const axios = require('axios');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const seedData = async () => {
    console.log('--- Starting Final, Unbiased Data Seeding ---');
    const client = await pool.connect();
    try {
        console.log("Fetching base champion data from DDragon...");
        const versionsRes = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
        const latestVersion = versionsRes.data[0];
        const response = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
        const championsData = response.data.data;

        await client.query('BEGIN');
        console.log("Populating 'champions' table with derived metrics for all champions...");
        
        for (const key in championsData) {
            const champ = championsData[key];

            // Derived Metrics
            // 1. Calculate Primary Damage Type
            const damageType = (champ.info.magic > champ.info.attack) ? 'AP' : 'AD';
            
            // 2. Calculate the Control Score
            const controlScore = champ.info.magic + champ.info.defense;

            // Use INSERT ... ON CONFLICT DO UPDATE to ensure every champion is processed
            const query = `
                INSERT INTO champions (champion_id, name, title, tags, primary_damage_type, control_score)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (champion_id) DO UPDATE SET
                    name = EXCLUDED.name,
                    title = EXCLUDED.title,
                    tags = EXCLUDED.tags,
                    primary_damage_type = EXCLUDED.primary_damage_type,
                    control_score = EXCLUDED.control_score;
            `;
            await client.query(query, [champ.id, champ.name, champ.title, champ.tags, damageType, controlScore]);
        }

        await client.query('COMMIT');
        console.log("Champion data successfully populated with derived metrics.");
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error during data seeding:', error);
        process.exit(1);
    } finally {
        client.release();
        process.exit(0);
    }
};

seedData();
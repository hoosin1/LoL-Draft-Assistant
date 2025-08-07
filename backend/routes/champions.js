const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/champions - Fetches all champions
router.get('/', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT champion_id, name, tags, primary_damage_type FROM champions ORDER BY name ASC');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
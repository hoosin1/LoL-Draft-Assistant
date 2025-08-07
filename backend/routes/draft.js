const express = require('express');
const router = express.Router();
const db = require('../db');

const { getLogicalRecommendations } = require('../services/logicalRecommendationService');

// Pre-load all champion data
let allChampions = [];
const loadData = async () => {
    try {
        const res = await db.query('SELECT * FROM champions');
        allChampions = res.rows;
        console.log(`Pre-loaded data of ${allChampions.length} champions.`);
    } catch (err) {
        console.error('Failed to pre-load champion data:', err);
    }
};
loadData();

// Single endpoint for all recommendations
router.post('/recommend', async (req, res) => {
    try {
        const recommendations = await getLogicalRecommendations(req.body, allChampions);
        res.json(recommendations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
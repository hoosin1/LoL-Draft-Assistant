// Scoring Weights
const SCORE_VALUES = {
    // Core Roles have the highest value
    FILLS_NEEDED_ROLE_TANK: 3.0,
    FILLS_NEEDED_ROLE_MARKSMAN: 3.0, // Primary damage source
    FILLS_NEEDED_ROLE_MAGE: 2.5, // Primary damage source
    FILLS_NEEDED_ROLE_SUPPORT: 2.0,

    // Secondary needs have lower value
    PROVIDES_NEEDED_DAMAGE_TYPE: 1.5, // e.g. adding AP to an all-AD team

    // Counter-pick scores
    EXPLOITS_ENEMY_DAMAGE_MONOPOLE: 2.0,
    IS_TANK_SHREDDER_VS_TANKS: 1.8,
};

// Main Service Function
const getLogicalRecommendations = async (draftState, allChampions) => {
    const { allyTeam, enemyTeam, bans } = draftState;

    const pickedOrBannedIds = new Set([...allyTeam, ...enemyTeam, ...bans].filter(c => c).map(c => c.champion_id));
    const availableChampions = allChampions.filter(c => !pickedOrBannedIds.has(c.champion_id));
    
    const allyPicks = allyTeam.filter(c => c);

    // 1. Establish team needs by looking at filled roles
    const hasTank = allyPicks.some(p => p.tags.includes('Tank'));
    const hasMarksman = allyPicks.some(p => p.tags.includes('Marksman'));
    const hasMage = allyPicks.some(p => p.tags.includes('Mage'));
    const hasSupport = allyPicks.some(p => p.tags.includes('Support'));

    // Establish damage profile needs
    const adCount = allyPicks.filter(p => p.primary_damage_type === 'AD').length;
    const apCount = allyPicks.filter(p => p.primary_damage_type === 'AP').length;
    const needsAP = allyPicks.length >= 2 && apCount === 0;
    const needsAD = allyPicks.length >= 2 && adCount === 0;

    // Establish counter-pick needs
    const enemyPicks = enemyTeam.filter(c => c);
    const enemyAdCount = enemyPicks.filter(p => p.primary_damage_type === 'AD').length;
    const enemyApCount = enemyPicks.filter(p => p.primary_damage_type === 'AP').length;
    const enemyIsAllAD = enemyPicks.length >= 2 && enemyApCount === 0;
    const enemyIsAllAP = enemyPicks.length >= 2 && enemyAdCount === 0;
    const enemyHasTanks = enemyPicks.some(p => p.tags.includes('Tank'));

    // 2. Score every available champion based on fulfilling needs
    const scoredChampions = availableChampions.map(champ => {
        let score = 0;
        let reasoning = [];

        // Role-Based Synergy Scoring
        if (!hasTank && champ.tags.includes('Tank')) {
            score += SCORE_VALUES.FILLS_NEEDED_ROLE_TANK;
            reasoning.push('Needed Role: Tank');
        }
        if (!hasMarksman && champ.tags.includes('Marksman')) {
            score += SCORE_VALUES.FILLS_NEEDED_ROLE_MARKSMAN;
            reasoning.push('Needed Role: ADC');
        }
        if (!hasMage && champ.tags.includes('Mage')) {
            score += SCORE_VALUES.FILLS_NEEDED_ROLE_MAGE;
            reasoning.push('Needed Role: Mage');
        }
        if (!hasSupport && champ.tags.includes('Support')) {
            score += SCORE_VALUES.FILLS_NEEDED_ROLE_SUPPORT;
            reasoning.push('Needed Role: Support');
        }

        // Secondary Synergy Scoring
        if (needsAP && champ.primary_damage_type === 'AP') {
            score += SCORE_VALUES.PROVIDES_NEEDED_DAMAGE_TYPE;
            reasoning.push('Adds AP Damage');
        }
        if (needsAD && champ.primary_damage_type === 'AD') {
            score += SCORE_VALUES.PROVIDES_NEEDED_DAMAGE_TYPE;
            reasoning.push('Adds AD Damage');
        }

        // Counter-Pick Scoring
        // A Tank/Fighter is good against an All-AD team
        if (enemyIsAllAD && (champ.tags.includes('Tank') || champ.tags.includes('Fighter'))) {
            score += SCORE_VALUES.EXPLOITS_ENEMY_DAMAGE_MONOPOLE;
            reasoning.push('Counters All-AD');
        }
        // A Tank/Fighter is good against an All-AP team
        if (enemyIsAllAP && (champ.tags.includes('Tank') || champ.tags.includes('Fighter'))) {
            score += SCORE_VALUES.EXPLOITS_ENEMY_DAMAGE_MONOPOLE;
            reasoning.push('Counters All-AP');
        }
        if (enemyHasTanks && champ.tags.includes('Marksman')) {
            score += SCORE_VALUES.IS_TANK_SHREDDER_VS_TANKS;
            reasoning.push('Tank Shredder');
        }
        
        // Add a small score based on control score as a minor tie-breaker
        score += (champ.control_score || 0) / 20.0;

        return {
            ...champ,
            score: score.toFixed(2),
            reasoning: reasoning.length > 0 ? reasoning.join(' | ') : `Flexible ${champ.tags[0]}`
        };
    });

    // Sort by the final calculated score
    scoredChampions.sort((a, b) => b.score - a.score);
    return scoredChampions.slice(0, 5);
};

module.exports = { getLogicalRecommendations };
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChampionGrid = ({ onSelectChampion, selectedChampion, draft, version }) => {    const [champions, setChampions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    const pickedOrBannedIds = new Set([...draft.allyTeam, ...draft.enemyTeam, ...draft.bans].filter(c => c).map(c => c.champion_id));

    useEffect(() => {
        axios.get('http://localhost:5001/api/champions')
            .then(res => { setChampions(res.data); setLoading(false); })
            .catch(err => console.error("Failed to fetch champions:", err));
    }, []);

    const filteredChampions = champions.filter(c => 
        c.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) return <div className="loading">Loading champions...</div>;

    return (
        <div className="champion-grid-container">
            <input 
                type="text" 
                placeholder="Search for a champion..." 
                className="champion-search"
                value={filter}
                onChange={e => setFilter(e.target.value)}
            />
            <div className="grid">
                {filteredChampions.map(champ => {
                    const isPicked = pickedOrBannedIds.has(champ.champion_id);
                    const isSelected = selectedChampion && selectedChampion.champion_id === champ.champion_id;
                    let className = 'champion-portrait';
                    if (isPicked) className += ' picked';
                    if (isSelected) className += ' selected';
                    return (
                        <div key={champ.champion_id} className={className} onClick={() => !isPicked && onSelectChampion(champ)}>
                            <img src={`https://ddragon.leagueoflegends.com/cdn/15.14.1/img/champion/${champ.champion_id}.png`} alt={champ.name} />
                            <span>{champ.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChampionGrid;
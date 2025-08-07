import React from 'react';

const Recommendations = ({ recommendations, isLoading }) => {
    return (
        <div className="recommendations-container">
            <h3>Top Recommendations</h3>
            {isLoading && <p>Analyzing draft...</p>}
            {!isLoading && recommendations.length === 0 && <p>Select champions to begin analysis.</p>}
            <ul>
                {recommendations.map(champ => (
                    <li key={champ.champion_id} className="rec-item">
                        <img src={`https://ddragon.leagueoflegends.com/cdn/15.14.1/img/champion/${champ.champion_id}.png`} alt={champ.name} />
                        <div className="rec-info">
                            <strong>{champ.name}</strong>
                            <span className="rec-score">Synergy Score: {champ.score}</span>
                            <div className="rec-details">
                                <span className="tag reasoning">{champ.reasoning}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Recommendations;
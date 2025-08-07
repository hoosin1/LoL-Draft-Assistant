import React from 'react';

const ChampionSlot = ({ champion, onClick }) => (
    <div className={`champion-slot ${!champion ? 'empty-slot' : ''}`} onClick={onClick}>
        {champion && <img src={`https://ddragon.leagueoflegends.com/cdn/15.14.1/img/champion/${champion.champion_id}.png`} alt={champion.name} />}
    </div>
);

const BanSlot = ({ champion, onClick }) => (
    <div className={`ban-slot ${!champion ? 'empty-slot' : ''}`} onClick={onClick}>
        {champion && <img src={`https://ddragon.leagueoflegends.com/cdn/15.14.1/img/champion/${champion.champion_id}.png`} alt={champion.name} />}
    </div>
);

const DraftBoard = ({ draft, onSlotClick }) => (
    <div className="draft-board-container">
        <div className="bans-container">
            {draft.bans.slice(0, 5).map((ban, index) => (
                <BanSlot key={`ally-ban-${index}`} champion={ban} onClick={() => onSlotClick('bans', index)} />
            ))}
        </div>
        <div className="teams-container">
            <div className="team-display ally">
                <h3>Ally Team</h3>
                {draft.allyTeam.map((champ, index) => (
                    <ChampionSlot key={`ally-${index}`} champion={champ} onClick={() => onSlotClick('allyTeam', index)} />
                ))}
            </div>
            <div className="team-display enemy">
                <h3>Enemy Team</h3>
                {draft.enemyTeam.map((champ, index) => (
                    <ChampionSlot key={`enemy-${index}`} champion={champ} onClick={() => onSlotClick('enemyTeam', index)} />
                ))}
            </div>
        </div>
        <div className="bans-container">
            {draft.bans.slice(5, 10).map((ban, index) => (
                <BanSlot key={`enemy-ban-${index}`} champion={ban} onClick={() => onSlotClick('bans', index + 5)} />
            ))}
        </div>
    </div>
);

export default DraftBoard;
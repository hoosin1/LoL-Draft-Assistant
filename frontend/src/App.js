import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DraftBoard from './components/DraftBoard';
import Recommendations from './components/Recommendations';
import ChampionGrid from './components/ChampionGrid';
import './App.css';

function App() {
  const [draft, setDraft] = useState({
    allyTeam: Array(5).fill(null),
    enemyTeam: Array(5).fill(null),
    bans: Array(10).fill(null), // 10 bans in the draft phase
    userRole: 'JUNGLE',
  });
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChampion, setSelectedChampion] = useState(null);

  // API Call logic
  useEffect(() => {
    const isDraftEmpty = draft.allyTeam.every(c => c === null) && draft.enemyTeam.every(c => c === null);
    if (isDraftEmpty) {
      setRecommendations([]);
      return;
    }
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const res = await axios.post('http://localhost:5001/api/draft/recommend', draft);
        setRecommendations(res.data);
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
      } finally {
        setIsLoading(false);
      }
    };
    const timer = setTimeout(() => fetchRecommendations(), 300);
    return () => clearTimeout(timer);
  }, [draft]);

  const handleSelectChampion = (champion) => {
    // If the selected champion is clicked again, deselect it
    if (selectedChampion && selectedChampion.champion_id === champion.champion_id) {
        setSelectedChampion(null);
    } else {
        setSelectedChampion(champion);
    }
  };

  const handleSlotClick = (team, index) => {
    if (!selectedChampion) return; // Can't place if no champion is selected

    setDraft(prevDraft => {
      const newDraft = JSON.parse(JSON.stringify(prevDraft));
      // Prevent placing a champion that's already picked/banned
      const isAlreadyPlaced = [...newDraft.allyTeam, ...newDraft.enemyTeam, ...newDraft.bans].some(c => c && c.champion_id === selectedChampion.champion_id);
      if (isAlreadyPlaced) return prevDraft;

      if (team === 'bans') {
        newDraft.bans[index] = selectedChampion;
      } else {
        newDraft[team][index] = selectedChampion;
      }
      return newDraft;
    });
    setSelectedChampion(null); // Clear selection after placing
  };

  return (
    <div className="app-container">
      <header><h1>LoL Draft Assistant</h1></header>
      <div className="selected-champion-display">
        {selectedChampion ? `Selected: ${selectedChampion.name}` : 'Select a champion to place'}
      </div>
      <main className="main-content">
        <DraftBoard draft={draft} onSlotClick={handleSlotClick} />
        <div className="interactive-area">
          <Recommendations recommendations={recommendations} isLoading={isLoading} />
          <ChampionGrid onSelectChampion={handleSelectChampion} selectedChampion={selectedChampion} draft={draft} />
        </div>
      </main>
    </div>
  );
}

export default App;
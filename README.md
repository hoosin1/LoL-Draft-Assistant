## Description

A full-stack web application with an expert system for providing strategic champion recommendations during the League of Legends draft phase.

## Screenshot

![App Screenshot](screenshot.png) 

## The Problem

The League of Legends champion draft is a complex, high-pressure phase where players must balance team synergy, role fulfillment, and enemy counters from a pool of over 160 champions. This project provides a tool to simplify this process.

## Features

- **Interactive Draft Board:** Simulate a full 5v5 draft with ally picks, enemy picks, and bans.
- **Intelligent System:** A rule-based expert system analyzes the draft in real-time.
- **Explainable Recommendations:** Each recommendation comes with clear reasoning (e.g., "Needed Role: Tank", "Counters All-AP").
- **Unbiased & Stable:** The engine uses Riot's official, static Data Dragon API and derived metrics.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL

## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/lol-draft-assistant.git
   cd lol-draft-assistant

2. **Setup the Backend:**
cd backend
npm install
# Create a .env file and add your PostgreSQL DATABASE_URL
# Run the seeder script
node scripts/seedDefinitiveData.js
# Start the server
node index.js

3. **Setup the Frontend:**
cd ../frontend
npm install
# Start the React app
npm start
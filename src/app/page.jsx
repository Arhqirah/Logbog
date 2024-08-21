import React from 'react';
import Team from '@/app/components/Team';
import DailyLog from '@/app/components/DailyLog';

const teamMembers = [
  { name: 'Alice', role: 'Team Leader' },
  { name: 'Bob', role: 'Developer' },
  { name: 'Charlie', role: 'Designer' },
  // Add other members here
];

const Home = () => (
  <div>
    <h1>Internship Logbook</h1>
    <Team members={teamMembers} />
    <DailyLog />
  </div>
);

export default Home;

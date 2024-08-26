"use client";
import React from 'react';

export default function DayPage({ log }) {
  if (!log) {
    return <p>Loading...</p>; // Handle loading state
  }

  return (
    <div className="p-6 bg-gray-800 shadow-lg rounded-lg max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold font-sans text-white mb-4">Dag {log.day}</h2>
      <p className="text-lg font-sans text-gray-400 mb-2">Dato: {log.date}</p>
      <p className="text-lg font-sans text-blue-400 mb-2">Aktiviteter:</p>
      <div className="text-sm font-sans text-gray-300 mb-4">
        {log.activities.split('\n').map((line, index) => (
          <p key={index} className="mb-2 text-gray-400">{line}</p>
        ))}
      </div>
      <p className="text-lg font-sans text-blue-400 mb-2">Team:</p>
      <div className="flex flex-wrap">
        {log.team_members?.map((member, index) => (
          <div key={index} className="flex items-center mb-4 mr-4">
            {member.imageUrl && (
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-12 h-12 rounded-full mr-3"
              />
            )}
            <p className="text-white">{member.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React from 'react';

const Team = ({ members }) => (
  <div className="p-5 bg-gradient-to-b from-black to-gray-900 rounded-lg mb-6">
    <h2 className="text-white mb-4">Team info</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member, index) => (
        <div
          key={index}
          className="p-4 border border-gray-700 rounded-md bg-gradient-to-b from-gray-800 to-gray-900"
        >
          <h3 className="text-green-300">{member.name}</h3>
          <p className="text-gray-400">Rolle: {member.role}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Team;

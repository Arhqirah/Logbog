"use client";

import React, { useState, useEffect } from 'react';
import DayPage from '@/app/components/DayPage';
import Calendar from '@/app/components/Calendar';
import { supabase } from '../lib/supabaseClient';
import jsPDF from 'jspdf';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const teamMembersList = {
  Alice: 'https://w7.pngwing.com/pngs/910/606/png-transparent-head-the-dummy-avatar-man-tie-jacket-user.png',
  Dennis: 'https://ctmirror-images.s3.amazonaws.com/wp-content/uploads/2021/01/dummy-man-570x570-1.png',
  Alexander: 'https://ctmirror-images.s3.amazonaws.com/wp-content/uploads/2021/01/dummy-man-570x570-1.png',
  Eve: 'https://w7.pngwing.com/pngs/910/606/png-transparent-head-the-dummy-avatar-man-tie-jacket-user.png',
  // Tilføj flere teammedlemmer her
};

export default function Book() {
  const [dailyLogs, setDailyLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditing, setIsEditing] = useState(false); // For at holde styr på, om vi er i redigeringstilstand

  const [newDate, setNewDate] = useState('');
  const [newActivities, setNewActivities] = useState('');
  const [newTeamMembers, setNewTeamMembers] = useState('');

  useEffect(() => {
    const fetchDailyLogs = async () => {
      const { data, error } = await supabase.from('daily_logs').select('*').order('day', { ascending: true });
      if (error) console.error('Error fetching logs:', error);
      else setDailyLogs(data);
    };

    fetchDailyLogs();
  }, []);

  const handleDayClick = (index) => {
    setCurrentPage(index);
    setIsEditing(false); // Stop redigeringstilstand, når vi klikker på en ny dag
  };

  const handleEditDay = (index) => {
    setCurrentPage(index);
    const log = dailyLogs[index];
    setNewDate(log.date);
    setNewActivities(log.activities);
    setNewTeamMembers(log.team_members.map((member) => member.name).join(', '));
    setIsEditing(true); // Start redigeringstilstand
  };

  const handleSaveEdit = async () => {
    const members = newTeamMembers.split(',').map((member) => {
      const name = member.trim();
      return {
        name,
        imageUrl: teamMembersList[name] || '', // Henter billed-URL fra den foruddefinerede liste
      };
    });

    const updatedLog = {
      day: currentPage + 1,
      date: newDate,
      activities: newActivities,
      team_members: members,
    };

    // Opdater loggen i databasen
    const { data, error } = await supabase.from('daily_logs').update(updatedLog).eq('day', currentPage + 1);

    if (error) {
      console.error('Error updating log:', error);
    } else {
      // Opdater lokal state
      const updatedLogs = dailyLogs.map((log, index) =>
        index === currentPage ? { ...log, ...updatedLog } : log
      );
      setDailyLogs(updatedLogs);
      setIsEditing(false); // Stop redigeringstilstand
    }
  };

  const handleAddDay = async () => {
    const members = newTeamMembers.split(',').map((member) => {
      const name = member.trim();
      return {
        name,
        imageUrl: teamMembersList[name] || '', // Henter billed-URL fra den foruddefinerede liste
      };
    });

    const newLog = {
      day: dailyLogs.length + 1,
      date: newDate,
      activities: newActivities,
      team_members: members,
    };

    const { data, error } = await supabase.from('daily_logs').insert([newLog]).select('*');

    if (error) {
      console.error('Error saving log:', error);
    } else {
      setDailyLogs([...dailyLogs, ...data]); // Opdater lokal state med den nye log
      setNewDate('');
      setNewActivities('');
      setNewTeamMembers('');
      setCurrentPage(dailyLogs.length); // Hopper til den nye side
    }
  };

  const handleDownloadPDF = () => {
    // PDF-genereringskoden her...
  };

  return (
    <div className="min-h-screen bg-slate-300 p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Venstre kolonne: Form */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Rediger Dag' : 'Tilføj en ny dag'}</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Dato:</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Aktiviteter:</label>
              <textarea
                value={newActivities}
                onChange={(e) => setNewActivities(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                rows="4"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Team:</label>
              <input
                type="text"
                value={newTeamMembers}
                onChange={(e) => setNewTeamMembers(e.target.value)}
                placeholder="Komma-separeret, f.eks., Dennis, Alexander"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            {isEditing ? (
              <button
                onClick={handleSaveEdit}
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Gem Ændringer
              </button>
            ) : (
              <button
                onClick={handleAddDay}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Tilføj Dag
              </button>
            )}
          </div>
        </div>

        {/* Højre kolonne: Kalender og Dag detaljer */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white shadow-md rounded-lg p-6 gap-8">
            <Calendar logs={dailyLogs} onDayClick={handleDayClick} />
          </div>
          {dailyLogs.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <DayPage log={dailyLogs[currentPage]} />
              <button
                onClick={() => handleEditDay(currentPage)}
                className="mt-4 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
              >
                Rediger Dag
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PDF-download-knap */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

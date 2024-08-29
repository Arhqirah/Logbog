"use client";

import React, { useState, useEffect } from 'react';
import DayPage from '@/app/components/DayPage';
import Calendar from '@/app/components/Calendar';
import { supabase } from '../lib/supabaseClient';
import jsPDF from 'jspdf';

const teamMembersList = {
  Alice: 'https://w7.pngwing.com/pngs/910/606/png-transparent-head-the-dummy-avatar-man-tie-jacket-user.png',
  Bob: 'https://ctmirror-images.s3.amazonaws.com/wp-content/uploads/2021/01/dummy-man-570x570-1.png',
  Charlie: 'https://ctmirror-images.s3.amazonaws.com/wp-content/uploads/2021/01/dummy-man-570x570-1.png',
  Eve: 'https://w7.pngwing.com/pngs/910/606/png-transparent-head-the-dummy-avatar-man-tie-jacket-user.png',
  // Tilføj flere teammedlemmer her
};

export default function Book() {
  const [dailyLogs, setDailyLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Initialiserer til at vise dag 1

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
    setCurrentPage(index); // Opdaterer til den valgte dags index
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
      setDailyLogs([...dailyLogs, ...data]); // Opdaterer lokal state med den nye log
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
            <h2 className="text-2xl font-bold mb-4">Add a New Day</h2>
            {/* Form til at tilføje en ny dag */}
          </div>
        </div>

        {/* Højre kolonne: Kalender og Dag detaljer */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <Calendar logs={dailyLogs} onDayClick={handleDayClick} />
          </div>
          {dailyLogs.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <DayPage log={dailyLogs[currentPage]} />
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

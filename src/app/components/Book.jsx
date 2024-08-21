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
  Bob: 'https://ctmirror-images.s3.amazonaws.com/wp-content/uploads/2021/01/dummy-man-570x570-1.png',
  Charlie: 'https://ctmirror-images.s3.amazonaws.com/wp-content/uploads/2021/01/dummy-man-570x570-1.png',
  Eve: 'https://w7.pngwing.com/pngs/910/606/png-transparent-head-the-dummy-avatar-man-tie-jacket-user.png',
  // Add more team members here
};

export default function Book() {
  const [dailyLogs, setDailyLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

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
  };

  const handleAddDay = async () => {
    const members = newTeamMembers.split(',').map((member) => {
      const name = member.trim();
      return {
        name,
        imageUrl: teamMembersList[name] || '', // Fetch the image URL from the predefined list
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
      setDailyLogs([...dailyLogs, ...data]); // Update local state with the new log
      setNewDate('');
      setNewActivities('');
      setNewTeamMembers('');
      setCurrentPage(dailyLogs.length); // Jump to the new page
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    dailyLogs.forEach((log, index) => {
      doc.setFontSize(18);
      doc.text(`Dag ${log.day}: ${log.date}`, 10, 10 + index * 40);

      doc.setFontSize(14);
      doc.text('Aktiviteter:', 10, 20 + index * 40);
      doc.setFontSize(12);
      const activities = log.activities.split('\n');
      activities.forEach((line, i) => {
        doc.text(line, 10, 30 + index * 40 + i * 5);
      });

      doc.setFontSize(14);
      doc.text('Team Members:', 10, 40 + index * 40 + activities.length * 5);
      doc.setFontSize(12);
      log.team_members.forEach((member, i) => {
        doc.text(`${member.name}`, 10, 50 + index * 40 + activities.length * 5 + i * 5);
      });

      if (index < dailyLogs.length - 1) {
        doc.addPage();
      }
    });

    doc.save('logbook.pdf');
  };

  return (
    <div className="min-h-screen bg-slate-300 p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Add a New Day</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Date:</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Activities:</label>
              <textarea
                value={newActivities}
                onChange={(e) => setNewActivities(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                rows="4"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Team Members:</label>
              <input
                type="text"
                value={newTeamMembers}
                onChange={(e) => setNewTeamMembers(e.target.value)}
                placeholder="Comma separated, e.g., Alice, Bob"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              onClick={handleAddDay}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Add Day
            </button>
          </div>
        </div>

        {/* Right Column: Calendar and Day Details */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white shadow-md rounded-lg p-6 gap-8">
            <Calendar logs={dailyLogs} onDayClick={handleDayClick} />
          </div>
          {dailyLogs.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <DayPage log={dailyLogs[currentPage]} />
            </div>
          )}
        </div>
      </div>

      {/* PDF Download Button */}
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

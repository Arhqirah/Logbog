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
    let yOffset = 30; // Starting y position after the title
  
    // Set up the document's font, title, and other properties
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40); // Dark gray color for the title
  
    // Add a title to the PDF
    doc.text('Logbook Summary', 14, yOffset);
    yOffset += 10; // Move down after the title
  
    // Add a line below the title
    doc.setLineWidth(0.5);
    doc.line(14, yOffset, 196, yOffset); // Horizontal line
    yOffset += 10; // Move down after the line
  
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(100, 100, 100); // Lighter gray color for the text
  
    // Loop through daily logs and add each entry to the PDF
    dailyLogs.forEach((log, index) => {
      // Check if adding the next log would go beyond the page height (270 is a safe margin)
      if (yOffset + 30 > 270) {
        doc.addPage();
        yOffset = 20; // Reset yOffset for new page
      }
  
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40); // Darker color for section titles
      doc.text(`Day ${log.day}: ${log.date}`, 14, yOffset);
      yOffset += 10;
  
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60); // Slightly lighter color for content
      doc.text('Activities:', 14, yOffset);
  
      // Split the text into lines for wrapping
      const activities = doc.splitTextToSize(log.activities, 180);
      doc.text(activities, 14, yOffset + 5);
      yOffset += 10 + activities.length * 6; // Adjust yOffset based on text length
  
      doc.setTextColor(60, 60, 60);
      doc.text('Team Members:', 14, yOffset);
  
      const teamMembers = log.team_members.map(member => member.name).join(', ');
      doc.text(teamMembers, 14, yOffset + 5);
      yOffset += 15; // Add some space after each log
  
      // Add a separator line after each day
      doc.setLineWidth(0.5);
      doc.line(14, yOffset, 196, yOffset); // Horizontal line
      yOffset += 10; // Add space after the line
    });
  
    // Save the PDF
    doc.save('logbook.pdf');
  };
  

  return (
    <div className="min-h-screen bg-slate-300 p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Tilføj en ny dag</h2>
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
                placeholder="Comma separated, e.g., Dennis, Alexander"
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

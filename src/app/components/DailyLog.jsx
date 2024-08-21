"use client";
import React, { useState } from 'react';
import DayPage from '@/app/components/DayPage';

  export default function Book() {
    const [currentPage, setCurrentPage] = useState(0);
  
    const handleNext = () => {
      if (currentPage < dailyLogs.length - 1) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    const handlePrevious = () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cover">
          <div className="relative bg-green p-8 shadow-page rounded-page border border-gray-200 max-w-xl">
            <DayPage log={dailyLogs[currentPage]} />
          </div>
          <div className="flex justify-between w-full max-w-xl mt-8">
            <button
              onClick={handlePrevious}
              className="bg-secondary text-page p-3 rounded-lg shadow-page hover:bg-secondary-dark transition-colors duration-300"
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="bg-accent text-page p-3 rounded-lg shadow-page hover:bg-accent-dark transition-colors duration-300"
              disabled={currentPage === dailyLogs.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      );
    }
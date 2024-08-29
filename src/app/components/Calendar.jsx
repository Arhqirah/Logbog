"use client";
import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

const getDayName = (dateString) => {
  const date = new Date(dateString);
  const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
  return days[date.getDay()];
};

const Calendar = ({ logs, onDayClick }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <Slider {...settings} className="w-full">
      {logs.map((log, index) => (
        <div
          key={index}
          className="aspect-w-1 aspect-h-1 bg-gradient-to-b from-gray-800 to-gray-900 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-700 transition-colors duration-300 mx-2"
          onClick={() => onDayClick(index)}
        >
          <p className="text-white font-bold text-lg">{getDayName(log.date)}</p>
          <p className="text-gray-400 text-sm">{log.date}</p>
        </div>
      ))}
    </Slider>
  );
};

export default Calendar;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F3F4F6', // Light grey background
        page: '#FFFFFF',       // White pages
        text: '#1F2937',       // Dark grey text for readability
        accent: '#3B82F6',     // Modern blue for accents
        secondary: '#64748B',  // Muted grey for secondary elements
      },
      fontFamily: {
        sans: ['"Poppins"', 'sans-serif'], // Modern sans-serif font
      },
      boxShadow: {
        page: '0 10px 20px rgba(0, 0, 0, 0.05)', // Soft shadow for pages
      },
      borderRadius: {
        page: '16px', // Rounded corners for modern look
      },
      backgroundImage: {
        'cover': 'linear-gradient(135deg, #F3F4F6 25%, #E5E7EB 100%)', // Modern gradient background
      },
    },
  },
  plugins: [],
};

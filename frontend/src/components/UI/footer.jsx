import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 dark:bg-slate-900 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
      <p>&copy; {new Date().getFullYear()} Expense Tracking System. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

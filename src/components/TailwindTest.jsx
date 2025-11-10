import React from 'react';

const TailwindTest = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Tailwind CSS ✓</span>
        </div>
      </div>
    </div>
  );
};

export default TailwindTest;

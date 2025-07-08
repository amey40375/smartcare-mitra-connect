
import React from 'react';

export const RegisterHeader: React.FC = () => {
  return (
    <div className="text-center mb-6">
      <div className="bg-gradient-to-r from-smartcare-blue-600 to-smartcare-green-600 bg-clip-text text-transparent">
        <h1 className="text-3xl font-bold mb-2">SmartCare</h1>
        <p className="text-lg text-smartcare-blue-600 font-semibold">Mitra</p>
      </div>
      <p className="text-gray-600 mt-4">Daftar sebagai mitra baru</p>
    </div>
  );
};

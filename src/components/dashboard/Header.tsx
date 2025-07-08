
import React from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { Wallet } from 'lucide-react';

const Header: React.FC = () => {
  const { mitraData } = useAuth();

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <header className="bg-gradient-to-r from-smartcare-blue-600 to-smartcare-green-600 text-white p-4 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-2 rounded-lg">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-smartcare-blue-600 font-bold text-lg">S</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold">SmartCare</h1>
            <p className="text-sm opacity-90">Mitra</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg">
          <Wallet className="h-5 w-5" />
          <div className="text-right">
            <p className="text-xs opacity-90">Saldo</p>
            <p className="font-bold">
              {formatRupiah(mitraData?.saldo || 0)}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

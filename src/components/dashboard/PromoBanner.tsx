
import React from 'react';

const PromoBanner: React.FC = () => {
  return (
    <div className="mx-4 my-4">
      <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">Promo Spesial!</h3>
            <p className="text-sm opacity-90 mb-3">
              Dapatkan bonus saldo untuk setiap 10 pesanan selesai
            </p>
            <div className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
              <span className="text-sm font-semibold">Bonus Rp 50.000</span>
            </div>
          </div>
          <div className="text-6xl opacity-50">🎉</div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;

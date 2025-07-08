
import React from 'react';
import { 
  Inbox, 
  Wrench, 
  Clock, 
  MessageSquare, 
  User, 
  Coins, 
  LogOut 
} from 'lucide-react';

interface MenuGridProps {
  onMenuClick: (menu: string) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({ onMenuClick }) => {
  const menuItems = [
    { id: 'pesanan-masuk', icon: Inbox, label: 'Pesanan Masuk', color: 'bg-blue-500' },
    { id: 'pesanan-aktif', icon: Wrench, label: 'Pesanan Aktif', color: 'bg-green-500' },
    { id: 'riwayat-pesanan', icon: Clock, label: 'Riwayat Pesanan', color: 'bg-purple-500' },
    { id: 'ulasan', icon: MessageSquare, label: 'Ulasan', color: 'bg-yellow-500' },
    { id: 'akun-saya', icon: User, label: 'Akun Saya', color: 'bg-indigo-500' },
    { id: 'top-up', icon: Coins, label: 'Top Up Saldo', color: 'bg-orange-500' },
    { id: 'logout', icon: LogOut, label: 'Logout', color: 'bg-red-500' },
    { id: '', icon: null, label: '', color: '' }, // Empty slot
  ];

  return (
    <div className="px-4">
      <div className="grid grid-cols-4 gap-4 mb-4">
        {menuItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            {item.icon ? (
              <button
                onClick={() => onMenuClick(item.id)}
                className="w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center mb-2 active:scale-95 transition-transform duration-150"
                style={{ backgroundColor: item.color.replace('bg-', '#') + '20' }}
              >
                <item.icon 
                  className="h-8 w-8" 
                  style={{ color: item.color.replace('bg-', '#').replace('500', '600') }}
                />
              </button>
            ) : (
              <div className="w-16 h-16 mb-2"></div>
            )}
            {item.label && (
              <span className="text-xs text-gray-700 text-center font-medium leading-tight">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuGrid;

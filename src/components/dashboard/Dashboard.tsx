
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import Header from './Header';
import PromoBanner from './PromoBanner';
import MenuGrid from './MenuGrid';
import PesananMasuk from '../pages/PesananMasuk';
import PesananAktif from '../pages/PesananAktif';
import RiwayatPesanan from '../pages/RiwayatPesanan';
import Ulasan from '../pages/Ulasan';
import AkunSaya from '../pages/AkunSaya';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Dashboard: React.FC = () => {
  const { mitraData, logout } = useAuth();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);

  useEffect(() => {
    // Check if mitra is verified
    if (mitraData && mitraData.status !== 'aktif') {
      setShowVerificationDialog(true);
    }
  }, [mitraData]);

  const handleMenuClick = (menu: string) => {
    if (menu === 'logout') {
      logout();
      return;
    }
    
    if (menu === 'top-up') {
      toast({
        title: "Layanan Dalam Pengembangan",
        description: "Layanan Top Up sedang dalam pengembangan. Silakan coba lagi nanti.",
        variant: "default"
      });
      return;
    }

    // Check verification status for other menu items
    if (mitraData?.status !== 'aktif' && menu !== 'akun-saya') {
      setShowVerificationDialog(true);
      return;
    }

    setCurrentPage(menu);
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'pesanan-masuk':
        return <PesananMasuk onBack={handleBackToDashboard} />;
      case 'pesanan-aktif':
        return <PesananAktif onBack={handleBackToDashboard} />;
      case 'riwayat-pesanan':
        return <RiwayatPesanan onBack={handleBackToDashboard} />;
      case 'ulasan':
        return <Ulasan onBack={handleBackToDashboard} />;
      case 'akun-saya':
        return <AkunSaya onBack={handleBackToDashboard} />;
      default:
        return (
          <div className="pb-6">
            <PromoBanner />
            <MenuGrid onMenuClick={handleMenuClick} />
          </div>
        );
    }
  };

  return (
    <div className="mobile-container">
      <Header />
      {renderCurrentPage()}

      {/* Verification Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Akun Belum Diverifikasi</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-600">
              Akun Anda belum diverifikasi oleh Admin. 
              Silakan tunggu proses verifikasi untuk dapat mengakses fitur lengkap.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;

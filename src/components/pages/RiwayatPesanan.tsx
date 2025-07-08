
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, User, Eye, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';

interface RiwayatPesananProps {
  onBack: () => void;
}

const RiwayatPesanan: React.FC<RiwayatPesananProps> = ({ onBack }) => {
  const [pesananList, setPesananList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPesanan, setSelectedPesanan] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const { mitraData } = useAuth();

  useEffect(() => {
    fetchRiwayatPesanan();
  }, []);

  const fetchRiwayatPesanan = async () => {
    try {
      const { data, error } = await supabase
        .from('pesanan')
        .select(`
          *,
          users (nama, nomor_hp),
          layanan (nama_layanan, tarif)
        `)
        .eq('mitra_id', mitraData?.id)
        .in('status', ['selesai', 'dibatalkan'])
        .order('tanggal_selesai', { ascending: false });

      if (error) throw error;
      setPesananList(data || []);
    } catch (error) {
      console.error('Error fetching riwayat pesanan:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID');
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}j ${minutes}m`;
  };

  const handleViewInvoice = (pesanan: any) => {
    setSelectedPesanan(pesanan);
    setShowInvoice(true);
  };

  if (loading) {
    return (
      <div className="mobile-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smartcare-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat riwayat pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold">Riwayat Pesanan</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {pesananList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum Ada Riwayat</h3>
            <p className="text-gray-600">Pesanan yang telah selesai akan muncul di sini</p>
          </div>
        ) : (
          pesananList.map((pesanan) => (
            <Card key={pesanan.id} className="shadow-md">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <Badge 
                    variant="secondary" 
                    className={`${pesanan.status === 'selesai' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {pesanan.status === 'selesai' ? 'Selesai' : 'Dibatalkan'}
                  </Badge>
                  <span className="text-lg font-bold text-smartcare-green-600">
                    {formatRupiah(pesanan.layanan?.tarif || 0)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium">{pesanan.layanan?.nama_layanan}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{pesanan.users?.nama}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{pesanan.alamat_pesanan}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateTime(pesanan.tanggal_selesai || pesanan.tanggal_pesanan)}</span>
                  </div>

                  {pesanan.durasi && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Durasi: {formatDuration(pesanan.durasi)}</span>
                    </div>
                  )}
                </div>

                {pesanan.status === 'selesai' && (
                  <Button 
                    onClick={() => handleViewInvoice(pesanan)}
                    variant="outline"
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Lihat Invoice
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Invoice Dialog */}
      <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Invoice</DialogTitle>
          </DialogHeader>
          {selectedPesanan && (
            <div className="space-y-4">
              <div className="text-center border-b pb-4">
                <h3 className="text-lg font-bold text-smartcare-blue-600">SmartCare</h3>
                <p className="text-sm text-gray-600">Invoice #{selectedPesanan.id.slice(0, 8)}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Layanan:</span>
                  <span className="text-sm font-medium">{selectedPesanan.layanan?.nama_layanan}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pelanggan:</span>
                  <span className="text-sm font-medium">{selectedPesanan.users?.nama}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tanggal:</span>
                  <span className="text-sm font-medium">{formatDateTime(selectedPesanan.tanggal_selesai)}</span>
                </div>
                
                {selectedPesanan.durasi && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Durasi:</span>
                    <span className="text-sm font-medium">{formatDuration(selectedPesanan.durasi)}</span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-smartcare-green-600">
                      {formatRupiah(selectedPesanan.layanan?.tarif || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-xs text-gray-500">Terima kasih atas layanan Anda!</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RiwayatPesanan;

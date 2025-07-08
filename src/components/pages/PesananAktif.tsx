
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Square, Calendar, MapPin, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PesananAktifProps {
  onBack: () => void;
}

const PesananAktif: React.FC<PesananAktifProps> = ({ onBack }) => {
  const [pesananList, setPesananList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTimers, setActiveTimers] = useState<{ [key: string]: number }>({});
  const { mitraData } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPesananAktif();
  }, []);

  useEffect(() => {
    const intervals: { [key: string]: NodeJS.Timeout } = {};
    
    Object.keys(activeTimers).forEach(pesananId => {
      intervals[pesananId] = setInterval(() => {
        setActiveTimers(prev => ({
          ...prev,
          [pesananId]: prev[pesananId] + 1
        }));
      }, 1000);
    });

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [Object.keys(activeTimers).length]);

  const fetchPesananAktif = async () => {
    try {
      const { data, error } = await supabase
        .from('pesanan')
        .select(`
          *,
          users (nama, nomor_hp),
          layanan (nama_layanan, tarif)
        `)
        .eq('mitra_id', mitraData?.id)
        .in('status', ['Diterima oleh ' + mitraData?.nama, 'sedang_dikerjakan']);

      if (error) throw error;
      setPesananList(data || []);
    } catch (error) {
      console.error('Error fetching pesanan aktif:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMulaiPekerjaan = async (pesananId: string) => {
    try {
      const { error } = await supabase
        .from('pesanan')
        .update({
          status: 'sedang_dikerjakan',
          tanggal_mulai: new Date().toISOString()
        })
        .eq('id', pesananId);

      if (error) throw error;

      setActiveTimers(prev => ({ ...prev, [pesananId]: 0 }));
      
      toast({
        title: "Pekerjaan Dimulai",
        description: "Timer telah diaktifkan",
        variant: "default"
      });

      fetchPesananAktif();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memulai pekerjaan",
        variant: "destructive"
      });
    }
  };

  const handleSelesaiPekerjaan = async (pesananId: string) => {
    try {
      const durasi = activeTimers[pesananId] || 0;
      const { error } = await supabase
        .from('pesanan')
        .update({
          status: 'selesai',
          tanggal_selesai: new Date().toISOString(),
          durasi: durasi
        })
        .eq('id', pesananId);

      if (error) throw error;

      // Remove from active timers
      setActiveTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[pesananId];
        return newTimers;
      });

      toast({
        title: "Pekerjaan Selesai",
        description: "Pesanan telah diselesaikan dan invoice telah dibuat",
        variant: "default"
      });

      fetchPesananAktif();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyelesaikan pekerjaan",
        variant: "destructive"
      });
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  if (loading) {
    return (
      <div className="mobile-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smartcare-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat pesanan aktif...</p>
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
          <h1 className="text-xl font-semibold">Pesanan Aktif</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {pesananList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛠️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum Ada Pesanan Aktif</h3>
            <p className="text-gray-600">Terima pesanan dari menu Pesanan Masuk</p>
          </div>
        ) : (
          pesananList.map((pesanan) => (
            <Card key={pesanan.id} className="shadow-md">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <Badge 
                    variant="secondary" 
                    className={`${pesanan.status === 'sedang_dikerjakan' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                  >
                    {pesanan.layanan?.nama_layanan}
                  </Badge>
                  <span className="text-lg font-bold text-smartcare-green-600">
                    {formatRupiah(pesanan.layanan?.tarif || 0)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
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
                    <span>{formatDateTime(pesanan.tanggal_pesanan)}</span>
                  </div>
                </div>

                {pesanan.status === 'sedang_dikerjakan' && (
                  <div className="bg-green-50 p-3 rounded-lg mb-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Sedang Dikerjakan</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatTime(activeTimers[pesanan.id] || 0)}
                    </div>
                  </div>
                )}

                {pesanan.catatan && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Catatan:</strong> {pesanan.catatan}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  {pesanan.status !== 'sedang_dikerjakan' ? (
                    <Button 
                      onClick={() => handleMulaiPekerjaan(pesanan.id)}
                      className="w-full bg-smartcare-green-600 hover:bg-smartcare-green-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Mulai Pekerjaan
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleSelesaiPekerjaan(pesanan.id)}
                      className="w-full bg-smartcare-blue-600 hover:bg-smartcare-blue-700"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Selesai
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PesananAktif;

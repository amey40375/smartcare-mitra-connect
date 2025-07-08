import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PesananMasukProps {
  onBack: () => void;
}

const PesananMasuk: React.FC<PesananMasukProps> = ({ onBack }) => {
  const [pesananList, setPesananList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { mitraData } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPesananMasuk();
  }, []);

  const fetchPesananMasuk = async () => {
    try {
      const { data, error } = await supabase
        .from('pesanan')
        .select(`
          *,
          users (nama, nomor_hp),
          layanan (nama_layanan, tarif)
        `)
        .eq('status', 'pending')
        .is('mitra_id', null);

      if (error) throw error;
      setPesananList(data || []);
    } catch (error) {
      console.error('Error fetching pesanan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTerimaPesanan = async (pesananId: string) => {
    try {
      const { error } = await supabase
        .from('pesanan')
        .update({
          mitra_id: mitraData.id,
          status: `Diterima oleh ${mitraData.nama}`,
          tanggal_pesanan: new Date().toISOString()
        })
        .eq('id', pesananId);

      if (error) throw error;

      toast({
        title: "Pesanan Diterima",
        description: "Pesanan berhasil diterima dan akan muncul di Pesanan Aktif",
        variant: "default"
      });

      fetchPesananMasuk(); // Refresh list
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menerima pesanan",
        variant: "destructive"
      });
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

  if (loading) {
    return (
      <div className="mobile-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smartcare-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat pesanan...</p>
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
          <h1 className="text-xl font-semibold">Pesanan Masuk</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {pesananList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📥</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum Ada Pesanan</h3>
            <p className="text-gray-600">Pesanan baru akan muncul di sini</p>
          </div>
        ) : (
          pesananList.map((pesanan) => (
            <Card key={pesanan.id} className="shadow-md">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
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

                {pesanan.catatan && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Catatan:</strong> {pesanan.catatan}
                    </p>
                  </div>
                )}

                <Button 
                  onClick={() => handleTerimaPesanan(pesanan.id)}
                  className="w-full bg-smartcare-green-600 hover:bg-smartcare-green-700"
                >
                  Terima Pesanan
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PesananMasuk;

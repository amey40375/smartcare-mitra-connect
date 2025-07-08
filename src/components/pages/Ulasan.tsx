
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, User, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';

interface UlasanProps {
  onBack: () => void;
}

const Ulasan: React.FC<UlasanProps> = ({ onBack }) => {
  const [ulasanList, setUlasanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const { mitraData } = useAuth();

  useEffect(() => {
    fetchUlasan();
  }, []);

  const fetchUlasan = async () => {
    try {
      const { data, error } = await supabase
        .from('rating')
        .select(`
          *,
          users (nama),
          pesanan (layanan (nama_layanan))
        `)
        .eq('mitra_id', mitraData?.id)
        .order('tanggal_rating', { ascending: false });

      if (error) throw error;
      
      setUlasanList(data || []);
      
      // Calculate average rating
      if (data && data.length > 0) {
        const total = data.reduce((sum, rating) => sum + (rating.nilai_rating || 0), 0);
        setAverageRating(total / data.length);
      }
    } catch (error) {
      console.error('Error fetching ulasan:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="mobile-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smartcare-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat ulasan...</p>
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
          <h1 className="text-xl font-semibold">Ulasan & Rating</h1>
        </div>
      </div>

      {/* Rating Summary */}
      {ulasanList.length > 0 && (
        <div className="bg-gradient-to-r from-smartcare-blue-50 to-smartcare-green-50 p-6 m-4 rounded-2xl">
          <div className="text-center">
            <div className="text-4xl font-bold text-smartcare-blue-600 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center space-x-1 mb-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <p className="text-sm text-gray-600">
              Dari {ulasanList.length} ulasan
            </p>
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {ulasanList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum Ada Ulasan</h3>
            <p className="text-gray-600">Ulasan dari pelanggan akan muncul di sini</p>
          </div>
        ) : (
          ulasanList.map((ulasan) => (
            <Card key={ulasan.id} className="shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{ulasan.users?.nama}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(ulasan.nilai_rating || 0)}
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-sm text-smartcare-blue-600 font-medium">
                    {ulasan.pesanan?.layanan?.nama_layanan}
                  </span>
                </div>

                {ulasan.komentar && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <p className="text-sm text-gray-700">"{ulasan.komentar}"</p>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDateTime(ulasan.tanggal_rating)}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Ulasan;

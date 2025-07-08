
import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Shield, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AkunSayaProps {
  onBack: () => void;
}

const AkunSaya: React.FC<AkunSayaProps> = ({ onBack }) => {
  const { mitraData } = useAuth();
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    nomor_hp: mitraData?.nomor_hp || '',
    alamat: mitraData?.alamat || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('mitras')
        .update({
          nomor_hp: editData.nomor_hp,
          alamat: editData.alamat
        })
        .eq('id', mitraData?.id);

      if (error) throw error;

      // Update localStorage
      const updatedMitra = { ...mitraData, ...editData };
      localStorage.setItem('smartcare_mitra', JSON.stringify(updatedMitra));

      toast({
        title: "Berhasil",
        description: "Data berhasil diperbarui",
        variant: "default"
      });

      setShowEditDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aktif':
        return <Badge className="bg-green-100 text-green-800">Terverifikasi</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Menunggu Verifikasi</Badge>;
      case 'ditolak':
        return <Badge className="bg-red-100 text-red-800">Ditolak</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Tidak Dikenal</Badge>;
    }
  };

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
          <h1 className="text-xl font-semibold">Akun Saya</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Header */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-smartcare-blue-600 to-smartcare-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{mitraData?.nama}</h2>
              <p className="text-sm text-gray-600 mb-3">{mitraData?.jenis_layanan}</p>
              {getStatusBadge(mitraData?.status)}
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Informasi Akun</h3>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{mitraData?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Nomor HP</p>
                  <p className="font-medium">{mitraData?.nomor_hp}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Alamat</p>
                  <p className="font-medium">{mitraData?.alamat || 'Belum diisi'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Status Verifikasi</p>
                  <p className="font-medium">
                    {mitraData?.status === 'aktif' ? 'Terverifikasi' : 'Menunggu Verifikasi'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Information */}
        <Card className="shadow-md">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Layanan</h3>
            <div className="bg-smartcare-blue-50 p-4 rounded-lg">
              <p className="font-medium text-smartcare-blue-800">{mitraData?.jenis_layanan}</p>
              <p className="text-sm text-smartcare-blue-600 mt-1">Layanan yang Anda tawarkan</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Informasi</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomor_hp">Nomor HP</Label>
              <Input
                id="nomor_hp"
                type="tel"
                value={editData.nomor_hp}
                onChange={(e) => setEditData(prev => ({ ...prev, nomor_hp: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Input
                id="alamat"
                type="text"
                value={editData.alamat}
                onChange={(e) => setEditData(prev => ({ ...prev, alamat: e.target.value }))}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowEditDialog(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button 
                onClick={handleSaveChanges}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AkunSaya;

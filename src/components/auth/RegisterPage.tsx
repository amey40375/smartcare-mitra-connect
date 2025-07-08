
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from './AuthContext';
import { User, Mail, Phone, MapPin, FileText, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    nomor_hp: '',
    alamat: '',
    ktp: '',
    kk: '',
    jenis_layanan: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const layananOptions = [
    'Cleaning Service',
    'AC Service', 
    'Laundry',
    'Massage',
    'Perbaikan Elektronik',
    'Tukang',
    'Catering',
    'Baby Sitter'
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      toast({
        title: "Pendaftaran Berhasil",
        description: result.message,
        variant: "default"
      });
      onSwitchToLogin();
    } else {
      toast({
        title: "Pendaftaran Gagal",
        description: result.message,
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="mobile-container p-4 overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-smartcare-blue-600 to-smartcare-green-600 bg-clip-text text-transparent">
            <h1 className="text-3xl font-bold mb-2">SmartCare</h1>
            <p className="text-lg text-smartcare-blue-600 font-semibold">Mitra</p>
          </div>
          <p className="text-gray-600 mt-4">Daftar sebagai mitra baru</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center text-gray-800">Daftar Mitra</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="nama"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={formData.nama}
                    onChange={(e) => handleChange('nama', e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomor_hp">Nomor HP</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="nomor_hp"
                    type="tel"
                    placeholder="Masukkan nomor HP"
                    value={formData.nomor_hp}
                    onChange={(e) => handleChange('nomor_hp', e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="alamat"
                    type="text"
                    placeholder="Masukkan alamat lengkap"
                    value={formData.alamat}
                    onChange={(e) => handleChange('alamat', e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ktp">Nomor KTP</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="ktp"
                    type="text"
                    placeholder="Masukkan nomor KTP"
                    value={formData.ktp}
                    onChange={(e) => handleChange('ktp', e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kk">Nomor KK</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="kk"
                    type="text"
                    placeholder="Masukkan nomor KK"
                    value={formData.kk}
                    onChange={(e) => handleChange('kk', e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jenis_layanan">Jenis Layanan</Label>
                <Select onValueChange={(value) => handleChange('jenis_layanan', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Pilih jenis layanan" />
                  </SelectTrigger>
                  <SelectContent>
                    {layananOptions.map((layanan) => (
                      <SelectItem key={layanan} value={layanan}>
                        {layanan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-smartcare-blue-600 to-smartcare-green-600 hover:from-smartcare-blue-700 hover:to-smartcare-green-700"
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Daftar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Sudah punya akun?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-smartcare-blue-600 hover:text-smartcare-blue-700 font-semibold"
                >
                  Masuk di sini
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;

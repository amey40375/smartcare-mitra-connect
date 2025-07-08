
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PersonalInfoFields } from './PersonalInfoFields';
import { ContactFields } from './ContactFields';
import { DocumentFields } from './DocumentFields';
import { ServiceTypeField } from './ServiceTypeField';
import { Button } from '@/components/ui/button';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    nomor_hp: '',
    alamat: '',
    ktp: '',
    kk: '',
    jenis_layanan: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.email || !formData.password || !formData.nomor_hp || !formData.ktp || !formData.kk) {
      toast({
        title: "Error",
        description: "Semua field wajib diisi",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan tidak terduga",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <PersonalInfoFields 
        formData={formData}
        handleChange={handleChange}
      />
      
      <ContactFields 
        formData={formData}
        handleChange={handleChange}
      />
      
      <DocumentFields 
        formData={formData}
        handleChange={handleChange}
      />
      
      <ServiceTypeField 
        formData={formData}
        handleChange={handleChange}
      />

      <Button 
        type="submit" 
        className="w-full h-12 bg-gradient-to-r from-smartcare-blue-600 to-smartcare-green-600 hover:from-smartcare-blue-700 hover:to-smartcare-green-700"
        disabled={loading}
      >
        {loading ? 'Memproses...' : 'Daftar'}
      </Button>
    </form>
  );
};

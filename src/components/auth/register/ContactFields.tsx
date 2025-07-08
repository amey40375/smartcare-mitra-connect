
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Phone, MapPin } from 'lucide-react';

interface ContactFieldsProps {
  formData: {
    nomor_hp: string;
    alamat: string;
  };
  handleChange: (field: string, value: string) => void;
}

export const ContactFields: React.FC<ContactFieldsProps> = ({ 
  formData, 
  handleChange 
}) => {
  return (
    <>
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
    </>
  );
};


import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ServiceTypeFieldProps {
  formData: {
    jenis_layanan: string;
  };
  handleChange: (field: string, value: string) => void;
}

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

export const ServiceTypeField: React.FC<ServiceTypeFieldProps> = ({ 
  formData, 
  handleChange 
}) => {
  return (
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
  );
};

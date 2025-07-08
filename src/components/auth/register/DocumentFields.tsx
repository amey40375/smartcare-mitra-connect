
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';

interface DocumentFieldsProps {
  formData: {
    ktp: string;
    kk: string;
  };
  handleChange: (field: string, value: string) => void;
}

export const DocumentFields: React.FC<DocumentFieldsProps> = ({ 
  formData, 
  handleChange 
}) => {
  return (
    <>
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
    </>
  );
};

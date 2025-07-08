
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterHeader } from './register/RegisterHeader';
import { RegisterForm } from './register/RegisterForm';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  return (
    <div className="mobile-container p-4 overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <RegisterHeader />

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center text-gray-800">Daftar Mitra</CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm onSwitchToLogin={onSwitchToLogin} />

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

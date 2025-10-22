
import React from 'react';
import { UserRole } from '../types';

interface HeaderProps {
  userRole: UserRole;
}

const Header: React.FC<HeaderProps> = ({ userRole }) => {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center z-10 sticky top-0">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-800 ml-2">Clipping App</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">Logado como: <span className="font-semibold capitalize">{userRole === UserRole.ADMIN ? 'Administrador' : userRole === UserRole.ASSESSOR ? 'Assessor' : 'Cliente'}</span></span>
        <div className="h-10 w-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold">
          {userRole.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Header;
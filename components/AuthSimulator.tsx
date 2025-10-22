
import React from 'react';
import { UserRole } from '../types';

interface AuthSimulatorProps {
  onLogin: (role: UserRole) => void;
}

const AuthSimulator: React.FC<AuthSimulatorProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = React.useState<UserRole>(UserRole.ADMIN);

  const handleLogin = () => {
    onLogin(selectedRole);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Entrar no Clipping App</h2>
        
        <div className="mb-6">
          <label htmlFor="role-select" className="block text-gray-700 text-sm font-bold mb-2">
            Selecionar Perfil de Usuário (Simulação)
          </label>
          <select
            id="role-select"
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
          >
            <option value={UserRole.ADMIN}>Administrador</option>
            <option value={UserRole.ASSESSOR}>Assessor</option>
            <option value={UserRole.CLIENT}>Cliente</option>
          </select>
        </div>

        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Simular Login
        </button>
        
        <p className="text-center text-gray-500 text-xs mt-6">
          Esta é uma simulação de login para fins de demonstração.
          <br/>
          Nenhuma autenticação real é realizada.
        </p>
        
        <div className="mt-8 text-center">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                Entender a Cobrança da API Gemini
            </a>
        </div>
      </div>
    </div>
  );
};

export default AuthSimulator;
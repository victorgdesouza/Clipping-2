
import React from 'react';
import { ActiveSection } from '../types';

interface SidebarProps {
  onNavigate: (section: ActiveSection) => void;
  activeSection: ActiveSection;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeSection }) => {
  const navItems = [
    { name: 'Dashboard', icon: '📊', section: 'dashboard' },
    { name: 'Notícias', icon: '📰', section: 'news' },
    { name: 'Mídias Sociais', icon: '📱', section: 'social' }, // Novo item
    { name: 'Relatórios', icon: '📈', section: 'reports' }, // Novo item
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col">
      <div className="text-2xl font-semibold text-center mb-8">
        <span className="text-blue-400">C</span>lipping
      </div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <button
                onClick={() => onNavigate(item.section as ActiveSection)}
                className={`flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200 
                  ${activeSection === item.section ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-700">
        <p className="text-sm text-gray-400">© 2024 Clipping App</p>
      </div>
    </aside>
  );
};

export default Sidebar;
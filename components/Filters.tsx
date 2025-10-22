
import React from 'react';
import { NewsCategory, UserRole, SocialMediaPlatform } from '../types';

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: NewsCategory | '';
  setSelectedCategory: (category: NewsCategory | '') => void;
  selectedPlatform: SocialMediaPlatform | ''; // Added for social media platform filter
  setSelectedPlatform: (platform: SocialMediaPlatform | '') => void; // Added for social media platform filter
  selectedClient: string | '';
  setSelectedClient: (client: string | '') => void;
  clients: string[];
  userRole: UserRole; // Adicionado para controle de permissão
  showCategoryFilter?: boolean; // Para NewsFeed
  showPlatformFilter?: boolean; // Para SocialMediaFeed
}

const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedPlatform, // Destructure new prop
  setSelectedPlatform, // Destructure new prop
  selectedClient,
  setSelectedClient,
  clients,
  userRole,
  showCategoryFilter = true,
  showPlatformFilter = false, // Assume false por padrão, NewsFeed definirá como false, SocialMediaFeed como true
}) => {
  const categories = Object.values(NewsCategory);
  // As plataformas de mídia social são hardcoded para simplicidade, se showPlatformFilter for true
  const socialMediaPlatforms = Object.values(SocialMediaPlatform); // Use enum values

  const isClientUser = userRole === UserRole.CLIENT;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-center justify-between">
      {/* Search Bar */}
      <div className="flex-grow min-w-[200px] max-w-sm">
        <input
          type="text"
          placeholder="Buscar por título, palavra-chave, veículo..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Buscar por palavra-chave"
        />
      </div>

      {/* Category Filter (para notícias) */}
      {showCategoryFilter && (
        <div className="min-w-[150px]">
          <select
            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as NewsCategory | '')}
            aria-label="Filtrar por categoria de notícia"
          >
            <option value="">Todas as Categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      )}

      {/* Platform Filter (para mídias sociais) */}
      {showPlatformFilter && (
        <div className="min-w-[150px]">
          <select
            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedPlatform} // Use new selectedPlatform prop
            onChange={(e) => setSelectedPlatform(e.target.value as SocialMediaPlatform | '')} // Use new setSelectedPlatform prop
            aria-label="Filtrar por plataforma de mídia social"
          >
            <option value="">Todas as Plataformas</option>
            {socialMediaPlatforms.map((platform) => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>
      )}

      {/* Client Filter */}
      <div className="min-w-[150px]">
        <select
          className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          disabled={isClientUser} // Desabilitar se for usuário cliente
          aria-label="Filtrar por cliente"
        >
          <option value="">Todos os Clientes</option>
          {clients.map((client) => (
            <option key={client} value={client}>{client}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
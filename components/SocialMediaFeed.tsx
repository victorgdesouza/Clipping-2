
import React from 'react';
import SocialMediaCard from './SocialMediaCard';
import Filters from './Filters';
import { SocialMediaPost, Sentiment, SocialMediaPlatform, UserRole } from '../types';
import { MOCK_CLIENTS } from '../constants'; // MOCK_SOCIAL_MEDIA_POSTS agora vem via props

interface SocialMediaFeedProps {
  userRole: UserRole;
  socialMediaPosts: SocialMediaPost[];
  setSocialMediaPosts: React.Dispatch<React.SetStateAction<SocialMediaPost[]>>;
  globalSelectedClient: string | '';
  setGlobalSelectedClient: React.Dispatch<React.SetStateAction<string | ''>>;
}

const SocialMediaFeed: React.FC<SocialMediaFeedProps> = ({ userRole, socialMediaPosts, setSocialMediaPosts, globalSelectedClient, setGlobalSelectedClient }) => {
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = React.useState<SocialMediaPlatform | ''>(''); // Usando selectedCategory do Filters para plataforma

  const handleSentimentChange = React.useCallback((id: string, newSentiment: Sentiment) => {
    setSocialMediaPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { ...post, sentiment: newSentiment } : post
      )
    );
  }, [setSocialMediaPosts]);

  const filteredPosts = React.useMemo(() => {
    return socialMediaPosts.filter(post => {
      const matchesSearch = searchTerm
        ? post.content.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesPlatform = selectedPlatform
        ? post.platform === selectedPlatform
        : true;

      const matchesClient = globalSelectedClient
        ? post.client === globalSelectedClient
        : true;
      
      return matchesSearch && matchesPlatform && matchesClient;
    });
  }, [socialMediaPosts, searchTerm, selectedPlatform, globalSelectedClient]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Mídias Sociais Recentes</h2>
      
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        // Pass empty string for selectedCategory when not showing news category filter
        selectedCategory={''} 
        setSelectedCategory={() => {}} 
        selectedPlatform={selectedPlatform} // Pass selectedPlatform directly
        setSelectedPlatform={setSelectedPlatform} // Pass setSelectedPlatform directly
        selectedClient={globalSelectedClient}
        setSelectedClient={setGlobalSelectedClient}
        clients={MOCK_CLIENTS}
        userRole={userRole}
        showCategoryFilter={false} // Não mostrar filtro de categoria de notícia aqui
        showPlatformFilter={true} // Mostrar filtro de plataforma de mídia social
      />

      {filteredPosts.length === 0 ? (
        <div className="text-center text-gray-600 text-lg p-8">
          Nenhum post de mídia social encontrado com os filtros aplicados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <SocialMediaCard
              key={post.id}
              post={post}
              onSentimentChange={handleSentimentChange}
              userRole={userRole}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialMediaFeed;
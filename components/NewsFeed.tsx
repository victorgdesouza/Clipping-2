
import React from 'react';
import NewsCard from './NewsCard';
import Filters from './Filters';
import { NewsArticle, Sentiment, NewsCategory, UserRole } from '../types';
import { MOCK_CLIENTS } from '../constants'; // MOCK_NEWS_ARTICLES agora vem via props

interface NewsFeedProps {
  userRole: UserRole;
  newsArticles: NewsArticle[]; // Recebe notícias como prop
  setNewsArticles: React.Dispatch<React.SetStateAction<NewsArticle[]>>; // Permite atualizar o estado global
  globalSelectedClient: string | '';
  setGlobalSelectedClient: React.Dispatch<React.SetStateAction<string | ''>>;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ userRole, newsArticles, setNewsArticles, globalSelectedClient, setGlobalSelectedClient }) => {
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [selectedCategory, setSelectedCategory] = React.useState<NewsCategory | ''>('');

  const handleSentimentChange = React.useCallback((id: string, newSentiment: Sentiment) => {
    setNewsArticles(prevArticles =>
      prevArticles.map(article =>
        article.id === id ? { ...article, sentiment: newSentiment } : article
      )
    );
  }, [setNewsArticles]);

  const filteredArticles = React.useMemo(() => {
    return newsArticles.filter(article => {
      const matchesSearch = searchTerm
        ? (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (article.journalist && article.journalist.toLowerCase().includes(searchTerm.toLowerCase())))
        : true;

      const matchesCategory = selectedCategory
        ? article.category === selectedCategory
        : true;

      const matchesClient = globalSelectedClient
        ? article.client === globalSelectedClient
        : true;
      
      return matchesSearch && matchesCategory && matchesClient;
    });
  }, [newsArticles, searchTerm, selectedCategory, globalSelectedClient]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Notícias Recentes</h2>
      
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedClient={globalSelectedClient}
        setSelectedClient={setGlobalSelectedClient}
        clients={MOCK_CLIENTS}
        userRole={userRole}
        showCategoryFilter={true}
        showPlatformFilter={false} // Garantir que o filtro de plataforma não apareça aqui
      />

      {filteredArticles.length === 0 ? (
        <div className="text-center text-gray-600 text-lg p-8">
          Nenhuma notícia encontrada com os filtros aplicados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <NewsCard
              key={article.id}
              article={article}
              onSentimentChange={handleSentimentChange}
              userRole={userRole}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;

import React from 'react';
import { SocialMediaPost, Sentiment, UserRole, SocialMediaPlatform } from '../types';
import { analyzeSentiment } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface SocialMediaCardProps {
  post: SocialMediaPost;
  onSentimentChange: (id: string, newSentiment: Sentiment) => void;
  userRole: UserRole;
}

const SocialMediaCard: React.FC<SocialMediaCardProps> = ({ post, onSentimentChange, userRole }) => {
  const [sentimentLoading, setSentimentLoading] = React.useState(post.sentiment === Sentiment.ANALYZING);

  // Efeito para sincronizar sentimentLoading com o estado inicial do post
  React.useEffect(() => {
    setSentimentLoading(post.sentiment === Sentiment.ANALYZING);
  }, [post.sentiment]);

  const getSentimentClasses = (sentiment: Sentiment) => {
    switch (sentiment) {
      case Sentiment.POSITIVE:
        return 'bg-green-100 text-green-800';
      case Sentiment.NEGATIVE:
        return 'bg-red-100 text-red-800';
      case Sentiment.NEUTRAL:
        return 'bg-yellow-100 text-yellow-800';
      case Sentiment.ANALYZING:
        return 'bg-blue-100 text-blue-800 animate-pulse';
      case Sentiment.UNCLASSIFIED:
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAnalyzeSentiment = React.useCallback(async () => {
    if (post.sentiment !== Sentiment.ANALYZING) {
      onSentimentChange(post.id, Sentiment.ANALYZING);
      setSentimentLoading(true);
      try {
        // Para posts de mídia social, analisamos o conteúdo do post
        const resultSentiment = await analyzeSentiment(post.content);
        onSentimentChange(post.id, resultSentiment);
      } catch (error) {
        console.error('Falha ao analisar sentimento do post de mídia social:', error);
        onSentimentChange(post.id, Sentiment.UNCLASSIFIED);
      } finally {
        setSentimentLoading(false);
      }
    }
  }, [post.id, post.content, post.sentiment, onSentimentChange]);

  const formattedDate = new Date(post.date).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const canAnalyzeSentiment = (userRole === UserRole.ADMIN || userRole === UserRole.ASSESSOR);

  const getPlatformIcon = (platform: SocialMediaPlatform) => {
    switch (platform) {
      case SocialMediaPlatform.TWITTER:
        return '🐦';
      case SocialMediaPlatform.FACEBOOK:
        return '📘';
      case SocialMediaPlatform.INSTAGRAM:
        return '📸';
      case SocialMediaPlatform.LINKEDIN:
        return '👔';
      default:
        return '🌐';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col" aria-label={`Post de mídia social: ${post.platform}`}>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-2">{getPlatformIcon(post.platform)}</span>
          <h3 className="text-xl font-semibold text-gray-800">{post.platform}</h3>
        </div>
        <p className="text-sm text-gray-700 mb-3 flex-grow">{post.content}</p>
        
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 mb-3">
          <span>{formattedDate}</span>
          <span>| Cliente: {post.client}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span>❤️ {post.likes}</span>
          <span>💬 {post.comments}</span>
          <span>🔄 {post.shares}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSentimentClasses(post.sentiment)}`} aria-live="polite">
            Sentimento: {post.sentiment}
          </span>
          {canAnalyzeSentiment && (
            <button
              onClick={handleAnalyzeSentiment}
              disabled={sentimentLoading}
              className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Analisar Sentimento com Inteligência Artificial"
            >
              {sentimentLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Analisando...</span>
                </>
              ) : (
                'Analisar Sentimento (IA)'
              )}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors duration-200"
            aria-label="Ver post original"
          >
            Ver Post Original
          </a>
          {(userRole === UserRole.ADMIN || userRole === UserRole.ASSESSOR) && (
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors duration-200" aria-label="Baixar post">
              Download
            </button>
          )}
          {(userRole === UserRole.ADMIN || userRole === UserRole.ASSESSOR) && (
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors duration-200" aria-label="Exportar post">
              Exportar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaCard;
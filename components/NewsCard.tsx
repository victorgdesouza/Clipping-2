
import React from 'react';
import { NewsArticle, Sentiment, UserRole } from '../types';
import { analyzeSentiment } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface NewsCardProps {
  article: NewsArticle;
  onSentimentChange: (id: string, newSentiment: Sentiment) => void;
  userRole: UserRole;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onSentimentChange, userRole }) => {
  const [showFullContent, setShowFullContent] = React.useState(false);
  const [sentimentLoading, setSentimentLoading] = React.useState(article.sentiment === Sentiment.ANALYZING);

  // Efeito para sincronizar sentimentLoading com o estado inicial do artigo
  React.useEffect(() => {
    setSentimentLoading(article.sentiment === Sentiment.ANALYZING);
  }, [article.sentiment]);


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
    if (article.fullContent && article.sentiment !== Sentiment.ANALYZING) {
      onSentimentChange(article.id, Sentiment.ANALYZING);
      setSentimentLoading(true);
      try {
        const resultSentiment = await analyzeSentiment(article.fullContent);
        onSentimentChange(article.id, resultSentiment);
      } catch (error) {
        console.error('Falha ao analisar sentimento:', error);
        onSentimentChange(article.id, Sentiment.UNCLASSIFIED);
      } finally {
        setSentimentLoading(false);
      }
    }
  }, [article.id, article.fullContent, article.sentiment, onSentimentChange]);

  const formattedDate = new Date(article.date).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const canAnalyzeSentiment = (userRole === UserRole.ADMIN || userRole === UserRole.ASSESSOR) && article.fullContent;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col" aria-label={`Artigo de notícia: ${article.title}`}>
      <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-2" aria-live="polite">{article.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{article.summary}</p>
        
        {showFullContent && article.fullContent && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm text-gray-700 max-h-40 overflow-y-auto mb-3" aria-expanded={showFullContent}>
            <h4 className="font-semibold mb-1">Conteúdo Completo:</h4>
            <p>{article.fullContent}</p>
          </div>
        )}

        <button
          onClick={() => setShowFullContent(!showFullContent)}
          className="text-blue-600 hover:text-blue-800 text-sm mt-2 mb-3 inline-block self-start"
          aria-controls={`full-content-${article.id}`}
          aria-expanded={showFullContent}
        >
          {showFullContent ? 'Ver menos' : 'Ver mais detalhes'}
        </button>

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 mb-3">
          <span className="font-medium">{article.source}</span>
          <span>| {formattedDate}</span>
          {article.journalist && <span>| Jornalista: {article.journalist}</span>}
          <span>| Cliente: {article.client}</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
            {article.category}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSentimentClasses(article.sentiment)}`} aria-live="polite">
            Sentimento: {article.sentiment}
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
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors duration-200"
            aria-label="Ler matéria original"
          >
            Ler Matéria Original
          </a>
          {(userRole === UserRole.ADMIN || userRole === UserRole.ASSESSOR) && (
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors duration-200" aria-label="Baixar notícia">
              Download
            </button>
          )}
          {(userRole === UserRole.ADMIN || userRole === UserRole.ASSESSOR) && (
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors duration-200" aria-label="Exportar notícia">
              Exportar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
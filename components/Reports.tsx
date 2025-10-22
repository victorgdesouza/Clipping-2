
import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas'; // Not directly used in the provided code, but kept for context if images were to be included.
import { NewsArticle, SocialMediaPost, Sentiment, UserRole } from '../types';
import { MOCK_CLIENTS } from '../constants';
// Added import for LoadingSpinner
import LoadingSpinner from './LoadingSpinner';

interface ReportsProps {
  newsArticles: NewsArticle[];
  socialMediaPosts: SocialMediaPost[];
  userRole: UserRole;
  globalSelectedClient: string | '';
}

const Reports: React.FC<ReportsProps> = ({ newsArticles, socialMediaPosts, userRole, globalSelectedClient }) => {
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');
  const [selectedClients, setSelectedClients] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Se for usuário cliente, pré-selecionar e desabilitar o filtro de cliente
    if (userRole === UserRole.CLIENT && globalSelectedClient) {
      setSelectedClients([globalSelectedClient]);
    } else if (userRole !== UserRole.CLIENT) { // For admin/assessor, clear selection if not client
      setSelectedClients([]);
    }
  }, [userRole, globalSelectedClient]);

  const handleClientChange = (client: string, isChecked: boolean) => {
    if (userRole === UserRole.CLIENT) {
      // Clients cannot change their pre-selected client
      return;
    }
    if (isChecked) {
      setSelectedClients(prev => [...prev, client]);
    } else {
      setSelectedClients(prev => prev.filter(c => c !== client));
    }
  };

  const generateReport = async () => {
    setLoading(true);

    const filteredNews = newsArticles.filter(article => {
      const articleDate = new Date(article.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      const inDateRange = (!start || articleDate >= start) && (!end || articleDate <= new Date(end.setDate(end.getDate() + 1))); // Adiciona 1 dia para incluir o dia final
      const forSelectedClients = selectedClients.length > 0 ? selectedClients.includes(article.client) : true;
      return inDateRange && forSelectedClients;
    });

    const filteredSocialMedia = socialMediaPosts.filter(post => {
      const postDate = new Date(post.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const inDateRange = (!start || postDate >= start) && (!end || postDate <= new Date(end.setDate(end.getDate() + 1)));
      const forSelectedClients = selectedClients.length > 0 ? selectedClients.includes(post.client) : true;
      return inDateRange && forSelectedClients;
    });

    const doc = new jsPDF('p', 'mm', 'a4');
    let yOffset = 10;
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Título e logo
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Relatório de Clipping', pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 10;

    // Simular logo (texto simples)
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Clipping App', pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 10;

    // Datas e clientes selecionados
    doc.setFontSize(12);
    doc.text(`Período: ${startDate || 'Início'} a ${endDate || 'Fim'}`, margin, yOffset);
    yOffset += 7;
    doc.text(`Clientes: ${selectedClients.length > 0 ? selectedClients.join(', ') : 'Todos'}`, margin, yOffset);
    yOffset += 15;

    // Métricas de resumo
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Métricas de Resumo', margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');

    const totalItems = filteredNews.length + filteredSocialMedia.length;
    const positiveItems = [...filteredNews, ...filteredSocialMedia].filter(item => item.sentiment === Sentiment.POSITIVE).length;
    const negativeItems = [...filteredNews, ...filteredSocialMedia].filter(item => item.sentiment === Sentiment.NEGATIVE).length;
    const neutralItems = [...filteredNews, ...filteredSocialMedia].filter(item => item.sentiment === Sentiment.NEUTRAL).length;
    
    doc.text(`Total de Itens: ${totalItems}`, margin, yOffset);
    yOffset += 7;
    doc.text(`Sentimento Positivo: ${positiveItems}`, margin, yOffset);
    yOffset += 7;
    doc.text(`Sentimento Negativo: ${negativeItems}`, margin, yOffset);
    yOffset += 7;
    doc.text(`Sentimento Neutro: ${neutralItems}`, margin, yOffset);
    yOffset += 15;

    // Notícias
    if (filteredNews.length > 0) {
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('Notícias', margin, yOffset);
      yOffset += 10;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');

      for (const article of filteredNews) {
        if (yOffset + 30 > doc.internal.pageSize.getHeight() - margin) { // Check if new page needed
          doc.addPage();
          yOffset = margin;
        }
        doc.setFont(undefined, 'bold');
        doc.text(`Título: ${article.title}`, margin, yOffset, { maxWidth: pageWidth - 2 * margin });
        doc.setFont(undefined, 'normal');
        yOffset += 5;
        doc.text(`Fonte: ${article.source} | Data: ${new Date(article.date).toLocaleDateString('pt-BR')} | Sentimento: ${article.sentiment} | Cliente: ${article.client}`, margin, yOffset, { maxWidth: pageWidth - 2 * margin });
        yOffset += 5;
        doc.text(`Link: ${article.link}`, margin, yOffset, { maxWidth: pageWidth - 2 * margin });
        yOffset += 10;
      }
    }

    // Mídias Sociais
    if (filteredSocialMedia.length > 0) {
      if (yOffset + 30 > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yOffset = margin;
      }
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('Mídias Sociais', margin, yOffset);
      yOffset += 10;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');

      for (const post of filteredSocialMedia) {
        if (yOffset + 30 > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          yOffset = margin;
        }
        doc.setFont(undefined, 'bold');
        doc.text(`Plataforma: ${post.platform}`, margin, yOffset, { maxWidth: pageWidth - 2 * margin });
        doc.setFont(undefined, 'normal');
        yOffset += 5;
        doc.text(`Conteúdo: ${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}`, margin, yOffset, { maxWidth: pageWidth - 2 * margin });
        yOffset += 5;
        doc.text(`Data: ${new Date(post.date).toLocaleDateString('pt-BR')} | Sentimento: ${post.sentiment} | Cliente: ${post.client}`, margin, yOffset, { maxWidth: pageWidth - 2 * margin });
        yOffset += 5;
        doc.text(`Engajamento: ❤️${post.likes} 💬${post.comments} 🔄${post.shares}`, margin, yOffset, { maxWidth: pageWidth - 2 * margin });
        yOffset += 5;
        doc.text(`Link: ${post.link}`, margin, yOffset, { maxWidth: pageWidth - 2 * margin });
        yOffset += 10;
      }
    }


    doc.save(`Relatorio_Clipping_${startDate}_${endDate}.pdf`);
    setLoading(false);
  };

  // Removed isAssessorOrAdmin check as clients can now access the page but with restrictions.
  // The 'disabled' props will handle the client role.

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Gerar Relatórios</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">Data de Início:</label>
            <input
              type="date"
              id="startDate"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">Data de Fim:</label>
            <input
              type="date"
              id="endDate"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Selecionar Clientes:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {MOCK_CLIENTS.map(client => (
              <label 
                key={client} 
                className={`inline-flex items-center p-2 rounded-md ${selectedClients.includes(client) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'} ${userRole === UserRole.CLIENT ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'}`}
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 rounded"
                  value={client}
                  checked={selectedClients.includes(client)}
                  onChange={(e) => handleClientChange(client, e.target.checked)}
                  disabled={userRole === UserRole.CLIENT} // Correctly disable checkbox if user is a client
                />
                <span className="ml-2">{client}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={generateReport}
          disabled={loading || selectedClients.length === 0 || userRole === UserRole.CLIENT} // Disable for clients
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Gerando Relatório...</span>
            </>
          ) : (
            'Gerar Relatório PDF'
          )}
        </button>
      </div>

      <p className="text-center text-gray-600 text-sm mt-8">
        Nota: A geração do relatório pode levar alguns segundos, dependendo da quantidade de dados.
      </p>
    </div>
  );
};

export default Reports;

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { NewsArticle, NewsCategory, Sentiment, Metric, ChartDataPoint, SocialMediaPost } from '../types';

interface DashboardProps {
  newsArticles: NewsArticle[];
  socialMediaPosts: SocialMediaPost[];
}

const Dashboard: React.FC<DashboardProps> = ({ newsArticles, socialMediaPosts }) => {
  const allItems = [...newsArticles, ...socialMediaPosts];

  // Calculate metrics for all items (news + social media)
  const totalItems = allItems.length;
  const positiveItems = allItems.filter(item => item.sentiment === Sentiment.POSITIVE).length;
  const negativeItems = allItems.filter(item => item.sentiment === Sentiment.NEGATIVE).length;
  const neutralItems = allItems.filter(item => item.sentiment === Sentiment.NEUTRAL).length;
  const unclassifiedItems = allItems.filter(item => item.sentiment === Sentiment.UNCLASSIFIED).length;
  const analyzingItems = allItems.filter(item => item.sentiment === Sentiment.ANALYZING).length;

  const metrics: Metric[] = [
    { title: 'Total de Itens', value: totalItems.toString(), change: '+12%', changeType: 'increase' },
    { title: 'Itens Positivos', value: positiveItems.toString(), change: '+8%', changeType: 'increase' },
    { title: 'Itens Negativos', value: negativeItems.toString(), change: '-3%', changeType: 'decrease' },
    { title: 'Itens Neutros', value: neutralItems.toString(), change: '+2%', changeType: 'neutral' },
  ];

  // Prepare data for Volume by Category Chart (only for News Articles)
  const categoryDataMap = new Map<NewsCategory, number>();
  newsArticles.forEach(article => {
    categoryDataMap.set(article.category, (categoryDataMap.get(article.category) || 0) + 1);
  });
  const categoryChartData: ChartDataPoint[] = Array.from(categoryDataMap.entries()).map(([name, value]) => ({ name, value }));

  // Prepare data for Volume by Platform Chart (only for Social Media Posts)
  const platformDataMap = new Map<string, number>();
  socialMediaPosts.forEach(post => {
    platformDataMap.set(post.platform, (platformDataMap.get(post.platform) || 0) + 1);
  });
  const platformChartData: ChartDataPoint[] = Array.from(platformDataMap.entries()).map(([name, value]) => ({ name, value }));


  // Prepare data for Sentiment Distribution Chart (for all items)
  const sentimentChartData: ChartDataPoint[] = [
    { name: Sentiment.POSITIVE, value: positiveItems },
    { name: Sentiment.NEGATIVE, value: negativeItems },
    { name: Sentiment.NEUTRAL, value: neutralItems },
    { name: Sentiment.UNCLASSIFIED, value: unclassifiedItems + analyzingItems } // Combine unclassified and analyzing for dashboard display
  ].filter(data => data.value > 0); // Only show sentiments that exist

  const PIE_COLORS = ['#4CAF50', '#F44336', '#FFC107', '#9E9E9E']; // Green, Red, Amber, Grey

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">{metric.title}</h3>
            <p className="text-4xl font-bold text-gray-900 mb-2">{metric.value}</p>
            <p className={`text-sm ${metric.changeType === 'increase' ? 'text-green-600' : metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'}`}>
              {metric.change} vs mês passado
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Volume de Notícias por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" tick={{ fill: '#4B5563' }} />
              <YAxis tick={{ fill: '#4B5563' }} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Legend />
              <Bar dataKey="value" name="Número de Notícias" fill="#60A5FA" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Volume de Posts por Plataforma</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" tick={{ fill: '#4B5563' }} />
              <YAxis tick={{ fill: '#4B5563' }} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Legend />
              <Bar dataKey="value" name="Número de Posts" fill="#8884d8" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Distribuição de Sentimento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={sentimentChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {sentimentChartData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
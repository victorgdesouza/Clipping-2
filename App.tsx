
import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NewsFeed from './components/NewsFeed';
import SocialMediaFeed from './components/SocialMediaFeed'; // Novo componente
import Reports from './components/Reports'; // Novo componente
import AuthSimulator from './components/AuthSimulator';
import { UserRole, NewsArticle, SocialMediaPost, ActiveSection } from './types';
import { MOCK_NEWS_ARTICLES, MOCK_SOCIAL_MEDIA_POSTS, MOCK_CLIENTS } from './constants';

const App: React.FC = () => {
  const [userRole, setUserRole] = React.useState<UserRole | null>(null);
  const [activeSection, setActiveSection] = React.useState<ActiveSection>('dashboard');
  const [newsArticles, setNewsArticles] = React.useState<NewsArticle[]>(MOCK_NEWS_ARTICLES);
  const [socialMediaPosts, setSocialMediaPosts] = React.useState<SocialMediaPost[]>(MOCK_SOCIAL_MEDIA_POSTS);
  const [globalSelectedClient, setGlobalSelectedClient] = React.useState<string | ''>(''); // Para todos os feeds/dash/reports

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    // Se um cliente faz login, define automaticamente o cliente dele e impede a alteração
    if (role === UserRole.CLIENT) {
      setGlobalSelectedClient(MOCK_CLIENTS[0]); // Assumir 'Cliente A' para o papel de cliente
    } else {
      setGlobalSelectedClient(''); // Limpar para admin/assessor
    }
  };

  if (!userRole) {
    return <AuthSimulator onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar onNavigate={setActiveSection} activeSection={activeSection} />
      <div className="flex-1 flex flex-col">
        <Header userRole={userRole} />
        <main className="flex-1 overflow-y-auto">
          {activeSection === 'dashboard' && <Dashboard newsArticles={newsArticles} socialMediaPosts={socialMediaPosts} />}
          {activeSection === 'news' && (
            <NewsFeed 
              userRole={userRole}
              newsArticles={newsArticles}
              setNewsArticles={setNewsArticles}
              globalSelectedClient={globalSelectedClient}
              setGlobalSelectedClient={setGlobalSelectedClient}
            />
          )}
          {activeSection === 'social' && (
            <SocialMediaFeed
              userRole={userRole}
              socialMediaPosts={socialMediaPosts}
              setSocialMediaPosts={setSocialMediaPosts}
              globalSelectedClient={globalSelectedClient}
              setGlobalSelectedClient={setGlobalSelectedClient}
            />
          )}
          {activeSection === 'reports' && (
            <Reports
              userRole={userRole}
              newsArticles={newsArticles}
              socialMediaPosts={socialMediaPosts}
              globalSelectedClient={globalSelectedClient}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
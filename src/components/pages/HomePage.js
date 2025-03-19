import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'; // Using your provided Sidebar component
import PageComponent from './PageComponent';
import CollabPage from './CollabPage';

const Home = () => {
  // State to track which view should be displayed
  const [currentView, setCurrentView] = useState('page');
  
  // Sample data for user
  const mockUser = {
    id: '1',
    email: 'user@example.com',
    full_name: 'John Doe',
  };
  
  // Sample data for workspaces - matching the structure expected by your Sidebar
  const mockWorkspaces = [
    {
      id: 'ws-1',
      name: 'Project Alpha',
      icon: null,
      pages: [
        { id: 'page-1', title: 'Getting Started' },
        { id: 'page-2', title: 'Requirements' }
      ]
    },
    {
      id: 'ws-2',
      name: 'Personal Notes',
      icon: null,
      pages: [
        { id: 'page-3', title: 'Ideas' },
        { id: 'page-4', title: 'Tasks' }
      ]
    }
  ];

  // Sample page data - would come from your database in production
  const initialPage = {
    id: 'page-1',
    title: 'My Document',
    icon: '📄',
    coverUrl: '',
    isPublic: false,
    blocks: []
  };

  // Function to handle nav item clicks from the sidebar
  const handleNavClick = (tab) => {
    console.log("Navigation clicked:", tab); // Log để debug
    
    if (tab === 'people') {
      setCurrentView('collab');
    } else if (tab === 'computer') {
      setCurrentView('page');
    } else if (tab === 'planet') {
      setCurrentView('planet');
    } else if (tab === 'settings') {
      setCurrentView('settings');
    }
  };

  // Function to determine which content to display
  const renderContent = () => {
    console.log("Current view:", currentView); // Debug log
    
    switch (currentView) {
      case 'collab':
        return <CollabPage />;
      case 'planet':
        return (
          <div className="p-6 bg-gray-100 dark:bg-gray-800 dark:text-white min-h-screen">
            <h1 className="text-2xl font-bold">Planet View</h1>
            <p className="mt-4">This is the planet/global view content.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 bg-gray-100 dark:bg-gray-800 dark:text-white min-h-screen">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="mt-4">Workspace and user settings would go here.</p>
          </div>
        );
      default:
        // Default to showing the PageComponent
        return <PageComponent workspaceId={mockWorkspaces[0].id} initialPage={initialPage} />;
    }
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Use your provided Sidebar component */}
      <Sidebar 
        user={mockUser} 
        workspaces={mockWorkspaces} 
        onNavClick={handleNavClick}
      />
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Home;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import workspaceService from '../../services/workspaceService';
import authService from '../../services/authService';
import { useToast } from "../ui/use-toast";
import { ToastProvider } from "../ui/toast";
import Sidebar from './Sidebar';
import PageComponent from './PageComponent';
import CollabPage from './CollabPage';

// Create a wrapped component that uses toast inside the provider
const HomeContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast(); // Now this is used inside the provider
  const [currentView, setCurrentView] = useState('computer');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);

  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Starting authentication check');
        const currentUser = await authService.getCurrentUser();
        console.log('Current user:', currentUser);
        
        if (!currentUser) {
          console.log('No user found, redirecting to login');
          navigate('/login');
          return;
        }
        
        setUser(currentUser);
        console.log('User set, fetching workspaces');
        await fetchWorkspaces();
      } catch (error) {
        console.error('Authentication error:', error);
        toast({
          title: 'Session expired',
          description: 'Please log in again to continue',
          variant: 'destructive',
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
  
    checkAuth();
  }, [navigate, toast]);

  // Fetch workspaces for the current user
  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      const workspacesData = await workspaceService.getWorkspaces();
      setWorkspaces(workspacesData);
      
      // Select the first workspace if available
      if (workspacesData.length > 0) {
        setSelectedWorkspace(workspacesData[0]);
        
        // If the workspace has pages, select the first one
        if (workspacesData[0].pages && workspacesData[0].pages.length > 0) {
          setSelectedPage(workspacesData[0].pages[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      toast({
        title: 'Error',
        description: 'Failed to load workspaces. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle main navigation clicks from sidebar
  const handleNavClick = (tab) => {
    console.log('Navigation clicked:', tab);
    setCurrentView(tab);
  };

  // Handle workspace selection
  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);
    if (workspace.pages && workspace.pages.length > 0) {
      setSelectedPage(workspace.pages[0]); // Chọn page đầu tiên khi đổi workspace
    } else {
      setSelectedPage(null);
    }
  };

  // Handle page selection
  const handlePageSelect = (page) => {
    console.log("Handling page select:", page); // Debug
    setSelectedPage(page);
    setCurrentView('computer'); // Đảm bảo ở view computer khi chọn page
  };

  // Render loading indicator
  const renderLoadingIndicator = () => {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  };

  // Render the main content based on current view
  const renderContent = () => {
    if (isLoading) {
      return renderLoadingIndicator();
    }

    switch (currentView) {
      case 'people':
        return <CollabPage user={user} workspace={selectedWorkspace} />;
      case 'computer':
      default:
        return selectedPage ? (
          <PageComponent 
            workspaceId={selectedWorkspace?.id} 
            initialPage={selectedPage} // Truyền selectedPage vào PageComponent
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6">
              <h2 className="text-2xl font-bold mb-4">No page selected</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create a new page or select an existing one from the sidebar.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        user={user} 
        workspaces={workspaces}
        selectedWorkspace={selectedWorkspace}
        onWorkspaceSelect={handleWorkspaceSelect}
        onPageSelect={handlePageSelect} // Truyền hàm onPageSelect vào Sidebar
        onNavClick={handleNavClick}
        activeTab={currentView}
      />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

// Main component that wraps everything with the ToastProvider
const Home = () => {
  return (
    <ToastProvider>
      <HomeContent />
    </ToastProvider>
  );
};

export default Home;
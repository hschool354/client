import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import workspaceService from '../../services/workspaceService';
import authService from '../../services/authService';
import { useToast } from "../ui/use-toast";
import { ToastProvider } from "../ui/toast";
import Sidebar from './Sidebar';
import PageComponent from './PageComponent';
import CollabPage from './CollabPage';
import PlanetPage from './PlanetPage';
import SettingPage from './Setting';

const HomeContent = () => {
  const navigate = useNavigate();
  const { workspaceId, pageId } = useParams();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState('computer');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);

  // Check authentication và load dữ liệu
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Starting initialization');
        setIsLoading(true);
  
        // Kiểm tra auth
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }
        setUser(currentUser);
  
        // Fetch workspaces
        const response = await workspaceService.getWorkspaces();
        console.log('Raw response:', response);
        let workspacesData = Array.isArray(response) ? response : response.data || [];
        if (!Array.isArray(workspacesData)) {
          console.error('Expected an array, got:', workspacesData);
          workspacesData = [];
        }
        setWorkspaces(workspacesData);
  
        // Đồng bộ với URL
        if (workspacesData.length > 0) {
          let workspaceToSelect = workspaceId
            ? workspacesData.find(w => w.id === workspaceId) || workspacesData[0]
            : workspacesData[0];
  
          if (workspaceToSelect) {
            setSelectedWorkspace(workspaceToSelect);
            if (workspaceToSelect.pages?.length > 0) {
              const pageToSelect = pageId
                ? workspaceToSelect.pages.find(p => p.id === pageId) || workspaceToSelect.pages[0]
                : workspaceToSelect.pages[0];
              setSelectedPage(pageToSelect);
              navigate(`/workspace/${workspaceToSelect.id}/page/${pageToSelect.id}`);
            } else {
              navigate(`/workspace/${workspaceToSelect.id}`);
            }
          } else if (workspaceId) {
            console.warn(`Workspace with ID ${workspaceId} not found`);
            navigate('/home');
          }
        }
      } catch (error) {
        console.error('Initialization error:', error);
        toast({
          title: 'Session expired',
          description: 'Please log in again',
          variant: 'destructive',
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
  
    initializeApp();
  }, [navigate, toast, workspaceId, pageId]);

  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      const response = await workspaceService.getWorkspaces();
      console.log('Raw response:', response);
  
      // Chuẩn hóa dữ liệu thành mảng
      let workspacesData = Array.isArray(response) ? response : response.data || [];
      if (!Array.isArray(workspacesData)) {
        console.error('Expected an array, got:', workspacesData);
        workspacesData = [];
      }
  
      setWorkspaces(workspacesData);
      console.log('Workspaces data:', workspacesData);
  
      // Khôi phục trạng thái từ URL
      if (workspacesData.length > 0) {
        let workspaceToSelect = workspaceId
          ? workspacesData.find(w => w.id === workspaceId) || workspacesData[0]
          : workspacesData[0];
  
        if (workspaceToSelect) {
          setSelectedWorkspace(workspaceToSelect);
          if (workspaceToSelect.pages?.length > 0) {
            const pageToSelect = pageId
              ? workspaceToSelect.pages.find(p => p.id === pageId) || workspaceToSelect.pages[0]
              : workspaceToSelect.pages[0];
            setSelectedPage(pageToSelect);
            navigate(`/workspace/${workspaceToSelect.id}/page/${pageToSelect.id}`);
          } else {
            navigate(`/workspace/${workspaceToSelect.id}`);
          }
        } else if (workspaceId) {
          console.warn(`Workspace with ID ${workspaceId} not found`);
          navigate('/home');
        }
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      toast({
        title: 'Error',
        description: 'Failed to load workspaces. Please try again.',
        variant: 'destructive',
      });
      setWorkspaces([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkspaceSelect = (workspace) => {
    console.log('Selected workspace:', workspace);
    setSelectedWorkspace(workspace);
    const firstPage = workspace?.pages?.[0] || null;
    setSelectedPage(firstPage);
    navigate(`/workspace/${workspace.id}${firstPage ? `/page/${firstPage.id}` : ''}`);
  };

  const handlePageSelect = (page) => {
    console.log("Handling page select:", page);
    setSelectedPage(page);
    setCurrentView('computer');
    if (selectedWorkspace) {
      navigate(`/workspace/${selectedWorkspace.id}/page/${page.id}`);
    }
  };

  const handleNavClick = (tab) => {
    console.log('Navigation clicked:', tab);
    setCurrentView(tab);
  };

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

  const renderContent = () => {
    if (isLoading) {
      return renderLoadingIndicator();
    }
  
    if (!user) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-4">Please log in</h2>
            <p className="text-gray-600 dark:text-gray-400">
              You need to log in to access workspaces.
            </p>
          </div>
        </div>
      );
    }
  
    if (workspaces.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-4">No workspaces available</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create a new workspace to get started.
            </p>
          </div>
        </div>
      );
    }
  
    if (!selectedWorkspace) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-4">No workspace selected</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please select a workspace from the sidebar.
            </p>
          </div>
        </div>
      );
    }
  
    switch (currentView) {
      case 'people':
        return <CollabPage user={user} workspace={selectedWorkspace} />;
        case 'planet':
        return <PlanetPage user={user} />;
        case 'settings':
        return <SettingPage user={user} />;
      case 'computer':
      default:
        return selectedPage ? (
          <PageComponent 
            workspaceId={selectedWorkspace.id} 
            initialPage={selectedPage}
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
        onPageSelect={handlePageSelect}
        onNavClick={handleNavClick}
        activeTab={currentView}
      />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

const HomePage = () => {
  return (
    <ToastProvider>
      <HomeContent />
    </ToastProvider>
  );
};

export default HomePage;
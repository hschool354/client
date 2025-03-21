import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import workspaceService from '../../services/workspaceService';
import authService from '../../services/authService';
import { useToast } from "../ui/use-toast";
import { ToastProvider } from "../ui/toast";
import Sidebar from './Sidebar';
import PageComponent from './PageComponent';
import CollabPage from './CollabPage';

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

  // Đồng bộ trạng thái với URL khi workspaceId hoặc pageId thay đổi
  useEffect(() => {
    if (workspaces.length > 0 && workspaceId) {
      const workspace = workspaces.find(w => w.id === workspaceId);
      if (workspace) {
        setSelectedWorkspace(workspace);
        if (pageId && workspace.pages) {
          const page = workspace.pages.find(p => p.id === pageId);
          setSelectedPage(page || null);
        } else {
          setSelectedPage(workspace.pages?.[0] || null); // Chọn page đầu tiên nếu không có pageId
        }
      } else {
        console.warn(`Workspace with ID ${workspaceId} not found`);
        navigate('/home'); // Chuyển về /home nếu workspace không tồn tại
      }
    }
  }, [workspaceId, pageId, workspaces, navigate]);

  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      const workspacesData = await workspaceService.getWorkspaces();
      console.log('Workspaces data:', workspacesData);
      setWorkspaces(workspacesData);

      // Khôi phục trạng thái từ URL
      if (workspacesData.length > 0 && workspaceId) {
        const workspaceToSelect = workspacesData.find(w => w.id === workspaceId);
        if (workspaceToSelect) {
          setSelectedWorkspace(workspaceToSelect);
          if (workspaceToSelect.pages) {
            if (pageId) {
              const pageToSelect = workspaceToSelect.pages.find(p => p.id === pageId);
              setSelectedPage(pageToSelect || null);
            } else if (workspaceToSelect.pages.length > 0) {
              setSelectedPage(workspaceToSelect.pages[0]);
              navigate(`/workspace/${workspaceToSelect.id}/page/${workspaceToSelect.pages[0].id}`);
            }
          }
        } else {
          console.warn(`Workspace with ID ${workspaceId} not found`);
          navigate('/home');
        }
      } else if (workspacesData.length > 0) {
        // Nếu không có workspaceId, chọn mặc định
        setSelectedWorkspace(workspacesData[0]);
        if (workspacesData[0].pages?.length > 0) {
          setSelectedPage(workspacesData[0].pages[0]);
          navigate(`/workspace/${workspacesData[0].id}/page/${workspacesData[0].pages[0].id}`);
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
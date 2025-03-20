import { create } from 'zustand';
import { createBlock, updateBlock, deleteBlock } from '../services/blockService';

export const usePageStore = create((set, get) => ({
  page: { id: '', title: 'Untitled', icon: '📄', coverUrl: '', isPublic: false },
  blocks: [],
  loading: true,
  saving: false,
  isStarred: false,
  coverExpanded: false,
  showMenu: false,
  searchQuery: '',
  recentPages: [],
  notification: null,
  selectedTab: 'content',
  showEmojiPicker: false,
  focusedBlockId: null,
  pageHistory: [],
  showTagsInput: false,
  pageTags: [],
  newTag: '',

  setPage: (page) => set({ page }),
  setBlocks: (blocks) => {
    console.log('Setting blocks:', blocks);
    set({ blocks });
  },
  setLoading: (loading) => set({ loading }),
  setSaving: (saving) => set({ saving }),
  setNotification: (notification) => {
    set({ notification });
    if (notification) setTimeout(() => set({ notification: null }), 3000);
  },
  setSelectedTab: (selectedTab) => set({ selectedTab }),
  setIsStarred: (isStarred) => set({ isStarred }),
  toggleStar: () => set((state) => ({ isStarred: !state.isStarred })),
  setCoverExpanded: (coverExpanded) => set({ coverExpanded }),
  setShowEmojiPicker: (showEmojiPicker) => set({ showEmojiPicker }),
  setFocusedBlockId: (focusedBlockId) => set({ focusedBlockId }),
  setPageHistory: (pageHistory) => set({ pageHistory }),
  setShowTagsInput: (showTagsInput) => set({ showTagsInput }),
  setPageTags: (pageTags) => set({ pageTags }),
  setNewTag: (newTag) => set({ newTag }),
  setRecentPages: (recentPages) => set({ recentPages }),

  addBlock: async (type, position) => {
    const blocks = get().blocks;
    const pageId = get().page.id;
    if (!pageId) {
      console.error('Page ID is missing');
      return;
    }
    try {
      const newBlock = await createBlock({
        pageId,
        type: type || 'text',
        content: '',
        position: position + 1,
      });
      const blockWithId = { ...newBlock, id: newBlock._id }; // Đồng bộ id
      const updatedBlocks = [
        ...blocks.slice(0, position + 1),
        blockWithId,
        ...blocks.slice(position + 1).map(b => ({ ...b, position: b.position + 1 })),
      ];
      console.log('Adding block, new blocks:', updatedBlocks);
      set({ blocks: updatedBlocks });
      setTimeout(() => {
        set({ focusedBlockId: newBlock._id });
        const textarea = document.querySelector(`textarea[data-block-id="${newBlock._id}"]`);
        if (textarea) textarea.focus();
      }, 100);
      return newBlock._id;
    } catch (error) {
      console.error('Failed to add block in store:', error);
      throw error; // Ném lỗi để component xử lý
    }
  },

  updateBlock: async (id, updates) => {
    const blocks = get().blocks;
    const blockIndex = blocks.findIndex(b => b.id === id); // Dùng id thay vì _id
    if (blockIndex === -1) {
      console.error('Block not found:', id);
      return;
    }
    const updatedBlocks = blocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    );
    console.log('Updating block, new blocks:', updatedBlocks);
    set({ blocks: updatedBlocks });
    try {
      await updateBlock(id, updates);
    } catch (error) {
      console.error('Failed to update block in API:', error);
      // Rollback nếu cần
      set({ blocks });
      throw error;
    }
  },

  deleteBlock: async (id) => {
    const blocks = get().blocks;
    const blockIndex = blocks.findIndex(b => b.id === id); // Dùng id thay vì _id
    if (blockIndex === -1) {
      console.error('Block not found:', id);
      return;
    }
    const originalBlocks = [...blocks];
    const updatedBlocks = [
      ...blocks.slice(0, blockIndex),
      ...blocks.slice(blockIndex + 1).map(b => ({ ...b, position: b.position - 1 })),
    ];
    console.log('Deleting block, new blocks:', updatedBlocks);
    set({ blocks: updatedBlocks });
    try {
      await deleteBlock(id);
      if (blockIndex > 0) {
        set({ focusedBlockId: blocks[blockIndex - 1].id });
      } else if (updatedBlocks.length > 0) {
        set({ focusedBlockId: updatedBlocks[0].id });
      }
    } catch (error) {
      console.error('Failed to delete block in API:', error);
      set({ blocks: originalBlocks }); // Rollback
      throw error;
    }
  },

  updatePageTitle: (title) => set((state) => ({ page: { ...state.page, title } })),
  updatePageIcon: (icon) => set((state) => ({ page: { ...state.page, icon } })),
  updatePageCover: (coverUrl) => set((state) => ({ page: { ...state.page, coverUrl } })),
  togglePagePublic: () => set((state) => ({ page: { ...state.page, isPublic: !state.page.isPublic } })),

  addTag: (tag) => {
    const tagToAdd = tag || get().newTag.trim();
    if (tagToAdd && !get().pageTags.includes(tagToAdd)) {
      set((state) => ({
        pageTags: [...state.pageTags, tagToAdd],
        newTag: '',
      }));
    }
  },

  removeTag: (tag) =>
    set((state) => ({
      pageTags: state.pageTags.filter(t => t !== tag),
    })),
}));
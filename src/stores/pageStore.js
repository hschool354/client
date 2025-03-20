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

  init: (data) => set({
    page: data.page,
    blocks: data.blocks.map(block => ({ ...block, id: block._id })), // Đồng bộ _id thành id nếu cần
    pageHistory: data.pageHistory,
    pageTags: data.pageTags,
    recentPages: data.recentPages,
  }),
  
  setPage: (page) => set({ page }),
  setBlocks: (blocks) => set({ blocks }),
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
    try {
      const newBlock = await createBlock({
        pageId,
        type: type || 'text',
        content: '',
        position: position + 1,
      });
      const updatedBlocks = [
        ...blocks.slice(0, position + 1),
        { ...newBlock, id: newBlock._id }, // Đảm bảo thêm block với _id
        ...blocks.slice(position + 1).map(b => ({ ...b, position: b.position + 1 })),
      ];
      set({ blocks: updatedBlocks });
      setTimeout(() => {
        set({ focusedBlockId: newBlock._id });
        const textarea = document.querySelector(`textarea[data-block-id="${newBlock._id}"]`);
        if (textarea) textarea.focus();
      }, 100);
      return newBlock._id;
    } catch (error) {
      console.error("Failed to add block in store:", error);
    }
  },

  updateBlock: async (id, updates) => {
    const blocks = get().blocks;
    const updatedBlocks = blocks.map(block => 
      block._id === id ? { ...block, ...updates } : block
    );
    set({ blocks: updatedBlocks });
    try {
      await updateBlock(id, updates);
    } catch (error) {
      console.error("Failed to update block in API:", error);
    }
  },

  deleteBlock: async (id) => {
    const blocks = get().blocks;
    const blockIndex = blocks.findIndex(b => b._id === id);
    if (blockIndex < 0) return;
    const updatedBlocks = [
      ...blocks.slice(0, blockIndex),
      ...blocks.slice(blockIndex + 1).map(b => ({ ...b, position: b.position - 1 })),
    ];
    set({ blocks: updatedBlocks });
    try {
      await deleteBlock(id);
    } catch (error) {
      console.error("Failed to delete block in API:", error);
    }
    if (blockIndex > 0) {
      set({ focusedBlockId: blocks[blockIndex - 1]._id });
    } else if (updatedBlocks.length > 0) {
      set({ focusedBlockId: updatedBlocks[0]._id });
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
        newTag: ''
      }));
    }
  },
  
  removeTag: (tag) => set((state) => ({
    pageTags: state.pageTags.filter(t => t !== tag)
  })),
}));
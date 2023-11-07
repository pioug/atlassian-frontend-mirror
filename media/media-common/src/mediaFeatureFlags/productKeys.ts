import { ProductKeys } from './types';

const productKeys: ProductKeys = {
  confluence: {
    /**
     * Note: Confluence Flags must be prefixed with "confluence.frontend" in order to integrate properly with the product
     */
    captions: 'confluence.frontend.fabric.editor.media.captions',
    mediaInline: 'confluence.frontend.fabric.editor.media.inline',
    folderUploads: 'confluence.frontend.media.picker.folder.uploads',
  },
  jira: {
    captions: 'issue.details.editor.media.captions',
    // Manged by Linking Platform. No Rollout plan found for Jira
    mediaInline: '',
    folderUploads: 'issue.details.media-picker-folder-upload',
  },
};

export const getProductKeys = () => productKeys;

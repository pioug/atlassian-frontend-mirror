import { type ProductKeys } from './types';

const productKeys: ProductKeys = {
	confluence: {
		/**
		 * Note: Confluence Flags must be prefixed with "confluence.frontend" in order to integrate properly with the product
		 */
		mediaInline: 'confluence.frontend.fabric.editor.media.inline',
		folderUploads: 'confluence.frontend.media.picker.folder.uploads',
		commentsOnMedia: 'confluence.frontend.renderer.comments-on-media',
	},
	jira: {
		// Manged by Linking Platform. No Rollout plan found for Jira
		mediaInline: '',
		folderUploads: 'issue.details.media-picker-folder-upload',
		commentsOnMedia: '',
	},
};

export const getProductKeys = () => productKeys;

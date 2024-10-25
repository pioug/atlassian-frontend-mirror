import { type ProductKeys } from './types';

const productKeys: ProductKeys = {
	confluence: {
		mediaInline: '',
		commentsOnMedia: 'confluence.frontend.renderer.comments-on-media',
	},
	jira: {
		// Manged by Linking Platform. No Rollout plan found for Jira
		mediaInline: '',
		commentsOnMedia: '',
	},
};

export const getProductKeys = () => productKeys;

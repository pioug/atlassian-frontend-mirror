import { type ProductKeys } from './types';

const productKeys: ProductKeys = {
	confluence: {
		mediaInline: '',
	},
	jira: {
		// Manged by Linking Platform. No Rollout plan found for Jira
		mediaInline: '',
	},
};

export const getProductKeys = () => productKeys;

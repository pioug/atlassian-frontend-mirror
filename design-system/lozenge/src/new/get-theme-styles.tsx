import { type LozengeColor } from './types';

// extract the category and key from the resolved color
export const getThemeStyles: (resolvedColor: LozengeColor) => {
	category: string;
	key: string;
} = (resolvedColor: LozengeColor) => {
	const isAccent = resolvedColor.startsWith('accent-');
	const category = isAccent ? 'accent' : 'semantic';
	const key = isAccent ? resolvedColor.replace('accent-', '') : resolvedColor;

	return { category, key };
};

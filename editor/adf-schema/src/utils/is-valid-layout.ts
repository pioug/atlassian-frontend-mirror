import type { Layout } from '../schema/nodes/types/extensions';

export const isValidLayout = (name: string | null): name is Layout => {
	return !!name && ['default', 'wide', 'full-width'].includes(name);
};

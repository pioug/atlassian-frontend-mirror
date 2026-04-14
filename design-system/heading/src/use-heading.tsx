import type { HeadingElement, HeadingLevel } from './types';
import { useHeadingLevel } from './use-heading-level';

export const useHeading: (fallback: HeadingElement) => readonly [HeadingLevel, HeadingElement] = (
	fallback: HeadingElement,
) => {
	const hLevel = useHeadingLevel();
	/**
	 * Order here is important, we for now apply
	 * 1. inferred a11y level (this only applies if context is present)
	 * 2. default final fallback
	 */
	return [
		hLevel,
		((hLevel && (hLevel > 6 ? 'div' : `h${hLevel as 1 | 2 | 3 | 4 | 5 | 6}`)) ||
			fallback) as HeadingElement,
	] as const;
};

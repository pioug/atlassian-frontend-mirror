import { List, type ListProps } from './list';

/**
 * __Menu list__
 *
 * An [unordered list](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul) with visual styles removed,
 * for semantically grouping list items.
 */
export const MenuList: React.ForwardRefExoticComponent<
	Omit<ListProps, 'xcss'> & React.RefAttributes<HTMLDivElement>
	// eslint-disable-next-line @repo/internal/react/require-jsdoc
> = List;

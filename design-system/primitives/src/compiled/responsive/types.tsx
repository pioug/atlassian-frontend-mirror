import { type media } from './media-helper';

/**
 * The breakpoints we have for responsiveness.
 */
export type Breakpoint = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * All supported media queries for use as keys, eg. in `css({ [media.above.md]: { … } })`.
 */
export type MediaQuery = (typeof media.above)[Breakpoint];

export type ComponentAs =
	| 'article'
	| 'aside'
	| 'dialog'
	| 'div'
	| 'footer'
	| 'header'
	| 'li'
	| 'main'
	| 'nav'
	| 'ol'
	| 'section'
	| 'span'
	| 'ul';

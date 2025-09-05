/**
 * default: no special intent, allow inline text toolbar to be visible
 *
 * popupOpen: when a popup (e.g. table drag menu, hyperlink picker) is open
 *
 * commenting: when commenting on text
 */
export type UserIntent =
	| 'default'
	| 'dragging'
	| 'blockMenuOpen'
	| 'resizing'
	| 'popupOpen'
	| 'commenting';

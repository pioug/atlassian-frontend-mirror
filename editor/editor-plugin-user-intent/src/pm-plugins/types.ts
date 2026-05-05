import type { PopupUserIntent } from '@atlaskit/editor-common/user-intent';
/**
 * default: no special intent, allow inline text toolbar to be visible
 *
 * popupOpen: when a popup (e.g. table drag menu, hyperlink picker) is open
 *
 * commenting: when commenting on text
 *
 * overlayOpen: when a modal or overlay (e.g. the remix ephemeral preview) is open over the editor,
 * hiding the floating toolbar so it does not appear above the overlay.
 */
export type UserIntent =
	| 'default'
	| 'dragging'
	| 'blockMenuOpen'
	| 'resizing'
	| 'commenting'
	| 'aiStreaming'
	| 'dragHandleSelected'
	| 'overlayOpen'
	| PopupUserIntent;

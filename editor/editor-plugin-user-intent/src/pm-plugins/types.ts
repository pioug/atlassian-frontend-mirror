import type { PopupUserIntent } from '@atlaskit/editor-common/user-intent/types';
/**
 * default: no special intent, allow inline text toolbar to be visible
 *
 * popupOpen: when a popup (e.g. table drag menu, hyperlink picker) is open
 *
 * commenting: when commenting on text
 *
 * reviewing: when reviewing an AI Suggested Edits card, hiding node floating toolbars so they do
 * not overlap or mis-position against the suggestion card/diff decorations.
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
	| 'reviewing'
	| 'aiStreaming'
	| 'viewingDiff'
	| 'dragHandleSelected'
	| 'overlayOpen'
	| PopupUserIntent;

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
 *
 * focusOutsideEditor: a lightweight alternative to disabling the editor while focus is on a
 * related surface outside ProseMirror, such as the page title or an editor-adjacent search input.
 * The editor remains enabled and retains its selection while transient editor chrome is suppressed.
 * Defining this intent is safe without a product gate because it is inert until a consumer explicitly
 * sets it. Consumers are responsible for gating their own rollout when they begin emitting it.
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
	| 'focusOutsideEditor'
	| PopupUserIntent;

import type { IntlShape } from 'react-intl';
import { isSafeUrl } from '@atlaskit/adf-schema/is-safe-url';
import { fg } from '@atlaskit/platform-feature-flags/fg';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuid } from 'uuid';

import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { OnClickCallback } from '@atlaskit/editor-common/card';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { HyperlinkState, LinkToolbarState } from '@atlaskit/editor-common/link';
import { InsertStatus, LinkAction, getActiveLinkMark } from '@atlaskit/editor-common/link';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorAppearance, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { canLinkBeCreatedInRange, shallowEqual } from '@atlaskit/editor-common/utils';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import { PluginKey, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type {
	EditorState,
	ReadonlyTransaction,
	Selection,
} from '@atlaskit/editor-prosemirror/state';

import type { HyperlinkPlugin } from '../hyperlinkPluginType';

const mapTransactionToState = (
	state: LinkToolbarState,
	tr: ReadonlyTransaction,
): LinkToolbarState => {
	if (!state) {
		return undefined;
	} else if (
		state.type === InsertStatus.EDIT_LINK_TOOLBAR ||
		state.type === InsertStatus.EDIT_INSERTED_TOOLBAR
	) {
		const { pos, deleted } = tr.mapping.mapResult(state.pos, 1);
		const node = tr.doc.nodeAt(pos) as Node;
		// If the position was not deleted & it is still a link
		if (!deleted && !!node.type.schema.marks.link.isInSet(node.marks)) {
			if (node === state.node && pos === state.pos) {
				return state;
			}
			return { ...state, pos, node };
		}
		// If the position has been deleted, then require a navigation to show the toolbar again
		return;
	} else if (state.type === InsertStatus.INSERT_LINK_TOOLBAR) {
		return {
			...state,
			from: tr.mapping.map(state.from),
			to: tr.mapping.map(state.to),
		};
	}
	return;
};

const toState = (
	state: LinkToolbarState,
	action: LinkAction,
	editorState: EditorState,
): LinkToolbarState => {
	// Show insert or edit toolbar
	if (!state) {
		switch (action) {
			case LinkAction.SHOW_INSERT_TOOLBAR: {
				const { from, to } = editorState.selection;
				if (canLinkBeCreatedInRange(from, to)(editorState)) {
					return {
						type: InsertStatus.INSERT_LINK_TOOLBAR,
						from,
						to,
					};
				}
				return undefined;
			}
			case LinkAction.SELECTION_CHANGE:
				// If the user has moved their cursor, see if they're in a link
				const link = getActiveLinkMark(editorState);
				if (link) {
					return { ...link, type: InsertStatus.EDIT_LINK_TOOLBAR };
				}
				return undefined;
			default:
				return undefined;
		}
	}
	// Update toolbar state if selection changes, or if toolbar is hidden
	if (state.type === InsertStatus.EDIT_LINK_TOOLBAR) {
		switch (action) {
			case LinkAction.EDIT_INSERTED_TOOLBAR: {
				const link = getActiveLinkMark(editorState);
				if (link) {
					if (link.pos === state.pos && link.node === state.node) {
						return { ...state, type: InsertStatus.EDIT_INSERTED_TOOLBAR };
					}
					return { ...link, type: InsertStatus.EDIT_INSERTED_TOOLBAR };
				}
				return undefined;
			}
			case LinkAction.SELECTION_CHANGE:
				const link = getActiveLinkMark(editorState);
				if (link) {
					if (link.pos === state.pos && link.node === state.node) {
						// Make sure we return the same object, if it's the same link
						return state;
					}
					return { ...link, type: InsertStatus.EDIT_LINK_TOOLBAR };
				}
				return undefined;
			case LinkAction.HIDE_TOOLBAR:
				return undefined;
			default:
				return state;
		}
	}

	// Remove toolbar if user changes selection or toolbar is hidden
	if (state.type === InsertStatus.INSERT_LINK_TOOLBAR) {
		switch (action) {
			case LinkAction.SELECTION_CHANGE:
			case LinkAction.HIDE_TOOLBAR:
				return undefined;
			default:
				return state;
		}
	}

	return;
};

const getActiveText = (selection: Selection): string | undefined => {
	const currentSlice = selection.content();

	if (currentSlice.size === 0) {
		return;
	}

	if (
		currentSlice.content.childCount === 1 &&
		currentSlice.content.firstChild &&
		selection instanceof TextSelection
	) {
		return currentSlice.content.firstChild.textContent;
	}
	return;
};

export const stateKey: PluginKey<HyperlinkState> = new PluginKey<HyperlinkState>('hyperlinkPlugin');

export const plugin = (
	dispatch: Dispatch,
	intl: IntlShape,
	editorAppearance?: EditorAppearance,
	_pluginInjectionApi?: ExtractInjectionAPI<HyperlinkPlugin> | undefined,
	_onClickCallback?: OnClickCallback,
	__livePage?: boolean,
): SafePlugin<HyperlinkState> =>
	new SafePlugin({
		state: {
			init(_, state: EditorState): HyperlinkState {
				const canInsertLink = canLinkBeCreatedInRange(
					state.selection.from,
					state.selection.to,
				)(state);
				return {
					activeText: getActiveText(state.selection),
					canInsertLink,
					timesViewed: 0,
					activeLinkMark: toState(undefined, LinkAction.SELECTION_CHANGE, state),
					editorAppearance,
				};
			},
			apply(tr, pluginState: HyperlinkState, oldState, newState): HyperlinkState {
				let state = pluginState;
				const action = tr.getMeta(stateKey) && (tr.getMeta(stateKey).type as LinkAction);
				const inputMethod =
					tr.getMeta(stateKey) && (tr.getMeta(stateKey).inputMethod as INPUT_METHOD);

				if (tr.docChanged) {
					state = {
						activeText: state.activeText,
						canInsertLink: canLinkBeCreatedInRange(
							newState.selection.from,
							newState.selection.to,
						)(newState),
						timesViewed: state.timesViewed,
						inputMethod,
						activeLinkMark: mapTransactionToState(state.activeLinkMark, tr),
						editorAppearance,
					};
				}

				if (action) {
					const stateForAnalytics = [
						LinkAction.SHOW_INSERT_TOOLBAR,
						LinkAction.EDIT_INSERTED_TOOLBAR,
					].includes(action)
						? {
								timesViewed: ++state.timesViewed,
								// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
								searchSessionId: uuid(),
							}
						: {
								timesViewed: state.timesViewed,
								searchSessionId: state.searchSessionId,
							};

					state = {
						activeText: state.activeText,
						canInsertLink: state.canInsertLink,
						inputMethod,
						activeLinkMark: toState(state.activeLinkMark, action, newState),
						editorAppearance,
						...stateForAnalytics,
					};
				}

				const hasPositionChanged =
					oldState.selection.from !== newState.selection.from ||
					oldState.selection.to !== newState.selection.to;

				if (tr.selectionSet && hasPositionChanged) {
					state = {
						activeText: getActiveText(newState.selection),
						canInsertLink: canLinkBeCreatedInRange(
							newState.selection.from,
							newState.selection.to,
						)(newState),
						activeLinkMark: toState(state.activeLinkMark, LinkAction.SELECTION_CHANGE, newState),
						timesViewed: state.timesViewed,
						searchSessionId: state.searchSessionId,
						inputMethod,
						editorAppearance,
					};
				}

				if (!shallowEqual(state, pluginState)) {
					dispatch(stateKey, state);
				}
				return state;
			},
		},
		key: stateKey,
		props: {
			handleDOMEvents: {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				auxclick: (_, event: any) => {
					if (event.button !== 1) {
						return false;
					}
					const anchor = getLinkAnchor(event);
					if (!anchor) {
						return false;
					}

					// Browsers do not follow a link clicked inside contenteditable, so a link in
					// editable text never opens on middle-click and has to be opened here. Cards
					// render their anchor inside a contenteditable="false" node view, and a
					// read-only editor is itself contenteditable="false" — in both cases the
					// browser opens the tab, so doing it again here would open two.
					if (anchor.closest('[contenteditable="false"]')) {
						return false;
					}

					const href = anchor.getAttribute('href');
					if (!href || !isSafeUrl(href)) {
						return false;
					}

					if (!fg('platform_editor_middle_click_no_link_toolbar')) {
						return false;
					}

					window.open(href, '_blank', 'noopener,noreferrer');
					return true;
				},
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				mouseup: (_, event: any) => {
					// this prevents redundant selection transaction when clicking on link
					// link state will be update on slection change which happens on mousedown
					if (isLinkDirectTarget(event)) {
						// Leave middle-click alone so the browser can still open the link in a new tab.
						if (event.button === 1 && fg('platform_editor_middle_click_no_link_toolbar')) {
							return false;
						}
						event.preventDefault();
						return true;
					}
					return false;
				},
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				mousedown: (view, event: any) => {
					// Middle-click on a link: skip ProseMirror's own handling so it does not move
					// the selection into the link or select the card node, which is what opens
					// the toolbar.
					const middleClickAnchor = event.button === 1 ? getLinkAnchor(event) : null;
					if (middleClickAnchor && fg('platform_editor_middle_click_no_link_toolbar')) {
						// Returning true only stops ProseMirror. The browser still places a caret
						// at the click point inside contenteditable, and a caret inside the link is
						// itself enough to open the toolbar, so the default has to be suppressed
						// too. The auxclick handler above opens the tab for these links.
						//
						// Anchors inside a contenteditable="false" node view (cards, and read-only
						// editors) are deliberately left alone: they get no caret, and it is the
						// browser's default that opens their new tab.
						if (!middleClickAnchor.closest('[contenteditable="false"]')) {
							event.preventDefault();
						}
						return true;
					}

					// since link clicks are disallowed by browsers inside contenteditable
					// so we need to handle shift+click selection ourselves in this case
					if (!event.shiftKey || !isLinkDirectTarget(event)) {
						return false;
					}
					const { state } = view;
					const {
						selection: { $anchor },
					} = state;
					const newPosition = view.posAtCoords({
						left: event.clientX,
						top: event.clientY,
					});
					if (newPosition?.pos != null && newPosition.pos !== $anchor.pos) {
						const tr = state.tr.setSelection(
							TextSelection.create(state.doc, $anchor.pos, newPosition.pos),
						);
						view.dispatch(tr);
						return true;
					}
					return false;
				},
			},
		},
	});

function isLinkDirectTarget(event: MouseEvent) {
	return event?.target instanceof HTMLElement && event.target.tagName === 'A';
}

/**
 * Whether the event happened anywhere inside a link, rather than on the anchor itself.
 *
 * Matching on the anchor alone is not enough. Every smart link variant renders its anchor
 * with nested content inside it — inline cards nest icon, title and lozenge spans, block
 * and embed cards render anchors via the flexible card `base-link-element` and
 * `ExpandedFrame` — so the direct target of a real click is almost never the anchor.
 *
 * Being DOM based rather than node based, this covers every variant that renders a real
 * anchor: link marks, inline cards, block cards, embed card headers and datasource cell
 * links. None of the card node views swallow `mousedown` (their `stopEvent` only returns
 * true for `dragstart`, or for form elements in the datasource case), so the event does
 * reach this handler in all of those cases. The exception is content inside an embed
 * card's iframe, which is a separate document we cannot observe.
 *
 * `isLinkDirectTarget` is deliberately left alone: widening it would also change
 * shift+click and mouseup handling for every nested element inside a link.
 */
function getLinkAnchor(event: MouseEvent) {
	return event?.target instanceof Element
		? event.target.closest<HTMLAnchorElement>('a[href]')
		: null;
}

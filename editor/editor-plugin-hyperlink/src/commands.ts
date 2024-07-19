import type { LinkAttributes } from '@atlaskit/adf-schema';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { EditorAnalyticsAPI, UnlinkToolbarAEP } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	buildEditLinkPayload,
	EVENT_TYPE,
	INPUT_METHOD,
	unlinkPayload,
} from '@atlaskit/editor-common/analytics';
import {
	addLinkMetadata,
	type CardPluginActions,
	commandWithMetadata,
} from '@atlaskit/editor-common/card';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import { isTextAtPos, LinkAction } from '@atlaskit/editor-common/link';
import { editorCommandToPMCommand } from '@atlaskit/editor-common/preset';
import type { CardAppearance } from '@atlaskit/editor-common/provider-factory';
import type { Command, EditorCommand, LinkInputType } from '@atlaskit/editor-common/types';
import { getLinkCreationAnalyticsEvent, normalizeUrl } from '@atlaskit/editor-common/utils';
import type { Mark, Node, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { stateKey } from './pm-plugins/main';

function setLinkHrefEditorCommand(
	href: string,
	pos: number,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
	to?: number,
	isTabPressed?: boolean,
): EditorCommand {
	return ({ tr }) => {
		if (!isTextAtPos(pos)({ tr })) {
			return null;
		}
		const $pos = tr.doc.resolve(pos);
		const node = tr.doc.nodeAt(pos) as Node;
		const linkMark = tr.doc.type.schema.marks.link;
		const mark = linkMark.isInSet(node.marks) as Mark | undefined;
		const url = normalizeUrl(href);

		if (mark && mark.attrs.href === url) {
			return null;
		}

		const rightBound = to && pos !== to ? to : pos - $pos.textOffset + node.nodeSize;

		tr.removeMark(pos, rightBound, linkMark);

		if (href.trim()) {
			tr.addMark(
				pos,
				rightBound,
				linkMark.create({
					...((mark && mark.attrs) || {}),
					href: url,
				}),
			);
		} else {
			editorAnalyticsApi?.attachAnalyticsEvent(
				unlinkPayload(ACTION_SUBJECT_ID.HYPERLINK) as UnlinkToolbarAEP,
			)(tr);
		}
		if (!isTabPressed) {
			tr.setMeta(stateKey, { type: LinkAction.HIDE_TOOLBAR });
		}
		return tr;
	};
}

export function setLinkHref(
	href: string,
	pos: number,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
	to?: number,
	isTabPressed?: boolean,
): Command {
	return editorCommandToPMCommand(
		setLinkHrefEditorCommand(href, pos, editorAnalyticsApi, to, isTabPressed),
	);
}

export type UpdateLink = (href: string, text: string, pos: number, to?: number) => Command;

export function updateLinkEditorCommand(
	href: string,
	text: string,
	pos: number,
	to?: number,
): EditorCommand {
	return ({ tr }) => {
		const $pos: ResolvedPos = tr.doc.resolve(pos);
		const node: Node | null | undefined = tr.doc.nodeAt(pos);
		if (!node) {
			return null;
		}
		const url = normalizeUrl(href);

		const mark = tr.doc.type.schema.marks.link.isInSet(node.marks);
		const linkMark = tr.doc.type.schema.marks.link;

		const rightBound = to && pos !== to ? to : pos - $pos.textOffset + node.nodeSize;

		if (!url && text) {
			tr.removeMark(pos, rightBound, linkMark);
			tr.insertText(text, pos, rightBound);
		} else if (!url) {
			return null;
		} else {
			tr.insertText(text, pos, rightBound);
			// Casting to LinkAttributes to prevent wrong attributes been passed (Example ED-7951)
			const linkAttrs: LinkAttributes = {
				...((mark && (mark.attrs as LinkAttributes)) || {}),
				href: url,
			};
			tr.addMark(pos, pos + text.length, linkMark.create(linkAttrs));
			tr.setMeta(stateKey, { type: LinkAction.HIDE_TOOLBAR });
		}
		return tr;
	};
}

export function updateLink(href: string, text: string, pos: number, to?: number): Command {
	return editorCommandToPMCommand(updateLinkEditorCommand(href, text, pos, to));
}

export function insertLink(
	from: number,
	to: number,
	incomingHref: string,
	incomingTitle?: string,
	displayText?: string,
	source?: LinkInputType,
	sourceEvent?: UIAnalyticsEvent | null | undefined,
	appearance: CardAppearance = 'inline',
	cardApiActions?: CardPluginActions,
): Command {
	return (state, dispatch) => {
		const link = state.schema.marks.link;
		const { tr } = state;
		if (incomingHref.trim()) {
			const normalizedUrl = normalizeUrl(incomingHref);
			// NB: in this context, `currentText` represents text which has been
			// highlighted in the Editor, upon which a link is is being added.
			const currentText = stateKey.getState(state)?.activeText;

			let markEnd = to;
			const text = displayText || incomingTitle || incomingHref;
			if (!displayText || displayText !== currentText) {
				tr.insertText(text, from, to);
				if (!isTextAtPos(from)(state)) {
					markEnd = from + text.length + 1;
				} else {
					markEnd = from + text.length;
				}
			}

			tr.addMark(from, markEnd, link.create({ href: normalizedUrl }));
			tr.setSelection(Selection.near(tr.doc.resolve(markEnd)));

			if (!displayText || displayText === incomingHref) {
				const queueCardsFromChangedTr = cardApiActions?.queueCardsFromChangedTr;

				if (queueCardsFromChangedTr) {
					queueCardsFromChangedTr?.(
						state,
						tr,
						source!,
						ACTION.INSERTED,
						false,
						sourceEvent,
						appearance,
					);
				} else {
					addLinkMetadata(state.selection, tr, {
						action: ACTION.INSERTED,
						inputMethod: source,
						sourceEvent,
					});
				}
			} else {
				/**
				 * Add link metadata because queue cards would have otherwise handled this for us
				 */
				addLinkMetadata(state.selection, tr, {
					action: ACTION.INSERTED,
					inputMethod: source,
					sourceEvent,
				});
			}

			tr.setMeta(stateKey, { type: LinkAction.HIDE_TOOLBAR });
			if (dispatch) {
				dispatch(tr);
			}
			return true;
		}
		tr.setMeta(stateKey, { type: LinkAction.HIDE_TOOLBAR });
		if (dispatch) {
			dispatch(tr);
		}
		return false;
	};
}

export type InsertLink = (
	inputMethod: LinkInputType,
	from: number,
	to: number,
	href: string,
	title?: string,
	displayText?: string,
	cardsAvailable?: boolean,
	sourceEvent?: UIAnalyticsEvent | null | undefined,
	appearance?: CardAppearance,
) => Command;

export const insertLinkWithAnalytics = (
	inputMethod: LinkInputType,
	from: number,
	to: number,
	href: string,
	cardActions: CardPluginActions | undefined,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
	title?: string,
	displayText?: string,
	cardsAvailable: boolean = false,
	sourceEvent: UIAnalyticsEvent | null | undefined = undefined,
	appearance?: CardAppearance,
) => {
	// If smart cards are available, we send analytics for hyperlinks when a smart link is rejected.
	if (cardsAvailable && !title && !displayText) {
		return insertLink(
			from,
			to,
			href,
			title,
			displayText,
			inputMethod,
			sourceEvent,
			appearance,
			cardActions,
		);
	}
	return withAnalytics(
		editorAnalyticsApi,
		getLinkCreationAnalyticsEvent(inputMethod, href),
	)(
		insertLink(
			from,
			to,
			href,
			title,
			displayText,
			inputMethod,
			sourceEvent,
			appearance,
			cardActions,
		),
	);
};

export function removeLink(
	pos: number,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): Command {
	return commandWithMetadata(setLinkHref('', pos, editorAnalyticsApi), {
		action: ACTION.UNLINK,
	});
}

export function removeLinkEditorCommand(
	pos: number,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): EditorCommand {
	return ({ tr }) => {
		setLinkHrefEditorCommand('', pos, editorAnalyticsApi)({ tr });
		addLinkMetadata(tr.selection, tr, {
			action: ACTION.UNLINK,
		});
		return tr;
	};
}

export function editInsertedLink(editorAnalyticsApi: EditorAnalyticsAPI | undefined): Command {
	return (state, dispatch) => {
		if (dispatch) {
			const { tr } = state;
			tr.setMeta(stateKey, {
				type: LinkAction.EDIT_INSERTED_TOOLBAR,
				inputMethod: INPUT_METHOD.FLOATING_TB,
			});
			editorAnalyticsApi?.attachAnalyticsEvent(buildEditLinkPayload(ACTION_SUBJECT_ID.HYPERLINK))(
				tr,
			);
			dispatch(tr);
		}
		return true;
	};
}

type InputMethod =
	| INPUT_METHOD.TOOLBAR
	| INPUT_METHOD.QUICK_INSERT
	| INPUT_METHOD.SHORTCUT
	| INPUT_METHOD.INSERT_MENU;

export type ShowLinkToolbar = (inputMethod: InputMethod) => EditorCommand;

export function showLinkToolbar(
	inputMethod: InputMethod,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): EditorCommand {
	return ({ tr }) => {
		const newTr = tr.setMeta(stateKey, {
			type: LinkAction.SHOW_INSERT_TOOLBAR,
			inputMethod,
		});
		editorAnalyticsApi?.attachAnalyticsEvent({
			action: ACTION.INVOKED,
			actionSubject: ACTION_SUBJECT.TYPEAHEAD,
			actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_LINK,
			attributes: { inputMethod },
			eventType: EVENT_TYPE.UI,
		})(newTr);
		return newTr;
	};
}

export function hideLinkToolbar(): Command {
	return function (state, dispatch) {
		if (dispatch) {
			dispatch(hideLinkToolbarSetMeta(state.tr));
		}
		return true;
	};
}

export type HideLinkToolbar = (tr: Transaction) => Transaction;
export const hideLinkToolbarSetMeta: HideLinkToolbar = (tr: Transaction) => {
	return tr.setMeta(stateKey, { type: LinkAction.HIDE_TOOLBAR });
};

export const onEscapeCallback =
	(cardActions?: CardPluginActions): Command =>
	(state, dispatch) => {
		const { tr } = state;
		hideLinkToolbarSetMeta(tr);
		cardActions?.hideLinkToolbar?.(tr);
		if (dispatch) {
			dispatch(tr);
			return true;
		}
		return false;
	};

export const onClickAwayCallback: Command = (state, dispatch) => {
	if (dispatch) {
		hideLinkToolbar()(state, dispatch);
		return true;
	}
	return false;
};

import isEqual from 'lodash/isEqual';

import { isSafeUrl } from '@atlaskit/adf-schema';
import type { CreateUIAnalyticsEvent, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type {
	AnalyticsEventPayload,
	EditorAnalyticsAPI,
	SmartLinkNodeContext,
	UnlinkToolbarAEP,
} from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
	SMART_LINK_TYPE,
	unlinkPayload,
} from '@atlaskit/editor-common/analytics';
import { addLinkMetadata } from '@atlaskit/editor-common/card';
import type { CardReplacementInputMethod } from '@atlaskit/editor-common/card';
import type { CardAppearance } from '@atlaskit/editor-common/provider-factory';
import type { Command } from '@atlaskit/editor-common/types';
import {
	getAnnotationMarksForPos,
	getLinkCreationAnalyticsEvent,
	isFromCurrentDomain,
	nodesBetweenChanged,
	processRawValue,
} from '@atlaskit/editor-common/utils';
import { closeHistory } from '@atlaskit/editor-prosemirror/history';
import type { Node, NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
	CardAdf,
	DatasourceAdf,
	DatasourceAdfView,
	InlineCardAdf,
} from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';

import type { CardPluginState, Request } from '../types';

import {
	hideDatasourceModal,
	queueCards,
	removeDatasourceStash,
	resolveCard,
	setDatasourceStash,
} from './actions';
import { pluginKey } from './plugin-key';
import { shouldReplaceLink } from './shouldReplaceLink';
import {
	appearanceForNodeType,
	isDatasourceConfigEditable,
	isDatasourceNode,
	selectedCardAppearance,
} from './utils';

/**
 * Attempt to replace the link into the respective card.
 */
function replaceLinksToCards(
	tr: Transaction,
	cardAdf: Node,
	schema: Schema,
	request: Request,
): string | undefined {
	const { inlineCard } = schema.nodes;
	const { url } = request;

	if (!isSafeUrl(url)) {
		return;
	}

	// replace all the outstanding links with their cards
	const pos = tr.mapping.map(request.pos);
	const $pos = tr.doc.resolve(pos);
	const $head = tr.selection.$head;

	const node = tr.doc.nodeAt(pos);
	if (!node || !node.type.isText) {
		return;
	}
	const replaceLink =
		request.shouldReplaceLink || shouldReplaceLink(node, request.compareLinkText, url);

	if (!replaceLink) {
		return;
	}

	// ED-5638: add an extra space after inline cards to avoid re-rendering them
	const nodes = [cardAdf];

	if (cardAdf.type === inlineCard) {
		nodes.push(schema.text(' '));
	}

	tr.replaceWith(pos, pos + (node.text || url).length, nodes);

	if (fg('editor_inline_comments_paste_insert_nodes')) {
		const annotationMarksForPos = getAnnotationMarksForPos($head);

		if (annotationMarksForPos && annotationMarksForPos.length > 0) {
			annotationMarksForPos.forEach((annotationMark) => {
				// Add the annotation mark on to the inlineCard node and the trailing space node.
				tr.addMark(pos, pos + nodes[0].nodeSize + nodes[1].nodeSize, annotationMark);
			});
		}
	}

	return $pos.node($pos.depth - 1).type.name;
}

export const replaceQueuedUrlWithCard =
	(
		url: string,
		cardData: CardAdf | DatasourceAdf,
		analyticsAction?: ACTION,
		editorAnalyticsApi?: EditorAnalyticsAPI,
		createAnalyticsEvent?: CreateUIAnalyticsEvent,
	): Command =>
	(editorState, dispatch) => {
		const state = pluginKey.getState(editorState) as CardPluginState | undefined;
		if (!state) {
			return false;
		}

		// find the requests for this URL
		const requests = state.requests.filter((req) => req.url === url);

		// try to transform response to ADF
		const schema: Schema = editorState.schema;
		const cardAdf = processRawValue(schema, cardData);

		let tr = editorState.tr;

		if (cardAdf) {
			// Should prevent any other node than cards? [inlineCard, blockCard].includes(cardAdf.type)
			const nodeContexts: Array<string | undefined> = requests
				.map((request) => replaceLinksToCards(tr, cardAdf, schema, request))
				.filter((context) => !!context); // context exist

			// Send analytics information
			if (nodeContexts.length) {
				const nodeContext = nodeContexts.every((context) => context === nodeContexts[0])
					? nodeContexts[0]
					: 'mixed';

				/** For block links v1, default to inline links */
				const nodeType = 'inlineCard';
				const [, , domainName] = url.split('/');

				if (state.smartLinkEvents) {
					state.smartLinkEvents.insertSmartLink(domainName, 'inline', createAnalyticsEvent);
				}

				/**
				 * TODO:
				 * What if each request has a different source?
				 * Unlikely, but need to define behaviour.
				 * Ignore analytics event? take first? provide 'mixed' as well?
				 */
				const inputMethod = requests[0].source;
				const sourceEvent = requests[0].sourceEvent;

				editorAnalyticsApi?.attachAnalyticsEvent({
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					action: (analyticsAction as any) || ACTION.INSERTED,
					actionSubject: ACTION_SUBJECT.DOCUMENT,
					actionSubjectId: ACTION_SUBJECT_ID.SMART_LINK,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						inputMethod,
						nodeType,
						nodeContext: nodeContext as SmartLinkNodeContext,
						fromCurrentDomain: isFromCurrentDomain(url),
					},
					nonPrivacySafeAttributes: {
						domainName,
					},
				})(tr);

				addLinkMetadata(editorState.selection, tr, {
					action: analyticsAction,
					inputMethod,
					cardAction: 'RESOLVE',
					sourceEvent,
				});
			}
		}

		if (dispatch) {
			dispatch(resolveCard(url)(closeHistory(tr)));
		}
		return true;
	};

export const handleFallbackWithAnalytics =
	(request: Request, editorAnalyticsApi: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		const cardState = pluginKey.getState(state) as CardPluginState | undefined;

		if (!cardState) {
			return false;
		}

		const tr = state.tr;

		if (request.source !== INPUT_METHOD.FLOATING_TB) {
			editorAnalyticsApi?.attachAnalyticsEvent(
				getLinkCreationAnalyticsEvent(request.source, request.url),
			)(tr);
		}

		addLinkMetadata(state.selection, tr, {
			action: request.analyticsAction,
			inputMethod: request.source,
			sourceEvent: request.sourceEvent,
		});

		if (dispatch) {
			dispatch(resolveCard(request.url)(tr));
		}
		return true;
	};

export const queueCardsFromChangedTr = (
	state: EditorState,
	tr: Transaction,
	source: CardReplacementInputMethod,
	analyticsAction?: ACTION,
	normalizeLinkText: boolean = true,
	sourceEvent: UIAnalyticsEvent | null | undefined = undefined,
	appearance: CardAppearance = 'inline',
): Transaction => {
	const { schema } = state;
	const { link } = schema.marks;

	const requests: Request[] = [];

	nodesBetweenChanged(tr, (node, pos) => {
		if (!node.isText) {
			return true;
		}

		const linkMark = node.marks.find((mark) => mark.type === link);

		if (linkMark) {
			if (!shouldReplaceLink(node, normalizeLinkText)) {
				return false;
			}

			requests.push({
				url: linkMark.attrs.href,
				pos,
				appearance,
				compareLinkText: normalizeLinkText,
				source,
				analyticsAction,
				sourceEvent,
			});
		}

		return false;
	});

	if (analyticsAction) {
		addLinkMetadata(state.selection, tr, {
			action: analyticsAction,
		});
	}

	return queueCards(requests)(tr);
};

export const queueCardFromChangedTr = (
	state: EditorState,
	tr: Transaction,
	source: CardReplacementInputMethod,
	analyticsAction: ACTION,
	normalizeLinkText: boolean = true,
	sourceEvent: UIAnalyticsEvent | null | undefined = undefined,
	previousAppearance?: CardAppearance | 'url',
): Transaction => {
	const { schema } = state;
	const { link } = schema.marks;

	let requests: Request[] = [];

	nodesBetweenChanged(tr, (node, pos) => {
		if (!node.isText) {
			return true;
		}

		const linkMark = node.marks.find((mark) => mark.type === link);

		if (linkMark) {
			if (!shouldReplaceLink(node, normalizeLinkText)) {
				return false;
			}

			requests.push({
				url: linkMark.attrs.href,
				pos,
				appearance: 'inline',
				previousAppearance: previousAppearance,
				compareLinkText: normalizeLinkText,
				source,
				analyticsAction,
				sourceEvent,
			});
		}

		return false;
	});

	addLinkMetadata(state.selection, tr, {
		action: analyticsAction,
	});

	return queueCards(requests)(tr);
};

export const convertHyperlinkToSmartCard = (
	state: EditorState,
	source: CardReplacementInputMethod,
	appearance: CardAppearance,
	normalizeLinkText: boolean = true,
): Transaction => {
	const { schema } = state;
	const { link } = schema.marks;
	const requests: Request[] = [];

	state.tr.doc.nodesBetween(state.selection.from, state.selection.to, (node, pos) => {
		const linkMark = node.marks.find((mark) => mark.type === link);
		if (linkMark) {
			requests.push({
				url: linkMark.attrs.href,
				pos,
				appearance,
				previousAppearance: 'url',
				compareLinkText: normalizeLinkText,
				source,
				analyticsAction: ACTION.CHANGED_TYPE,
				shouldReplaceLink: true,
			});
		}
	});

	addLinkMetadata(state.selection, state.tr, {
		action: ACTION.CHANGED_TYPE,
	});

	return queueCards(requests)(state.tr);
};

export const changeSelectedCardToLink =
	(
		text?: string,
		href?: string,
		sendAnalytics?: boolean,
		node?: Node,
		pos?: number,
		editorAnalyticsApi?: EditorAnalyticsAPI,
	): Command =>
	(state, dispatch) => {
		const selectedNode =
			state.selection instanceof NodeSelection ? state.selection.node : undefined;

		let tr;
		if (node && pos) {
			tr = cardNodeToLinkWithTransaction(state, text, href, node, pos);
		} else {
			tr = cardToLinkWithTransaction(state, text, href);
		}

		updateDatasourceStash(tr, selectedNode);

		if (sendAnalytics) {
			if (selectedNode) {
				editorAnalyticsApi?.attachAnalyticsEvent({
					action: ACTION.CHANGED_TYPE,
					actionSubject: ACTION_SUBJECT.SMART_LINK,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						newType: SMART_LINK_TYPE.URL,
						previousType: appearanceForNodeType(selectedNode.type),
					},
				} as AnalyticsEventPayload)(tr);
			}
		}

		if (dispatch) {
			dispatch(tr.scrollIntoView());
		}

		return true;
	};

export const changeSelectedCardToLinkFallback =
	(
		text?: string,
		href?: string,
		sendAnalytics?: boolean,
		node?: Node,
		pos?: number,
		editorAnalyticsApi?: EditorAnalyticsAPI,
	): Command =>
	(state, dispatch) => {
		let tr;
		if (node && pos) {
			tr = cardNodeToLinkWithTransaction(state, text, href, node, pos);
		} else {
			tr = cardToLinkWithTransaction(state, text, href);
		}
		if (sendAnalytics) {
			editorAnalyticsApi?.attachAnalyticsEvent({
				action: ACTION.ERRORED,
				actionSubject: ACTION_SUBJECT.SMART_LINK,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					error: 'Smart card falling back to link.',
				},
			} as AnalyticsEventPayload)(tr);
		}

		if (dispatch) {
			dispatch(tr.scrollIntoView());
		}

		return true;
	};

export const updateCard =
	(href: string, sourceEvent?: UIAnalyticsEvent | null | undefined): Command =>
	(state, dispatch) => {
		const selectedNode = state.selection instanceof NodeSelection && state.selection.node;
		if (!selectedNode) {
			return false;
		}

		const cardAppearance = selectedCardAppearance(state);

		const tr = cardToLinkWithTransaction(state, href, href);

		queueCardFromChangedTr(
			state,
			tr,
			INPUT_METHOD.MANUAL,
			ACTION.UPDATED,
			undefined,
			sourceEvent,
			cardAppearance,
		);

		if (dispatch) {
			dispatch(tr.scrollIntoView());
		}

		return true;
	};

function cardToLinkWithTransaction(
	state: EditorState,
	text: string | undefined,
	href: string | undefined,
): Transaction {
	const selectedNode = state.selection instanceof NodeSelection && state.selection.node;
	if (!selectedNode) {
		return state.tr;
	}
	const { link } = state.schema.marks;
	const url = selectedNode.attrs.url || selectedNode.attrs.data.url;
	const tr = state.tr.replaceSelectionWith(
		state.schema.text(text || url, [link.create({ href: href || url })]),
		false,
	);
	return tr;
}

function cardNodeToLinkWithTransaction(
	state: EditorState,
	text: string | undefined,
	href: string | undefined,
	node: Node,
	pos: number,
): Transaction {
	const { link } = state.schema.marks;
	const url = node.attrs.url || node.attrs.data.url;
	return state.tr.replaceWith(
		pos,
		pos + node.nodeSize,
		state.schema.text(text || url, [link.create({ href: href || url })]),
	);
}

export const changeSelectedCardToText =
	(text: string, editorAnalyticsApi: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		const selectedNode = state.selection instanceof NodeSelection && state.selection.node;
		if (!selectedNode) {
			return false;
		}

		const tr = state.tr.replaceSelectionWith(state.schema.text(text), false);

		if (dispatch) {
			addLinkMetadata(state.selection, tr, {
				action: ACTION.UNLINK,
			});
			tr.scrollIntoView();
			editorAnalyticsApi?.attachAnalyticsEvent(
				unlinkPayload(ACTION_SUBJECT_ID.CARD_INLINE) as UnlinkToolbarAEP,
			)(tr);
			dispatch(tr);
		}

		return true;
	};

export const setSelectedCardAppearance: (
	appearance: CardAppearance,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
) => Command = (appearance, editorAnalyticsApi) => (state, dispatch) => {
	const selectedNode = state.selection instanceof NodeSelection ? state.selection.node : undefined;

	if (!selectedNode) {
		// When there is no selected node, we insert a new one
		// and replace the existing blue link
		const tr = convertHyperlinkToSmartCard(state, INPUT_METHOD.FLOATING_TB, appearance);
		if (dispatch) {
			addLinkMetadata(state.selection, tr, {
				action: ACTION.CHANGED_TYPE,
			});
			dispatch(tr.scrollIntoView());
		}

		return false;
	}

	if (appearanceForNodeType(selectedNode.type) === appearance && !selectedNode.attrs.datasource) {
		return false;
	}

	const attrs = getAttrsForAppearance(appearance, selectedNode);

	const { from, to } = state.selection;
	const nodeType = getLinkNodeType(appearance, state.schema.nodes as LinkNodes);
	const tr = state.tr.setNodeMarkup(from, nodeType, attrs, selectedNode.marks);

	updateDatasourceStash(tr, selectedNode);

	// When the selected card is the last element in the doc we add a new paragraph after it for consistent replacement
	if (tr.doc.nodeSize - 2 === to) {
		tr.insertText(' ', to);
	}

	tr.setSelection(TextSelection.create(tr.doc, to + 1));
	const previousNodePos = from - 1 > 0 ? from - 1 : 0;
	const previousNode = tr.doc.nodeAt(previousNodePos);
	if (previousNode?.type?.name === 'paragraph') {
		tr.delete(previousNodePos, from);
	}

	editorAnalyticsApi?.attachAnalyticsEvent({
		action: ACTION.CHANGED_TYPE,
		actionSubject: ACTION_SUBJECT.SMART_LINK,
		eventType: EVENT_TYPE.TRACK,
		attributes: {
			newType: appearance,
			previousType: appearanceForNodeType(selectedNode.type),
		},
	} as AnalyticsEventPayload)(tr);

	addLinkMetadata(state.selection, tr, {
		action: ACTION.CHANGED_TYPE,
	});

	if (dispatch) {
		dispatch(tr.scrollIntoView());
	}

	return true;
};

export type LinkNodes = {
	[key in 'inlineCard' | 'blockCard' | 'embedCard']: NodeType;
};

export const getLinkNodeType = (appearance: CardAppearance, linkNodes: LinkNodes): NodeType => {
	switch (appearance) {
		case 'inline':
			return linkNodes.inlineCard;
		case 'block':
			return linkNodes.blockCard;
		case 'embed':
			return linkNodes.embedCard;
	}
};

type UpdateCardArgs = {
	state: EditorState;
	node: Node;
	newAdf: DatasourceAdf | InlineCardAdf;
	view: EditorView;
	sourceEvent?: UIAnalyticsEvent;
	isDeletingConfig?: boolean;
	inputMethod?: string;
};

// Apply an update made from a datasource ui interaction
export const updateCardViaDatasource = (args: UpdateCardArgs) => {
	const { state, node, newAdf, view, sourceEvent, isDeletingConfig, inputMethod } = args;
	const {
		tr,
		selection: { from, to },
		schema: { nodes: schemaNodes },
	} = state;

	if (newAdf.type === 'blockCard') {
		if (node.attrs?.datasource && newAdf.attrs?.datasource) {
			const newAttrs = newAdf.attrs;
			const oldAttrs = node.attrs as DatasourceAdf['attrs'];

			const [newViews] = (newAttrs.datasource.views as DatasourceAdfView[]) ?? [];
			const [oldViews] = (oldAttrs.datasource.views as DatasourceAdfView[]) ?? [];

			const isColumnChange = !isEqual(oldViews?.properties?.columns, newViews?.properties?.columns);
			const isUrlChange = newAttrs.url !== oldAttrs.url;

			if (isColumnChange || isUrlChange) {
				tr.setNodeMarkup(from, schemaNodes.blockCard, {
					...oldAttrs,
					...newAdf.attrs,
				});
			}
		} else if (node.type.isText) {
			// url to datasource
			let link: { url: string; text: string | undefined; pos: number } | undefined;
			state.doc.nodesBetween(from, to, (node, pos) => {
				// get the actual start position of a link within the node
				const linkMark = node.marks.find((mark) => mark.type === state.schema.marks.link);
				if (linkMark) {
					link = {
						url: linkMark.attrs.href,
						text: node.text,
						pos,
					};
					return false;
				}
				return true;
			});

			if (link) {
				const newNode = schemaNodes.blockCard.createChecked(newAdf.attrs);
				tr.replaceWith(link.pos, link.pos + (link.text || link.url).length, [newNode]);
			}
		} else {
			// inline or blockCard to datasource
			tr.setNodeMarkup(from, schemaNodes.blockCard, newAdf.attrs);
		}
	} else if (newAdf.type === 'inlineCard') {
		// card type to inlineCard
		tr.setNodeMarkup(from, schemaNodes.inlineCard, newAdf.attrs);
	}

	addLinkMetadata(state.selection, tr, {
		action: ACTION.UPDATED,
		sourceEvent,
		inputMethod,
	});

	if (isDeletingConfig) {
		if (typeof node.attrs.url === 'string') {
			removeDatasourceStash(tr, node.attrs.url);
		}
	} else {
		hideDatasourceModal(tr);
	}
	view.dispatch(tr.scrollIntoView());
};

export const insertDatasource = (
	state: EditorState,
	adf: DatasourceAdf | InlineCardAdf,
	view: EditorView,
	sourceEvent?: UIAnalyticsEvent,
) => {
	const {
		tr,
		selection: { from },
		schema: { nodes: schemaNodes },
	} = state;

	const { attrs, type } = adf;

	const schemaNode = type === 'inlineCard' ? schemaNodes.inlineCard : schemaNodes.blockCard;
	const newNode = schemaNode.createChecked(attrs);
	// in future, if we decide to do datasource insertion from the main toolbar, we should probably consider editor-plugin-content-insertion instead of tr.insert
	// this will allow us to deal with insertions from multiple paths in a more consistent way
	newNode && tr.insert(from, newNode);

	hideDatasourceModal(tr);
	addLinkMetadata(state.selection, tr, {
		action: ACTION.INSERTED,
		sourceEvent,
	});
	view.dispatch(tr.scrollIntoView());
};

/**
 * Get attributes for new Card Appearance
 */
export const getAttrsForAppearance = (appearance: CardAppearance, selectedNode: Node) => {
	if (appearance === 'embed') {
		return {
			...selectedNode.attrs,
			layout: 'center',
		};
	}

	if (isDatasourceNode(selectedNode)) {
		return { url: selectedNode.attrs.url };
	}

	return selectedNode.attrs;
};

const updateDatasourceStash = (tr: Transaction, selectedNode?: Node) => {
	if (
		isDatasourceNode(selectedNode) &&
		!isDatasourceConfigEditable(selectedNode.attrs.datasource.id) &&
		selectedNode.attrs.url
	) {
		setDatasourceStash(tr, {
			url: selectedNode.attrs.url,
			views: selectedNode.attrs.datasource.views,
		});
	}
};

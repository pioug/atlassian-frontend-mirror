import type { SDKUnsupportedReasons } from '@loomhq/record-sdk';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics/types/enums';
import { logException } from '@atlaskit/editor-common/monitoring/error';
import { Side } from '@atlaskit/editor-common/selection';
import { GapCursorSelection } from '@atlaskit/editor-common/selection/gap-cursor/selection';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { InsertNodeAPI } from '@atlaskit/editor-plugin-content-insertion/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, TextSelection, type Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { LoomPlugin } from '../loomPluginType';
import type { LoomProviderOptions, PositionType, VideoMeta } from '../types';
import { getQuickInsertItem } from '../ui/quickInsert';
import { LoomPluginAction, loomPluginKey } from './main';

export const enableLoom =
	({
		loomButton,
		recordVideo,
	}: {
		loomButton: HTMLButtonElement;
		recordVideo?: (source: 'editor-pinned-toolbar') => void;
	}): EditorCommand =>
	({ tr }) => {
		tr.setMeta(loomPluginKey, {
			type: LoomPluginAction.ENABLE,
			loomButton,
			recordVideo,
		});
		return tr;
	};

export const disableLoom =
	({ error }: { error: string }): EditorCommand =>
	({ tr }) => {
		tr.setMeta(loomPluginKey, {
			type: LoomPluginAction.DISABLE,
			error,
		});
		return tr;
	};

export const recordVideo =
	({
		inputMethod,
		editorAnalyticsAPI,
		source,
	}: {
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
		inputMethod: INPUT_METHOD;
		source?: 'editor-pinned-toolbar';
	}): EditorCommand =>
	({ tr }) => {
		tr.setMeta(loomPluginKey, {
			type: LoomPluginAction.RECORD_VIDEO,
			source,
		});
		editorAnalyticsAPI?.attachAnalyticsEvent({
			action: ACTION.RECORD_VIDEO,
			actionSubject: ACTION_SUBJECT.LOOM,
			attributes: {
				inputMethod,
			},
			eventType: EVENT_TYPE.TRACK,
		})(tr);

		return tr;
	};

export const recordVideoFailed =
	({
		inputMethod,
		error,
		editorAnalyticsAPI,
	}: {
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
		error: SDKUnsupportedReasons | undefined;
		inputMethod: INPUT_METHOD;
	}): EditorCommand =>
	({ tr }) => {
		editorAnalyticsAPI?.attachAnalyticsEvent({
			action: ACTION.RECORD_VIDEO_FAILED,
			actionSubject: ACTION_SUBJECT.LOOM,
			attributes: {
				inputMethod,
				error,
			},
			eventType: EVENT_TYPE.TRACK,
		})(tr);

		return tr;
	};

export const insertVideo =
	({
		editorAnalyticsAPI,
		video,
	}: {
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
		video: VideoMeta;
	}): EditorCommand =>
	({ tr }) => {
		tr.setMeta(loomPluginKey, {
			type: LoomPluginAction.INSERT_VIDEO,
		});
		editorAnalyticsAPI?.attachAnalyticsEvent({
			action: ACTION.INSERT_VIDEO,
			actionSubject: ACTION_SUBJECT.LOOM,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				duration: video.duration,
			},
		})(tr);

		return tr;
	};

const getPositions = (tr: Transaction, posType: PositionType): { from: number; to: number } => {
	const selection = tr.selection;

	switch (posType) {
		case 'current':
			return { from: selection.from, to: selection.from };
		case 'start':
			return { from: 0, to: 0 };
		case 'end':
			return { from: tr.doc.content.size, to: tr.doc.content.size };
	}
};

export const insertLoom = (
	editorView: EditorView | null,
	api: ExtractInjectionAPI<LoomPlugin> | undefined,
	video: VideoMeta,
	positionType: PositionType,
): boolean => {
	if (!editorView) {
		return false;
	}
	const { state, dispatch } = editorView;
	const { from, to } = getPositions(state.tr, positionType);

	return (
		api?.hyperlink?.actions.insertLink(
			INPUT_METHOD.TYPEAHEAD,
			from,
			to,
			video.sharedUrl,
			video.title,
			undefined,
			undefined,
			undefined,
			'embed', // Convert to embed card instead of inline
		)(state, dispatch) ?? false
	);
};

export const executeRecordVideo = (
	api: ExtractInjectionAPI<LoomPlugin> | undefined,
	source?: 'editor-pinned-toolbar',
): void => {
	api?.core?.actions.execute(
		recordVideo({
			inputMethod: INPUT_METHOD.TOOLBAR,
			source,
			editorAnalyticsAPI: api?.analytics?.actions,
		}),
	);
};

/** Resolve the end of the last selected block. */
const getInsertionAnchor = (tr: Transaction) => {
	const { selection, doc } = tr;
	const $selectionEnd = selection.ranges.reduce(
		($furthestEnd, range) => (range.$to.pos > $furthestEnd.pos ? range.$to : $furthestEnd),
		selection.$to,
	);
	if (
		!(selection instanceof TextSelection) ||
		selection.empty ||
		!$selectionEnd.parent.inlineContent ||
		$selectionEnd.parentOffset !== 0
	) {
		return $selectionEnd;
	}

	// A range ending at the start of a text block includes none of that block's content.
	let $previousBlockEnd = doc.resolve($selectionEnd.before());
	// Walk out of containers that also start at this boundary.
	while ($previousBlockEnd.depth > 0 && $previousBlockEnd.parentOffset === 0) {
		$previousBlockEnd = doc.resolve($previousBlockEnd.before());
	}
	// If the previous block is a container, try its last child first.
	while (
		$previousBlockEnd.nodeBefore?.childCount &&
		!$previousBlockEnd.nodeBefore.isTextblock &&
		!$previousBlockEnd.nodeBefore.isAtom
	) {
		$previousBlockEnd = doc.resolve($previousBlockEnd.pos - 1);
	}
	return $previousBlockEnd;
};

const insertNativeLoom = (tr: Transaction, nativeEmbed: PMNode): Transaction | null => {
	const { type: embedType, marks } = nativeEmbed;
	const $anchor = getInsertionAnchor(tr);
	const { selection } = tr;
	for (let depth = $anchor.depth; depth >= 0; depth--) {
		const parent = $anchor.node(depth);
		const insertionIndex = $anchor.indexAfter(depth);
		const replaceEmptyParagraph =
			depth === $anchor.depth - 1 &&
			selection instanceof TextSelection &&
			selection.empty &&
			$anchor.parent.type === tr.doc.type.schema.nodes.paragraph &&
			$anchor.parent.content.size === 0 &&
			parent.canReplaceWith(insertionIndex - 1, insertionIndex, embedType, marks);
		const replacementStartIndex = replaceEmptyParagraph ? insertionIndex - 1 : insertionIndex;
		if (!parent.canReplaceWith(replacementStartIndex, insertionIndex, embedType, marks)) {
			continue;
		}

		const embedStart = $anchor.posAtIndex(replacementStartIndex, depth);
		const replacementEnd = $anchor.posAtIndex(insertionIndex, depth);
		tr.replaceWith(embedStart, replacementEnd, nativeEmbed);
		if (NodeSelection.isSelectable(nativeEmbed)) {
			return tr.setSelection(NodeSelection.create(tr.doc, embedStart));
		}

		const $afterEmbed = tr.doc.resolve(embedStart + nativeEmbed.nodeSize);
		const cursor = GapCursorSelection.valid($afterEmbed)
			? new GapCursorSelection($afterEmbed, Side.RIGHT)
			: TextSelection.findFrom($afterEmbed, 1, true);
		return cursor && cursor.$from.depth >= depth && cursor.$from.node(depth) === $afterEmbed.parent
			? tr.setSelection(cursor)
			: null;
	}
	return null;
};

const insertLoomEmbedCard = (
	tr: Transaction,
	embedCard: PMNode,
	insertContent: InsertNodeAPI['commands']['insert'],
): Transaction | null => {
	const $selectionEnd = tr.selection.$to;
	const firstInsertionStepIndex = tr.steps.length;
	insertContent({
		node: embedCard,
		options: {
			insertAt: $selectionEnd.parent.inlineContent
				? TextSelection.create(tr.doc, $selectionEnd.pos)
				: new GapCursorSelection($selectionEnd, Side.RIGHT),
			selectNodeInserted: false,
		},
	})({ tr });
	if (tr.steps.length === firstInsertionStepIndex) {
		return null;
	}

	// Later transaction steps can move the card before we set the final selection.
	const laterStepsMapping = tr.mapping.slice(firstInsertionStepIndex + 1);
	tr.mapping.maps[firstInsertionStepIndex].forEach((_oldFrom, _oldTo, insertedFrom, insertedTo) => {
		const cardStart = laterStepsMapping.map(insertedFrom);
		const insertedNode = tr.doc.nodeAt(cardStart);
		if (insertedNode?.type === embedCard.type && NodeSelection.isSelectable(insertedNode)) {
			tr.setSelection(NodeSelection.create(tr.doc, cardStart));
		} else {
			const $afterCard = tr.doc.resolve(laterStepsMapping.map(insertedTo));
			tr.setSelection(new GapCursorSelection($afterCard, Side.RIGHT));
		}
	});
	return tr;
};

/** Insert after the selection's last block, keeping the nearest schema-supported container. */
const insertRecordedLoom = (
	editorView: EditorView,
	api: ExtractInjectionAPI<LoomPlugin> | undefined,
	video: VideoMeta,
): boolean | undefined => {
	const { state } = editorView;
	const recordingSelection = loomPluginKey.getState(state)?.recordingSelection;
	if (recordingSelection === null) {
		return false;
	}
	const embedCardType = state.schema.nodes.embedCard;
	const insertContent = api?.contentInsertion?.commands.insert;
	// Report unsupported schemas without attempting a different insertion policy.
	if (!embedCardType || !insertContent) {
		return undefined;
	}

	const executed =
		api?.core.actions.execute(({ tr }) => {
			if (recordingSelection && !recordingSelection.eq(tr.selection)) {
				tr.setSelection(recordingSelection);
			}
			const embedAttrs = { url: video.sharedUrl, layout: 'wide' } as const;
			// Resolve the final node before choosing where it can be inserted.
			const nativeEmbed = api?.editorPluginNativeEmbeds?.actions.cardToNativeEmbedNode(
				state.schema,
				embedAttrs,
			);
			const insertion = nativeEmbed
				? insertNativeLoom(tr, nativeEmbed)
				: insertLoomEmbedCard(tr, embedCardType.createChecked(embedAttrs), insertContent);
			if (!insertion) {
				return null;
			}

			insertVideo({ editorAnalyticsAPI: api?.analytics?.actions, video })({ tr: insertion });
			return insertion.scrollIntoView();
		}) ?? false;
	return executed && !editorView.state.doc.eq(state.doc);
};

export const setupLoom = async (
	loomProvider: LoomProviderOptions,
	api: ExtractInjectionAPI<LoomPlugin> | undefined,
	editorView: EditorView | null,
	/**
	 * Whether loom initialisation is evoked via `initLoom` command.
	 */
	initViaCommand?: boolean,
): Promise<{ error?: string }> => {
	const clientResult = await loomProvider.getClient();

	if (clientResult.status === 'error') {
		api?.core?.actions.execute(disableLoom({ error: clientResult.message }));
		logException(new Error(clientResult.message), {
			location: 'editor-plugin-loom/sdk-initialisation',
		});
		api?.analytics?.actions.fireAnalyticsEvent({
			action: ACTION.ERRORED,
			actionSubject: ACTION_SUBJECT.LOOM,
			eventType: EVENT_TYPE.OPERATIONAL,
			attributes: { error: clientResult.message },
		});
		return { error: clientResult.message };
	}

	const { attachToButton, recordVideo: recordWithSource } = clientResult.client;

	const onInsert = (video: VideoMeta): boolean => {
		if (!editorView || editorView.isDestroyed) {
			return false;
		}
		if (isExperimentEnabled('twc_growth_loom_conf_pinned_toolbar')) {
			const inserted = insertRecordedLoom(editorView, api, video) ?? false;
			if (inserted) {
				editorView.focus();
			}
			return inserted;
		}

		const { state, dispatch } = editorView;
		const pos = state.selection.from;
		const inserted =
			api?.hyperlink?.actions.insertLink(
				INPUT_METHOD.TYPEAHEAD,
				pos, // Preserve the existing insertion policy; never replace selected text.
				pos,
				video.sharedUrl,
				video.title,
				undefined,
				undefined,
				undefined,
				'embed',
			)(state, dispatch) ?? false;
		api?.core?.actions.execute(insertVideo({ editorAnalyticsAPI: api?.analytics?.actions, video }));
		return inserted;
	};

	// Hidden element to work around the SDK API for existing recording entry points.
	const loomButton = document.createElement('button');
	attachToButton({
		button: loomButton,
		onInsert: (video) => {
			onInsert(video);
		},
	});
	let recordWithContext: ((source: 'editor-pinned-toolbar') => void) | undefined;
	if (recordWithSource && isExperimentEnabled('twc_growth_loom_conf_pinned_toolbar')) {
		recordWithContext = (source) => recordWithSource({ source, onInsert });
	}

	api?.core?.actions.execute(({ tr }) => {
		enableLoom({ loomButton, recordVideo: recordWithContext })({ tr });
		if (initViaCommand) {
			api?.quickInsert?.commands.addQuickInsertItem(getQuickInsertItem(api?.analytics?.actions))({
				tr,
			});
		}
		return tr;
	});

	// We're not combining the analytics steps into the enable / disable commands because the collab-edit plugin
	// filters out any transactions with steps (even analytics) when it's initialising.
	// Even if `initViaCommand` is true, collab-edit might not be ready depending on when `initLoom` is called,
	// hence the analytics step is added separately in both cases
	api?.analytics?.actions.fireAnalyticsEvent({
		action: ACTION.INITIALISED,
		actionSubject: ACTION_SUBJECT.LOOM,
		eventType: EVENT_TYPE.OPERATIONAL,
	});

	return {};
};

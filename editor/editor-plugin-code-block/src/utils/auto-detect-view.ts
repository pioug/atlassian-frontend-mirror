import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { CodeBlockPlugin } from '../index';
import { ACTIONS } from '../pm-plugins/actions';
import { autoDetectPluginKey, type AutoDetectEntry } from '../pm-plugins/auto-detect-state';

import { createAutoDetectEntry } from './auto-detect-state';
import { detectLanguage } from './language-detect';

export type AutoDetectTimer = {
	lastObservedText: string;
	timer: ReturnType<typeof setTimeout>;
};

const AUTO_DETECT_DEBOUNCE_MS = 500;

// Stored positions are mapped through transactions; verify the localId before using them.
const getCodeBlockFromEntry = (view: EditorView, localId: string, entry: AutoDetectEntry) => {
	const node = view.state.doc.nodeAt(entry.pos);
	const codeBlockType = view.state.schema.nodes.codeBlock;

	if (node?.type === codeBlockType && node.attrs.localId === localId) {
		return { node, pos: entry.pos };
	}

	return null;
};

// Runs after debounce, so it must re-read current editor state before applying language changes.
const runPendingDetection = (
	view: EditorView,
	localId: string,
	api?: ExtractInjectionAPI<CodeBlockPlugin>,
): void => {
	const pluginState = autoDetectPluginKey.getState(view.state);
	const entry = pluginState?.languageDetectionMap[localId];

	if (!entry?.isPending) {
		return;
	}

	const found = getCodeBlockFromEntry(view, localId, entry);

	if (!found) {
		return;
	}

	const detectedLanguage = detectLanguage(found.node.textContent);
	const detectionResult = detectedLanguage ? 'detected' : 'noneDetected';
	// Keep a previous auto-detected language when the latest snippet is too weak to classify.
	const shouldPreserveAutoDetectedLanguage =
		!detectedLanguage &&
		Boolean(entry.autoDetectedLanguage) &&
		found.node.attrs.language === entry.autoDetectedLanguage;
	const nextEntry: AutoDetectEntry = {
		...createAutoDetectEntry(found.node, found.pos, false, entry),
		detectionResult,
		autoDetectedLanguage: detectedLanguage ?? entry.autoDetectedLanguage,
	};

	// If there is no confident detection, record the result without clearing user-visible language.
	const shouldOnlyUpdateDetectionState =
		!detectedLanguage && (!found.node.attrs.language || shouldPreserveAutoDetectedLanguage);

	api?.core?.actions.execute(({ tr }) => {
		if (!shouldOnlyUpdateDetectionState) {
			tr.setNodeMarkup(
				found.pos,
				undefined,
				{ ...found.node.attrs, language: detectedLanguage },
				found.node.marks,
			);
		}

		tr.setMeta(autoDetectPluginKey, {
			type: ACTIONS.SET_AUTO_DETECT_ENTRY,
			data: { localId, entry: nextEntry },
		});
		api?.analytics?.actions.attachAnalyticsEvent({
			action: ACTION.LANGUAGE_AUTO_DETECTED,
			actionSubject: ACTION_SUBJECT.CODE_BLOCK,
			attributes: {
				language: detectedLanguage ?? 'none',
				detectionResult,
			},
			eventType: EVENT_TYPE.TRACK,
		})(tr);
		return tr;
	});
};

const clearTimer = (timers: Map<string, AutoDetectTimer>, localId: string): void => {
	const scheduledDetection = timers.get(localId);
	if (scheduledDetection) {
		clearTimeout(scheduledDetection.timer);
		timers.delete(localId);
	}
};

// Keeps one debounce timer per pending code block and drops timers for stale entries.
export const syncPendingDetectionTimers = (
	view: EditorView,
	timers: Map<string, AutoDetectTimer>,
	api?: ExtractInjectionAPI<CodeBlockPlugin>,
): void => {
	const pluginState = autoDetectPluginKey.getState(view.state);
	const pendingEntries = Object.entries(pluginState?.languageDetectionMap ?? {}).filter(
		([, entry]) => entry.isPending,
	);
	const pendingLocalIds = new Set(pendingEntries.map(([localId]) => localId));

	pendingEntries.forEach(([localId, entry]) => {
		const scheduledDetection = timers.get(localId);
		if (scheduledDetection?.lastObservedText === entry.lastObservedText) {
			return;
		}

		clearTimer(timers, localId);

		const timer = setTimeout(() => {
			timers.delete(localId);
			runPendingDetection(view, localId, api);
		}, AUTO_DETECT_DEBOUNCE_MS);

		timers.set(localId, {
			lastObservedText: entry.lastObservedText,
			timer,
		});
	});

	timers.forEach((_, localId) => {
		if (!pendingLocalIds.has(localId)) {
			clearTimer(timers, localId);
		}
	});
};

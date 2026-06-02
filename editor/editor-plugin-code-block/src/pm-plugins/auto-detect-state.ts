import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export type AutoDetectResult = 'detected' | 'noneDetected';

export type AutoDetectEntry = {
	autoDetectedLanguage?: string;
	detectionResult?: AutoDetectResult;
	isPending?: boolean;
	lastObservedFirstLine: string;
	lastObservedText: string;
	pos: number;
};

export type AutoDetectState = {
	languageDetectionMap: Record<string, AutoDetectEntry>;
};

export const autoDetectPluginKey: PluginKey<AutoDetectState> = new PluginKey<AutoDetectState>(
	'codeBlockAutoDetectPlugin',
);

export const getAutoDetectPluginState = (state: EditorState): AutoDetectState | undefined =>
	autoDetectPluginKey.getState(state);

import type { NextEditorPlugin } from './index';

export type _MarkdownModePluginStateStub = {
	isLivePage?: boolean;
	isMarkdownMode: boolean;
	showSourceLineNumbers: boolean;
	sourceBlockFormatState: {
		headingLevel: number | null;
		inBlockquote: boolean;
		inCodeBlock: boolean;
	} | null;
	sourceInlineFormatState: {
		boldActive: boolean;
		codeActive: boolean;
		inlineFormattingAvailable: boolean;
		italicActive: boolean;
		strikeActive: boolean;
	} | null;
	sourceListFormatState: {
		inBulletList: boolean;
		inOrderedList: boolean;
		inTaskList: boolean;
	} | null;
	sourcePositionState: {
		columnNumber: number;
		lineCount: number;
		lineNumber: number;
		wordCount?: number;
	} | null;
	view: 'syntax' | 'split-view' | 'preview';
	wrapSourceCode: boolean;
};

/**
 * Duck-typed mirror of `@atlassian/editor-plugin-markdown-mode`'s
 * `MarkdownModePlugin`, covering all actions and `sharedState` fields
 * declared by that plugin.
 *
 * We avoid importing the real type because `@atlaskit/editor-plugin-text-formatting`
 * publishes to public npm while `@atlassian/editor-plugin-markdown-mode` only
 * publishes to Atlassian's internal registry — re-exporting the cross-namespace
 * type in this package's `.d.ts` would leave the type unresolvable for external
 * consumers. TS structural typing means the real plugin (when loaded by the host)
 * satisfies this stub, so runtime calls are still type-correct.
 *
 * Maintenance: this stub is NOT compile-time checked against the source-of-truth
 * `MarkdownModePlugin` type. If markdown-mode renames, removes, or changes the
 * signature of any of the actions/shared-state fields listed below, the mismatch
 * surfaces only at runtime (stale toolbar state, no-op clicks). Keep the action
 * signatures and `sharedState` fields here in sync with
 * `@atlassian/editor-plugin-markdown-mode/src/markdownModePluginType.ts`.
 */
export type _MarkdownModePluginStub = NextEditorPlugin<
	'markdownMode',
	{
		actions: {
			dispatchSourceCommand: (cmd: unknown) => boolean;
			insertSourceTable: (rowsCount?: number, colsCount?: number) => void;
			registerSourceCommandDispatch: (dispatcher: ((cmd: unknown) => boolean) | null) => void;
			setShowSourceLineNumbers: (showSourceLineNumbers: boolean) => void;
			setSourceBlockFormatState: (state: unknown) => void;
			setSourceFormatState: (state: unknown) => void;
			setSourceInlineFormatState: (state: unknown) => void;
			setSourceListFormatState: (state: unknown) => void;
			setSourcePositionState: (
				state: {
					columnNumber: number;
					lineCount: number;
					lineNumber: number;
					wordCount?: number;
				} | null,
			) => void;
			setView: (view: 'syntax' | 'split-view' | 'preview') => void;
			setWrapSourceCode: (wrapSourceCode: boolean) => void;
			toggleSourceBlockquote: () => boolean;
			toggleSourceBold: () => boolean;
			toggleSourceBulletList: () => boolean;
			toggleSourceHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => boolean;
			toggleSourceInlineCode: () => boolean;
			toggleSourceItalic: () => boolean;
			toggleSourceOrderedList: () => boolean;
			toggleSourceStrike: () => boolean;
			toggleSourceTaskList: () => boolean;
		};
		sharedState: _MarkdownModePluginStateStub | undefined;
	}
>;

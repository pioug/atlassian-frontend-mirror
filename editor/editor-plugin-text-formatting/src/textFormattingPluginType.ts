import type {
	NextEditorPlugin,
	OptionalPlugin,
	TextFormattingOptions as CommonTextFormattingOptions,
	TextFormattingState,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BasePlugin } from '@atlaskit/editor-plugin-base';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';

import type { ToggleMarkEditorCommand } from './editor-commands/types';

export type TextFormattingPluginOptions = CommonTextFormattingOptions;

/**
 * Minimal duck-typed slice of `@atlassian/editor-plugin-markdown-mode`'s
 * `MarkdownModePlugin` covering only the surface this plugin uses (inline
 * source-view toggle actions + the inline format-state + `view` fields).
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
type _MarkdownModePluginStub = NextEditorPlugin<
	'markdownMode',
	{
		actions: {
			toggleSourceBold: () => boolean;
			toggleSourceInlineCode: () => boolean;
			toggleSourceItalic: () => boolean;
			toggleSourceStrike: () => boolean;
		};
		sharedState:
			| {
					sourceInlineFormatState: {
						boldActive: boolean;
						codeActive: boolean;
						inlineFormattingAvailable: boolean;
						italicActive: boolean;
						strikeActive: boolean;
					} | null;
					view: 'syntax' | 'split-view' | 'preview';
			  }
			| undefined;
	}
>;

export type TextFormattingPlugin = NextEditorPlugin<
	'textFormatting',
	{
		commands: {
			toggleCode: ToggleMarkEditorCommand;
			toggleEm: ToggleMarkEditorCommand;
			toggleStrike: ToggleMarkEditorCommand;
			toggleStrong: ToggleMarkEditorCommand;
			toggleSubscript: ToggleMarkEditorCommand;
			toggleSuperscript: ToggleMarkEditorCommand;
			toggleUnderline: ToggleMarkEditorCommand;
		};
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<PrimaryToolbarPlugin>,
			OptionalPlugin<BasePlugin>,
			OptionalPlugin<SelectionToolbarPlugin>,
			OptionalPlugin<UserPreferencesPlugin>,
			OptionalPlugin<ToolbarPlugin>,
			OptionalPlugin<_MarkdownModePluginStub>,
		];
		pluginConfiguration: TextFormattingPluginOptions | undefined;
		sharedState: TextFormattingState | undefined;
	}
>;

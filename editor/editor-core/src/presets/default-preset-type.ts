import type { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import type { BasePlugin } from '@atlaskit/editor-plugins/base';
import type { BetterTypeHistoryPlugin } from '@atlaskit/editor-plugins/better-type-history';
import type { BlockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import type { ClearMarksOnEmptyDocPlugin } from '@atlaskit/editor-plugins/clear-marks-on-empty-doc';
import type { ClipboardPlugin } from '@atlaskit/editor-plugins/clipboard';
import type { CodeBlockPlugin } from '@atlaskit/editor-plugins/code-block';
import type { CompositionPlugin } from '@atlaskit/editor-plugins/composition';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugins/context-identifier';
import type { CopyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';
import type { DecorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugins/feature-flags';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';
import type { FocusPlugin } from '@atlaskit/editor-plugins/focus';
import type { HistoryPlugin } from '@atlaskit/editor-plugins/history';
import type { HyperlinkPlugin } from '@atlaskit/editor-plugins/hyperlink';
import type { PastePlugin } from '@atlaskit/editor-plugins/paste';
import type { PlaceholderPlugin } from '@atlaskit/editor-plugins/placeholder';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugins/primary-toolbar';
import type { QuickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import type { SelectionPlugin } from '@atlaskit/editor-plugins/selection';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugins/selection-toolbar';
import type { SubmitEditorPlugin } from '@atlaskit/editor-plugins/submit-editor';
import type { TextFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import type { UndoRedoPlugin } from '@atlaskit/editor-plugins/undo-redo';
import type { UnsupportedContentPlugin } from '@atlaskit/editor-plugins/unsupported-content';
import type { WidthPlugin } from '@atlaskit/editor-plugins/width';

type ExtractPluginName<Plugin> =
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Plugin extends NextEditorPlugin<infer PluginName, any> | undefined
		? // Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			PluginName
		: never;

// Manually create all the plugins to ensure they are consistent
// If the default preset changes typescript will flag this is wrong and we can update it
export type DefaultPresetPlugins = [
	CodeBlockPlugin,
	SelectionPlugin,
	FloatingToolbarPlugin,
	CopyButtonPlugin,
	SubmitEditorPlugin,
	EditorDisabledPlugin,
	UnsupportedContentPlugin,
	PlaceholderPlugin,
	QuickInsertPlugin,
	WidthPlugin,
	TextFormattingPlugin,
	HyperlinkPlugin,
	SelectionToolbarPlugin,
	ClearMarksOnEmptyDocPlugin,
	BlockTypePlugin,
	UndoRedoPlugin | undefined,
	PrimaryToolbarPlugin,
	HistoryPlugin | undefined,
	TypeAheadPlugin,
	DecorationsPlugin,
	BasePlugin,
	ContextIdentifierPlugin,
	CompositionPlugin,
	FocusPlugin,
	ClipboardPlugin,
	PastePlugin,
	BetterTypeHistoryPlugin,
	AnalyticsPlugin | undefined,
	FeatureFlagsPlugin,
];

// eslint-disable-next-line
type ExtractPluginNames<PluginList extends (NextEditorPlugin<any, any> | undefined)[]> =
	PluginList extends [infer Head, ...infer Tail]
		? // eslint-disable-next-line
			Tail extends (NextEditorPlugin<any, any> | undefined)[]
			? [ExtractPluginName<Head>, ...ExtractPluginNames<Tail>]
			: []
		: [];

type DefaultPresetPluginNames = ExtractPluginNames<DefaultPresetPlugins>;

export type DefaultPresetBuilder = EditorPresetBuilder<
	DefaultPresetPluginNames,
	DefaultPresetPlugins
>;

import type { MessageDescriptor } from 'react-intl';

import type { PasteSource } from '@atlaskit/editor-common/analytics/types/paste-events';
import type { CardOptions } from '@atlaskit/editor-common/card/cardOptions';
import type { PasteWarningOptions } from '@atlaskit/editor-common/types';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { AnnotationPlugin } from '@atlaskit/editor-plugin-annotation/annotationPluginType';
import type { BetterTypeHistoryPlugin } from '@atlaskit/editor-plugin-better-type-history/betterTypeHistoryPluginType';
import type { CardPlugin } from '@atlaskit/editor-plugin-card/cardPluginType';
import type { ExpandPlugin } from '@atlaskit/editor-plugin-expand/types';
import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension/extensionPluginType';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags/featureFlagsPluginType';
import type { ListPlugin } from '@atlaskit/editor-plugin-list/list-plugin-type';
import type { MediaPlugin } from '@atlaskit/editor-plugin-media/media-plugin-type';
import type { MentionsPlugin } from '@atlaskit/editor-plugin-mentions/mentions-plugin-type';
import type { Fragment, Schema, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

export enum FLAG_TYPE {
	WARNING = 'warning',
	ERROR = 'error',
	INFO = 'info',
	SUCCESS = 'success',
}

type FlagConfig = {
	description: MessageDescriptor;
	id: string;
	// Called when the flag is closed
	onDismissed?: (tr: Transaction) => Transaction | void;
	title: MessageDescriptor;
	type: FLAG_TYPE;
	urlHref?: string;
	urlText?: MessageDescriptor;
};

export type ActiveFlag = FlagConfig | false;

export interface PastePluginState {
	activeFlag: ActiveFlag | null;
	lastContentPasted: LastContentPasted | null;
	/** map of pasted macro link positions that will to be mapped through incoming transactions */
	pastedMacroPositions: { [key: string]: number };
}

export type LastContentPasted = {
	isPlainText: boolean;
	isShiftPressed: boolean;
	pastedAt: number;
	/**
	 * Backwards-compatible field for existing paste option consumers.
	 *
	 * This is the last slice extracted from a ReplaceStep or ReplaceAroundStep
	 * in the paste transaction. It is not necessarily the original clipboard
	 * slice or the full content inserted by the paste.
	 */
	pastedSlice: Slice;
	pasteEndPos: number;
	pasteSource: PasteSource;
	pasteStartPos: number;
	/**
	 * The paste handler slice captured before inspecting transaction steps.
	 * This has already passed through clipboard parsing and paste transforms,
	 * but does not depend on which ReplaceStep or ReplaceAroundStep happens to
	 * be last in the paste transaction.
	 */
	sourcePastedSlice?: Slice;
	text?: string;
};

export type MarkdownToPmConverter = (params: { markdown: string; schema: Schema }) => Fragment;

export type PastePluginOptions = {
	cardOptions?: CardOptions;
	isFullPage?: boolean;
	/**
	 * Optional markdown → ProseMirror fragment converter used for plain-text
	 * Cmd+V paste when `platform_editor_paste_as_md_use_gfm` is enabled.
	 * When omitted or the experiment is off, the legacy MarkdownTransformer is used.
	 */
	markdownToPmConverter?: MarkdownToPmConverter;
	pasteWarningOptions?: PasteWarningOptions;
	sanitizePrivateContent?: boolean;
};

export type PastePluginDependencies = [
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<ListPlugin>,
	BetterTypeHistoryPlugin,
	OptionalPlugin<CardPlugin>,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<MediaPlugin>,
	OptionalPlugin<ExtensionPlugin>,
	OptionalPlugin<AnnotationPlugin>,
	OptionalPlugin<MentionsPlugin>,
	OptionalPlugin<ExpandPlugin>,
];

export type PastePlugin = NextEditorPlugin<
	'paste',
	{
		dependencies: PastePluginDependencies;
		pluginConfiguration: PastePluginOptions;
		sharedState: {
			activeFlag: ActiveFlag | null;
			lastContentPasted: LastContentPasted | null;
		};
	}
>;

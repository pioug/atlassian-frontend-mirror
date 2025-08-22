import type { PasteSource } from '@atlaskit/editor-common/analytics';
import type { CardOptions } from '@atlaskit/editor-common/card';
import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { AnnotationPlugin } from '@atlaskit/editor-plugin-annotation';
import type { BetterTypeHistoryPlugin } from '@atlaskit/editor-plugin-better-type-history';
import type { CardPlugin } from '@atlaskit/editor-plugin-card';
import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { ListPlugin } from '@atlaskit/editor-plugin-list';
import type { MediaPlugin } from '@atlaskit/editor-plugin-media';
import type { MentionsPlugin } from '@atlaskit/editor-plugin-mentions';
import type { Slice } from '@atlaskit/editor-prosemirror/model';

export interface PastePluginState {
	lastContentPasted: LastContentPasted | null;
	/** map of pasted macro link positions that will to be mapped through incoming transactions */
	pastedMacroPositions: { [key: string]: number };
}

export type LastContentPasted = {
	isPlainText: boolean;
	isShiftPressed: boolean;
	pastedAt: number;
	pastedSlice: Slice;
	pasteEndPos: number;
	pasteSource: PasteSource;
	pasteStartPos: number;
	text?: string;
};

export type PastePluginOptions = {
	cardOptions?: CardOptions;
	isFullPage?: boolean;
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
];

export type PastePlugin = NextEditorPlugin<
	'paste',
	{
		dependencies: PastePluginDependencies;
		pluginConfiguration: PastePluginOptions;
		sharedState: {
			lastContentPasted: LastContentPasted | null;
		};
	}
>;

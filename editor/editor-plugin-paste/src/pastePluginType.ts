import type { MessageDescriptor } from 'react-intl-next';

import type { PasteSource } from '@atlaskit/editor-common/analytics';
import type { CardOptions } from '@atlaskit/editor-common/card';
import type {
	NextEditorPlugin,
	OptionalPlugin,
	PasteWarningOptions,
} from '@atlaskit/editor-common/types';
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
	pastedSlice: Slice;
	pasteEndPos: number;
	pasteSource: PasteSource;
	pasteStartPos: number;
	text?: string;
};

export type PastePluginOptions = {
	cardOptions?: CardOptions;
	isFullPage?: boolean;
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

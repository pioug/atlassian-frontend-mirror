import type { IntlShape } from 'react-intl-next';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { Node, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import type { ACTION, EditorAnalyticsAPI, INPUT_METHOD } from '../analytics';
import type { CardAppearance, CardProvider } from '../provider-factory';
import type { Command, FloatingToolbarItem } from '../types';

export interface OptionConfig {
	appearance?: CardAppearance;
	description?: string;
	disabled?: boolean;
	hidden?: boolean;
	onClick: Command;
	selected: boolean;
	testId: string;
	title: string;
	tooltip?: string;
}

export type CardReplacementInputMethod =
	| INPUT_METHOD.CLIPBOARD
	| INPUT_METHOD.AUTO_DETECT
	| INPUT_METHOD.FORMATTING
	| INPUT_METHOD.MANUAL
	| INPUT_METHOD.TYPEAHEAD
	| INPUT_METHOD.FLOATING_TB;

export type QueueCardsFromTransactionAction = (
	state: EditorState,
	tr: Transaction,
	source: CardReplacementInputMethod,
	analyticsAction?: ACTION,
	normalizeLinkText?: boolean,
	sourceEvent?: UIAnalyticsEvent | null | undefined,
	appearance?: CardAppearance,
) => Transaction;
export type HideLinkToolbarAction = (tr: Transaction) => Transaction;
export type ChangeSelectedCardToLink = (
	text?: string,
	href?: string,
	sendAnalytics?: boolean,
	node?: Node,
	pos?: number,
	editorAnalyticsApi?: EditorAnalyticsAPI,
) => Command;
export type SetSelectedCardAppearance = (
	appearance: CardAppearance,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
) => Command;
export type GetStartingToolbarItems = (
	intl: IntlShape,
	link: string,
	onEditLink: Command,
	metadata: { title: string; url: string },
	state?: EditorState,
) => FloatingToolbarItem<Command>[];

export type GetEndingToolbarItems = (
	intl: IntlShape,
	link: string,
) => FloatingToolbarItem<Command>[];

/**
 * Attributes passed to an embed card node transformer.
 * Contains the URL and layout information needed to transform
 * an embedCard into an alternative node representation.
 */
export type EmbedCardTransformAttrs = {
	layout?: string;
	originalHeight?: number | null;
	originalWidth?: number | null;
	url: string;
	width?: number;
};

/**
 * A generic transformer function that converts embed card attributes into
 * an alternative ProseMirror Node (e.g. a native embed extension node).
 *
 * Returns undefined if the URL is not supported or transformation is not possible.
 */
export type EmbedCardNodeTransformer = (
	schema: Schema,
	attrs: EmbedCardTransformAttrs,
) => Node | undefined;

/**
 * Options for creating a transform command that replaces a selected card node
 * with an alternative node representation.
 */
export type EmbedCardTransformCommandOptions = {
	/**
	 * Callback to augment the transaction with additional concerns
	 * (e.g. analytics events, datasource stash updates, link metadata).
	 */
	augmentTransaction?: (tr: Transaction, state: EditorState) => void;
	editorAnalyticsApi?: EditorAnalyticsAPI;
};

/**
 * A factory function that creates a Command to replace the currently selected
 * card node with an alternative node representation (e.g. a native embed).
 *
 * The returned command should return false if transformation is not possible.
 */
export type CreateEmbedCardTransformCommand = (
	options?: EmbedCardTransformCommandOptions,
) => Command;

export interface EmbedCardTransformers {
	createEmbedCardTransformCommand: CreateEmbedCardTransformCommand;
	embedCardNodeTransformer: EmbedCardNodeTransformer;
}

export type CardPluginActions = {
	getEndingToolbarItems: GetEndingToolbarItems;
	getStartingToolbarItems: GetStartingToolbarItems;
	hideLinkToolbar: HideLinkToolbarAction;
	queueCardsFromChangedTr: QueueCardsFromTransactionAction;
	registerEmbedCardTransformer: (transformers: EmbedCardTransformers) => void;
	setProvider: (provider: Promise<CardProvider>) => Promise<boolean>;
};

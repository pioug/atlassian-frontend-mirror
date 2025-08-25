import { type IntlShape } from 'react-intl-next';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import type { ACTION, EditorAnalyticsAPI, INPUT_METHOD } from '../analytics';
import { type CardAppearance, type CardProvider } from '../provider-factory';
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

export type CardPluginActions = {
	getEndingToolbarItems: GetEndingToolbarItems;
	getStartingToolbarItems: GetStartingToolbarItems;
	hideLinkToolbar: HideLinkToolbarAction;
	queueCardsFromChangedTr: QueueCardsFromTransactionAction;
	setProvider: (provider: Promise<CardProvider>) => Promise<boolean>;
};

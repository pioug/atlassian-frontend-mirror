import type { RichMediaAttributes } from '@atlaskit/adf-schema';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { ACTION } from '@atlaskit/editor-common/analytics';
import type {
	CardOptions,
	CardReplacementInputMethod,
	OnClickCallback,
} from '@atlaskit/editor-common/card';
import type { CardAppearance, CardProvider } from '@atlaskit/editor-common/provider-factory';
import type {
	DatasourceModalType,
	EditorAppearance,
	LinkPickerOptions,
} from '@atlaskit/editor-common/types';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { DatasourceAdf, DatasourceAdfView } from '@atlaskit/linking-common';
import type { SmartLinkEvents } from '@atlaskit/smart-card';

import type { EditorCardPluginEvents } from '../ui/analytics/create-events-queue';
import type { CardPluginEvent } from '../ui/analytics/types';
import type { DatasourceTableLayout } from '../ui/LayoutButton/types';

export type CardType = CardAppearance | 'url' | 'datasource';

export type DatasourceNode = Omit<Node, 'attrs'> & {
	readonly attrs: DatasourceAdf['attrs'] & Partial<RichMediaAttributes>;
};

export type CardInfo = {
	id?: string;
	pos: number;
	title?: string;
	url?: string;
};

export type Request = {
	/**
	 * Analytics action to be used when disaptching
	 * analytics events once the link is successfully/unsuccessfully
	 * resolved. Preserves the users "intent" ie was this a link
	 * being inserted or updated?
	 */
	analyticsAction?: ACTION;
	/**
	 * The requested appearance to upgrade to
	 */
	appearance: CardAppearance;
	/**
	 * Determines if the link should only be replaced after successful
	 * resolution if the link's text content still matches its href
	 * (ie has not been changed by the user since the resolve request).
	 */
	compareLinkText: boolean;
	/**
	 * The position of the link in the doc this request for upgrade is for
	 */
	pos: number;
	/**
	 * The previous appearance of the link
	 * This is necessary when tracking an update of a link
	 * where the link begins as a smart card, then is updated by
	 * replacing with a hyperlink and queueing it for upgrade
	 */
	previousAppearance?: CardAppearance | 'url';
	/**
	 * Describes if the requested `appearance` MUST be returned by the card provider
	 * when resolving the link, because the request is associated with the user intent
	 * to explicitly change the link appearance to the target appearance (view switcher), and therefore
	 * should not be affected by "default appearances" or "user preferences"
	 */
	shouldReplaceLink?: boolean;
	/**
	 * Analytics input method which preserves "how" the change
	 * has occured. Used when analytics are dispatched after the link
	 * is successfully/unsuccessfully resolved.
	 */
	source: CardReplacementInputMethod;
	/**
	 * Source UI that triggered this step if relevant
	 * Primarily for transfering link picker UI event from initial UI action
	 * through to the end of the link queue/request saga
	 */
	sourceEvent?: UIAnalyticsEvent | null | undefined;
	/**
	 * The URL of the link being upgraded/resolved
	 */
	url: string;
};

/**
 * Each key in the stash is URL.
 * For any given URL we might temporarily stash some user preferences, like view settings for the datasource.
 */
type DatasourceStash = Record<string, { views: DatasourceAdfView[] }>;

export type CardPluginState = {
	allowBlockCards?: boolean;
	allowEmbeds?: boolean;
	cards: CardInfo[];
	datasourceModalType?: DatasourceModalType;
	datasourceStash: DatasourceStash;
	datasourceTableRef?: HTMLElement;
	editorAppearance?: EditorAppearance;
	inlineCardAwarenessCandidatePosition?: number;
	layout?: DatasourceTableLayout;
	overlayCandidatePosition?: number;
	provider: CardProvider | null;
	removeOverlay?: () => void;
	requests: Request[];
	selectedInlineLinkPosition?: number;
	showDatasourceModal: boolean;
	showLinkingToolbar: boolean;
	smartLinkEvents?: SmartLinkEvents;
};

export type CardPluginOptions = CardOptions & {
	cardPluginEvents?: EditorCardPluginEvents<CardPluginEvent>;
	CompetitorPrompt?: React.ComponentType<{ linkType?: string; sourceUrl: string; }>;
	disableFloatingToolbar?: boolean;
	editorAppearance?: EditorAppearance;
	fullWidthMode?: boolean;
	isPageSSRed?: boolean;
	linkPicker?: LinkPickerOptions;
	lpLinkPicker?: boolean;
	onClickCallback?: OnClickCallback;
};

// actions
export type SetProvider = {
	provider: CardProvider | null;
	type: 'SET_PROVIDER';
};

export type Queue = {
	requests: Request[];
	type: 'QUEUE';
};

export type Resolve = {
	type: 'RESOLVE';
	url: string;
};

export type Register = {
	info: CardInfo;
	type: 'REGISTER';
};

export type RemoveCard = {
	info: Partial<CardInfo>;
	type: 'REMOVE_CARD';
};

export type ShowLinkToolbar = {
	type: 'SHOW_LINK_TOOLBAR';
};

export type HideLinkToolbar = {
	type: 'HIDE_LINK_TOOLBAR';
};

export type ShowDatasourceModal = {
	modalType: DatasourceModalType;
	type: 'SHOW_DATASOURCE_MODAL';
};

export type HideDatasourceModal = {
	type: 'HIDE_DATASOURCE_MODAL';
};

export type RegisterSmartCardEvents = {
	smartLinkEvents: SmartLinkEvents;
	type: 'REGISTER_EVENTS';
};

export type SetDatasourceTableRef = {
	datasourceTableRef?: HTMLElement;
	type: 'SET_DATASOURCE_TABLE_REF';
};

export type SetCardLayout = {
	layout: DatasourceTableLayout;
	type: 'SET_CARD_LAYOUT';
};

export type SetCardLayoutAndDatasourceTableRef = {
	datasourceTableRef?: HTMLElement;
	layout: DatasourceTableLayout;
	type: 'SET_CARD_LAYOUT_AND_DATASOURCE_TABLE_REF';
};

type ClearOverlayCandidate = {
	type: 'CLEAR_OVERLAY_CANDIDATE';
};

type RegisterRemoveOverlayOnInsertedLink = {
	callback: () => void;
	info?: Register['info'];
	type: 'REGISTER_REMOVE_OVERLAY_ON_INSERTED_LINK';
};

export type SetDatasourceStash = {
	datasourceStash: { url: string; views: DatasourceAdfView[] };
	type: 'SET_DATASOURCE_STASH';
};

export type RemoveDatasourceStash = {
	type: 'REMOVE_DATASOURCE_STASH';
	url: string;
};

export type CardPluginAction =
	| SetProvider
	| Queue
	| Resolve
	| Register
	| RemoveCard
	| ShowLinkToolbar
	| HideLinkToolbar
	| ShowDatasourceModal
	| HideDatasourceModal
	| RegisterSmartCardEvents
	| SetDatasourceTableRef
	| SetCardLayout
	| SetCardLayoutAndDatasourceTableRef
	| ClearOverlayCandidate
	| RegisterRemoveOverlayOnInsertedLink
	| SetDatasourceStash
	| RemoveDatasourceStash;

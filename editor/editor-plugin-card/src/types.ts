import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { ACTION } from '@atlaskit/editor-common/analytics';
import type {
  CardOptions,
  CardReplacementInputMethod,
} from '@atlaskit/editor-common/card';
import type {
  CardAppearance,
  CardProvider,
} from '@atlaskit/editor-common/provider-factory';
import type {
  DatasourceModalType,
  EditorAppearance,
  LinkPickerOptions,
} from '@atlaskit/editor-common/types';
import type { DatasourceAdfView } from '@atlaskit/linking-common';
import type { SmartLinkEvents } from '@atlaskit/smart-card';

import type { EditorCardPluginEvents } from './analytics/create-events-queue';
import type { CardPluginEvent } from './analytics/types';
import type { DatasourceTableLayout } from './ui/LayoutButton/types';

export type CardInfo = {
  title?: string;
  url?: string;
  pos: number;
};

export type Request = {
  /**
   * The position of the link in the doc this request for upgrade is for
   */
  pos: number;
  /**
   * The URL of the link being upgraded/resolved
   */
  url: string;
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
   * Analytics input method which preserves "how" the change
   * has occured. Used when analytics are dispatched after the link
   * is successfully/unsuccessfully resolved.
   */
  source: CardReplacementInputMethod;
  /**
   * The previous appearance of the link
   * This is necessary when tracking an update of a link
   * where the link begins as a smart card, then is updated by
   * replacing with a hyperlink and queueing it for upgrade
   */
  previousAppearance?: CardAppearance | 'url';
  /**
   * Analytics action to be used when disaptching
   * analytics events once the link is successfully/unsuccessfully
   * resolved. Preserves the users "intent" ie was this a link
   * being inserted or updated?
   */
  analyticsAction?: ACTION;
  /**
   * Describes if the requested `appearance` MUST be returned by the card provider
   * when resolving the link, because the request is associated with the user intent
   * to explicitly change the link appearance to the target appearance (view switcher), and therefore
   * should not be affected by "default appearances" or "user preferences"
   */
  shouldReplaceLink?: boolean;
  /**
   * Source UI that triggered this step if relevant
   * Primarily for transfering link picker UI event from initial UI action
   * through to the end of the link queue/request saga
   */
  sourceEvent?: UIAnalyticsEvent | null | undefined;
};

/**
 * Each key in the stash is URL.
 * For any given URL we might temporarily stash some user preferences, like view settings for the datasource.
 */
type DatasourceStash = Record<string, { views: DatasourceAdfView[] }>;

export type CardPluginState = {
  requests: Request[];
  provider: CardProvider | null;
  cards: CardInfo[];
  datasourceStash: DatasourceStash;
  showLinkingToolbar: boolean;
  smartLinkEvents?: SmartLinkEvents;
  editorAppearance?: EditorAppearance;
  showDatasourceModal: boolean;
  datasourceModalType?: DatasourceModalType;
  datasourceTableRef?: HTMLElement;
  layout?: DatasourceTableLayout;
  inlineCardAwarenessCandidatePosition?: number;
  overlayCandidatePosition?: number;
  removeOverlay?: () => void;
  selectedInlineLinkPosition?: number;
  allowEmbeds?: boolean;
  allowBlockCards?: boolean;
};

export type CardPluginOptions = CardOptions & {
  editorAppearance?: EditorAppearance;
  platform: 'mobile' | 'web';
  fullWidthMode?: boolean;
  linkPicker?: LinkPickerOptions;
  cardPluginEvents?: EditorCardPluginEvents<CardPluginEvent>;
  lpLinkPicker?: boolean;
  disableFloatingToolbar?: boolean;
};

// actions
export type SetProvider = {
  type: 'SET_PROVIDER';
  provider: CardProvider | null;
};

export type Queue = {
  type: 'QUEUE';
  requests: Request[];
};

export type Resolve = {
  type: 'RESOLVE';
  url: string;
};

export type Register = {
  type: 'REGISTER';
  info: CardInfo;
};

export type ShowLinkToolbar = {
  type: 'SHOW_LINK_TOOLBAR';
};

export type HideLinkToolbar = {
  type: 'HIDE_LINK_TOOLBAR';
};

export type ShowDatasourceModal = {
  type: 'SHOW_DATASOURCE_MODAL';
  modalType: DatasourceModalType;
};

export type HideDatasourceModal = {
  type: 'HIDE_DATASOURCE_MODAL';
};

export type RegisterSmartCardEvents = {
  type: 'REGISTER_EVENTS';
  smartLinkEvents: SmartLinkEvents;
};

export type SetDatasourceTableRef = {
  type: 'SET_DATASOURCE_TABLE_REF';
  datasourceTableRef?: HTMLElement;
};

export type SetCardLayout = {
  type: 'SET_CARD_LAYOUT';
  layout: DatasourceTableLayout;
};

export type SetCardLayoutAndDatasourceTableRef = {
  type: 'SET_CARD_LAYOUT_AND_DATASOURCE_TABLE_REF';
  layout: DatasourceTableLayout;
  datasourceTableRef?: HTMLElement;
};

export type ClearOverlayCandidate = {
  type: 'CLEAR_OVERLAY_CANDIDATE';
};

export type RegisterRemoveOverlayOnInsertedLink = {
  type: 'REGISTER_REMOVE_OVERLAY_ON_INSERTED_LINK';
  callback: () => void;
};

export type SetDatasourceStash = {
  type: 'SET_DATASOURCE_STASH';
  datasourceStash: { url: string; views: DatasourceAdfView[] };
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

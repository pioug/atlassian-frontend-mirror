import { INPUT_METHOD, ACTION } from '@atlaskit/editor-common/analytics';
import {
  CardProvider,
  CardAppearance,
} from '@atlaskit/editor-common/provider-factory';
import { SmartLinkEvents } from '@atlaskit/smart-card';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { CardOptions } from '@atlaskit/editor-common/card';
import type { EditorAppearance } from '@atlaskit/editor-common/types';
import { LinkPickerOptions } from '@atlaskit/editor-common/types';

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

type Metadata<T = {}> = {
  url: string;
  display: string;
  isUndo?: boolean;
  isRedo?: boolean;
  action?: string;
  inputMethod?: string;
  sourceEvent?: unknown;
  nodeContext?: string;
} & T;

type UpdateMetadata = {
  previousDisplay?: string;
};

export type SmartLinkEventsNext = {
  created: (metadata: Metadata) => void;
  updated: (metadata: Metadata<UpdateMetadata>) => void;
  deleted: (metadata: Metadata) => void;
};

export type LifecycleEventType = keyof SmartLinkEventsNext;

/**
 * Describes the shape of an event that will be stored
 * in the Card state until it can be dispatched
 * as a side-effect in a view update
 */
export type LifecycleEvent<
  Type extends keyof SmartLinkEventsNext = keyof SmartLinkEventsNext,
> = {
  type: Type;
  data: Parameters<SmartLinkEventsNext[Type]>[0];
};

export type CardPluginState = {
  requests: Request[];
  provider: CardProvider | null;
  cards: CardInfo[];
  showLinkingToolbar: boolean;
  smartLinkEvents?: SmartLinkEvents;
  smartLinkEventsNext?: SmartLinkEventsNext;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  editorAppearance?: EditorAppearance;
};

export type CardPluginOptions = CardOptions & {
  editorAppearance?: EditorAppearance;
  platform: 'mobile' | 'web';
  fullWidthMode?: boolean;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  linkPicker?: LinkPickerOptions;
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

export type RegisterSmartCardEvents = {
  type: 'REGISTER_EVENTS';
  smartLinkEvents: SmartLinkEvents;
};

export type RegisterSmartCardEventsNext = {
  type: 'REGISTER_EVENTS_NEXT';
  smartLinkEvents: SmartLinkEventsNext;
};

export type CardPluginAction =
  | SetProvider
  | Queue
  | Resolve
  | Register
  | ShowLinkToolbar
  | HideLinkToolbar
  | RegisterSmartCardEvents
  | RegisterSmartCardEventsNext;

export type CardReplacementInputMethod =
  | INPUT_METHOD.CLIPBOARD
  | INPUT_METHOD.AUTO_DETECT
  | INPUT_METHOD.FORMATTING
  | INPUT_METHOD.MANUAL
  | INPUT_METHOD.TYPEAHEAD
  | INPUT_METHOD.FLOATING_TB;

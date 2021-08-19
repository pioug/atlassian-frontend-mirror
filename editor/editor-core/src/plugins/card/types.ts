import { INPUT_METHOD, ACTION } from '../analytics/types/enums';
import {
  CardProvider,
  CardAppearance,
  CardAdf,
} from '@atlaskit/editor-common/provider-factory';
import { SmartLinkEvents } from '@atlaskit/smart-card';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

export type CardInfo = {
  title?: string;
  url?: string;
  pos: number;
};

export type Request = {
  pos: number;
  url: string;
  appearance: CardAppearance;
  compareLinkText: boolean;
  source: CardReplacementInputMethod;
  analyticsAction?: ACTION;
  shouldReplaceLink?: boolean;
};

export type OutstandingRequests = { [key: string]: Promise<void | CardAdf> };

export type CardPluginState = {
  requests: Request[];
  provider: CardProvider | null;
  cards: CardInfo[];
  showLinkingToolbar: boolean;
  smartLinkEvents?: SmartLinkEvents;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
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

export type CardPluginAction =
  | SetProvider
  | Queue
  | Resolve
  | Register
  | ShowLinkToolbar
  | HideLinkToolbar
  | RegisterSmartCardEvents;

export type CardReplacementInputMethod =
  | INPUT_METHOD.CLIPBOARD
  | INPUT_METHOD.AUTO_DETECT
  | INPUT_METHOD.FORMATTING
  | INPUT_METHOD.MANUAL
  | INPUT_METHOD.TYPEAHEAD;

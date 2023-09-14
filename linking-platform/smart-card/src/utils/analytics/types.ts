import { APIError, CardType } from '@atlaskit/linking-common';
import { SmartLinkActionType } from '@atlaskit/linking-types';
import {
  PreviewDisplay,
  PreviewInvokeMethod,
} from '../../view/HoverCard/types';
import { ErrorInfo } from 'react';
import { CardInnerAppearance } from '../../view/Card/types';
import { InvokeType } from '../../model/invoke-opts';

export type DestinationProduct = 'jira' | 'confluence' | 'bitbucket' | 'trello';
export type DestinationSubproduct = 'core' | 'software' | 'servicedesk';
export interface CommonEventProps {
  id?: string;
  definitionId?: string;
  extensionKey?: string;
  resourceType?: string;
  destinatinoObjectType?: string;
  destinationSubproduct?: DestinationSubproduct | string;
  destinationProduct?: DestinationProduct | string;
  location?: string;
  statusDetails?: string;
}

export type ResolvedEventProps = CommonEventProps & {
  id: string;
};

export type UnresolvedEventProps = CommonEventProps & {
  id: string;
  status: string;
  error?: APIError;
};

export type InvokeSucceededEventProps = CommonEventProps & {
  id?: string;
  actionType: string;
  display?: CardInnerAppearance;
};

export type InvokeFailedEventProps = CommonEventProps & {
  id?: string;
  actionType: string;
  display?: CardInnerAppearance;
  reason: string;
};

export type ConnectSucceededEventProps = CommonEventProps & {
  id?: string;
};

export type ConnectFailedEventProps = CommonEventProps & {
  id?: string;
  reason?: string;
};

export type TrackAppAccountConnectedProps = CommonEventProps;

export type UiAuthEventProps = CommonEventProps & {
  display: CardInnerAppearance;
};

export type UiAuthAlternateAccountEventProps = CommonEventProps & {
  display: CardInnerAppearance;
};

export type UiCardClickedEventProps = CommonEventProps & {
  id: string;
  display: CardInnerAppearance;
  status: CardType;
  isModifierKeyPressed?: boolean;
  actionSubjectId?: string;
};

export type UiIframeDwelledEventProps = CommonEventProps & {
  id: string;
  display: CardInnerAppearance;
  status: CardType;
  dwellTime: number;
  dwellPercentVisible: number;
};

export type UiIframeFocusedEventProps = CommonEventProps & {
  id: string;
  display: CardInnerAppearance;
  status: CardType;
};

export type UiActionClickedEventProps = CommonEventProps & {
  id?: string;
  display?: CardInnerAppearance;
  actionType: string;
  invokeType?: InvokeType;
};

export type UiServerActionClickedEventProps = CommonEventProps & {
  smartLinkActionType: SmartLinkActionType;
};

export type ScreenAuthPopupEventProps = CommonEventProps;

export type UiClosedAuthEventProps = CommonEventProps & {
  display: CardInnerAppearance;
};

export type UiRenderSuccessEventProps = CommonEventProps & {
  display: CardInnerAppearance;
  status: CardType;
};

export type UiRenderFailedEventProps = CommonEventProps & {
  display: CardInnerAppearance;
  error: Error;
  errorInfo: ErrorInfo;
};

export type UiHoverCardViewedEventProps = CommonEventProps & {
  previewDisplay: PreviewDisplay;
  previewInvokeMethod?: PreviewInvokeMethod;
  status: CardType;
};

export type UiHoverCardDismissedEventProps = CommonEventProps & {
  previewDisplay: PreviewDisplay;
  hoverTime: number;
  previewInvokeMethod?: PreviewInvokeMethod;
  status: CardType;
};

export type UiHoverCardOpenLinkClickedEventProps = CommonEventProps & {
  previewDisplay: PreviewDisplay;
  previewInvokeMethod?: PreviewInvokeMethod;
};

export type InstrumentEventProps = CommonEventProps & {
  error?: APIError;
  status: CardType;
  id: string;
};

export type ClickType = 'left' | 'middle' | 'right' | 'keyboard' | 'none';

export type ClickOutcome =
  | 'prevented'
  | 'clickThrough'
  | 'clickThroughNewTabOrWindow'
  | 'contextMenu'
  | 'alt'
  | 'contentEditable'
  | 'unknown';

export type UiLinkClickedEventProps = {
  /**
   * Whether the click occurred with the left, middle or right mouse button
   */
  clickType: ClickType;
  /**
   * The user outcome for clicking the link as far as can be reasonably be determined
   * This ignores any programmatic cancellation of the outcome (ie e.preventDefault()) and
   * thus this represents the user intent, not necessarily the actual outcome
   */
  clickOutcome: ClickOutcome;
  /**
   * The keys held by the user at the time of clicking the link (which influence `clickOutcome`)
   */
  keysHeld: ('alt' | 'ctrl' | 'meta' | 'shift')[];
  /**
   * Whether the browser's default behaviour was prevented programmatically
   */
  defaultPrevented: boolean;
};

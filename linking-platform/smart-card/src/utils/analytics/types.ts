import { type ErrorInfo } from 'react';

import { type APIError, type CardType } from '@atlaskit/linking-common';
import { type SmartLinkActionType } from '@atlaskit/linking-types';

import { type InvokeType } from '../../model/invoke-opts';
import { type CardInnerAppearance } from '../../view/Card/types';
import { type PreviewDisplay, type PreviewInvokeMethod } from '../../view/HoverCard/types';

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

/**
 * @deprecated consider removing when cleaning up FF platform_migrate-some-ui-events-smart-card
 */
export type UiAuthEventProps = CommonEventProps & {
	display: CardInnerAppearance;
};

/**
 * @deprecated consider removing when cleaning up FF platform_migrate-some-ui-events-smart-card
 */
export type UiAuthAlternateAccountEventProps = CommonEventProps & {
	display: CardInnerAppearance;
};

/**
 * @deprecated consider removing when cleaning up FF platform_migrate-some-ui-events-smart-card
 */
export type UiCardClickedEventProps = CommonEventProps & {
	id: string;
	display: CardInnerAppearance;
	status: CardType;
	isModifierKeyPressed?: boolean;
	actionSubjectId?: string;
};

export type UiActionClickedEventProps = CommonEventProps & {
	id?: string;
	display?: CardInnerAppearance;
	actionType: string;
	invokeType?: InvokeType;
};

/**
 * @deprecated consider removing when cleaning up FF platform_migrate-some-ui-events-smart-card
 */
export type UiServerActionClickedEventProps = CommonEventProps & {
	smartLinkActionType: SmartLinkActionType;
};

/**
 * @deprecated consider removing when cleaning up FF platform_migrate-some-ui-events-smart-card
 */
export type UiClosedAuthEventProps = CommonEventProps & {
	display: CardInnerAppearance;
};

export type UiRenderSuccessEventProps = CommonEventProps & {
	display: CardInnerAppearance;
	status: CardType;
	canBeDatasource?: boolean;
};

export type UiRenderFailedEventProps = CommonEventProps & {
	display: CardInnerAppearance;
	error: Error;
	errorInfo: ErrorInfo;
};

/**
 * @deprecated consider removing when cleaning up FF platform_migrate-some-ui-events-smart-card
 */
export type UiHoverCardViewedEventProps = CommonEventProps & {
	previewDisplay: PreviewDisplay;
	previewInvokeMethod?: PreviewInvokeMethod;
	status: CardType;
};

/**
 * @deprecated consider removing when cleaning up FF platform_migrate-some-ui-events-smart-card
 */
export type UiHoverCardDismissedEventProps = CommonEventProps & {
	previewDisplay: PreviewDisplay;
	hoverTime: number;
	previewInvokeMethod?: PreviewInvokeMethod;
	status: CardType;
};

/**
 * @deprecated consider removing when cleaning up FF platform_migrate-some-ui-events-smart-card
 */
export type UiHoverCardOpenLinkClickedEventProps = CommonEventProps & {
	previewDisplay: PreviewDisplay;
	previewInvokeMethod?: PreviewInvokeMethod;
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

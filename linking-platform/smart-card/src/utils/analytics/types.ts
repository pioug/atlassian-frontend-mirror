import { type ErrorInfo } from 'react';

import { type CardType } from '@atlaskit/linking-common';

import { type InvokeType } from '../../model/invoke-opts';
import { type CardInnerAppearance } from '../../view/Card/types';

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

export type UiActionClickedEventProps = CommonEventProps & {
	id?: string;
	display?: CardInnerAppearance;
	actionType: string;
	invokeType?: InvokeType;
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

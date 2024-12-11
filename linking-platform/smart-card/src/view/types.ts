import { type Appearance } from '@atlaskit/button';
import { type CardType } from '@atlaskit/linking-common';

import { type RequestAccessMessageKey } from '../messages';

export interface WithShowControlMethodProp {
	showControls?: () => void;
}

export type AccessTypes =
	| 'REQUEST_ACCESS'
	| 'PENDING_REQUEST_EXISTS'
	| 'FORBIDDEN'
	| 'DIRECT_ACCESS'
	| 'DENIED_REQUEST_EXISTS'
	| 'APPROVED_REQUEST_EXISTS'
	| 'ACCESS_EXISTS';

export interface AccessContext {
	accessType?: AccessTypes;
	cloudId?: string;
	url?: string;
	smartLinksAccessMetadataExperimentCohort?: 'experiment' | 'control' | 'not-enrolled';
}

export interface ActionProps {
	/* Id of the action for use by ??? */
	id: string;
	/* The text to be displayed in the action's button */
	text: React.ReactNode;
	/* The function to be called on clicking the action. This is a promise so the state can transition correctly after the action finishes */
	promise: () => Promise<any>;
	/* The atlaskit button style to use in showing the action. This is the only button prop you have access to. */
	buttonAppearance?: Appearance;
}

export interface RequestAccessContextProps extends AccessContext {
	action?: ActionProps;
	callToActionMessageKey?: RequestAccessMessageKey;
	descriptiveMessageKey?: RequestAccessMessageKey;
	titleMessageKey?: RequestAccessMessageKey;
	hostname?: string;
	buttonDisabled?: boolean;
}

export type InlinePreloaderStyle = 'on-left-with-skeleton' | 'on-right-without-skeleton';

export type ErrorCardType = 'errored' | 'fallback' | 'forbidden' | 'not_found' | 'unauthorized';

export type OnErrorCallback = (data: {
	status: Extract<CardType, ErrorCardType>;
	url: string;
	err?: Error;
}) => void;

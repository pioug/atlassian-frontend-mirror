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
	smartLinksAccessMetadataExperimentCohort?: 'experiment' | 'control' | 'not-enrolled';
	url?: string;
}

export interface ActionProps {
	/* The atlaskit button style to use in showing the action. This is the only button prop you have access to. */
	buttonAppearance?: Appearance;
	/* Id of the action for use by ??? */
	id: string;
	/* The function to be called on clicking the action. This is a promise so the state can transition correctly after the action finishes */
	promise: () => Promise<any>;
	/* The text to be displayed in the action's button */
	text: React.ReactNode;
}

export interface RequestAccessContextProps extends AccessContext {
	action?: ActionProps;
	buttonDisabled?: boolean;
	callToActionMessageKey?: RequestAccessMessageKey;
	descriptiveMessageKey?: RequestAccessMessageKey;
	hostname?: string;
	titleMessageKey?: RequestAccessMessageKey;
}

export type InlinePreloaderStyle = 'on-left-with-skeleton' | 'on-right-without-skeleton';

export type ErrorCardType = 'errored' | 'fallback' | 'forbidden' | 'not_found' | 'unauthorized';

export type OnErrorCallback = (data: {
	err?: Error;
	status: Extract<CardType, ErrorCardType>;
	url: string;
}) => void;

/**
 * The method-in-object pattern (extracting `handler` via indexed access) is used intentionally
 * to replicate TypeScript's bivariant method parameter checking — the same technique React uses
 * internally for `React.EventHandler`. This allows consumers to pass callbacks with narrower
 * event types (e.g. `React.MouseEvent<HTMLElement>`) without TypeScript errors, while still
 * enabling callers inside Smart Links to pass the optional `data` second argument.
 *
 * See: https://www.typescriptlang.org/docs/handbook/2/functions.html#function-compatibility
 */
export type EventHandlerWithData<TEvent extends React.SyntheticEvent<any>, TData extends object> = {
	bivarianceHack(event: TEvent, data?: TData): void;
}['bivarianceHack'];

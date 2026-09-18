/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

export const ANALYTICS_CHANNEL = 'media';

export const context: {
	componentName: string;
	packageName: string;
	packageVersion: string;
} = {
	componentName: 'smart-cards',
	packageName: process.env._PACKAGE_NAME_ || '',
	packageVersion: process.env._PACKAGE_VERSION_ || '',
};

export enum TrackQuickActionType {
	StatusUpdate = 'StatusUpdate',
}

export enum TrackQuickActionFailureReason {
	PermissionError = 'PermissionError',
	ValidationError = 'ValidationError',
	UnknownError = 'UnknownError',
}

/**
 * @deprecated Use `import { SmartLinkEvents } from '@atlaskit/smart-card/smart-link-events'` instead.
 */
export { SmartLinkEvents } from './SmartLinkEvents';
/**
 * @deprecated Use `import { fireSmartLinkEvent } from '@atlaskit/smart-card/fire-smart-link-event'` instead.
 */
export { fireSmartLinkEvent } from './fireSmartLinkEvent';

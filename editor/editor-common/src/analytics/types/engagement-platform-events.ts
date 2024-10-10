import type { ACTION, ACTION_SUBJECT } from './enums';
import type { UIAEP } from './utils';

/**
 * Payload of an engagement platform event that is sent when an error occurs.
 *
 * It's used by `@atlassian/editor-plugin-engagement-platform` plugin.
 */
type EngagementPlatformErroredAEP = UIAEP<
	ACTION.ERRORED,
	ACTION_SUBJECT.ENGAGEMENT_PLATFORM,
	undefined,
	{
		/** The error message. */
		error: string;
		/** The error stack trace. */
		errorStack?: string;
	},
	undefined
>;

/**
 * Payload of an engagement platform event.
 *
 * It's used by `@atlassian/editor-plugin-engagement-platform` plugin.
 */
export type EngagementPlatformEventPayload = EngagementPlatformErroredAEP;

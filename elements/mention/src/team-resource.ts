/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import { ELEMENTS_CHANNEL } from './_constants';
import { AbstractMentionResource } from './api/AbstractMentionResource';
import { AbstractPresenceResource } from './api/AbstractPresenceResource';
import ContextMentionResource from './api/ContextMentionResource';
import {
	MentionResource,
	type MentionContextIdentifier,
	type MentionProvider,
	type MentionStats,
	type MentionResourceConfig,
} from './api/MentionResource';
import { PresenceResource, type PresenceProvider } from './api/PresenceResource';
import TeamMentionResource from './api/TeamMentionResource';
import { isSpecialMention } from './is-special-mention';
import type { MentionDescription, MentionsResult, TeamMember } from './types';

/**
 * @deprecated Use `import ContextMentionResource, { MentionResource, PresenceResource, isSpecialMention, ELEMENTS_CHANNEL } from '@atlaskit/mention/context-mention-resource'` instead.
 */
export {
	// Classes
	ContextMentionResource,
	MentionResource,
	TeamMentionResource,
	PresenceResource,
	AbstractMentionResource,
	AbstractPresenceResource,
	// Functions
	isSpecialMention,
	// Constants
	ELEMENTS_CHANNEL,
};
export type {
	// Interfaces
	MentionProvider,
	PresenceProvider,
	MentionDescription,
	MentionsResult,
	// types
	MentionContextIdentifier,
	MentionStats,
	TeamMember,
	MentionResourceConfig,
};

import MentionResource, {
	AbstractMentionResource,
	type ResolvingMentionProvider,
	type MentionContextIdentifier,
	type MentionProvider,
	type MentionStats,
	type MentionResourceConfig,
	isResolvingMentionProvider,
} from './api/MentionResource';
import PresenceResource, {
	type PresenceProvider,
	AbstractPresenceResource,
} from './api/PresenceResource';
import { DefaultMentionNameResolver, type MentionNameResolver } from './api/MentionNameResolver';
import { type MentionNameClient } from './api/MentionNameClient';
import {
	type MentionDescription,
	type MentionsResult,
	isSpecialMention,
	MentionNameStatus,
	type MentionNameDetails,
} from './types';
import { ELEMENTS_CHANNEL } from './_constants';
import ContextMentionResource from './api/ContextMentionResource';
import { SLI_EVENT_TYPE, SMART_EVENT_TYPE, buildSliPayload } from './util/analytics';

export {
	// Classes
	ContextMentionResource,
	MentionResource,
	PresenceResource,
	AbstractMentionResource,
	AbstractPresenceResource,
	DefaultMentionNameResolver,
	MentionNameStatus,
	// Functions
	isSpecialMention,
	isResolvingMentionProvider,
	// Constants
	ELEMENTS_CHANNEL,
	// ANALYTICS
	SLI_EVENT_TYPE,
	SMART_EVENT_TYPE,
	buildSliPayload,
};
export type {
	// Interfaces
	ResolvingMentionProvider,
	MentionProvider,
	PresenceProvider,
	MentionDescription,
	MentionsResult,
	MentionNameClient,
	MentionNameResolver,
	// types
	MentionContextIdentifier,
	MentionStats,
	MentionResourceConfig,
	MentionNameDetails,
};

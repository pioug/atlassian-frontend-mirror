/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import { ELEMENTS_CHANNEL } from './_constants';
import { AbstractMentionResource } from './api/AbstractMentionResource';
import { AbstractPresenceResource } from './api/AbstractPresenceResource';
import ContextMentionResource from './api/ContextMentionResource';
import { DefaultMentionNameResolver } from './api/DefaultMentionNameResolver';
import { isResolvingMentionProvider } from './api/isResolvingMentionProvider';
import { type MentionNameClient } from './api/MentionNameClient';
import type { MentionNameResolver } from './api/MentionNameResolver';
import {
	MentionResource,
	type ResolvingMentionProvider,
	type MentionContextIdentifier,
	type MentionProvider,
	type MentionStats,
	type MentionResourceConfig,
} from './api/MentionResource';
import { PresenceResource, type PresenceProvider } from './api/PresenceResource';
import { isSpecialMention } from './is-special-mention';
import {
	type MentionDescription,
	type MentionsResult,
	MentionNameStatus,
	type MentionNameDetails,
} from './types';
import { SLI_EVENT_TYPE, SMART_EVENT_TYPE } from './util/analytics';
import { buildSliPayload } from './util/build-sli-payload';

/**
 * @deprecated Use `import ContextMentionResource, { MentionResource, PresenceResource, DefaultMentionNameResolver, MentionNameStatus, isSpecialMention, isResolvingMentionProvider, ELEMENTS_CHANNEL, SLI_EVENT_TYPE, SMART_EVENT_TYPE, buildSliPayload } from '@atlaskit/mention/context-mention-resource'` instead.
 */
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

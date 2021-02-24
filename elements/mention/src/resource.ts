import MentionResource, {
  AbstractMentionResource,
  ResolvingMentionProvider,
  MentionContextIdentifier,
  MentionProvider,
  MentionStats,
  MentionResourceConfig,
  isResolvingMentionProvider,
  TeamMentionProvider,
} from './api/MentionResource';
import PresenceResource, {
  PresenceProvider,
  AbstractPresenceResource,
} from './api/PresenceResource';
import {
  DefaultMentionNameResolver,
  MentionNameResolver,
} from './api/MentionNameResolver';
import { MentionNameClient } from './api/MentionNameClient';
import {
  MentionDescription,
  MentionsResult,
  isSpecialMention,
  MentionNameStatus,
  MentionNameDetails,
} from './types';
import { ELEMENTS_CHANNEL } from './_constants';
import ContextMentionResource from './api/ContextMentionResource';
import {
  SLI_EVENT_TYPE,
  SMART_EVENT_TYPE,
  buildSliPayload,
} from './util/analytics';

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
  TeamMentionProvider,
  // types
  MentionContextIdentifier,
  MentionStats,
  MentionResourceConfig,
  MentionNameDetails,
};

import MentionResource, {
  AbstractMentionResource,
  type MentionContextIdentifier,
  type MentionProvider,
  type MentionStats,
  type MentionResourceConfig,
} from './api/MentionResource';
import TeamMentionResource from './api/TeamMentionResource';
import PresenceResource, {
  type PresenceProvider,
  AbstractPresenceResource,
} from './api/PresenceResource';
import {
  type MentionDescription,
  type MentionsResult,
  isSpecialMention,
  type TeamMember,
} from './types';
import { ELEMENTS_CHANNEL } from './_constants';
import ContextMentionResource from './api/ContextMentionResource';

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

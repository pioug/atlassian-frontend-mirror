import MentionResource, {
  AbstractMentionResource,
  MentionContextIdentifier,
  MentionProvider,
  ResolvingMentionProvider,
  MentionStats,
  MentionResourceConfig,
  TeamMentionResourceConfig,
  isResolvingMentionProvider,
} from './api/MentionResource';
import SmartMentionResource, {
  SmartMentionConfig,
} from './api/SmartMentionResource';

import TeamMentionResource from './api/TeamMentionResource';
import PresenceResource, {
  PresenceProvider,
  AbstractPresenceResource,
} from './api/PresenceResource';
import {
  DefaultMentionNameResolver,
  MentionNameResolver,
} from './api/MentionNameResolver';
import { MentionNameClient } from './api/MentionNameClient';
import MentionItem from './components/MentionItem';
import MentionList from './components/MentionList';
import ResourcedMentionList from './components/ResourcedMentionList';
import { MentionPickerWithAnalytics as MentionPicker } from './components/MentionPicker';
import Mention from './components/Mention';
import ResourcedMention from './components/Mention/ResourcedMention';
import TeamMentionHighlight from './components/TeamMentionHighlight';
import TeamMentionHighlightController from './components/TeamMentionHighlight/TeamMentionHighlightController';
import {
  MentionDescription,
  MentionsResult,
  MentionNameStatus,
  MentionNameDetails,
  InviteExperimentCohort,
  InviteFlow,
  isSpecialMention,
  TeamMember,
  UserRole,
} from './types';
import { ELEMENTS_CHANNEL } from './_constants';
import ContextMentionResource from './api/ContextMentionResource';

export {
  // Classes
  ContextMentionResource,
  MentionResource,
  SmartMentionResource,
  TeamMentionResource,
  PresenceResource,
  DefaultMentionNameResolver,
  AbstractMentionResource,
  AbstractPresenceResource,
  MentionNameStatus,
  // Components
  MentionItem,
  MentionList,
  ResourcedMentionList,
  MentionPicker,
  Mention,
  ResourcedMention,
  TeamMentionHighlight,
  TeamMentionHighlightController,
  // Functions
  isSpecialMention,
  isResolvingMentionProvider,
  // Constants
  ELEMENTS_CHANNEL,
};
export type {
  // Interfaces
  ResolvingMentionProvider,
  MentionProvider,
  PresenceProvider,
  MentionDescription,
  MentionsResult,
  MentionNameResolver,
  MentionNameClient,
  MentionNameDetails,
  // types
  MentionContextIdentifier,
  MentionStats,
  TeamMember,
  MentionResourceConfig,
  SmartMentionConfig,
  TeamMentionResourceConfig,
  InviteExperimentCohort,
  InviteFlow,
  UserRole,
};

export default MentionPicker;

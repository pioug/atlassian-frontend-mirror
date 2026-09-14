import { ELEMENTS_CHANNEL } from './_constants';
import { AbstractMentionResource } from './api/AbstractMentionResource';
import { AbstractPresenceResource } from './api/AbstractPresenceResource';
import ContextMentionResource from './api/ContextMentionResource';
import { DefaultMentionNameResolver } from './api/DefaultMentionNameResolver';
import { type MentionNameClient } from './api/MentionNameClient';
import type { MentionNameResolver } from './api/MentionNameResolver';
import {
	MentionResource,
	type MentionContextIdentifier,
	type MentionProvider,
	type ResolvingMentionProvider,
	type MentionStats,
	type MentionResourceConfig,
	type TeamMentionResourceConfig,
} from './api/MentionResource';
import { isResolvingMentionProvider } from './api/isResolvingMentionProvider';
import { PresenceResource, type PresenceProvider } from './api/PresenceResource';
import TeamMentionResource from './api/TeamMentionResource';
import Mention from './components/Mention';
import ResourcedMention from './components/Mention/ResourcedMention';
import MentionItem from './components/MentionItem';
import MentionList from './components/MentionList';
import { MentionPickerWithAnalytics as MentionPicker } from './components/MentionPicker';
import ResourcedMentionList from './components/ResourcedMentionList';
import { isSpecialMention } from './is-special-mention';
import {
	type MentionDescription,
	type MentionsResult,
	MentionNameStatus,
	type MentionNameDetails,
	type InviteFlow,
	type TeamMember,
	UserAccessLevel,
	type UserRole,
	UserType,
	ComponentNames,
	Actions,
	SliNames,
} from './types';

export {
	// Classes
	ContextMentionResource,
	MentionResource,
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
	UserAccessLevel,
	UserType,
	ComponentNames,
	SliNames,
	Actions,
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
	TeamMentionResourceConfig,
	InviteFlow,
	UserRole,
};

export default MentionPicker;

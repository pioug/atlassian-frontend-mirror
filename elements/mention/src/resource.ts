import { type MentionNameClient } from './api/MentionNameClient';
import type { MentionNameResolver } from './api/MentionNameResolver';
import {
	type ResolvingMentionProvider,
	type MentionContextIdentifier,
	type MentionProvider,
	type MentionStats,
	type MentionResourceConfig,
} from './api/MentionResource';
import { type PresenceProvider } from './api/PresenceResource';
import { type MentionDescription, type MentionsResult, type MentionNameDetails } from './types';

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

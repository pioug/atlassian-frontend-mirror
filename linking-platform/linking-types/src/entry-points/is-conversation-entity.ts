import type { ConversationEntity } from './entity-types';
import { isBaseEntity } from './is-base-entity';

export const isConversationEntity = (value: unknown): value is ConversationEntity =>
	isBaseEntity(value) &&
	('isArchived' in value ||
		'lastActive' in value ||
		'memberCount' in value ||
		'members' in value ||
		'membershipType' in value ||
		'topic' in value ||
		'workspace' in value);

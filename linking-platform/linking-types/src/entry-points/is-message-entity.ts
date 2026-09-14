import type { MessageEntity } from './entity-types';
import { isBaseEntity } from './is-base-entity';

export const isMessageEntity = (value: unknown): value is MessageEntity =>
	isBaseEntity(value) &&
	('attachments' in value ||
		'commentCount' in value ||
		'hidden' in value ||
		'isPinned' in value ||
		'lastActive' in value ||
		'reactions' in value);

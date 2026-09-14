import type { EntityType } from './entity-types';
import { isBaseEntity } from './is-base-entity';
import { isConversationEntity } from './is-conversation-entity';
import { isDesignEntity } from './is-design-entity';
import { isDocumentEntity } from './is-document-entity';
import { isMessageEntity } from './is-message-entity';
import { isProjectEntity } from './is-project-entity';
import { isRemoteLinkEntity } from './is-remote-link-entity';
import { isUnsupportedEntity } from './is-unsupported-entity';
import { isWorkItemEntity } from './is-work-item-entity';

export const isEntityType = (value: unknown): value is EntityType =>
	isBaseEntity(value) &&
	(isDesignEntity(value) ||
		isRemoteLinkEntity(value) ||
		isProjectEntity(value) ||
		isWorkItemEntity(value) ||
		isDocumentEntity(value) ||
		isMessageEntity(value) ||
		isConversationEntity(value) ||
		isUnsupportedEntity(value));

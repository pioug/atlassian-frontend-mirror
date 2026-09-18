/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

export interface User {
	accountId?: string;
	displayName?: string;
	email?: string;
	externalId?: string;
	id?: string;
	picture?: string;
}

export const DESIGN_TYPES = ['FILE', 'CANVAS', 'GROUP', 'NODE', 'PROTOTYPE', 'OTHER'] as const;

export type DesignType = (typeof DESIGN_TYPES)[number];

export const DESIGN_STATUSES = ['READY_FOR_DEVELOPMENT', 'UNKNOWN', 'NONE'] as const;

export type DesignStatus = (typeof DESIGN_STATUSES)[number];

export type DesignAttributes = {
	iconUrl?: string;
	inspectUrl?: string;
	status: DesignStatus;
	type: DesignType;
};

export const REMOTE_LINK_TYPES = [
	'document',
	'alert',
	'test',
	'security',
	'logFile',
	'prototype',
	'coverage',
	'bugReport',
	'releaseNotes',
	'other',
] as const;

export type RemoteLinkType = (typeof REMOTE_LINK_TYPES)[number];

export type RemoteLinkAttributes = {
	actionIds?: string[];
	assignee?: User;
	attributeMap?: Map<string, string>;
	author?: User;
	category?: string; // max 255 characters
	status?: RemoteLinkStatus;
	type: RemoteLinkType;
};

const APPEARANCES = ['default', 'inprogress', 'moved', 'new', 'removed', 'success'] as const;

export type Appearance = (typeof APPEARANCES)[number];

export type RemoteLinkStatus = {
	appearance: Appearance;
	label: string; // max 255 characters
};

export type Attachment = {
	byteSize: number;
	mimeType: string;
	thumbnailUrl: string;
	title: string;
	url: string;
};

export type ProjectAttributes = {
	assignee?: User;
	attachments?: Attachment[];
	dueDate?: string;
	environment?: string;
	key?: string;
	labels?: string[];
	priority?: string;
	resolution?: string;
	status?: string;
	votesCount?: number;
	watchersCount?: number;
};

export const WORK_ITEM_SUB_TYPES = [
	'task',
	'bug',
	'story',
	'epic',
	'feature',
	'question',
	'other',
	'incident',
	'problem',
	'approval',
	'section',
	'milestone',
	'work_item',
	'default_task',
] as const;

export type SubType = (typeof WORK_ITEM_SUB_TYPES)[number];

export type WorkItemAttributes = {
	assignee?: User;
	attachments?: Attachment[];
	collaborators?: User[];
	dueDate?: string;
	exceedsMaxCollaborators?: boolean;
	project?: ProjectEntity;
	status: string;
	subtype: SubType;
	team: string;
};

export const DOCUMENT_CATEGORIES = [
	'folder',
	'document',
	'presentation',
	'spreadsheet',
	'image',
	'audio',
	'video',
	'pdf',
	'shortcut',
	'code',
	'archive',
	'form',
	'web-page',
	'other',
] as const;

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

export type DocumentContent = {
	binary?: string;
	mimeType?: string;
	text?: string;
};

export type ExportLink = {
	mimeType: string;
	url: string;
};

export type DocumentType = {
	category?: DocumentCategory;
	iconUrl?: string;
};

export type DocumentAttributes = {
	byteSize?: number;
	collaborators?: User[];
	content?: DocumentContent;
	exportLinks?: ExportLink[];
	type: DocumentType;
};

export type Reactions = {
	reactionType: string;
	total: number;
};

export type MessageAttributes = {
	attachments?: Attachment[];
	commentCount?: number;
	hidden?: boolean;
	isPinned?: boolean;
	lastActive?: string;
	reactions?: Reactions[];
};

export type ConversationAttributes = {
	isArchived?: boolean;
	lastActive?: string;
	memberCount?: number;
	members?: User[];
	membershipType?: string;
	topic?: string;
	type?: string;
	workspace?: string;
};

/**
 * The base shape of supported nouns as defined by data depot.
 * @see https://developer.atlassian.com/cloud/jsw-data-depot/supported-nouns/common-attributes-and-shapes/
 */
export interface BaseEntity {
	ari?: string;
	createdAt?: string;
	createdBy?: User;
	description?: string;
	displayName: string;
	id: string;
	lastUpdatedAt?: string;
	lastUpdatedBy?: User;
	liveEmbedUrl?: string;
	owners?: User[];
	permissions?: Record<string, unknown>;
	schemaVersion?: string;
	thirdPartyAri?: string;
	thumbnail?: {
		externalUrl: string;
	};
	updateSequenceNumber?: number;
	url: string;
}

export interface DesignEntity extends BaseEntity, DesignAttributes {}

export interface RemoteLinkEntity extends BaseEntity {
	'atlassian:remote-link': RemoteLinkAttributes;
}

export interface WorkItemEntity extends BaseEntity {
	'atlassian:work-item': WorkItemAttributes;
}

export interface ProjectEntity extends BaseEntity {
	'atlassian:project': ProjectAttributes;
}

export interface DocumentEntity extends BaseEntity, DocumentAttributes {}

export interface MessageEntity extends BaseEntity, MessageAttributes {}

export interface ConversationEntity extends BaseEntity, ConversationAttributes {}

export interface UnsupportedEntity extends BaseEntity {
	[x: string | number | symbol]: unknown;
}

/**
 * The shape of the response from Native entity support by the Smart Link API.
 */
export type EntityType =
	| BaseEntity
	| DesignEntity
	| RemoteLinkEntity
	| ProjectEntity
	| WorkItemEntity
	| DocumentEntity
	| MessageEntity
	| ConversationEntity
	| UnsupportedEntity;

/**
 * @deprecated Use `import { isBaseEntity } from '@atlaskit/linking-types/is-base-entity'` instead.
 */
export { isBaseEntity } from './is-base-entity';
/**
 * @deprecated Use `import { isDesignEntity } from '@atlaskit/linking-types/is-design-entity'` instead.
 */
export { isDesignEntity } from './is-design-entity';
/**
 * @deprecated Use `import { isRemoteLinkEntity } from '@atlaskit/linking-types/is-remote-link-entity'` instead.
 */
export { isRemoteLinkEntity } from './is-remote-link-entity';
/**
 * @deprecated Use `import { isProjectEntity } from '@atlaskit/linking-types/is-project-entity'` instead.
 */
export { isProjectEntity } from './is-project-entity';
/**
 * @deprecated Use `import { isWorkItemEntity } from '@atlaskit/linking-types/is-work-item-entity'` instead.
 */
export { isWorkItemEntity } from './is-work-item-entity';
/**
 * @deprecated Use `import { isDocumentEntity } from '@atlaskit/linking-types/is-document-entity'` instead.
 */
export { isDocumentEntity } from './is-document-entity';
/**
 * @deprecated Use `import { isMessageEntity } from '@atlaskit/linking-types/is-message-entity'` instead.
 */
export { isMessageEntity } from './is-message-entity';
/**
 * @deprecated Use `import { isConversationEntity } from '@atlaskit/linking-types/is-conversation-entity'` instead.
 */
export { isConversationEntity } from './is-conversation-entity';
/**
 * @deprecated Use `import { isUnsupportedEntity } from '@atlaskit/linking-types/is-unsupported-entity'` instead.
 */
export { isUnsupportedEntity } from './is-unsupported-entity';
/**
 * @deprecated Use `import { isEntityType } from '@atlaskit/linking-types/is-entity-type'` instead.
 */
export { isEntityType } from './is-entity-type';
/**
 * @deprecated Use `import { isOneOf } from '@atlaskit/linking-types/is-one-of'` instead.
 */
export { isOneOf } from './is-one-of';
/**
 * @deprecated Use `import { isObject } from '@atlaskit/linking-types/is-object'` instead.
 */
export { isObject } from './is-object';
/**
 * @deprecated Use `import { asRecord } from '@atlaskit/linking-types/as-record'` instead.
 */
export { asRecord } from './as-record';

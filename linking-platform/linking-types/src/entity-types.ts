export interface User {
	accountId?: string;
	displayName?: string;
	email?: string;
	externalId?: string;
	id?: string;
	picture?: string;
}

const DESIGN_TYPES = ['FILE', 'CANVAS', 'GROUP', 'NODE', 'PROTOTYPE', 'OTHER'] as const;
export type DesignType = (typeof DESIGN_TYPES)[number];

const DESIGN_STATUSES = ['READY_FOR_DEVELOPMENT', 'UNKNOWN', 'NONE'] as const;
export type DesignStatus = (typeof DESIGN_STATUSES)[number];

export type DesignAttributes = {
	iconUrl?: string;
	inspectUrl?: string;
	status: DesignStatus;
	type: DesignType;
};
const REMOTE_LINK_TYPES = [
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

const WORK_ITEM_SUB_TYPES = [
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

const DOCUMENT_CATEGORIES = [
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
 * Runtime membership check for string literal tuples.
 * Keeps guard logic aligned with tuple-derived union types.
 */
const isOneOf = <T extends readonly string[]>(values: T, value: unknown): value is T[number] =>
	typeof value === 'string' && (values as readonly string[]).includes(value);

const isObject = (value: unknown): value is Record<string | number | symbol, unknown> =>
	typeof value === 'object' && value !== null;

const asRecord = (value: unknown): Record<string | number | symbol, unknown> =>
	value as Record<string | number | symbol, unknown>;

export const isBaseEntity = (value: unknown): value is BaseEntity =>
	isObject(value) &&
	typeof value.displayName === 'string' &&
	typeof value.id === 'string' &&
	typeof value.url === 'string';

export const isDesignEntity = (value: unknown): value is DesignEntity =>
	isBaseEntity(value) &&
	isOneOf(DESIGN_STATUSES, asRecord(value).status) &&
	isOneOf(DESIGN_TYPES, asRecord(value).type);

export const isRemoteLinkEntity = (value: unknown): value is RemoteLinkEntity => {
	if (!isBaseEntity(value)) {
		return false;
	}

	const entity = asRecord(value);
	const remoteLink = entity['atlassian:remote-link'];
	return isObject(remoteLink) && isOneOf(REMOTE_LINK_TYPES, remoteLink.type);
};

export const isProjectEntity = (value: unknown): value is ProjectEntity =>
	isBaseEntity(value) && isObject(asRecord(value)['atlassian:project']);

export const isWorkItemEntity = (value: unknown): value is WorkItemEntity => {
	if (!isBaseEntity(value)) {
		return false;
	}

	const entity = asRecord(value);
	const workItem = entity['atlassian:work-item'];
	return (
		isObject(workItem) &&
		typeof workItem.status === 'string' &&
		isOneOf(WORK_ITEM_SUB_TYPES, workItem.subtype) &&
		typeof workItem.team === 'string'
	);
};

export const isDocumentEntity = (value: unknown): value is DocumentEntity => {
	if (!isBaseEntity(value)) {
		return false;
	}

	const entityType = asRecord(value).type;
	return (
		isObject(entityType) &&
		(entityType.category === undefined || isOneOf(DOCUMENT_CATEGORIES, entityType.category)) &&
		(entityType.iconUrl === undefined || typeof entityType.iconUrl === 'string') &&
		(isOneOf(DOCUMENT_CATEGORIES, entityType.category) || typeof entityType.iconUrl === 'string')
	);
};

export const isMessageEntity = (value: unknown): value is MessageEntity =>
	isBaseEntity(value) &&
	('attachments' in value ||
		'commentCount' in value ||
		'hidden' in value ||
		'isPinned' in value ||
		'lastActive' in value ||
		'reactions' in value);

export const isConversationEntity = (value: unknown): value is ConversationEntity =>
	isBaseEntity(value) &&
	('isArchived' in value ||
		'lastActive' in value ||
		'memberCount' in value ||
		'members' in value ||
		'membershipType' in value ||
		'topic' in value ||
		'workspace' in value);

export const isUnsupportedEntity = (value: unknown): value is UnsupportedEntity =>
	isBaseEntity(value) &&
	!isDesignEntity(value) &&
	!isRemoteLinkEntity(value) &&
	!isProjectEntity(value) &&
	!isWorkItemEntity(value) &&
	!isDocumentEntity(value) &&
	!isMessageEntity(value) &&
	!isConversationEntity(value);

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

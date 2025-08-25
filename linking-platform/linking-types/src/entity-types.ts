export interface User {
	accountId?: string;
	displayName?: string;
	email?: string;
	externalId?: string;
	id?: string;
	picture?: string;
}

export type DesignType = 'FILE' | 'CANVAS' | 'GROUP' | 'NODE' | 'PROTOTYPE' | 'OTHER';

export type DesignStatus = 'READY_FOR_DEVELOPMENT' | 'UNKNOWN' | 'NONE';

export type DesignAttributes = {
	iconUrl?: string;
	inspectUrl?: string;
	status: DesignStatus;
	type: DesignType;
};

export type RemoteLinkType =
	| 'document'
	| 'alert'
	| 'test'
	| 'security'
	| 'logFile'
	| 'prototype'
	| 'coverage'
	| 'bugReport'
	| 'releaseNotes'
	| 'other';

export type RemoteLinkAttributes = {
	actionIds?: string[];
	assignee?: User;
	attributeMap?: Map<string, string>;
	author?: User;
	category?: string; // max 255 characters
	status?: RemoteLinkStatus;
	type: RemoteLinkType;
};

export type Appearance = 'default' | 'inprogress' | 'moved' | 'new' | 'removed' | 'success';
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

export type SubType =
	| 'task'
	| 'bug'
	| 'story'
	| 'epic'
	| 'feature'
	| 'question'
	| 'other'
	| 'incident'
	| 'problem'
	| 'approval'
	| 'section'
	| 'milestone'
	| 'work_item'
	| 'default_task';

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

export type DocumentCategory =
	| 'folder'
	| 'document'
	| 'presentation'
	| 'spreadsheet'
	| 'image'
	| 'audio'
	| 'video'
	| 'pdf'
	| 'shortcut'
	| 'code'
	| 'archive'
	| 'form'
	| 'web-page'
	| 'other';

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

export interface User {
	accountId?: string;
	id?: string;
	email?: string;
	externalId?: string;
	displayName?: string;
	picture?: string;
}

export type DesignType = 'FILE' | 'CANVAS' | 'GROUP' | 'NODE' | 'PROTOTYPE' | 'OTHER';

export type DesignStatus = 'READY_FOR_DEVELOPMENT' | 'UNKNOWN' | 'NONE';

export type DesignAttributes = {
	inspectUrl?: string;
	status: DesignStatus;
	type: DesignType;
	iconUrl?: string;
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
	type: RemoteLinkType;
	status?: RemoteLinkStatus;
	actionIds?: string[];
	attributeMap?: Map<string, string>;
	author?: User;
	assignee?: User;
	category?: string; // max 255 characters
};

export type Appearance = 'default' | 'inprogress' | 'moved' | 'new' | 'removed' | 'success';
export type RemoteLinkStatus = {
	appearance: Appearance;
	label: string; // max 255 characters
};

export type Attachment = {
	url: string;
	thumbnailUrl: string;
	title: string;
	mimeType: string;
	byteSize: number;
};

export type ProjectAttributes = {
	key?: string;
	labels?: string[];
	dueDate?: string;
	priority?: string;
	assignee?: User;
	status?: string;
	attachments?: Attachment[];
	environment?: string;
	resolution?: string;
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
	dueDate?: string;
	assignee?: User;
	project?: ProjectEntity;
	collaborators?: User[];
	exceedsMaxCollaborators?: boolean;
	status: string;
	subtype: SubType;
	attachments?: Attachment[];
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
	mimeType?: string;
	text?: string;
	binary?: string;
};

export type ExportLink = {
	mimeType: string;
	url: string;
};

export type DocumentType = {
	iconUrl?: string;
	category?: DocumentCategory;
};

export type DocumentAttributes = {
	type: DocumentType;
	content?: DocumentContent;
	byteSize?: number;
	exportLinks?: ExportLink[];
	collaborators?: User[];
};

/**
 * The base shape of supported nouns as defined by data depot.
 * @see https://developer.atlassian.com/cloud/jsw-data-depot/supported-nouns/common-attributes-and-shapes/
 */
export interface BaseEntity {
	schemaVersion?: string;
	id: string;
	ari?: string;
	thirdPartyAri?: string;
	updateSequenceNumber?: number;
	thumbnail?: {
		externalUrl: string;
	};
	displayName: string;
	description?: string;
	url: string;
	createdAt?: string;
	createdBy?: User;
	lastUpdatedAt?: string;
	lastUpdatedBy?: User;
	owners?: User[];
	permissions?: Record<string, unknown>;
	liveEmbedUrl?: string;
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
	| UnsupportedEntity;

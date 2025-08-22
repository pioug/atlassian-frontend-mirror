import type { Node } from '@atlaskit/editor-prosemirror/model';

export type Entity = {
	node: Node;
	nodeContext: string;
	pos: number;
};

type Metadata<T = Object> = {
	action?: string;
	inputMethod?: string;
	isRedo?: boolean;
	isUndo?: boolean;
	node: Node;
	nodeContext?: string;
	sourceEvent?: unknown;
} & T;

type UpdateMetadata = {
	previousDisplay?: string;
};

export enum EVENT {
	CREATED = 'created',
	UPDATED = 'updated',
	DELETED = 'deleted',
}

export enum EVENT_SUBJECT {
	LINK = 'link',
	DATASOURCE = 'datasource',
}

/**
 * These are not GASv3 events
 * But they share a similar in shape so that GASv3
 * events can be derived from them / think of them in the same way
 */
export type LinkCreatedEvent = {
	data: Metadata;
	event: EVENT.CREATED;
	subject: EVENT_SUBJECT.LINK;
};
export type LinkUpdatedEvent = {
	data: Metadata<UpdateMetadata>;
	event: EVENT.UPDATED;
	subject: EVENT_SUBJECT.LINK;
};
export type LinkDeletedEvent = {
	data: Metadata;
	event: EVENT.DELETED;
	subject: EVENT_SUBJECT.LINK;
};
export type DatasourceCreatedEvent = {
	data: Metadata;
	event: EVENT.CREATED;
	subject: EVENT_SUBJECT.DATASOURCE;
};
export type DatasourceUpdatedEvent = {
	data: Metadata<UpdateMetadata>;
	event: EVENT.UPDATED;
	subject: EVENT_SUBJECT.DATASOURCE;
};
export type DatasourceDeletedEvent = {
	data: Metadata;
	event: EVENT.DELETED;
	subject: EVENT_SUBJECT.DATASOURCE;
};

export type LinkEvent = LinkCreatedEvent | LinkUpdatedEvent | LinkDeletedEvent;

export type DatasourceEvent =
	| DatasourceCreatedEvent
	| DatasourceUpdatedEvent
	| DatasourceDeletedEvent;

export type CardPluginEvent = LinkEvent | DatasourceEvent;

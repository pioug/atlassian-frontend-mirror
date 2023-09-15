import type { Node } from '@atlaskit/editor-prosemirror/model';

export type Entity = {
  pos: number;
  node: Node;
  nodeContext: string;
};

type Metadata<T = {}> = {
  node: Node;
  isUndo?: boolean;
  isRedo?: boolean;
  action?: string;
  inputMethod?: string;
  sourceEvent?: unknown;
  nodeContext?: string;
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
  event: EVENT.CREATED;
  subject: EVENT_SUBJECT.LINK;
  data: Metadata;
};
export type LinkUpdatedEvent = {
  event: EVENT.UPDATED;
  subject: EVENT_SUBJECT.LINK;
  data: Metadata<UpdateMetadata>;
};
export type LinkDeletedEvent = {
  event: EVENT.DELETED;
  subject: EVENT_SUBJECT.LINK;
  data: Metadata;
};
export type DatasourceCreatedEvent = {
  event: EVENT.CREATED;
  subject: EVENT_SUBJECT.DATASOURCE;
  data: Metadata;
};
export type DatasourceUpdatedEvent = {
  event: EVENT.UPDATED;
  subject: EVENT_SUBJECT.DATASOURCE;
  data: Metadata<UpdateMetadata>;
};
export type DatasourceDeletedEvent = {
  event: EVENT.DELETED;
  subject: EVENT_SUBJECT.DATASOURCE;
  data: Metadata;
};

export type LinkEvent = LinkCreatedEvent | LinkUpdatedEvent | LinkDeletedEvent;

export type DatasourceEvent =
  | DatasourceCreatedEvent
  | DatasourceUpdatedEvent
  | DatasourceDeletedEvent;

export type CardPluginEvent = LinkEvent | DatasourceEvent;

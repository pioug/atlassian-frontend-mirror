import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from './enums';
import { OperationalAEP } from './utils';

export type InitialiseFragmentMarksAEP = OperationalAEP<
  ACTION.INITIALISED_FRAGMENT_MARK,
  ACTION_SUBJECT.DOCUMENT,
  undefined,
  {
    duration: number;
    docSize: number;
    count: number;
  },
  EVENT_TYPE.OPERATIONAL
>;

export type ConnectedNodesAEP = OperationalAEP<
  ACTION.CONNECTED_NODES,
  ACTION_SUBJECT.DOCUMENT,
  undefined,
  {
    actionType: string;
    docSize: number;
    duration: number;
    sourceNodeType: string;
    targetNodeType: string;
    type: string;
  },
  EVENT_TYPE.OPERATIONAL
>;

export type DisconnectedSourceAEP = OperationalAEP<
  ACTION.DISCONNECTED_SOURCE,
  ACTION_SUBJECT.DOCUMENT,
  undefined,
  {
    docSize: number;
    duration: number;
    targetNodeType: string;
  },
  EVENT_TYPE.OPERATIONAL
>;

export type DisconnectedTargetAEP = OperationalAEP<
  ACTION.DISCONNECTED_TARGET,
  ACTION_SUBJECT.DOCUMENT,
  undefined,
  {
    docSize: number;
    duration: number;
    sourceNodeType: string;
    targetNodeType: string;
  },
  EVENT_TYPE.OPERATIONAL
>;

export type GotConnectionsAEP = OperationalAEP<
  ACTION.GOT_CONNECTIONS,
  ACTION_SUBJECT.DOCUMENT,
  undefined,
  {
    count: number;
    docSize: number;
    duration: number;
  },
  EVENT_TYPE.OPERATIONAL
>;

export type UpdatedFragmentMarkNameAEP = OperationalAEP<
  ACTION.UPDATED_FRAGMENT_MARK_NAME,
  ACTION_SUBJECT.DOCUMENT,
  undefined,
  {
    duration: number;
    nodeType: string;
  },
  EVENT_TYPE.OPERATIONAL
>;

export type UpdatedSourceAEP = OperationalAEP<
  ACTION.UPDATED_SOURCE,
  ACTION_SUBJECT.DOCUMENT,
  undefined,
  {
    docSize: number;
    duration: number;
    newSourceNodeType: string;
    oldSourceNodeType: string;
    type: UPDATED_TYPE;
  },
  EVENT_TYPE.OPERATIONAL
>;

export type UPDATED_TYPE = 'update' | 'replaceAndUpdate';

export type UpdatedTargetAEP = OperationalAEP<
  ACTION.UPDATED_TARGET,
  ACTION_SUBJECT.DOCUMENT,
  undefined,
  {
    docSize: number;
    duration: number;
    newTargetNodeType: string;
    oldTargetNodeType: string;
    sourceNodeType: string;
    type: UPDATED_TYPE;
  },
  EVENT_TYPE.OPERATIONAL
>;

export type ReferentialityEventPayload =
  | InitialiseFragmentMarksAEP
  | ConnectedNodesAEP
  | DisconnectedSourceAEP
  | DisconnectedTargetAEP
  | GotConnectionsAEP
  | UpdatedFragmentMarkNameAEP
  | UpdatedSourceAEP
  | UpdatedTargetAEP;

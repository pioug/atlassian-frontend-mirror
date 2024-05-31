import type { ACTION, ACTION_SUBJECT } from './enums';
import type { OperationalAEP } from './utils';

export type InitialiseFragmentMarksAEP = OperationalAEP<
	ACTION.INITIALISED_FRAGMENT_MARK,
	ACTION_SUBJECT.DOCUMENT,
	undefined,
	{
		duration: number;
		docSize: number;
		count: number;
	}
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
	}
>;

export type DisconnectedSourceAEP = OperationalAEP<
	ACTION.DISCONNECTED_SOURCE,
	ACTION_SUBJECT.DOCUMENT,
	undefined,
	{
		docSize: number;
		duration: number;
		targetNodeType: string;
	}
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
	}
>;

export type GotConnectionsAEP = OperationalAEP<
	ACTION.GOT_CONNECTIONS,
	ACTION_SUBJECT.DOCUMENT,
	undefined,
	{
		count: number;
		docSize: number;
		duration: number;
	}
>;

export type UpdatedFragmentMarkNameAEP = OperationalAEP<
	ACTION.UPDATED_FRAGMENT_MARK_NAME,
	ACTION_SUBJECT.DOCUMENT,
	undefined,
	{
		duration: number;
		nodeType: string;
	}
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
	}
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
	}
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

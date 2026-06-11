import type { ACTION, ACTION_SUBJECT } from './enums';
import type { OperationalAEP } from './utils';

export type ContainerNodeTransformedAEP = OperationalAEP<
	ACTION.CONTAINER_NODE_TRANSFORMED,
	ACTION_SUBJECT.EDITOR | ACTION_SUBJECT.RENDERER,
	undefined,
	{ transformedNodeTypes: string[] }
>;

export type ContainerNodeActionsEventPayload = ContainerNodeTransformedAEP;

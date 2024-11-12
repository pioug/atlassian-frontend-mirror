import type { ACTION, ACTION_SUBJECT } from './enums';
import type { OperationalAEP } from './utils';

export type NestedTableTransformedAEP = OperationalAEP<
	ACTION.NESTED_TABLE_TRANSFORMED,
	ACTION_SUBJECT.EDITOR,
	undefined,
	undefined
>;

export type NestedTableActionsEventPayload = NestedTableTransformedAEP;

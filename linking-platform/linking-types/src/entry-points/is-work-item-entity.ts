import { asRecord } from './as-record';
import { WORK_ITEM_SUB_TYPES } from './entity-types';
import type { WorkItemEntity } from './entity-types';
import { isBaseEntity } from './is-base-entity';
import { isObject } from './is-object';
import { isOneOf } from './is-one-of';

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

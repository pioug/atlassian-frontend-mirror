import { asRecord } from './as-record';
import type { ProjectEntity } from './entity-types';
import { isBaseEntity } from './is-base-entity';
import { isObject } from './is-object';

export const isProjectEntity = (value: unknown): value is ProjectEntity =>
	isBaseEntity(value) && isObject(asRecord(value)['atlassian:project']);

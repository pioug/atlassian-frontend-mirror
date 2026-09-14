import { asRecord } from './as-record';
import { DESIGN_STATUSES, DESIGN_TYPES } from './entity-types';
import type { DesignEntity } from './entity-types';
import { isBaseEntity } from './is-base-entity';
import { isOneOf } from './is-one-of';

export const isDesignEntity = (value: unknown): value is DesignEntity =>
	isBaseEntity(value) &&
	isOneOf(DESIGN_STATUSES, asRecord(value).status) &&
	isOneOf(DESIGN_TYPES, asRecord(value).type);

import type { BaseEntity } from './entity-types';
import { isObject } from './is-object';

export const isBaseEntity = (value: unknown): value is BaseEntity =>
	isObject(value) &&
	typeof value.displayName === 'string' &&
	typeof value.id === 'string' &&
	typeof value.url === 'string';

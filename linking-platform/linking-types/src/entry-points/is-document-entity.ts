import { asRecord } from './as-record';
import { DOCUMENT_CATEGORIES } from './entity-types';
import type { DocumentEntity } from './entity-types';
import { isBaseEntity } from './is-base-entity';
import { isObject } from './is-object';
import { isOneOf } from './is-one-of';

export const isDocumentEntity = (value: unknown): value is DocumentEntity => {
	if (!isBaseEntity(value)) {
		return false;
	}

	const entityType = asRecord(value).type;
	return (
		isObject(entityType) &&
		(entityType.category === undefined || isOneOf(DOCUMENT_CATEGORIES, entityType.category)) &&
		(entityType.iconUrl === undefined || typeof entityType.iconUrl === 'string') &&
		(isOneOf(DOCUMENT_CATEGORIES, entityType.category) || typeof entityType.iconUrl === 'string')
	);
};

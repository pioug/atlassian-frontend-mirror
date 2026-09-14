import { asRecord } from './as-record';
import { REMOTE_LINK_TYPES } from './entity-types';
import type { RemoteLinkEntity } from './entity-types';
import { isBaseEntity } from './is-base-entity';
import { isObject } from './is-object';
import { isOneOf } from './is-one-of';

export const isRemoteLinkEntity = (value: unknown): value is RemoteLinkEntity => {
	if (!isBaseEntity(value)) {
		return false;
	}

	const entity = asRecord(value);
	const remoteLink = entity['atlassian:remote-link'];
	return isObject(remoteLink) && isOneOf(REMOTE_LINK_TYPES, remoteLink.type);
};

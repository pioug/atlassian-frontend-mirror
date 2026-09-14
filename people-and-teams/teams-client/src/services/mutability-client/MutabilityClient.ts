import { DefaultError } from '../../common/utils/error/DefaultError';
import { DEFAULT_CONFIG } from '../constants';
import { RestClient } from '../rest-client';

import { type MutabilityConstraint, type Reason } from './types';

import { NOT_EDITABLE, NOT_EDITABLE_FIELD, NOT_EDITABLE_REASON } from './index';

const defaultConfig = {
	serviceUrl: `${DEFAULT_CONFIG.stargateRoot}/users/manage`,
};

interface Profile {
	[NOT_EDITABLE]: {
		[NOT_EDITABLE_FIELD]: string;
		[NOT_EDITABLE_REASON]: string;
	}[];
}

function mapToMutabilityConstraints(json: Profile): MutabilityConstraint[] {
	let constraints: MutabilityConstraint[] = [];
	if (json[NOT_EDITABLE] != null) {
		for (const value of json[NOT_EDITABLE]) {
			constraints = constraints.concat({
				field: value[NOT_EDITABLE_FIELD],
				reason: determineReason(value[NOT_EDITABLE_REASON]),
			});
		}
	}
	return constraints;
}

function determineReason(value: string): Reason {
	switch (value) {
		case 'managed':
		case 'ext.dir.scim':
		case 'ext.dir.google':
			return value;
		default:
			throw new DefaultError({
				message: `Unknown mutability constraint reason: ${value}`,
			});
	}
}

export class MutabilityClient extends RestClient {
	constructor(config = {}) {
		super({ ...defaultConfig, ...config });
	}

	async getProfileWithMutability(userId: string): Promise<MutabilityConstraint[]> {
		return this.getResource<Profile>(`/${userId}/profile`).then((resp) => {
			return mapToMutabilityConstraints(resp);
		});
	}
}

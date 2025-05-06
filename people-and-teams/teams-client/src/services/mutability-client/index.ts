import { DefaultError } from '../../common/utils/error';
import { DEFAULT_CONFIG } from '../constants';
import { RestClient } from '../rest-client';

import { type MutabilityConstraint, type Reason } from './types';

const defaultConfig = {
	serviceUrl: `${DEFAULT_CONFIG.stargateRoot}/users/manage`,
};

const NOT_EDITABLE = 'not_editable';
const NOT_EDITABLE_FIELD = 'field';
const NOT_EDITABLE_REASON = 'reason';

interface Profile {
	[NOT_EDITABLE]: {
		[NOT_EDITABLE_FIELD]: string;
		[NOT_EDITABLE_REASON]: string;
	}[];
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

// eslint-disable-next-line import/no-anonymous-default-export
export default new MutabilityClient();

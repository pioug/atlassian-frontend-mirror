import { DEFAULT_CONFIG } from '../constants';
import { RestClient } from '../rest-client';

const defaultConfig = {
	serviceUrl: `${DEFAULT_CONFIG.stargateRoot}/user-tenure/v1`,
};

interface UserTenureResponse {
	userHireDate: string;
	employeesHiredBefore: number;
	employeesHiredAfter: number;
}

export class ReplinesClient extends RestClient {
	constructor(config = {}) {
		super({ ...defaultConfig, ...config });
	}

	async getUserTenure(userId: string): Promise<{
		userHireDate: Date;
		employeesHiredBefore: number;
		employeesHiredAfter: number;
	}> {
		const orgId = this.getOrgId();
		return this.getResource<UserTenureResponse>(`/${orgId}/${userId}`)
			.then((response) => ({
				...response,
				userHireDate: new Date(response.userHireDate),
			}))
			.catch((_error) => {
				throw new Error('Failed to fetch user tenure');
			});
	}
}

const _default_1: ReplinesClient = new ReplinesClient();
export default _default_1;

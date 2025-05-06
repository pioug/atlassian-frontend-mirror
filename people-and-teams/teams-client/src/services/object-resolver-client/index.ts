import { DEFAULT_CONFIG } from '../constants';
import { RestClient } from '../rest-client';

import { type IconItemFailure, type IconItemSuccess, type LinkIconData } from './types';
import { transformIconData } from './utils';

const defaultConfig = {
	serviceUrl: `${DEFAULT_CONFIG.stargateRoot}`,
};

export class ObjectResolverClient extends RestClient {
	constructor(config = {}) {
		super({ ...defaultConfig, ...config });
	}

	async getTeamLinkIcons(teamLinkUrls: string[]): Promise<LinkIconData[]> {
		const requestBody = teamLinkUrls.map((url) => ({ resourceUrl: url }));
		return this.postResourceRaw<(IconItemSuccess | IconItemFailure)[]>(
			`/object-resolver/resolve/batch`,
			JSON.stringify(requestBody),
		).then(transformIconData);
	}
}

export default new ObjectResolverClient();

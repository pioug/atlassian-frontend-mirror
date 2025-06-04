import { DEFAULT_CONFIG } from '../constants';
import { RestClient } from '../rest-client';

import {
	GetAriFromUrlResponse,
	type IconItemFailure,
	type IconItemSuccess,
	type LinkIconData,
} from './types';
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

	async getAriFromUrl(url: string): Promise<string | undefined> {
		return this.postResourceRaw<GetAriFromUrlResponse>(
			`/object-resolver/converter/toAri`,
			JSON.stringify({ resourceUrl: url }),
		).then((response) => response?.data?.ari);
	}
}

export default new ObjectResolverClient();

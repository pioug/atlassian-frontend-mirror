import { DEFAULT_CONFIG } from '../constants';
import { RestClient } from '../rest-client';

import type {
	GetAriFromUrlResponse,
	IconItemFailure,
	IconItemSuccess,
	LinkIconData,
	WebLinkTitleItemSuccess,
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

	async getWebLinkTitle(webLinkUrl: string): Promise<string | undefined> {
		try {
			const response = await this.postResourceRaw<WebLinkTitleItemSuccess>(
				'/object-resolver/resolve',
				JSON.stringify({ resourceUrl: webLinkUrl }),
			);

			if (response && 'data' in response) {
				if (response.data?.name) {
					return response.data.name;
				}
			}

			if (
				response &&
				'meta' in response &&
				(response.meta?.visibility === 'restricted' || response.meta?.visibility === 'unauthorized')
			) {
				const auth = response.meta.auth?.[0];
				if (auth?.displayName) {
					return auth.displayName;
				}
			}

			return;
		} catch (error) {
			return;
		}
	}
}

export default new ObjectResolverClient();

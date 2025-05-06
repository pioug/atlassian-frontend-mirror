import { type ReadMediaTokenResponse } from '../../types/media';
import { DEFAULT_CONFIG } from '../constants';
import { RestClient } from '../rest-client';

const buildGetReadTokenURL = (accountId: string) =>
	`/api/user-image/${accountId}/header-image/read`;

export class UserPreferencesClient extends RestClient {
	async getReadMediaToken(accountId: string): Promise<ReadMediaTokenResponse> {
		return this.getResource<ReadMediaTokenResponse>(buildGetReadTokenURL(accountId)).then(
			(response) => response,
		);
	}

	async getWriteMediaToken(): Promise<ReadMediaTokenResponse> {
		return this.getResource<ReadMediaTokenResponse>('/api/user-image/header-image/write').then(
			(response) => response,
		);
	}

	async updateUserHeaderImage(headerImageId: string | null): Promise<any> {
		return await this.putResource('/api/user-image/self/header-image', {
			headerImageId,
		});
	}
}

export default new UserPreferencesClient({
	serviceUrl: DEFAULT_CONFIG.stargateRoot,
});

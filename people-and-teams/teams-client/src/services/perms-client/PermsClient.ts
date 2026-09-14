import { RestClient } from '../rest-client';

interface GetIsSiteAdminResponse {
	permitted: boolean;
}

export class PermsClient extends RestClient {
	getIsSiteAdmin(
		/**
		 * @private
		 * @deprecated don't need to pass param, value is taken from `this.getCloudId()` instead
		 */
		cloudId?: string,
	): Promise<boolean> {
		return this.postResource<GetIsSiteAdminResponse>('/permitted', {
			permissionId: 'manage',
			resourceId: `ari:cloud:platform::site/${this.getCloudId(cloudId)}`,
		}).then((response) => response.permitted);
	}
}

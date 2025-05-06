import { DEFAULT_CONFIG } from '../constants';
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

/**
 * REST Client to make calls to resources on the activity service.
 *
 * @type {RestClient}
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default new PermsClient({
	serviceUrl: DEFAULT_CONFIG.permsServiceUrl,
});

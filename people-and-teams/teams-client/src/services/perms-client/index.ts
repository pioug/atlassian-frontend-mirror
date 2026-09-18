import { DEFAULT_CONFIG } from '../constants';
import { PermsClient } from './PermsClient';

/**
 * REST Client to make calls to resources on the activity service.
 *
 * @type {RestClient}
 */
// eslint-disable-next-line import/no-anonymous-default-export
const _default_1: PermsClient = new PermsClient({
	serviceUrl: DEFAULT_CONFIG.permsServiceUrl,
});

export default _default_1;

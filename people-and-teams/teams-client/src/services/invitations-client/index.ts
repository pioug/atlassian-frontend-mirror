import { DEFAULT_CONFIG } from '../constants';
import { logException } from '../sentry/logException';

import { InvitationsClient } from './InvitationsClient';

export const PRODUCT_RECCOMENDATIONS: any = '/v1/product-recommendations';

export const PRODUCT_JOIN_OR_REQUEST_BULK: any = '/v1/access-requests/bulk/request';

// eslint-disable-next-line import/no-anonymous-default-export
const _default_1: InvitationsClient = new InvitationsClient(DEFAULT_CONFIG.invitationsServiceUrl, {
	logException,
});

export default _default_1;

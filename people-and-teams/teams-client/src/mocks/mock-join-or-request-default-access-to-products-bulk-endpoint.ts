import { type AccessRequestBulk } from '../services/invitations-client/types';

import { mockJoinOrRequestDefaultAccessToProductsBulkRegex } from './endpoint-regexes';
import { getJoinOrRequestDefaultAccessToProductsBulkSuccessResponse } from './invitations';
import type { MockConfig } from './mock-config-2';

export const mockJoinOrRequestDefaultAccessToProductsBulkEndpoint: any = ({
	fetchMock,
	delay,
}: MockConfig) => {
	fetchMock.post(
		mockJoinOrRequestDefaultAccessToProductsBulkRegex,
		(_: string, options: { body: string }) => {
			const request: AccessRequestBulk = JSON.parse(options.body);
			const aris = request.resources.map((resource) => resource.ari);
			return getJoinOrRequestDefaultAccessToProductsBulkSuccessResponse(aris);
		},
		{ method: 'POST', overwriteRoutes: true, delay },
	);
};

import type { InvokeRequest } from '@atlaskit/linking-types/smart-link-actions';
import { type StatusUpdateActionPayload } from '@atlaskit/linking-types/smart-link-actions';

const createStatusUpdateRequest = (
	request: InvokeRequest,
	id: string,
): InvokeRequest<StatusUpdateActionPayload> => ({
	providerKey: request.providerKey,
	action: {
		...request.action,
		payload: { newStatusId: id },
	},
});

export default createStatusUpdateRequest;

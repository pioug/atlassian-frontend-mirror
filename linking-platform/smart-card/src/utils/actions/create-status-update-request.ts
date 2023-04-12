import type { InvokeRequest } from '@atlaskit/linking-types/smart-link-actions';
import { StatusUpdateActionPayload } from '@atlaskit/linking-types/smart-link-actions';

const createStatusUpdateRequest = (
  request: InvokeRequest,
  id: string,
): InvokeRequest<StatusUpdateActionPayload> => ({
  ...request,
  action: {
    ...request.action,
    payload: { newStatusId: id },
  },
});

export default createStatusUpdateRequest;

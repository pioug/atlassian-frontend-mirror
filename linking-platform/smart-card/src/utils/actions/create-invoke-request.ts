import type { InvokeRequest } from '@atlaskit/linking-types/smart-link-actions';

const createInvokeRequest = <TPayload extends object>(
  request: InvokeRequest,
  payload?: TPayload,
): InvokeRequest<TPayload> => ({
  action: {
    ...request.action,
    payload,
  },
  providerKey: request.providerKey,
});

export default createInvokeRequest;

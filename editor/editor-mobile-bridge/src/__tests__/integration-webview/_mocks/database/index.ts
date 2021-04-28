import uuidV4 from 'uuid/v4';
import { ClientBasedAuth } from '@atlaskit/media-core';
import { defaultBaseUrl } from '../utils';
export const tenantAuth: ClientBasedAuth = {
  clientId: uuidV4(),
  token: 'some-tenant-token',
  baseUrl: defaultBaseUrl,
};

export const tenantAuthProvider = () => Promise.resolve(tenantAuth);

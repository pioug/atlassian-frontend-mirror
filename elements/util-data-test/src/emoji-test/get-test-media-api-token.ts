import { mediaBaseUrl } from '../emoji-constants';
import { expiresAt } from './expires-at';

export const getTestMediaApiToken = () => ({
  url: mediaBaseUrl,
  clientId: '1234',
  jwt: 'abcd',
  collectionName: 'emoji-collection',
  expiresAt: expiresAt(60), // seconds since Epoch UTC
});

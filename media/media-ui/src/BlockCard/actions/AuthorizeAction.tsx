import { ButtonAppearances } from '@atlaskit/button';

import { ActionProps } from '../components/Action';

export const AuthorizeAction = (handler: () => void): ActionProps => ({
  id: 'connect-account',
  text: 'Connect',
  promise: () => new Promise(resolve => resolve(handler())),
  buttonAppearance: 'primary' as ButtonAppearances,
});

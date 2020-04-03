import { ButtonAppearances } from '@atlaskit/button';

import { ActionProps } from '../components/Action';

export const ForbiddenAction = (handler: () => void): ActionProps => ({
  id: 'connect-other-account',
  text: 'Try another account',
  promise: () => new Promise(resolve => resolve(handler())),
  buttonAppearance: 'primary' as ButtonAppearances,
});

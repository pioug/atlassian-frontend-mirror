import React from 'react';

import SignInIcon from '@atlaskit/icon/glyph/sign-in';

import { IconButton } from '../IconButton';

import { type SignInProps } from './types';

/**
 * __Sign in__
 *
 * A sign-in button that can be passed into `AtlassianNavigation`'s `renderSignIn` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#sign-in)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const SignIn = (props: SignInProps) => {
  const { tooltip, ...iconButtonProps } = props;
  return (
    <div role="listitem">
      <IconButton
        icon={
          <SignInIcon
            label={typeof tooltip === 'string' ? tooltip : 'Sign-in Icon'}
          />
        }
        tooltip={tooltip}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...iconButtonProps}
      />
    </div>
  );
};

export default SignIn;

/** @jsx jsx */
import { jsx } from '@emotion/react';

import { ProviderProps } from '@atlaskit/smart-card';
import React from 'react';
import CardView from './utils/card-view';
import { embedWrapperStyles } from './utils/common';
import {
  UnAuthClient,
  UnAuthClientWithNoAuthFlow,
  UnAuthClientWithProviderImage,
} from './utils/custom-client';

const render = (client: ProviderProps['client'], title: string) => (
  <React.Fragment>
    <h4>{title}</h4>
    <CardView appearance="embed" client={client} />
  </React.Fragment>
);

export default () => (
  <div css={embedWrapperStyles}>
    {render(new UnAuthClient(), 'Unauthorised view')}
    {render(
      new UnAuthClientWithNoAuthFlow(),
      'Unauthorised view with no auth flow',
    )}
    {render(
      new UnAuthClientWithProviderImage(),
      'Unauthorised view with provider image',
    )}
  </div>
);

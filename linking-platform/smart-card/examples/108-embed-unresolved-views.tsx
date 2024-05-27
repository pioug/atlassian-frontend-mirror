/** @jsx jsx */
import { type ProviderProps } from '@atlaskit/link-provider';
import { jsx } from '@emotion/react';
import React from 'react';
import CardView from './utils/card-view';
import { embedWrapperStyles } from './utils/common';
import {
  ForbiddenClient,
  ForbiddenWithObjectRequestAccessClient,
  ForbiddenWithSiteDeniedRequestClient,
  ForbiddenWithSiteDirectAccessClient,
  ForbiddenWithSiteForbiddenClient,
  ForbiddenWithSitePendingRequestClient,
  ForbiddenWithSiteRequestAccessClient,
  NotFoundClient,
  NotFoundWithSiteAccessExistsClient,
  UnAuthClient,
  UnAuthClientWithNoAuthFlow,
  UnAuthClientWithProviderImage,
} from './utils/custom-client';

const render = (
  client: ProviderProps['client'],
  title: string,
  description?: string,
) => (
  <React.Fragment>
    <h4>{title}</h4>
    {description ? (
      <p>
        <b>Context:</b> {description}
      </p>
    ) : undefined}
    <CardView
      appearance="embed"
      client={client}
      url="https://site.atlassian.net/browse/key-1"
    />
  </React.Fragment>
);

// Cross-Join: https://product-fabric.atlassian.net/wiki/spaces/EM/pages/3726016731
export default () => {
  return (
    <div css={embedWrapperStyles}>
      {render(new ForbiddenClient(), '[Forbidden] Default')}
      {render(
        new ForbiddenWithSiteRequestAccessClient(),
        '[Forbidden] Site - Request Access',
        "I don't have access to the site, but I can request access",
      )}
      {render(
        new ForbiddenWithSitePendingRequestClient(),
        '[Forbidden] Site - Pending Request',
        "I don't have access to the site, but I’ve already requested access and I’m waiting",
      )}
      {render(
        new ForbiddenWithSiteDeniedRequestClient(),
        '[Forbidden] Site - Denied Request',
        "I don't have access to the site, and my previous request was denied",
      )}
      {render(
        new ForbiddenWithSiteDirectAccessClient(),
        '[Forbidden] Site - Direct Access',
        "I don't have access to the site, but I can join directly",
      )}
      {render(
        new ForbiddenWithObjectRequestAccessClient(),
        '[Forbidden] Object - Request Access',
        'I have access to the site, but not the object',
      )}
      {render(
        new ForbiddenWithSiteForbiddenClient(),
        '[Forbidden] Forbidden',
        "When you don't have access to the site, and you can’t request access",
      )}
      {render(new NotFoundClient(), '[Not Found] Default')}
      {render(
        new NotFoundWithSiteAccessExistsClient(),
        '[Not Found] Access Exists',
        'I have access to the site, but not the object or object is not-found',
      )}
      {render(new UnAuthClient(), '[Unauthorized] Default')}
      {render(new UnAuthClientWithNoAuthFlow(), '[Unauthorized] No auth flow')}
      {render(
        new UnAuthClientWithProviderImage(),
        '[Unauthorized] With provider image',
      )}
    </div>
  );
};

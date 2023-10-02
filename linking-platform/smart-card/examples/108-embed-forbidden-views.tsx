/** @jsx jsx */
import { ProviderProps } from '@atlaskit/link-provider';
import { jsx } from '@emotion/react';
import React from 'react';
import CardView from './utils/card-view';
import { embedWrapperStyles } from './utils/common';
import {
  ForbiddenClient,
  ForbiddenWithImageClient,
  ForbiddenWithObjectRequestAccessClient,
  ForbiddenWithSiteDeniedRequestClient,
  ForbiddenWithSiteDirectAccessClient,
  ForbiddenWithSitePendingRequestClient,
  ForbiddenWithSiteRequestAccessClient,
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
      {render(new ForbiddenClient(), 'Forbidden')}
      {render(
        new ForbiddenWithSiteRequestAccessClient(),
        'Site - Request Access',
        "I don't have access to the site, but I can request access",
      )}
      {render(
        new ForbiddenWithSitePendingRequestClient(),
        'Site - Pending Request',
        "I don't have access to the site, but I’ve already requested access and I’m waiting",
      )}
      {render(
        new ForbiddenWithSiteDeniedRequestClient(),
        'Site - Denied Request',
        "I don't have access to the site, and my previous request was denied",
      )}
      {render(
        new ForbiddenWithSiteDirectAccessClient(),
        'Site - Direct Access',
        "I don't have access to the site, but I can join directly",
      )}
      {render(
        new ForbiddenWithObjectRequestAccessClient(),
        '[Forbidden] Object - Request Access',
        'I have access to the site, but not the object (might be Confluence-specific)',
      )}
      {render(
        new ForbiddenWithImageClient(),
        '[Forbidden] Forbidden',
        "When you don't have access to the site, and you can’t request access",
      )}
    </div>
  );
};

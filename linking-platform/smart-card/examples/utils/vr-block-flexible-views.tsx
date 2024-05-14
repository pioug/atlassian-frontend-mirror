import React from 'react';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { Card } from '../../src';
import type { CardAppearance } from '@atlaskit/linking-common';
import {
  ErroredClient,
  ForbiddenClient,
  NotFoundClient,
  UnAuthClient,
} from './custom-client';

export const renderCard = (client: CardClient, appearance: CardAppearance) => (
  <SmartCardProvider
    client={client}
    featureFlags={{ enableFlexibleBlockCard: true }}
  >
    <Card url="https://some.url" appearance={appearance} />
  </SmartCardProvider>
);

/**
 * Unresolved view used with deprecated vr tests (puppeteer)
 * @deprecated
 */
const UnresolvedViewTest: React.FC<{ appearance: CardAppearance }> = ({
  appearance,
}) => {
  return (
    <React.Fragment>
      <h4>Error</h4>
      {renderCard(new ErroredClient(), appearance)}

      <h4>Forbidden</h4>
      {renderCard(new ForbiddenClient(), appearance)}

      <h4>Not found</h4>
      {renderCard(new NotFoundClient(), appearance)}

      <h4>Unauthorised</h4>
      {renderCard(new UnAuthClient(), appearance)}
    </React.Fragment>
  );
};

export default UnresolvedViewTest;

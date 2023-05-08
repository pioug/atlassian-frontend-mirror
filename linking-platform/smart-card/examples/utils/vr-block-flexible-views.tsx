import React from 'react';
import { JsonLd } from 'json-ld-types';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { Card } from '../../src';
import { mocks } from './common';
import type { CardAppearance } from '@atlaskit/linking-common';

class ErroredClient extends CardClient {
  fetchData(url: string): Promise<JsonLd.Response> {
    return Promise.reject(`Can't resolve from ${url}`);
  }
}

class ForbiddenClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mocks.forbidden);
  }
}

class NotFoundClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mocks.notFound);
  }
}

class UnAuthClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mocks.unauthorized);
  }
}

export const renderCard = (client: CardClient, appearance: CardAppearance) => (
  <SmartCardProvider
    client={client}
    featureFlags={{ enableFlexibleBlockCard: true }}
  >
    <Card
      url="https://some.url"
      appearance={appearance}
      showServerActions={true}
    />
  </SmartCardProvider>
);

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

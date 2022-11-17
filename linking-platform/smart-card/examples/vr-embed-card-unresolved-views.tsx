import React from 'react';
import { JsonLd } from 'json-ld-types';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';

import { VRTestWrapper } from './utils/vr-test';
import UnresolvedViewTest from './utils/vr-unresolved-views';
import { mocks } from './utils/common';
import { Card } from '../src';
import { iconGoogleDrive } from './images';

class UnAuthClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    const response = {
      ...mocks.unauthorized,
      data: {
        ...mocks.unauthorized.data,
        generator: {
          ...((mocks.unauthorized.data as JsonLd.Data.BaseData)
            .generator as JsonLd.Primitives.Object),
          image: {
            '@type': 'Image',
            url: iconGoogleDrive,
          },
        },
      },
    };
    return Promise.resolve(response as JsonLd.Response);
  }
}

export default () => (
  <VRTestWrapper title="Embed card unresolved views">
    <UnresolvedViewTest appearance="embed" />
    <h4>Unauthorised with provider image</h4>
    <SmartCardProvider client={new UnAuthClient()}>
      <Card url="https://some.url" appearance="embed" />
    </SmartCardProvider>
  </VRTestWrapper>
);

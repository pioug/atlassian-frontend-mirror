import React from 'react';
import { Component } from 'react';
import {
  createStorybookMediaClientConfig,
  atlassianLogoUrl,
  imageFileId,
} from '@atlaskit/media-test-helpers';
import { ExternalImageIdentifier } from '@atlaskit/media-client';
import { Card } from '../src';
import { ExternalIdentifierWrapper } from '../example-helpers/styled';
import { MainWrapper } from '../example-helpers';

const mediaClientConfig = createStorybookMediaClientConfig();
const externalIdentifierWithName: ExternalImageIdentifier = {
  mediaItemType: 'external-image',
  dataURI: atlassianLogoUrl,
  name: 'me',
};
const externalIdentifier: ExternalImageIdentifier = {
  mediaItemType: 'external-image',
  dataURI: atlassianLogoUrl,
};
const brokenIdentifierWithName: ExternalImageIdentifier = {
  mediaItemType: 'external-image',
  dataURI: 'https://something.com/this-is-a-broken-uri',
};

class Example extends Component {
  render() {
    return (
      <MainWrapper>
        <ExternalIdentifierWrapper>
          <div>
            <h2>External image identifier</h2>
            <Card
              mediaClientConfig={mediaClientConfig}
              identifier={externalIdentifier}
            />
          </div>
          <div>
            <h2>External image identifier with name</h2>
            <Card
              mediaClientConfig={mediaClientConfig}
              identifier={externalIdentifierWithName}
            />
          </div>
          <div>
            <h2>File identifier</h2>
            <Card
              mediaClientConfig={mediaClientConfig}
              identifier={imageFileId}
            />
          </div>
          <div>
            <h2>Broken File identifier</h2>
            <Card
              mediaClientConfig={mediaClientConfig}
              identifier={brokenIdentifierWithName}
            />
          </div>
        </ExternalIdentifierWrapper>
      </MainWrapper>
    );
  }
}

export default () => <Example />;

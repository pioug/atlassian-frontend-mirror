import React from 'react';
import {
  Matrix,
  createStorybookMediaClientConfig,
  videoFileId,
  audioFileId,
  imageFileId,
  docFileId,
  unknownFileId,
} from '@atlaskit/media-test-helpers';
import { MainWrapper } from '../example-helpers';

import { Card } from '../src';

const mediaClientConfig = createStorybookMediaClientConfig();
// file cards
const videoFileCard = (
  <Card mediaClientConfig={mediaClientConfig} identifier={videoFileId} />
);
const imageFileCard = (
  <Card mediaClientConfig={mediaClientConfig} identifier={imageFileId} />
);
const audioFileCard = (
  <Card mediaClientConfig={mediaClientConfig} identifier={audioFileId} />
);
const docFileCard = (
  <Card mediaClientConfig={mediaClientConfig} identifier={docFileId} />
);
const unknownFileCard = (
  <Card mediaClientConfig={mediaClientConfig} identifier={unknownFileId} />
);

export default () => (
  <MainWrapper>
    <div style={{ margin: '40px' }}>
      <h1>Media type matrix</h1>
      <Matrix>
        <thead>
          <tr>
            <td />
            <td>File Cards</td>
            <td>Link Cards</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>video</td>
            <td>
              <div>{videoFileCard}</div>
            </td>
          </tr>
          <tr>
            <td>image</td>
            <td>
              <div>{imageFileCard}</div>
            </td>
          </tr>
          <tr>
            <td>audio</td>
            <td>
              <div>{audioFileCard}</div>
            </td>
          </tr>
          <tr>
            <td>doc</td>
            <td>
              <div>{docFileCard}</div>
            </td>
          </tr>
          <tr>
            <td>unknown</td>
            <td>
              <div>{unknownFileCard}</div>
            </td>
          </tr>
        </tbody>
      </Matrix>
    </div>
  </MainWrapper>
);

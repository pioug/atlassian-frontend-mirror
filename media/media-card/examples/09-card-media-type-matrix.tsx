import React from 'react';
import { Matrix } from '@atlaskit/media-test-helpers';
import { token } from '@atlaskit/tokens';
import { MainWrapper } from '../example-helpers';
import {
  videoFileCard,
  imageFileCard,
  audioFileCard,
  docFileCard,
  unknownFileCard,
} from '../example-helpers/cards';

export default () => (
  <MainWrapper>
    <div style={{ margin: token('space.500', '40px') }}>
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

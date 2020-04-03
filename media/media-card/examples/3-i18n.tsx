import React from 'react';
import {
  I18NWrapper,
  errorFileId,
  createStorybookMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import { Card } from '../src';

const mediaClientConfig = createStorybookMediaClientConfig();

export default () => (
  <I18NWrapper>
    <Card mediaClientConfig={mediaClientConfig} identifier={errorFileId} />
  </I18NWrapper>
);

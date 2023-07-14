import React from 'react';

import BitbucketPipelinesIcon from '@atlaskit/icon/glyph/bitbucket/pipelines';

import { GoBackItem } from '../src';

const Example = () => (
  <>
    <GoBackItem>Back to project</GoBackItem>
    <GoBackItem isSelected>Back to project</GoBackItem>
    <GoBackItem isDisabled>Back to project</GoBackItem>
    <GoBackItem iconBefore={<BitbucketPipelinesIcon label="" />}>
      Back to the future
    </GoBackItem>
    <GoBackItem description="My project name">Back to project</GoBackItem>
  </>
);

export default Example;

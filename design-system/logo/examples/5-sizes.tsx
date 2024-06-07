import React from 'react';

import { Code } from '@atlaskit/code';

import { ConfluenceIcon, ConfluenceLogo } from '../src';

export default () => (
  <div data-testid="sizes">
    <div>
      <Code>xsmall</Code>
    </div>
    <div>
      <ConfluenceIcon size="xsmall" />
      <ConfluenceLogo size="xsmall" />
    </div>
    <div>
      <Code>small</Code>
    </div>
    <div>
      <ConfluenceIcon size="small" />
      <ConfluenceLogo size="small" />
    </div>
    <div>
      <Code>medium</Code>
    </div>
    <div>
      <ConfluenceIcon size="medium" />
      <ConfluenceLogo size="medium" />
    </div>
    <div>
      <Code>large</Code>
    </div>
    <div>
      <ConfluenceIcon size="large" />
      <ConfluenceLogo size="large" />
    </div>
    <div>
      <Code>xlarge</Code>
    </div>
    <div>
      <ConfluenceIcon size="xlarge" />
      <ConfluenceLogo size="xlarge" />
    </div>
  </div>
);

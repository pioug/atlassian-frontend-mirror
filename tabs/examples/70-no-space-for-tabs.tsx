import React from 'react';
import { colors } from '@atlaskit/theme';
import Tabs from '../src';
import { Content } from './shared';

export default () => (
  <div
    style={{
      width: 400,
      height: 200,
      margin: '16px auto',
      border: `1px dashed ${colors.N100}`,
      display: 'flex',
    }}
  >
    <Tabs
      tabs={[
        {
          label: 'Here is an incredibly super long label, too long really',
          defaultSelected: true,
          content: <Content>Content is here</Content>,
        },
        {
          label: 'here, a short label',
          defaultSelected: true,
          content: <Content>Content is here</Content>,
        },
      ]}
    />
  </div>
);

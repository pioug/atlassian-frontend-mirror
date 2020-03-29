import React from 'react';
import Spinner from '@atlaskit/spinner';
import { colors } from '@atlaskit/theme';
import Tabs from '../src';

export default () => (
  <div
    style={{
      height: 200,
      margin: '16px auto',
      border: `1px dashed ${colors.N100}`,
      display: 'flex',
    }}
  >
    <Tabs
      tabs={[
        {
          label: 'Spinner should be centered',
          content: (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flex: '1 0 auto',
                justifyContent: 'center',
              }}
            >
              <Spinner size="medium" />
            </div>
          ),
        },
      ]}
    />
  </div>
);

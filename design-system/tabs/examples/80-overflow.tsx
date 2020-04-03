import React from 'react';
import Lorem from 'react-lorem-component';
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
          label: 'Constrained height scrolls',
          defaultSelected: true,
          content: (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flexBasis: '100%',
                overflowY: 'scroll',
              }}
            >
              <p
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: '0 0 auto',
                }}
              >
                This paragraph is testing horizontal overflow to make sure that
                the scroll container stays where it should be.
              </p>
              <Lorem count={5} />
            </div>
          ),
        },
        {
          label: 'Unconstrained height',
          content: (
            <div>
              <Lorem count={5} />
            </div>
          ),
        },
      ]}
    />
  </div>
);

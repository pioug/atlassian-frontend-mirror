import React from 'react';
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
    <style>
      {`
        .lobby-tab-content {
          display: flex;
          flex-direction: column;
          flex-basis: 100%;
          max-width: 100%;
        }

        .lobby-title {
          color: @ak-color-N100;
          font-size: 12px;
          font-weight: 500;
          padding: (@ak-grid-size * 1.5) (@ak-grid-size * 2) (@ak-grid-size * 1.5) 0;
          text-transform: uppercase;
        }

        .lobby-panel {
          border: none;
          display: flex;
          flex: 1 1 auto;
          overflow-x: hidden;
          position: relative;
        }
        `}
    </style>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        overflowX: 'auto',
      }}
    >
      <div>SEARCH GOES HERE</div>
      <Tabs
        tabs={[
          {
            label: 'HipChat example',
            content: (
              <div className="lobby-tab-content">
                <div className="lobby-title">Title goes here</div>
                <div
                  className="lobby-panel"
                  style={{ backgroundColor: 'yellow' }}
                >
                  <div
                    style={{
                      backgroundColor: 'lightblue',
                      flexGrow: 1,
                      overflowY: 'scroll',
                    }}
                  >
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                    <p>hi</p>
                  </div>
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  </div>
);

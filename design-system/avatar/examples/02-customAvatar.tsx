// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React, { type CSSProperties } from 'react';

import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { Block } from '../examples-util/helpers';
import Avatar from '../src';

const customStyles: CSSProperties = {
  textAlign: 'center',
  fontWeight: 600,
  color: token('color.text.inverse'),
  backgroundColor: token('color.background.brand.bold'),
};

export default () => (
  <div>
    <Block heading="Circle">
      <Tooltip content="Mike Cannon-Brookes">
        <Avatar name="Mike Cannon-Brookes" size="large">
          {(props) => (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
            <span {...props} style={customStyles}>
              MCB
            </span>
          )}
        </Avatar>
      </Tooltip>
      <Tooltip content="Scott Farquhar">
        <Avatar name="Scott Farquhar" size="large">
          {(props) => (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
            <span {...props} style={customStyles}>
              SF
            </span>
          )}
        </Avatar>
      </Tooltip>
      <Tooltip content="Daniel Del Core">
        <Avatar name="Daniel Del Core" size="large">
          {({ children, ...props }) => (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
            <span {...props} style={customStyles}>
              DDC
            </span>
          )}
        </Avatar>
      </Tooltip>
    </Block>
  </div>
);

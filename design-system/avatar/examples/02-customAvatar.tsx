import React, { CSSProperties } from 'react';

import { primary } from '@atlaskit/theme/colors';
import Tooltip from '@atlaskit/tooltip';

import { Block } from '../examples-util/helpers';
import Avatar from '../src';

const customStyles: CSSProperties = {
  textAlign: 'center',
  fontWeight: 600,
  color: 'white',
  backgroundColor: primary(),
};

export default () => (
  <div>
    <Block heading="Circle">
      <Tooltip content="Mike Cannon-Brookes">
        <Avatar name="Mike Cannon-Brookes" size="large">
          {props => (
            <span {...props} style={customStyles}>
              MCB
            </span>
          )}
        </Avatar>
      </Tooltip>
      <Tooltip content="Scott Farquhar">
        <Avatar name="Scott Farquhar" size="large">
          {props => (
            <span {...props} style={customStyles}>
              SF
            </span>
          )}
        </Avatar>
      </Tooltip>
      <Tooltip content="Daniel Del Core">
        <Avatar name="Daniel Del Core" size="large">
          {({ children, ...props }) => (
            <span {...props} style={customStyles}>
              DDC
            </span>
          )}
        </Avatar>
      </Tooltip>
    </Block>
  </div>
);

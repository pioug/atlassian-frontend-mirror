import React from 'react';

import { Block } from '../examples-util/helpers';
import Avatar from '../src';

export default () => (
  <div>
    <Block heading="Circle">
      <Avatar
        name="xxlarge"
        size="xxlarge"
        testId="myAvatar"
        onClick={() => alert('Avatar has been clicked!')}
      />
    </Block>
  </div>
);

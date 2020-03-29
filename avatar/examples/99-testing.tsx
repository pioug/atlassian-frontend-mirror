import React from 'react';
import Avatar from '../src';
import { Block } from '../examples-util/helpers';

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

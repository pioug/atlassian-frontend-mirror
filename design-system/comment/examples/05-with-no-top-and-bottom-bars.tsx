import React from 'react';

import Avatar from '@atlaskit/avatar';
import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';

import Comment from '../src';

import avatarImg from './utils/sample-avatar';

export default () => (
  <Comment
    avatar={<Avatar src={avatarImg} />}
    content={
      <Text>
        Cookie macaroon liquorice. Marshmallow donut lemon drops candy canes
        marshmallow topping chocolate cake. Croissant pastry soufflé waffle cake
        fruitcake. Brownie oat cake sugar plum.
      </Text>
    }
  />
);

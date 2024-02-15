import React from 'react';

import Avatar from '@atlaskit/avatar';
import { Text } from '@atlaskit/primitives';

import Comment from '../src';

import avatarImg from './images/avatar_400x400.jpg';

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

import React from 'react';

import Avatar from '@atlaskit/avatar';

import Comment from '../src';

import avatarImg from './utils/sample-avatar.png';

const getSampleText = () =>
  `Cookie macaroon liquorice. Marshmallow donut lemon drops candy canes marshmallow topping chocolate cake. Croissant pastry soufflé waffle cake fruitcake. Brownie oat cake sugar plum.`;

export default () => (
  <Comment
    avatar={<Avatar src={avatarImg} />}
    content={<p>{getSampleText()}</p>}
  />
);

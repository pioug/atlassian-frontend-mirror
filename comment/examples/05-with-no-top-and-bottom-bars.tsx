import React from 'react';
import Avatar from '@atlaskit/avatar';
import avatarImg from './utils/sample-avatar.png';
import Comment from '../src';

const getSampleText = () =>
  `Cookie macaroon liquorice. Marshmallow donut lemon drops candy canes marshmallow topping chocolate cake. Croissant pastry soufflé waffle cake fruitcake. Brownie oat cake sugar plum.`;

export default () => (
  <Comment
    avatar={<Avatar src={avatarImg} label="Atlaskit avatar" />}
    content={<p>{getSampleText()}</p>}
  />
);

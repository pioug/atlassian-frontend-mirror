import React from 'react';

import Avatar from '@atlaskit/avatar';

import Comment from '../src';

import avatarImg from './utils/sample-avatar.png';

export default () => (
  <Comment avatar={<Avatar src={avatarImg} size="medium" />} />
);

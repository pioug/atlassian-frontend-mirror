import React from 'react';

import Comment, { CommentAuthor } from '../src';

import avatarImg from './utils/sample-avatar.png';

const getNonSpacedSampleText = () =>
  'Cookiemacaroonliquorice.Marshmallowdonutlemondropscandycanesmarshmallowtoppingchocolatecake.Croissantpastrysouffléwafflecakefruitcake.Brownieoatcakesugarplum.';

export default () => (
  <div style={{ width: 500 }}>
    <Comment
      author={<CommentAuthor>John Smith</CommentAuthor>}
      avatar={<img src={avatarImg} alt="img avatar" height="40" width="40" />}
      content={<p>{getNonSpacedSampleText()}</p>}
    />
  </div>
);

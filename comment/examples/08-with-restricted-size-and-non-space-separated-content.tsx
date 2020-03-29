import React from 'react';
import avatarImg from './utils/sample-avatar.png';
import Comment, { CommentAuthor } from '../src';

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

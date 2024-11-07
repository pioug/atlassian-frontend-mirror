import React from 'react';

import Comment, { CommentAuthor } from '@atlaskit/comment';

import avatarImg from './images/avatar_400x400.jpg';

const getNonSpacedSampleText = () =>
	'Cookiemacaroonliquorice.Marshmallowdonutlemondropscandycanesmarshmallowtoppingchocolatecake.Croissantpastrysouffléwafflecakefruitcake.Brownieoatcakesugarplum.';

export default () => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	<div style={{ width: 500 }}>
		<Comment
			author={<CommentAuthor>John Smith</CommentAuthor>}
			avatar={<img src={avatarImg} alt="" height="40" width="40" />}
			content={<p>{getNonSpacedSampleText()}</p>}
		/>
	</div>
);

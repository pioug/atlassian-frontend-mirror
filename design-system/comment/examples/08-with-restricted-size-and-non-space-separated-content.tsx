import React from 'react';

import Comment, { CommentAuthor } from '@atlaskit/comment';

import avatarImg from './images/avatar_400x400.jpg';

const getNonSpacedSampleText = () =>
	'Cookiemacaroonliquorice.Marshmallowdonutlemondropscandycanesmarshmallowtoppingchocolatecake.Croissantpastrysouffléwafflecakefruitcake.Brownieoatcakesugarplum.';

export default (): React.JSX.Element => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	<div style={{ width: 500 }}>
		<Comment
			author={<CommentAuthor>John Smith</CommentAuthor>}
			avatar={<img src={avatarImg} alt="" height="40" width="40" />}
			content={<p>{getNonSpacedSampleText()}</p>}
		/>
		<Comment
			author={<CommentAuthor>Bruce Doe</CommentAuthor>}
			avatar={<img src={avatarImg} alt="" height="40" width="40" />}
			content={
				<>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique nam, labore,
						nesciunt voluptates voluptas aliquam suscipit quaerat autem facere commodi impedit! Hic,
						labore neque ea perspiciatis aliquam voluptas repellat laboriosam!
					</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique nam, labore,
						nesciunt voluptates voluptas aliquam suscipit quaerat autem facere commodi impedit! Hic,
						labore neque ea perspiciatis aliquam voluptas repellat laboriosam!
					</p>
				</>
			}
		/>
	</div>
);

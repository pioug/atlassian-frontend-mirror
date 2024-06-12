import React from 'react';

import Avatar from '@atlaskit/avatar';

import Comment from '../../src';
import sampleAvatar from '../images/avatar_400x400.jpg';

const CommentDefaultExample = () => {
	return (
		<Comment
			avatar={<Avatar name="Scott Farquhar" src={sampleAvatar} />}
			content={<p>Our mission is to unleash the potential of every team.</p>}
		/>
	);
};

export default CommentDefaultExample;

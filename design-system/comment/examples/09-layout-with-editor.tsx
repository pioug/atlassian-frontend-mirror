import React from 'react';

import Avatar from '@atlaskit/avatar';
import { CommentLayout } from '@atlaskit/comment';
import { Editor } from '@atlaskit/editor-core';

import avatarImg from './images/avatar_400x400.jpg';

export default () => (
	<CommentLayout
		avatar={<Avatar src={avatarImg} size="medium" />}
		content={<Editor appearance="comment" />}
	/>
);

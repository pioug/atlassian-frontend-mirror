import React, { useState } from 'react';

import Avatar from '@atlaskit/avatar';
import { Checkbox } from '@atlaskit/checkbox';
import Comment, { CommentAction, CommentAuthor, CommentTime } from '@atlaskit/comment';
import { Box } from '@atlaskit/primitives/compiled';

import sampleAvatar from '../images/avatar_400x400.jpg';

const CommentDefaultExample = (): React.JSX.Element => {
	const [saving, setSaving] = useState(true);

	return (
		<>
			<Box>
				<Checkbox
					label="Enable saving mode"
					isChecked={saving}
					onChange={(e) => setSaving(e.currentTarget.checked)}
				/>
			</Box>
			<Comment
				isSaving={saving}
				savingText="Saving..."
				avatar={<Avatar name="Scott Farquhar" src={sampleAvatar} />}
				author={<CommentAuthor>Scott Farquhar</CommentAuthor>}
				time={<CommentTime>Mar 14, 2024</CommentTime>}
				content={
					<p>
						Building “soft skills,” like effective communication and collaboration, are vital to a
						team’s success.
					</p>
				}
				actions={[
					<CommentAction>Reply</CommentAction>,
					<CommentAction>Edit</CommentAction>,
					<CommentAction>Like</CommentAction>,
				]}
			/>
		</>
	);
};

export default CommentDefaultExample;

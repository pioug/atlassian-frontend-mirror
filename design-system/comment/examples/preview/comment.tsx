import React from 'react';

import { IntlProvider } from 'react-intl';

import Avatar from '@atlaskit/avatar/avatar';
import { CommentAction } from '@atlaskit/comment/action-item';
import { CommentAuthor } from '@atlaskit/comment/author';
import Comment from '@atlaskit/comment/comment';
import { CommentTime } from '@atlaskit/comment/time';
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '300px',
		display: 'block',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<Comment
					avatar={<Avatar name="Alex Morgan" size="medium" />}
					author={<CommentAuthor>Alex Morgan</CommentAuthor>}
					time={<CommentTime>2 hours ago</CommentTime>}
					content={<p>Ready for the design review.</p>}
					actions={[<CommentAction key="reply">Reply</CommentAction>]}
				/>
			</Box>
		</IntlProvider>
	);
}

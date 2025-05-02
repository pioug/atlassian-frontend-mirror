import React, { type FC } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { CommentProps } from '../types';

import Footer from './footer';
import Header from './header';
import CommentLayout from './layout';

const textStyles = cssMap({
	root: {
		color: token('color.text'),
	},
	disabled: {
		color: token('color.text.disabled'),
	},
});

/**
 * __Comment__
 *
 * Comments enable discussions on an entity such as a page, blog post, issue or pull request.
 */
const Comment: FC<CommentProps> = ({
	actions = [],
	restrictedTo = '',
	highlighted = false,
	isSaving = false,
	savingText = 'Sending...',
	isError = false,
	errorActions = [],
	errorIconLabel = '',
	author,
	avatar,
	children,
	content,
	edited,
	time,
	type,
	testId,
	id,
	afterContent,
	shouldRenderNestedCommentsInline,
	headingLevel = '3',
	shouldHeaderWrap,
}) => {
	const headerProps = {
		author,
		edited,
		isError,
		isSaving,
		restrictedTo,
		savingText,
		time,
		type,
		headingLevel,
		shouldHeaderWrap,
	};
	const footerProps = {
		actions,
		errorActions,
		errorIconLabel,
		isError,
		isSaving,
	};

	return (
		<CommentLayout
			testId={testId}
			shouldRenderNestedCommentsInline={shouldRenderNestedCommentsInline}
			id={id}
			avatar={avatar}
			content={
				<Stack space="space.075">
					<Stack space="space.050">
						<Header testId={testId && `${testId}-header`} {...headerProps} />
						<Box
							testId={testId && `${testId}-content`}
							xcss={cx(textStyles.root, (isSaving || isError) && textStyles.disabled)}
						>
							{content}
						</Box>
					</Stack>
					<Footer testId={testId && `${testId}-footer`} {...footerProps} />
					{afterContent}
				</Stack>
			}
			highlighted={highlighted}
		>
			{children}
		</CommentLayout>
	);
};

Comment.displayName = 'Comment';

export default Comment;

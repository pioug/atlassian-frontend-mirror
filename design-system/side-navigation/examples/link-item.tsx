import React, { type MouseEvent } from 'react';

import { cssMap } from '@atlaskit/css';
import BookIcon from '@atlaskit/icon/core/book-with-bookmark';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Flex } from '@atlaskit/primitives/compiled';
import { LinkItem } from '@atlaskit/side-navigation';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const Example = (): React.JSX.Element => (
	// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
	<Box onClick={(e: MouseEvent) => e.preventDefault()}>
		{/* eslint-disable @atlassian/a11y/anchor-is-valid */}
		<LinkItem href="#">My articles</LinkItem>
		<LinkItem href="#" isDisabled>
			My articles
		</LinkItem>
		<LinkItem
			href="#"
			iconAfter={
				<Flex xcss={iconSpacingStyles.space050}>
					<StarStarredIcon label="" />
				</Flex>
			}
		>
			My articles
		</LinkItem>
		<LinkItem href="#" description="Will create an article">
			My articles
		</LinkItem>
		<LinkItem
			href="#"
			iconBefore={
				<Flex xcss={iconSpacingStyles.space050}>
					<BookIcon label="" />
				</Flex>
			}
		>
			My articles
		</LinkItem>
		<LinkItem
			href="#"
			iconBefore={
				<Flex xcss={iconSpacingStyles.space050}>
					<BookIcon label="" />
				</Flex>
			}
			iconAfter={
				<Flex xcss={iconSpacingStyles.space050}>
					<StarStarredIcon label="" />
				</Flex>
			}
		>
			My articles
		</LinkItem>
		<LinkItem
			href="#"
			description="Will create an article"
			iconBefore={
				<Flex xcss={iconSpacingStyles.space050}>
					<BookIcon label="" />
				</Flex>
			}
		>
			My articles
		</LinkItem>
		<LinkItem
			href="#"
			description="Will create an article"
			iconBefore={
				<Flex xcss={iconSpacingStyles.space050}>
					<BookIcon label="" />
				</Flex>
			}
			iconAfter={
				<Flex xcss={iconSpacingStyles.space050}>
					<StarStarredIcon label="" />
				</Flex>
			}
		>
			My articles
		</LinkItem>
		{/* eslint-enable @atlassian/a11y/anchor-is-valid */}
	</Box>
);

export default Example;

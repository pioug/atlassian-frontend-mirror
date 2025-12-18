import React, { type MouseEvent } from 'react';

import BookIcon from '@atlaskit/icon/core/book-with-bookmark';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';
import { LinkItem } from '@atlaskit/side-navigation';

const Example = (): React.JSX.Element => (
	// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
	<Box onClick={(e: MouseEvent) => e.preventDefault()}>
		{/* eslint-disable @atlassian/a11y/anchor-is-valid */}
		<LinkItem href="#">My articles</LinkItem>
		<LinkItem href="#" isDisabled>
			My articles
		</LinkItem>
		<LinkItem href="#" iconAfter={<StarStarredIcon label="" spacing="spacious" />}>
			My articles
		</LinkItem>
		<LinkItem href="#" description="Will create an article">
			My articles
		</LinkItem>
		<LinkItem href="#" iconBefore={<BookIcon spacing="spacious" label="" />}>
			My articles
		</LinkItem>
		<LinkItem
			href="#"
			iconBefore={<BookIcon spacing="spacious" label="" />}
			iconAfter={<StarStarredIcon label="" spacing="spacious" />}
		>
			My articles
		</LinkItem>
		<LinkItem
			href="#"
			description="Will create an article"
			iconBefore={<BookIcon spacing="spacious" label="" />}
		>
			My articles
		</LinkItem>
		<LinkItem
			href="#"
			description="Will create an article"
			iconBefore={<BookIcon spacing="spacious" label="" />}
			iconAfter={<StarStarredIcon label="" spacing="spacious" />}
		>
			My articles
		</LinkItem>
		{/* eslint-enable @atlassian/a11y/anchor-is-valid */}
	</Box>
);

export default Example;

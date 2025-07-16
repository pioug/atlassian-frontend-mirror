import React, { type MouseEvent } from 'react';

import BookIcon from '@atlaskit/icon/glyph/book';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';
import { LinkItem } from '@atlaskit/side-navigation';

const Example = () => (
	// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
	<Box onClick={(e: MouseEvent) => e.preventDefault()}>
		{/* eslint-disable jsx-a11y/anchor-is-valid */}
		<LinkItem href="#">My articles</LinkItem>
		<LinkItem href="#" isDisabled>
			My articles
		</LinkItem>
		<LinkItem href="#" iconAfter={<EmojiAtlassianIcon label="" />}>
			My articles
		</LinkItem>
		<LinkItem href="#" description="Will create an article">
			My articles
		</LinkItem>
		<LinkItem href="#" iconBefore={<BookIcon label="" />}>
			My articles
		</LinkItem>
		<LinkItem
			href="#"
			iconBefore={<BookIcon label="" />}
			iconAfter={<EmojiAtlassianIcon label="" />}
		>
			My articles
		</LinkItem>
		<LinkItem href="#" description="Will create an article" iconBefore={<BookIcon label="" />}>
			My articles
		</LinkItem>
		<LinkItem
			href="#"
			description="Will create an article"
			iconBefore={<BookIcon label="" />}
			iconAfter={<EmojiAtlassianIcon label="" />}
		>
			My articles
		</LinkItem>
		{/* eslint-enable jsx-a11y/anchor-is-valid */}
	</Box>
);

export default Example;

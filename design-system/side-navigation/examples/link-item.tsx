/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { type MouseEvent } from 'react';

import BookIcon from '@atlaskit/icon/glyph/book';
import OpenIcon from '@atlaskit/icon/glyph/open';
import { Box } from '@atlaskit/primitives';

import { LinkItem } from '../src';

const Example = () => (
	<Box onClick={(e: MouseEvent) => e.preventDefault()}>
		<LinkItem href="#">My articles</LinkItem>
		<LinkItem href="#" isDisabled>
			My articles
		</LinkItem>
		<LinkItem href="#" iconAfter={<OpenIcon label="" />}>
			My articles
		</LinkItem>
		<LinkItem href="#" description="Will create an article">
			My articles
		</LinkItem>
		<LinkItem href="#" iconBefore={<BookIcon label="" />}>
			My articles
		</LinkItem>
		<LinkItem href="#" iconBefore={<BookIcon label="" />} iconAfter={<OpenIcon label="" />}>
			My articles
		</LinkItem>
		<LinkItem href="#" description="Will create an article" iconBefore={<BookIcon label="" />}>
			My articles
		</LinkItem>
		<LinkItem
			href="#"
			description="Will create an article"
			iconBefore={<BookIcon label="" />}
			iconAfter={<OpenIcon label="" />}
		>
			My articles
		</LinkItem>
	</Box>
);

export default Example;

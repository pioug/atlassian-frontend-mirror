import React from 'react';

import BookIcon from '@atlaskit/icon/glyph/book';

import { LinkItem, Section } from '../../src';

const ButtonItemExample = () => {
	return (
		<div>
			<Section>
				{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
				<LinkItem href="#">My articles</LinkItem>
			</Section>
			<Section>
				{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
				<LinkItem href="#" description="All published articles" iconBefore={<BookIcon label="" />}>
					My articles
				</LinkItem>
			</Section>
		</div>
	);
};

export default ButtonItemExample;

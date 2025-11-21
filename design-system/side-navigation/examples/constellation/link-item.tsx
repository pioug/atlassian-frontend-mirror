import React from 'react';

import BookWithBookmarkIcon from '@atlaskit/icon/core/book-with-bookmark';
import { LinkItem, Section } from '@atlaskit/side-navigation';

const ButtonItemExample = (): React.JSX.Element => {
	return (
		<div>
			<Section>
				{/* eslint-disable-next-line @atlassian/a11y/anchor-is-valid */}
				<LinkItem href="#">My articles</LinkItem>
			</Section>
			<Section>
				{/* eslint-disable-next-line @atlassian/a11y/anchor-is-valid */}
				<LinkItem
					href="#"
					description="All published articles"
					iconBefore={<BookWithBookmarkIcon label="" />}
				>
					My articles
				</LinkItem>
			</Section>
		</div>
	);
};

export default ButtonItemExample;

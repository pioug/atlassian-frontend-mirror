import React from 'react';

import BookWithBookmarkIcon from '@atlaskit/icon/core/book-with-bookmark';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { LinkItem, Section } from '@atlaskit/side-navigation';

const ButtonItemExample = (): React.JSX.Element => {
	return (
		<div>
			<Section>
				<LinkItem href="/">My articles</LinkItem>
			</Section>
			<Section>
				<LinkItem
					href="/"
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

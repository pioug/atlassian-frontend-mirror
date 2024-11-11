import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import Pagination from '@atlaskit/pagination';
import { Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import SectionMessage from '@atlaskit/section-message';

const customEllipsisStyles = xcss({
	margin: 'space.0',
});

export default function CustomEllipsisExample() {
	const [maxPageSize, setMaxPageSize] = useState(7);

	const handleEllipsisCLick = () => setMaxPageSize(10);

	return (
		<Stack space="space.150">
			<SectionMessage title="Using the example">
				<Text as="p">Please click on the ellipsis to expand the Pagination</Text>
			</SectionMessage>
			<Pagination
				testId="pagination"
				renderEllipsis={({ key }: { key: string }) => (
					<Inline key={key} as="li" xcss={customEllipsisStyles}>
						<Button onClick={handleEllipsisCLick} appearance="subtle" aria-label="Expand list">
							&hellip;
						</Button>
					</Inline>
				)}
				max={maxPageSize}
				pages={[...Array(10)].map((_, i) => i + 1)}
				nextLabel="Next"
				label="Custom Ellipsis"
				pageLabel="Page"
				previousLabel="Previous"
			/>
		</Stack>
	);
}

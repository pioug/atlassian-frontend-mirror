import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Pagination from '@atlaskit/pagination';
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import SectionMessage from '@atlaskit/section-message';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	customEllipsis: {
		marginTop: token('space.0'),
		marginRight: token('space.0'),
		marginBottom: token('space.0'),
		marginLeft: token('space.0'),
	},
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
					<Inline key={key} as="li" xcss={styles.customEllipsis}>
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

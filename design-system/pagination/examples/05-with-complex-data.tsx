import React, { type SyntheticEvent, useState } from 'react';

import { Code } from '@atlaskit/code';
import Pagination from '@atlaskit/pagination';
import { Stack, Text } from '@atlaskit/primitives/compiled';
import { withPlatformFeatureFlags } from '@atlassian/feature-flags-storybook-utils';

const PAGES = [...Array(10)].map((_, i) => ({
	label: i + 1,
	href: `page-${i + 1}`,
}));

export default function ComplexDataExample() {
	const [onChangeEvent, setOnChangeEvent] = useState({
		label: 1,
		href: 'page-1',
	});

	const handleChange = (event: SyntheticEvent, newPage: any) => setOnChangeEvent(newPage);

	const getLabel = ({ label }: any) => label;

	return (
		<Stack space="space.150">
			<Pagination
				testId="pagination"
				pages={PAGES}
				onChange={handleChange}
				getPageLabel={getLabel}
				nextLabel="Next"
				label="Complex Data Page"
				pageLabel="Page"
				previousLabel="Previous"
			/>
			<Text as="p">Received onChange event:</Text>
			<Code>
				{JSON.stringify(
					{
						label: onChangeEvent.label,
						href: onChangeEvent.href,
					},
					null,
					2,
				)}
			</Code>
		</Stack>
	);
}

ComplexDataExample.decorators = [
	withPlatformFeatureFlags({
		'jfp-a11y-team_pagination_list-markup': true,
	}),
];

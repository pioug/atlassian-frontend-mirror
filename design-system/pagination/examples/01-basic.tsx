import React, { type SyntheticEvent, useState } from 'react';

import Pagination from '@atlaskit/pagination';
import { Stack, Text } from '@atlaskit/primitives/compiled';

const Pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function BasicExample(): React.JSX.Element {
	const [onChangeEvent, setOnChangeEvent] = useState(1);

	const handleChange = (event: SyntheticEvent, newPage: any) => setOnChangeEvent(newPage);

	return (
		<Stack space="space.150">
			<Pagination
				testId="pagination"
				pages={Pages}
				onChange={handleChange}
				nextLabel="Next"
				label="Basic Page"
				pageLabel="Page"
				previousLabel="Previous"
			/>
			<Text testId="description" as="p">
				selected page from onChange hook: {onChangeEvent}
			</Text>
		</Stack>
	);
}

import React from 'react';

import Pagination from '@atlaskit/pagination';
import Stack from '@atlaskit/primitives/stack';

const Pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function BasicExample() {
	return (
		<Stack space="space.150">
			<h2>Disabled pagination</h2>
			<Pagination
				testId="pagination"
				pages={Pages}
				isDisabled
				nextLabel="Next"
				label="Disabled pagination"
				pageLabel="Page"
				previousLabel="Previous"
			/>
		</Stack>
	);
}

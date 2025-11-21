import React from 'react';

import Pagination from '@atlaskit/pagination';

export default function PaginationDefaultSelectedIndexExample(): React.JSX.Element {
	return (
		<Pagination
			defaultSelectedIndex={5}
			pages={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
			nextLabel="Next"
			label="Page"
			pageLabel="Page"
			previousLabel="Previous"
		/>
	);
}

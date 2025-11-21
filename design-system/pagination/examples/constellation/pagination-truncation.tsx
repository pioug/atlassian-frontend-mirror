import React from 'react';

import Pagination from '@atlaskit/pagination';

export default function PaginationTruncationExample(): React.JSX.Element {
	return (
		<Pagination
			nextLabel="Next"
			label="Page"
			pageLabel="Page"
			pages={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
			previousLabel="Previous"
		/>
	);
}

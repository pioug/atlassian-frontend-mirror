import React from 'react';

import Pagination from '@atlaskit/pagination';

export default [
	<Pagination
		pages={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
		defaultSelectedIndex={2}
		max={7}
		onChange={(event, page) => console.log('Page selected:', page)}
	/>,
	<Pagination
		pages={['A', 'B', 'C', 'D']}
		defaultSelectedIndex={1}
		onChange={(event, page) => console.log('Letter page:', page)}
	/>,
];

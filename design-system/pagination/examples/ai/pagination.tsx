import React from 'react';

import Pagination from '@atlaskit/pagination/pagination';

const Examples = (): React.JSX.Element => (
	<>
		<Pagination pages={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} defaultSelectedIndex={2} max={7} />
		<Pagination pages={['A', 'B', 'C', 'D']} defaultSelectedIndex={1} />
	</>
);
export default Examples;

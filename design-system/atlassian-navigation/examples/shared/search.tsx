import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { Search } from '@atlaskit/atlassian-navigation';

const onClick = (...args: any[]) => {
	console.log('search click', ...args);
};

export const DefaultSearch = (): React.JSX.Element => (
	<Search onClick={onClick} placeholder="Search..." tooltip="Search" label="Search" />
);

export default DefaultSearch;

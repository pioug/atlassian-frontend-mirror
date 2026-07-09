import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
import { Search } from '@atlaskit/atlassian-navigation/search';

export default (): React.JSX.Element => {
	const DefaultSearch = () => {
		const [value, setValue] = useState('');
		const onChange = (event: any) => {
			console.log('search clicked with value: ', event.target.value);
			setValue(event.target.value);
		};

		return (
			<Search
				onClick={onChange}
				placeholder="Search..."
				tooltip="Search"
				label="Search"
				value={value}
			/>
		);
	};

	return (
		<AtlassianNavigation
			label="site"
			renderProductHome={() => null}
			renderSearch={DefaultSearch}
			primaryItems={[]}
		/>
	);
};

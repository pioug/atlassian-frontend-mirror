import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';

import { head } from './content/sample-data';

const LoadingNoRowsExample = (): React.JSX.Element => {
	const [isLoading, setIsLoading] = useState(false);
	return (
		<div>
			<Button onClick={() => setIsLoading((loading) => !loading)}>Toggle loading</Button>
			<DynamicTableStateless head={head} isLoading={isLoading} />
		</div>
	);
};

export default LoadingNoRowsExample;

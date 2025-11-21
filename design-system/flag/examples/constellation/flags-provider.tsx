import React from 'react';

import { FlagsProvider } from '@atlaskit/flag';

const FlagProviderExample = (): React.JSX.Element => {
	return (
		<FlagsProvider>
			<h3>I'm wrapped in a flags provider.</h3>
		</FlagsProvider>
	);
};

export default FlagProviderExample;

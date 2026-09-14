import React from 'react';

import LoadingButton from '@atlaskit/button/loading-button';

const ButtonLoadingExample = (): React.JSX.Element => {
	return (
		<LoadingButton appearance="primary" isLoading>
			Loading button
		</LoadingButton>
	);
};

export default ButtonLoadingExample;

import React from 'react';

import Banner from '@atlaskit/banner';
import ErrorIcon from '@atlaskit/icon/core/status-error';

const Icon = <ErrorIcon spacing="spacious" label="Error" />;

export default (): React.JSX.Element => (
	<Banner icon={Icon} appearance="error">
		This is an error banner
	</Banner>
);

import React from 'react';

import Banner from '@atlaskit/banner';
import ErrorIcon from '@atlaskit/icon/core/status-error';
import Link from '@atlaskit/link';

const Icon = <ErrorIcon spacing="spacious" label="Error" />;

export default (): React.JSX.Element => (
	<Banner icon={Icon} appearance="error">
		This is an error banner from <Link href="http://atlassian.com">Atlassian</Link>
	</Banner>
);

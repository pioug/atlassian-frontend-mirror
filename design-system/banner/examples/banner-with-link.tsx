import React from 'react';

import Banner from '@atlaskit/banner';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Link from '@atlaskit/link';

const Icon = <ErrorIcon label="Error" secondaryColor="inherit" />;

export default (): React.JSX.Element => (
	<Banner icon={Icon} appearance="error">
		This is an error banner from <Link href="http://atlassian.com">Atlassian</Link>
	</Banner>
);

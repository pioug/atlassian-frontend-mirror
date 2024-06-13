import React from 'react';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import Link from '@atlaskit/link';

import Banner from '../src';

const Icon = <ErrorIcon label="Error" secondaryColor="inherit" />;

export default () => (
	<Banner icon={Icon} appearance="error">
		This is an error banner from <Link href="http://atlassian.com">Atlassian</Link>
	</Banner>
);

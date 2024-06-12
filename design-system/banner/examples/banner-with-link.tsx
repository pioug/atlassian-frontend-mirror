import React from 'react';

import ErrorIcon from '@atlaskit/icon/glyph/error';

import Banner from '../src';

const Icon = <ErrorIcon label="Error" secondaryColor="inherit" />;

export default () => (
	<Banner icon={Icon} appearance="error">
		This is an error banner from <a href="http://atlassian.com">Atlassian</a>
	</Banner>
);

import React from 'react';

import Banner from '@atlaskit/banner';
import ErrorIcon from '@atlaskit/icon/glyph/error';

const Icon = <ErrorIcon label="Error" secondaryColor="inherit" />;

export default () => (
	<Banner icon={Icon} appearance="error">
		This is an error banner
	</Banner>
);

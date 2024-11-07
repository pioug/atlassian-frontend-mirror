import React from 'react';

import Banner from '@atlaskit/banner';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Box from '@atlaskit/primitives/box';

export default () => (
	<Box>
		<Banner icon={<WarningIcon label="Warning" secondaryColor="inherit" size="medium" />}>
			Your license is about to expire. Please renew your license within the next week.
		</Banner>
	</Box>
);

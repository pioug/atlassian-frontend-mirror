import React from 'react';

import Banner from '@atlaskit/banner';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import Box from '@atlaskit/primitives/box';

export default (): React.JSX.Element => (
	<Box>
		<Banner icon={<WarningIcon label="Warning" spacing="spacious" />} testId="basicTestId">
			Your license is about to expire. Please renew your license within the next week.
		</Banner>
	</Box>
);

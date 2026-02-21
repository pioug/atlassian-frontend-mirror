import React from 'react';

import Banner from '@atlaskit/banner';
import WarningIcon from '@atlaskit/icon/core/status-warning';

export default (): React.JSX.Element => (
	<Banner icon={<WarningIcon spacing="spacious" label="Warning" />} testId="myBannerTestId">
		Your Banner is rendered with a [data-testid="myBannerTestId"].
	</Banner>
);

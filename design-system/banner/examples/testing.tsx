import React from 'react';

import Banner from '@atlaskit/banner';
import WarningIcon from '@atlaskit/icon/glyph/warning';

export default (): React.JSX.Element => (
	<Banner icon={<WarningIcon label="Warning" secondaryColor="inherit" />} testId="myBannerTestId">
		Your Banner is rendered with a [data-testid="myBannerTestId"].
	</Banner>
);

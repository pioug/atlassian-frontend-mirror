import React from 'react';

import { FeedbackIcon } from '@atlaskit/logo/feedback/icon';
import { FeedbackLogoCS as FeedbackLogo } from '@atlaskit/logo/feedback/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		icon={<FeedbackIcon appearance="brand" />}
		logo={<FeedbackLogo appearance="brand" />}
	/>
);

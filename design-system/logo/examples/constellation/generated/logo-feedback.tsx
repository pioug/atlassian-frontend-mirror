import React from 'react';

import { FeedbackIcon, FeedbackLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		icon={<FeedbackIcon appearance="brand" />}
		logo={<FeedbackLogo appearance="brand" />}
	/>
);

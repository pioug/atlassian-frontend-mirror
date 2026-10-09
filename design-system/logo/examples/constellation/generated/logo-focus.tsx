import React from 'react';

import { FocusIcon } from '@atlaskit/logo/focus/icon';
import { FocusLogoCS as FocusLogo } from '@atlaskit/logo/focus/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<FocusLogo appearance="brand" />} icon={<FocusIcon appearance="brand" />} />
);

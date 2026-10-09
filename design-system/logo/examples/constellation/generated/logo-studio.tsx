import React from 'react';

import { StudioIcon } from '@atlaskit/logo/studio/icon';
import { StudioLogoCS as StudioLogo } from '@atlaskit/logo/studio/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<StudioLogo appearance="brand" />} icon={<StudioIcon appearance="brand" />} />
);

import React from 'react';

import { CompassIcon } from '@atlaskit/logo/compass/icon';
import { CompassLogoCS as CompassLogo } from '@atlaskit/logo/compass/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<CompassLogo appearance="brand" />} icon={<CompassIcon appearance="brand" />} />
);

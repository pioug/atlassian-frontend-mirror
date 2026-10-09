import React from 'react';

import { TalentIcon } from '@atlaskit/logo/talent/icon';
import { TalentLogoCS as TalentLogo } from '@atlaskit/logo/talent/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<TalentLogo appearance="brand" />} icon={<TalentIcon appearance="brand" />} />
);

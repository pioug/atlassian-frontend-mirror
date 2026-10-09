import React from 'react';

import { TrelloIcon } from '@atlaskit/logo/trello-icon';
import { TrelloLogoCS as TrelloLogo } from '@atlaskit/logo/trello/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<TrelloLogo appearance="brand" />} icon={<TrelloIcon appearance="brand" />} />
);

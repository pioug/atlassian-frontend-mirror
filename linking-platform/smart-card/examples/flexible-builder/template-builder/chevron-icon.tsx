import React from 'react';

import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/utility/migration/chevron-up';

const ChevronIcon = ({ open }: { open: boolean }) =>
	open ? (
		<ChevronUpIcon label="collapse" color="currentColor" />
	) : (
		<ChevronDownIcon label="expand" color="currentColor" />
	);

export default ChevronIcon;

import React from 'react';

import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/core/migration/chevron-up';

const ChevronIcon = ({ open }: { open: boolean }): React.JSX.Element =>
	open ? (
		<ChevronUpIcon label="collapse" color="currentColor" size="small" />
	) : (
		<ChevronDownIcon label="expand" color="currentColor" size="small" />
	);

export default ChevronIcon;

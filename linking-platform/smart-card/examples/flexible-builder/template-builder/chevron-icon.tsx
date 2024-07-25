import React from 'react';
import ChevronUpIcon from '@atlaskit/icon/utility/migration/chevron-up';
import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';

const ChevronIcon = ({ open }: { open: boolean }) =>
	open ? (
		<ChevronUpIcon label="collapse" color="currentColor" />
	) : (
		<ChevronDownIcon label="expand" color="currentColor" />
	);

export default ChevronIcon;

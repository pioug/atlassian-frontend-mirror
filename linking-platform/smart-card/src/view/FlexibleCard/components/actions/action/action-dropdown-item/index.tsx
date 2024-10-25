import React from 'react';

import { DropdownItem } from '@atlaskit/dropdown-menu';

import { handleOnClick } from '../../../../../../utils';

import { type ActionDropdownItemProps } from './types';

const ActionDropdownItem = ({
	content,
	iconAfter,
	iconBefore,
	isLoading,
	onClick,
	testId,
}: ActionDropdownItemProps) => (
	<DropdownItem
		elemAfter={iconAfter}
		elemBefore={iconBefore}
		isDisabled={isLoading}
		onClick={handleOnClick(onClick)}
		testId={testId}
	>
		{content}
	</DropdownItem>
);

export default ActionDropdownItem;

import React from 'react';

import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { handleOnClick } from '../../../../../../utils/handle-on-click';
import { type ActionDropdownItemProps } from './types';

const ActionDropdownItem = ({
	ariaLabel,
	content,
	iconAfter,
	iconBefore,
	isLoading,
	onClick,
	testId,
}: ActionDropdownItemProps): React.JSX.Element => (
	<DropdownItem
		aria-label={fg('platform_smart_link_preview_a11y_label') ? ariaLabel : undefined}
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

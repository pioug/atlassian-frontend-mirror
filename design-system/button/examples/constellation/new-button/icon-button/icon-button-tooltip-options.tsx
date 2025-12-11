import React from 'react';

import { IconButton, type IconButtonProps } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';

const tooltipOptions: IconButtonProps['tooltip'] = {
	position: 'right',
	hideTooltipOnClick: true,
};

const IconButtonPrimaryExample = (): React.JSX.Element => {
	return (
		<IconButton
			icon={AddIcon}
			label="Create page"
			isTooltipDisabled={false}
			tooltip={tooltipOptions}
		/>
	);
};

export default IconButtonPrimaryExample;

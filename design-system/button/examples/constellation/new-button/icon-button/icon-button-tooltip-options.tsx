import React from 'react';

import AddIcon from '@atlaskit/icon/glyph/add';

import { IconButton, type IconButtonProps } from '../../../../src/new';

const tooltipOptions: IconButtonProps['tooltip'] = {
	position: 'right',
	hideTooltipOnClick: true,
};

const IconButtonPrimaryExample = () => {
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

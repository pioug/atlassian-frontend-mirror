import React from 'react';

import { IconTile } from '@atlaskit/icon';

import AddIcon from '../../core/add';

const IconTileCircleReplacementComponentExample = () => {
	return (
		<IconTile
			icon={AddIcon}
			label=""
			appearance="greenBold"
			shape="circle"
			size="24"
			UNSAFE_circleReplacementComponent={<span>Circle replacement</span>}
		/>
	);
};

export default IconTileCircleReplacementComponentExample;

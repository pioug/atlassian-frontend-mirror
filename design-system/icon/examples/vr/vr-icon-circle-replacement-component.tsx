import React from 'react';

import { IconTile } from '@atlaskit/icon';

import AddIcon from '../../core/add';

const IconTileCircleReplacementComponentExample = (): React.JSX.Element => {
	return (
		<IconTile
			icon={AddIcon}
			label=""
			appearance="greenBold"
			shape="circle"
			size="small"
			UNSAFE_circleReplacementComponent={<span>Circle replacement</span>}
		/>
	);
};

export default IconTileCircleReplacementComponentExample;

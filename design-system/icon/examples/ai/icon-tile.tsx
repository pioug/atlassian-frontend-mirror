import React from 'react';

import AddIcon from '@atlaskit/icon/core/add';
import IconTile from '@atlaskit/icon/icon-tile';

const IconTileExample = (): React.JSX.Element[] => [
	<IconTile key="redBold" size="small" icon={AddIcon} label="Add" appearance="redBold" />,
	<IconTile key="blue" size="small" icon={AddIcon} label="Add" appearance="blue" />,
];
export default IconTileExample;

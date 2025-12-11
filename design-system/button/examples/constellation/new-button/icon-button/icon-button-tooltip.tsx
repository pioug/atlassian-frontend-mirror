import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';

const IconButtonPrimaryExample = (): React.JSX.Element => {
	return <IconButton icon={AddIcon} label="Create page" isTooltipDisabled={false} />;
};

export default IconButtonPrimaryExample;

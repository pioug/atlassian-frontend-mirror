import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';

const IconButtonPrimaryExample = (): React.JSX.Element => {
	return <IconButton appearance="primary" icon={AddIcon} label="Create page" />;
};

export default IconButtonPrimaryExample;

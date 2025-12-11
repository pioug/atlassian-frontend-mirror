import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';

const IconButtonCircleExample = (): React.JSX.Element => {
	return <IconButton shape="circle" icon={ShowMoreHorizontalIcon} label="More actions" />;
};

export default IconButtonCircleExample;

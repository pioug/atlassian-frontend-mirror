import React from 'react';

import IconButton from '@atlaskit/button/icon/button';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';

const IconButtonSelectedExample = (): React.JSX.Element => {
	return <IconButton isSelected icon={ShowMoreHorizontalIcon} label="More actions" />;
};

export default IconButtonSelectedExample;

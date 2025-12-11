import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import LinkIcon from '@atlaskit/icon/core/link';

const IconButtonSubtleExample = (): React.JSX.Element => {
	return <IconButton appearance="subtle" icon={LinkIcon} label="Copy link" />;
};

export default IconButtonSubtleExample;

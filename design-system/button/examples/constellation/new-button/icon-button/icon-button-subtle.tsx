import React from 'react';

import IconButton from '@atlaskit/button/icon/button';
import LinkIcon from '@atlaskit/icon/core/link';

const IconButtonSubtleExample = (): React.JSX.Element => {
	return <IconButton appearance="subtle" icon={LinkIcon} label="Copy link" />;
};

export default IconButtonSubtleExample;

import React from 'react';

import Button from '@atlaskit/button/new';
import LinkIcon from '@atlaskit/icon/glyph/link';

const ButtonIconBeforeSizeExample = () => {
	return (
		<Button
			iconBefore={(iconProps) => <LinkIcon {...iconProps} size="small" />}
			appearance="warning"
		>
			Icon with size override
		</Button>
	);
};

export default ButtonIconBeforeSizeExample;

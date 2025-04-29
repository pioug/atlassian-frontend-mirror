import React from 'react';

import { LinkButton } from '@atlaskit/button/new';
import ShortcutIcon from '@atlaskit/icon/core/migration/shortcut--add-item';

const LinkButtonIconExample = () => {
	return (
		<LinkButton iconAfter={ShortcutIcon} href="https://atlassian.com/">
			Icon after
		</LinkButton>
	);
};

export default LinkButtonIconExample;

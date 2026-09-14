import React from 'react';

import LinkButton from '@atlaskit/button/link';
import ShortcutIcon from '@atlaskit/icon/core/shortcut';

const LinkButtonIconExample = (): React.JSX.Element => {
	return (
		<LinkButton iconAfter={ShortcutIcon} href="https://atlassian.com/">
			Icon after
		</LinkButton>
	);
};

export default LinkButtonIconExample;

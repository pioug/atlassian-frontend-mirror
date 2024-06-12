import React from 'react';

import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';

import { LinkButton } from '../../../../src/new';

const LinkButtonIconExample = () => {
	return (
		<LinkButton iconAfter={ShortcutIcon} href="https://atlassian.com/">
			Icon after
		</LinkButton>
	);
};

export default LinkButtonIconExample;

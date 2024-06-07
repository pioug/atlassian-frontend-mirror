import React from 'react';

import { CopyLinkButton } from '../src/components/CopyLinkButton';

export default () => (
	<CopyLinkButton
		link={'http://atlassian.com'}
		copyLinkButtonText={'Copy link'}
		copiedToClipboardText={'Link copied to clipboard'}
	/>
);

import React from 'react';

import Link from '@atlaskit/link';

import { CopyLinkButton } from '../src/components/CopyLinkButton';

export default () => (
	<CopyLinkButton
		link={'http://atlassian.com'}
		copyLinkButtonText={'Copy link with Tooltip'}
		copiedToClipboardText={'Link copied to clipboard'}
	>
		<Link href="/">Fancy Button</Link>
	</CopyLinkButton>
);

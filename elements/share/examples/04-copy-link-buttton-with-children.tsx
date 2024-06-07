import React from 'react';

import { LinkButton } from '@atlaskit/button/new';

import { CopyLinkButton } from '../src/components/CopyLinkButton';

export default () => (
	<CopyLinkButton
		link={'http://atlassian.com'}
		copyLinkButtonText={'Copy link with Tooltip'}
		copiedToClipboardText={'Link copied to clipboard'}
	>
		<LinkButton appearance="link" spacing="none" href="/">
			Fancy Button
		</LinkButton>
	</CopyLinkButton>
);

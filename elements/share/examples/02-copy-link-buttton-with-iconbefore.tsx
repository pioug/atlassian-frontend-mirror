import React from 'react';

import FeedbackIcon from '@atlaskit/icon/core/migration/feedback';

import { CopyLinkButton } from '../src/components/CopyLinkButton';

export default () => (
	<CopyLinkButton
		link={'http://atlassian.com'}
		copyLinkButtonText={'Feedback Link Copy'}
		copiedToClipboardText={'Link copied to clipboard'}
		iconBefore={
			<FeedbackIcon color="currentColor" label="" LEGACY_size="medium" spacing="spacious" />
		}
	/>
);

import React from 'react';

import LinkUrl from '@atlaskit/smart-card/link';

export default function LinkUrlExample(): React.JSX.Element {
	return (
		<p>
			<LinkUrl href="https://www.atlassian.com/">atlassian.com</LinkUrl> ·{' '}
			<LinkUrl href="https://www.atlassian.com/">Atlassian website</LinkUrl>
		</p>
	);
}

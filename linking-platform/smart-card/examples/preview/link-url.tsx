import React from 'react';

import LinkUrl from '@atlaskit/smart-card/link';
export default function Preview(): React.JSX.Element {
	return (
		<div data-testid="component-preview">
			<LinkUrl href="https://www.atlassian.com/">Atlassian website</LinkUrl>
		</div>
	);
}

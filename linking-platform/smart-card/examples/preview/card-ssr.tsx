import React from 'react';

import { CardSSR } from '@atlaskit/smart-card/ssr';
export default function Preview(): React.JSX.Element {
	return (
		<div data-testid="component-preview">
			<CardSSR appearance="block" url="https://example.atlassian.net/browse/ENG-1" />
		</div>
	);
}

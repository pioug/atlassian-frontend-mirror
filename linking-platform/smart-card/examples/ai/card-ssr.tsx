import React from 'react';

import { CardSSR } from '@atlaskit/smart-card/ssr';

/** Use this rendering surface when the host needs the Smart Link card's SSR-compatible output. */
export default function CardSsrExample(): React.JSX.Element {
	return <CardSSR appearance="block" url="https://example.atlassian.net/browse/ENG-1" />;
}

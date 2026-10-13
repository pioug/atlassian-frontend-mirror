import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { Card } from '@atlaskit/smart-card/card/lazy';

type Props = { client: React.ComponentProps<typeof SmartCardProvider>['client'] };

/** Use the host product's permission-aware Smart Link client in this example. */
export default function InlineCardExample({ client }: Props): React.JSX.Element {
	return (
		<SmartCardProvider client={client}>
			<Card appearance="inline" url="https://example.atlassian.net/browse/ENG-1" showHoverPreview />
		</SmartCardProvider>
	);
}

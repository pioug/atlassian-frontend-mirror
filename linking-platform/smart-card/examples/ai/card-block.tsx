import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { Card } from '@atlaskit/smart-card/card/lazy';

type Props = { client: React.ComponentProps<typeof SmartCardProvider>['client'] };
export default function BlockCardExample({ client }: Props): React.JSX.Element {
	return (
		<SmartCardProvider client={client}>
			<Card appearance="block" url="https://example.atlassian.net/browse/ENG-1" />
		</SmartCardProvider>
	);
}

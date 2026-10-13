import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { Card } from '@atlaskit/smart-card/card/lazy';

type Props = { client: React.ComponentProps<typeof SmartCardProvider>['client'] };
/** Use only when the link supports embedding; keep a textual link fallback in host UI. */
export default function EmbedCardExample({ client }: Props): React.JSX.Element {
	return (
		<SmartCardProvider client={client}>
			<Card
				appearance="embed"
				frameStyle="show"
				platform="web"
				url="https://example.atlassian.net/wiki/spaces/EXAMPLE/pages/1"
			/>
		</SmartCardProvider>
	);
}

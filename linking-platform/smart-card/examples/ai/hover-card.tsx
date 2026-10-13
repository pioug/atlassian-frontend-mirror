import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { Anchor } from '@atlaskit/primitives/compiled/anchor';
import { HoverCard } from '@atlaskit/smart-card/hover';

type Props = { client: React.ComponentProps<typeof SmartCardProvider>['client'] };
export default function HoverCardExample({ client }: Props): React.JSX.Element {
	return (
		<SmartCardProvider client={client}>
			<HoverCard url="https://example.atlassian.net/browse/ENG-1" label="Preview ENG-1">
				<Anchor href="https://example.atlassian.net/browse/ENG-1">View ENG-1</Anchor>
			</HoverCard>
		</SmartCardProvider>
	);
}

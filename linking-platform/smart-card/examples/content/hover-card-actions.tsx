import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { ResolvedClient, ResolvedClientEmbedUrl } from '@atlaskit/link-test-helpers';
import { Stack } from '@atlaskit/primitives/compiled';

import { CardAction } from '../../src';
import { HoverCard } from '../../src/hoverCard';
import HoverOverMe from '../utils/hover-card-box';

export default (): React.JSX.Element => (
	<IntlProvider locale="en">
		<SmartCardProvider client={new ResolvedClient('stg')}>
			<Stack space="space.100">
				<HoverCard url={ResolvedClientEmbedUrl}>
					<HoverOverMe content="Show all available actions (default)" />
				</HoverCard>
				<HoverCard actionOptions={{ hide: true }} url={ResolvedClientEmbedUrl}>
					<HoverOverMe content="Hide all actions" />
				</HoverCard>
				<HoverCard
					actionOptions={{ hide: false, exclude: [CardAction.PreviewAction] }}
					url={ResolvedClientEmbedUrl}
				>
					<HoverOverMe content="Show all actions except preview action" />
				</HoverCard>
			</Stack>
		</SmartCardProvider>
	</IntlProvider>
);

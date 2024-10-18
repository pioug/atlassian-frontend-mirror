import { SmartCardProvider } from '@atlaskit/link-provider';
import { Stack } from '@atlaskit/primitives';
import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { ResolvedClient, ResolvedClientEmbedUrl } from '../../examples/utils/custom-client';
import { CardAction } from '../../src';
import { HoverCard } from '../../src/hoverCard';
import HoverOverMe from '../utils/hover-card-box';

export default () => (
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

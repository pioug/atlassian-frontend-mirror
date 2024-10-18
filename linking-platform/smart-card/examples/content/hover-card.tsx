import { SmartCardProvider } from '@atlaskit/link-provider';
import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { ResolvedClient, ResolvedClientEmbedUrl } from '../../examples/utils/custom-client';
import { HoverCard } from '../../src/hoverCard';
import HoverOverMe from '../utils/hover-card-box';

export default () => (
	<IntlProvider locale="en">
		<SmartCardProvider client={new ResolvedClient('stg')}>
			<HoverCard url={ResolvedClientEmbedUrl}>
				<HoverOverMe />
			</HoverCard>
		</SmartCardProvider>
	</IntlProvider>
);

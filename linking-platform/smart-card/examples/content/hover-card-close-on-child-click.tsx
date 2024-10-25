import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { HoverCard } from '../../src/hoverCard';
import { ResolvedClient, ResolvedClientEmbedUrl } from '../utils/custom-client';
import HoverOverMe from '../utils/hover-card-box';

export default () => (
	<IntlProvider locale="en">
		<SmartCardProvider client={new ResolvedClient('staging')}>
			<HoverCard url={ResolvedClientEmbedUrl} closeOnChildClick={true}>
				<HoverOverMe />
			</HoverCard>
		</SmartCardProvider>
	</IntlProvider>
);

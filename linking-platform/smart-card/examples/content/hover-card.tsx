import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { ResolvedClient, ResolvedClientEmbedUrl } from '@atlaskit/link-test-helpers';

import { HoverCard } from '../../src/hoverCard';
import HoverOverMe from '../utils/hover-card-box';

export default (): React.JSX.Element => (
	<IntlProvider locale="en">
		<SmartCardProvider client={new ResolvedClient('stg')}>
			<HoverCard url={ResolvedClientEmbedUrl}>
				<HoverOverMe />
			</HoverCard>
		</SmartCardProvider>
	</IntlProvider>
);

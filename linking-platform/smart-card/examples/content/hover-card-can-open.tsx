import React, { useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import { Checkbox } from '@atlaskit/checkbox';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Stack } from '@atlaskit/primitives';

import { HoverCard } from '../../src/hoverCard';
import { ResolvedClient, ResolvedClientEmbedUrl } from '../utils/custom-client';
import HoverOverMe from '../utils/hover-card-box';

export default () => {
	const [canOpen, setCanOpen] = useState(true);

	return (
		<IntlProvider locale="en">
			<SmartCardProvider client={new ResolvedClient('staging')}>
				<Stack space="space.100">
					<Checkbox isChecked={canOpen} onChange={() => setCanOpen(!canOpen)} label="Can open" />
					<HoverCard url={ResolvedClientEmbedUrl} canOpen={canOpen}>
						<HoverOverMe />
					</HoverCard>
				</Stack>
			</SmartCardProvider>
		</IntlProvider>
	);
};

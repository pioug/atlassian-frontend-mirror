import React from 'react';

import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';

import { Card } from '../../src/view/Card';
import { TitleBlock } from '../../src/view/FlexibleCard/components/blocks/title-block/TitleBlock';
import { getJsonLdResponse } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

class EmbeddedCardClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(getJsonLdResponse(url, {}, { name: 'Help Center article' }));
	}
}

const client = new EmbeddedCardClient('staging');
const linkNavigation = (url: string): { target: '_top'; url: string } => ({
	url: url.replace('/wiki/', '/portal/'),
	target: '_top',
});

export default function EmbeddedCardNavigation(): React.JSX.Element {
	return (
		<VRTestWrapper>
			<SmartCardProvider client={client} linkNavigation={linkNavigation}>
				<SmartCardProvider>
					<Card
						appearance="block"
						url="https://example.com/wiki/article"
						ui={{ clickableContainer: true }}
					>
						<TitleBlock hideTitleTooltip={true} />
					</Card>
				</SmartCardProvider>
			</SmartCardProvider>
		</VRTestWrapper>
	);
}

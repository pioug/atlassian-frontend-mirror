import React from 'react';

import Heading from '@atlaskit/heading/heading';
import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';
import { response1 } from '@atlaskit/link-test-helpers';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { Bleed, Box, Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { AuthorGroupElement, Card, PreviewElement } from '../../src';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(response1 as JsonLd.Response);
	}
}

export default (): React.JSX.Element => (
	<Provider client={new CustomClient('stg')}>
		<Card appearance="inline" ui={{ removeBlockRestriction: true }} url={response1.data.url}>
			<PreviewElement />
			<Bleed block="space.200">
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<Box style={{ paddingBottom: token('space.100'), marginTop: token('space.negative.150') }}>
					<AtlassianIcon appearance="brand" size="xlarge" />
				</Box>
			</Bleed>
			<Flex>
				<Heading size={'medium'}>{response1.data.name}</Heading>
				<AuthorGroupElement />
			</Flex>
		</Card>
	</Provider>
);

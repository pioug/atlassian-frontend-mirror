import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';

import { ResolvedClient, ResolvedClientEmbedUrl } from '../../examples/utils/custom-client';
import { Card } from '../../src';

export default () => {
	const [platform, setPlatform] = useState<React.ComponentProps<typeof Card>['platform']>('web');

	return (
		<SmartCardProvider client={new ResolvedClient('stg')}>
			<Box padding="space.100">
				<Stack space="space.100">
					<Inline space="space.100">
						<Button isDisabled={platform === 'web'} onClick={() => setPlatform('web')}>
							Web
						</Button>
						<Button isDisabled={platform === 'mobile'} onClick={() => setPlatform('mobile')}>
							Mobile
						</Button>
					</Inline>
					<Card
						appearance="embed"
						frameStyle="show"
						platform={platform}
						url={ResolvedClientEmbedUrl}
					/>
				</Stack>
			</Box>
		</SmartCardProvider>
	);
};

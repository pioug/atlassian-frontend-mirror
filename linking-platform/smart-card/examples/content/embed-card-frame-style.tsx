import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Box, Inline, Stack } from '@atlaskit/primitives';

import { ResolvedClient, ResolvedClientEmbedUrl } from '../../examples/utils/custom-client';
import { Card } from '../../src';

export default () => {
	const [frameStyle, setFrameStyle] =
		useState<React.ComponentProps<typeof Card>['frameStyle']>('show');

	return (
		<SmartCardProvider client={new ResolvedClient('stg')}>
			<Box padding="space.100">
				<Stack space="space.100">
					<Inline space="space.100">
						<Button isDisabled={frameStyle === 'show'} onClick={() => setFrameStyle('show')}>
							Show
						</Button>
						<Button isDisabled={frameStyle === 'hide'} onClick={() => setFrameStyle('hide')}>
							Hide
						</Button>
						<Button
							isDisabled={frameStyle === 'showOnHover'}
							onClick={() => setFrameStyle('showOnHover')}
						>
							Show on hover
						</Button>
					</Inline>
					<Card
						appearance="embed"
						frameStyle={frameStyle}
						platform="web"
						url={ResolvedClientEmbedUrl}
					/>
				</Stack>
			</Box>
		</SmartCardProvider>
	);
};

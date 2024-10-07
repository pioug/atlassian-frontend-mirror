import Link from '@atlaskit/link';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Box, Grid, Stack } from '@atlaskit/primitives';
import SectionMessage from '@atlaskit/section-message';
import React from 'react';
import { ResolvedClient, ResolvedClientEmbedUrl } from '../../examples/utils/custom-client';
import { Card } from '../../src';

export default () => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Box paddingBlockStart="space.300">
			<Grid alignItems="center" columnGap="space.100" templateColumns="1fr 1fr">
				<Stack space="space.600">
					<SectionMessage>
						You must be logged in to{' '}
						<Link
							href="https://pug.jira-dev.com"
							target="_blank"
							title="Login to staging environment"
						>
							staging environment
						</Link>{' '}
						to load the examples.
					</SectionMessage>
					<Card appearance="inline" showHoverPreview={true} url={ResolvedClientEmbedUrl} />
					<Card appearance="block" url={ResolvedClientEmbedUrl} />
				</Stack>
				<Card appearance="embed" frameStyle="show" platform="web" url={ResolvedClientEmbedUrl} />
			</Grid>
		</Box>
	</SmartCardProvider>
);

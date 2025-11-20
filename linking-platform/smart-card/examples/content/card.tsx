import React from 'react';

import { cssMap } from '@atlaskit/css';
import Link from '@atlaskit/link';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { ResolvedClient, ResolvedClientEmbedUrl } from '@atlaskit/link-test-helpers';
import { Box, Grid, Stack } from '@atlaskit/primitives/compiled';
import SectionMessage from '@atlaskit/section-message';

import { Card } from '../../src';

const gridStyles = cssMap({
	root: {
		gridTemplateColumns: '1fr 1fr',
	},
});

export default (): React.JSX.Element => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Box paddingBlockStart="space.300">
			<Grid alignItems="center" columnGap="space.100" xcss={gridStyles.root}>
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

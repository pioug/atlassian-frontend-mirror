import React, { useState } from 'react';

import Link from '@atlaskit/link';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import SectionMessage from '@atlaskit/section-message';
import { Card } from '@atlaskit/smart-card';

const StagingCardExample = ({
	url = 'about:blank',
	...props
}: Partial<React.ComponentProps<typeof Card>>) => {
	const [hasError, setHasError] = useState(false);

	return (
		<SmartCardProvider
			client={new CardClient('stg')}
			isAdminHubAIEnabled={true}
			product="CONFLUENCE"
		>
			<Box paddingBlockStart="space.200" paddingBlockEnd="space.100">
				{hasError ? (
					<SectionMessage>
						You must be logged in to{' '}
						<Link
							href="https://pug.jira-dev.com"
							target="_blank"
							title="Login to staging environment"
						>
							staging environment
						</Link>{' '}
						and have access to{' '}
						<Link href={url} target="_blank" title="Go to resource">
							this resource
						</Link>{' '}
						to load this example.
					</SectionMessage>
				) : (
					<Stack alignInline="center">
						<Card appearance="block" onError={() => setHasError(true)} url={url} {...props} />
					</Stack>
				)}
			</Box>
		</SmartCardProvider>
	);
};

export default StagingCardExample;

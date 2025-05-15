/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import Heading from '@atlaskit/heading';
import InlineMessage from '@atlaskit/inline-message';
import Link from '@atlaskit/link';
import { Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		display: 'flex',
		justifyContent: 'center',
		paddingBlock: token('space.1000'),
	},
});

export default function InlineMessageFallbackPlacementsExample() {
	return (
		<div css={styles.root}>
			<InlineMessage
				appearance="connectivity"
				title="JIRA Service Desk"
				secondaryText="Carrot cake chocolate bar caramels."
				placement="right"
				fallbackPlacements={['bottom']}
				testId="inline-message"
			>
				<Stack space="space.100">
					<Heading size="small" as="h2">
						Authenticate heading
					</Heading>
					<Text>
						<Link href="http://www.atlassian.com">Authenticate</Link> to see more information
					</Text>
				</Stack>
			</InlineMessage>
		</div>
	);
}

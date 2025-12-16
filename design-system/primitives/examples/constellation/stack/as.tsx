import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';

export default function Example(): React.JSX.Element {
	return (
		<Inline spread="space-between">
			<Stack space="space.150">
				<Heading size="small">Stack as 'div'</Heading>
				<Stack space="space.200">
					<Box>First child</Box>
					<Box>Second child</Box>
					<Box>Third child</Box>
					<Box>Fourth child</Box>
				</Stack>
			</Stack>
			<Stack space="space.150">
				<Heading size="small">Stack as 'span'</Heading>
				<Stack as="span" space="space.200">
					<Box>First child</Box>
					<Box>Second child</Box>
					<Box>Third child</Box>
					<Box>Fourth child</Box>
				</Stack>
			</Stack>
			<Box>
				<Heading size="small">Stack as 'ul'</Heading>
				<Stack as="ul" space="space.200">
					<li>Unordered List Item</li>
					<li>Unordered List Item</li>
					<li>Unordered List Item</li>
					<li>Unordered List Item</li>
				</Stack>
			</Box>
			<Box>
				<Heading size="small">Stack as 'ol'</Heading>
				<Stack as="ol" space="space.200">
					<li>Ordered List Item</li>
					<li>Ordered List Item</li>
					<li>Ordered List Item</li>
					<li>Ordered List Item</li>
				</Stack>
			</Box>
			<Box>
				<Heading size="small">Stack as 'dl'</Heading>
				<Stack as="dl" space="space.200">
					<Box as="dt">Jira</Box>
					<Box as="dd">Flexible project management</Box>
					<Box as="dt">Confluence</Box>
					<Box as="dd">Knowledge, all in one place</Box>
					<Box as="dt">BitBucket</Box>
					<Box as="dd">Collaborative code repos</Box>
				</Stack>
			</Box>
		</Inline>
	);
}

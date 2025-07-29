import React from 'react';

import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import SectionMessage from '@atlaskit/section-message';

const Example = () => (
	<Box padding="space.250">
		<Stack space="space.150">
			<SectionMessage title="New" testId="section-message" appearance="discovery" isDismissible>
				<Text as="p">
					This is a live doc! You can make updates instantly without having to publish.
				</Text>
			</SectionMessage>
			<SectionMessage title="New" testId="section-message" appearance="information" isDismissible>
				<Text as="p">
					This is a live doc! You can make updates instantly without having to publish.
				</Text>
			</SectionMessage>
			<SectionMessage title="New" testId="section-message" appearance="warning" isDismissible>
				<Text as="p">
					This is a live doc! You can make updates instantly without having to publish.
				</Text>
			</SectionMessage>
		</Stack>
	</Box>
);

export default Example;

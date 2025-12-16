import React from 'react';

import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import SectionMessage from '@atlaskit/section-message';

const Example = (): React.JSX.Element => (
	<Box padding="space.250">
		<Stack space="space.150">
			<SectionMessage
				title="New"
				testId="section-message"
				appearance="discovery"
				isDismissible
				onDismiss={() => {
					console.log('dismissed');
				}}
			>
				<Text as="p">
					This is a live doc! You can make updates instantly without having to publish.
				</Text>
			</SectionMessage>
			<SectionMessage
				title="New"
				testId="section-message"
				appearance="information"
				isDismissible
				onDismiss={() => {
					console.log('dismissed');
				}}
			>
				<Text as="p">
					This is a live doc! You can make updates instantly without having to publish.
				</Text>
			</SectionMessage>
			<SectionMessage
				title="New"
				testId="section-message"
				appearance="warning"
				isDismissible
				onDismiss={() => {
					console.log('dismissed');
				}}
			>
				<Text as="p">
					This is a live doc! You can make updates instantly without having to publish.
				</Text>
			</SectionMessage>
		</Stack>
	</Box>
);

export default Example;

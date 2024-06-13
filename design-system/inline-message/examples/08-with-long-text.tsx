import React from 'react';

import Heading from '@atlaskit/heading';
import Link from '@atlaskit/link';
import { Stack, Text } from '@atlaskit/primitives';

import InlineMessage from '../src';

const messageContent = (
	<Stack space="space.100">
		<Heading size="small">Authenticate heading</Heading>
		<Text>
			<Link href="http://www.atlassian.com">Authenticate</Link> to see more information
		</Text>
	</Stack>
);

export default () => (
	<InlineMessage
		appearance="connectivity"
		title="JIRA Service Desk"
		secondaryText="Carrot cake chocolate bar caramels. Wafer jelly beans toffee chocolate ice cream jujubes candy canes. Sugar plum brownie jelly chocolate cake. Candy canes topping halvah tiramisu caramels dessert brownie jelly-o. Sweet tart cookie cupcake jelly-o jelly caramels bear claw."
	>
		{messageContent}
	</InlineMessage>
);

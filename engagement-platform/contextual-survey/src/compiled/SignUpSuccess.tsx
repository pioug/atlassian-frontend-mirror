import React from 'react';

import Heading from '@atlaskit/heading';
import { Stack, Text } from '@atlaskit/primitives/compiled';

import SuccessContainer from './SuccessContainer';

interface Props {}

export default ({}: Props) => (
	<SuccessContainer>
		<Stack space="space.150">
			<Heading size="xsmall">Thanks for signing up</Heading>
			<Text as="p">
				We may reach out to you in the future to participate in additional research.
			</Text>
		</Stack>
	</SuccessContainer>
);

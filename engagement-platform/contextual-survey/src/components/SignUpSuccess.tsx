/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Heading from '@atlaskit/heading';
import { Stack, Text } from '@atlaskit/primitives';

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

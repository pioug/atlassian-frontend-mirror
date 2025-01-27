import React from 'react';

import styled from '@emotion/styled';

import { Presence } from '@atlaskit/avatar';
import { Code } from '@atlaskit/code';
import Heading from '@atlaskit/heading';
import { Stack, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Container = styled.div({
	display: 'flex',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const PresenceWrapper = styled.div({
	height: '30px',
	width: '30px',
	marginRight: token('space.100', '8px'),
});

export default () => (
	<Stack space="space.200">
		<Heading as="h2" size="large">
			Custom background color
		</Heading>
		<Stack>
			<Text as="p">
				By default presences will display a white border. This can be overridden with the
				<Code>borderColor</Code> property.
			</Text>
			<Text as="p">
				The <Code>borderColor</Code> property will accept any string that CSS border-color can e.g.
				hex, rgba, transparent, etc.
			</Text>
		</Stack>
		<Container>
			<PresenceWrapper>
				<Presence presence="online" />
			</PresenceWrapper>

			<PresenceWrapper>
				<Presence presence="busy" borderColor={token('color.border.discovery')} />
			</PresenceWrapper>

			<PresenceWrapper>
				<Presence presence="offline" borderColor={token('color.border.brand')} />
			</PresenceWrapper>

			<PresenceWrapper>
				<Presence presence="focus" borderColor="transparent" />
			</PresenceWrapper>
		</Container>
	</Stack>
);

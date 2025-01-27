import React from 'react';

import styled from '@emotion/styled';

import Avatar from '@atlaskit/avatar';
import { token } from '@atlaskit/tokens';

import { Block } from '../examples-util/helpers';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const DivPresence = styled.div({
	alignItems: 'center',
	backgroundColor: token('color.background.discovery.bold'),
	color: token('elevation.surface'),
	display: 'flex',
	font: token('font.body.small'),
	fontWeight: token('font.weight.medium'),
	height: '100%',
	justifyContent: 'center',
	textAlign: 'center',
	width: '100%',
});

export default () => (
	<Block heading="Custom div as status">
		<Avatar
			name="xxlarge"
			size="xxlarge"
			appearance="square"
			status={<DivPresence>1</DivPresence>}
		/>
		<Avatar name="xlarge" size="xlarge" appearance="square" status={<DivPresence>1</DivPresence>} />
		<Avatar name="large" size="large" appearance="square" status={<DivPresence>1</DivPresence>} />
		<Avatar name="medium" size="medium" appearance="square" status={<DivPresence>1</DivPresence>} />
		<Avatar name="small" size="small" appearance="square" status={<DivPresence>1</DivPresence>} />
		<Avatar name="xsmall" size="xsmall" appearance="square" status={<DivPresence>1</DivPresence>} />
	</Block>
);

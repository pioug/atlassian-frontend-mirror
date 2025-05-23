import React from 'react';

import { styled } from '@compiled/react';

import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const LabelElement = styled.label({
	font: token('font.body.UNSAFE_small'),
	fontWeight: token('font.weight.semibold'),
	color: token('color.text.subtle'),
	display: 'inline-block',
	marginBottom: token('space.050'),
	marginTop: 0,
});

export function Label(
	props: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
) {
	return (
		<Box>
			<LabelElement {...(props as any)} />
		</Box>
	);
}

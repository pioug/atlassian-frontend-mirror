import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { Box } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const LabelElement = styled.label({
	font: token('font.body.UNSAFE_small'),
	fontWeight: token('font.weight.semibold'),
	color: token('color.text.subtle'),
	display: 'inline-block',
	marginBottom: token('space.050', '4px'),
	marginTop: 0,
});

export function Label(
	props: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
) {
	return (
		<Box>
			{/* eslint-disable-next-line styled-components-a11y/label-has-associated-control,styled-components-a11y/label-has-for */}
			<LabelElement {...(props as any)} />
		</Box>
	);
}

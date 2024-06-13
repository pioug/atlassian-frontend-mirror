import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const FormRowContainer = styled.div<{ isNarrowGap?: boolean }>((props) => ({
	alignItems: 'center',
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	gap: props.isNarrowGap ? token('space.100', '8px') : token('space.200', '16px'),
	flexGrow: 1,
	width: '100%',
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const FormContainer = styled.form({
	display: 'grid',
	rowGap: token('space.200', '16px'),
	width: '100%',
});

// Override the top margin of fields
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const FieldContainer = styled.div({
	flex: 1,
	marginTop: token('space.negative.100', '-8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SchemaSelectContainer = styled.div({
	width: '100%',
	maxWidth: '386px',
});

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { type ReactNode } from 'react';

// eslint-disable-next-line no-restricted-imports, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { N100, R400, R50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Wrapper = styled.div({
	marginTop: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ChildrenWrapper = styled.div({
	alignItems: 'baseline',
	color: token('color.text'),
	display: 'flex',
	flexWrap: 'wrap',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		marginRight: token('space.100', '8px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const Note = styled.p<{ size?: string }>((props) => ({
	color: N100,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	fontSize: props.size === 'large' ? '1.15em' : '0.9rem',
	marginTop: token('space.050', '4px'),
	marginBottom: token('space.200', '16px'),
}));

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Code = styled.code({
	backgroundColor: R50,
	borderRadius: '0.2em',
	color: R400,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: '0.85em',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1.1,
	padding: '0.1em 0.4em',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Gap = styled.span({
	marginRight: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ShrinkWrap = styled(Gap)({
	height: token('space.300', '24px'),
	width: token('space.300', '24px'),
});
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Heading = styled.div({
	color: token('color.text.subtlest'),
	display: 'flex',
	fontSize: '0.8rem',
	fontWeight: token('font.weight.medium'),
	marginBottom: token('space.100', '0.5em'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	textTransform: 'uppercase',
});

export const Block = ({
	children,
	heading,
	testId,
}: {
	children?: ReactNode;
	heading?: string;
	testId?: string;
}) => (
	<Wrapper data-testid={testId}>
		{heading ? <Heading>{heading}</Heading> : null}
		<ChildrenWrapper>{children}</ChildrenWrapper>
	</Wrapper>
);

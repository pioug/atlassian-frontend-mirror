import type { FC, HTMLProps } from 'react';

import { withFocusWithin } from 'react-focus-within';
// TODO: should use @emotion
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled, { css } from 'styled-components';

// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
const transition = css`
	transition: all 200ms ease-in-out;
`;

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const PanelWrapper = styled.div`
	margin: 0 auto ${token('space.200', '16px')};
`;

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ButtonWrapper = styled.div<{ isHidden: boolean }>`
	left: 0;
	line-height: 0;
	opacity: ${({ isHidden }) => (isHidden ? 0 : 1)};
	position: absolute;
	${transition};

	/* IE 11 needs these vertical positioning rules - the flexbox
  behavior for absolute-positioned children is not up to spec.
  https://googlechrome.github.io/samples/css-flexbox-abspos/ */
	top: 50%;
	transform: translateY(-50%);

	button {
		pointer-events: none;
	}
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const PanelHeader: FC<
	HTMLProps<HTMLDivElement> & { isFocused?: boolean }
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/design-system/no-styled-tagged-template-expression -- Ignored via go/DSP-18766
> = withFocusWithin(styled.div<{ isFocused?: boolean }>`
	align-items: center;
	background-color: ${(props) => props.isFocused && token('elevation.surface.hovered', colors.N20)};
	border-radius: ${token('border.radius.100', '3px')};
	display: flex;
	left: ${token('space.negative.300', '-24px')};
	margin-bottom: ${token('space.100', '8px')};
	margin-top: ${token('space.200', '16px')};
	padding: ${token('space.025', '2px')} ${token('space.0', '0px')} ${token('space.025', '2px')}
		${token('space.300', '24px')};
	position: relative;
	${transition};
	width: 100%;

	${ButtonWrapper} {
		opacity: ${(props) => props.isFocused && 1};
	}

	&:hover {
		background-color: ${token('elevation.surface.hovered', colors.N20)};
		cursor: pointer;

		${ButtonWrapper} {
			opacity: 1;
		}
	}
`);

import type { ClassAttributes, DetailedHTMLProps, FC, HTMLAttributes, HTMLProps } from 'react';

import { withFocusWithin } from 'react-focus-within';
// TODO: should use @emotion
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled, { css, type StyledComponentClass } from 'styled-components';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
const transition = css`
	transition: all 200ms ease-in-out;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const PanelWrapper: StyledComponentClass<
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	any,
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
	// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
> = styled.div`
	margin: 0 auto ${token('space.200')};
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ButtonWrapper: StyledComponentClass<
	ClassAttributes<HTMLDivElement> &
		HTMLAttributes<HTMLDivElement> & {
			isHidden: boolean;
		},
	any,
	ClassAttributes<HTMLDivElement> &
		HTMLAttributes<HTMLDivElement> & {
			isHidden: boolean;
		}
	// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766
> = styled.div<{ isHidden: boolean }>(
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles
	(props) => ({
		left: 0,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 0,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		opacity: props.isHidden ? 0 : 1,
		position: 'absolute',
	}),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	transition,
	{
		top: '50%',
		transform: 'translateY(-50%)',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		button: {
			pointerEvents: 'none',
		},
	},
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @typescript-eslint/ban-types -- Ignored via go/DSP-18766
export const PanelHeader: FC<
	HTMLProps<HTMLDivElement> & { isFocused?: boolean }
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/design-system/no-styled-tagged-template-expression -- Ignored via go/DSP-18766
> = withFocusWithin(styled.div<{ isFocused?: boolean }>`
	align-items: center;
	background-color: ${(props) => props.isFocused && token('elevation.surface.hovered')};
	border-radius: ${token('radius.small', '3px')};
	display: flex;
	left: ${token('space.negative.300')};
	margin-bottom: ${token('space.100')};
	margin-top: ${token('space.200')};
	padding: ${token('space.025')} ${token('space.0')} ${token('space.025')} ${token('space.300')};
	position: relative;
	${transition};
	width: 100%;

	${ButtonWrapper} {
		opacity: ${(props) => props.isFocused && 1};
	}

	&:hover {
		background-color: ${token('elevation.surface.hovered')};
		cursor: pointer;

		${ButtonWrapper} {
			opacity: 1;
		}
	}
`);

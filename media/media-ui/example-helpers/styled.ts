/* eslint-disable @atlaskit/ui-styling-standard/use-compiled, @atlaskit/ui-styling-standard/no-styled -- Ignored via go/DSP-18766 */
import { token } from '@atlaskit/tokens';
import type { Theme } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled, { type StyledComponent } from '@emotion/styled';
import type {
	DetailedHTMLProps,
	HTMLAttributes,
	LiHTMLAttributes,
	ButtonHTMLAttributes,
	LabelHTMLAttributes,
} from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const InputWrapper: StyledComponent<
	{
		theme?: Theme;
		as?: React.ElementType;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> = styled.div({
	margin: `${token('space.250')} 0`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const PreviewList: StyledComponent<
	{
		theme?: Theme;
		as?: React.ElementType;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
	{}
> = styled.ul({
	margin: 0,
	padding: 0,
	listStyleType: 'none',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const PreviewItem: StyledComponent<
	{
		theme?: Theme;
		as?: React.ElementType;
	},
	DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>,
	{}
> = styled.li({
	borderRadius: token('space.100'),
	border: `${token('border.width', '1px')} solid ${token('color.border')}`,
	padding: token('space.100'),
	overflow: 'auto',
	maxHeight: '600px',
	position: 'relative',
	marginBottom: token('space.100'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Code: StyledComponent<
	{
		theme?: Theme;
		as?: React.ElementType;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
	{}
> = styled.code({
	padding: token('space.050'),
	borderRadius: token('space.050'),
	backgroundColor: token('color.background.inverse.subtle'),
	color: token('color.text'),
	font: token('font.code'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const CloseButton: StyledComponent<
	{
		theme?: Theme;
		as?: React.ElementType;
	},
	DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
	{}
> = styled.button({
	position: 'absolute',
	top: token('space.050'),
	right: token('space.050'),
	cursor: 'pointer',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const PreviewImageContainer: StyledComponent<
	{
		theme?: Theme;
		as?: React.ElementType;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> = styled.div({
	marginTop: token('space.100'),
	marginBottom: token('space.100'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const OrientationSelectWrapper: StyledComponent<
	{
		theme?: Theme;
		as?: React.ElementType;
	},
	DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
	{}
> = styled.label({
	marginBottom: token('space.250'),
	display: 'block',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const TimeRangeWrapper: StyledComponent<
	{
		theme?: Theme;
		as?: React.ElementType;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> = styled.div({
	marginTop: token('space.500'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Container: StyledComponent<
	{
		theme?: Theme;
		as?: React.ElementType;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> = styled.div({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Group: StyledComponent<
	{
		theme?: Theme;
		as?: React.ElementType;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> = styled.div({
	width: '250px',
	padding: token('space.250'),
});

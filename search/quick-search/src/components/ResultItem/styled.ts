// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled, { type StyledComponentClass } from 'styled-components';
import { token } from '@atlaskit/tokens';
import type { ClassAttributes, HTMLAttributes, DetailedHTMLProps } from 'react';

// Copied from `@atlaskit/theme` to allow removal of that package
const N200 = '#6B778C';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const ResultItemAfter: StyledComponentClass<
	ClassAttributes<HTMLDivElement> &
		HTMLAttributes<HTMLDivElement> & {
			shouldTakeSpace: boolean;
		},
	any,
	ClassAttributes<HTMLDivElement> &
		HTMLAttributes<HTMLDivElement> & {
			shouldTakeSpace: boolean;
		}
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-dynamic-styles
> = styled.div<{ shouldTakeSpace: boolean }>((props) => ({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minWidth: props.shouldTakeSpace ? '24px' : 0,
}));

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ResultItemAfterWrapper: StyledComponentClass<
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	any,
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
> = styled.div({
	display: 'flex',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ResultItemCaption: StyledComponentClass<
	DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
	any,
	DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
> = styled.span({
	color: N200,
	font: token('font.body.small'),
	marginLeft: token('space.100'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ResultItemSubText: StyledComponentClass<
	DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
	any,
	DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
> = styled.span({
	font: token('font.body.small'),
	color: N200,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ResultItemIcon: StyledComponentClass<
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	any,
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
> = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
	transition: 'padding 200ms',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		flex: '1 0 auto',
	},

	/* We need to ensure that any image passed in as a child (<img/>, <svg/>
    etc.) receives the correct width, height and border radius. We don't
    currently assume that the image passed in is the correct dimensions, or has
    width / height 100% */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> img': {
		height: token('space.300'),
		width: token('space.300'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ResultItemTextAfter: StyledComponentClass<
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	any,
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
> = styled.div({
	position: 'relative',
	zIndex: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled, { type StyledComponentClass } from 'styled-components';
import { token } from '@atlaskit/tokens';
import type { HTMLAttributes, DetailedHTMLProps } from 'react';

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

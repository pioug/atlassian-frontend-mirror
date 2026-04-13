// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type CSSObject } from '@emotion/react';

export const overlayCss: CSSObject = {
	// stretching to full width / height of button
	// this is important as we need it to still block
	// event if clicking in the button's own padding
	position: 'absolute',
	left: 0,
	top: 0,
	right: 0,
	bottom: 0,

	// Putting all children in the center
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};

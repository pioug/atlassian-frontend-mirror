/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const reactionPickerStyle = css({
	display: 'inline-block',
	marginTop: token('space.050', '4px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const seeWhoReactedStyle = css({
	height: '24px',
	lineHeight: '24px',
	paddingLeft: 0,
	paddingRight: 0,
	marginTop: token('space.050', '4px'),
	marginLeft: token('space.050', '4px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const wrapperStyle = css({
	display: 'flex',
	flexWrap: 'wrap',
	position: 'relative',
	alignItems: 'center',
	borderRadius: '15px',
	marginTop: token('space.negative.050', '-4px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'> :first-of-type > :first-of-type': { marginLeft: 0 },
});

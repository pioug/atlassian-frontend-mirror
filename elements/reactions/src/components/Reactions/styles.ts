/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const reactionPickerStyle = css({
	display: 'inline-block',
	marginTop: token('space.050', '4px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
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

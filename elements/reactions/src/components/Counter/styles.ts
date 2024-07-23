/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { N90, B400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const countStyle = css({
	fontSize: 11,
	color: token('color.text.subtlest', N90),
	overflow: 'hidden',
	position: 'relative',
	padding: `${token('space.050', '4px')} ${token('space.100', '8px')} ${token(
		'space.050',
		'4px',
	)} 0`,
	lineHeight: '14px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const containerStyle = css({
	display: 'flex',
	flexDirection: 'column',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const highlightStyle = css({
	color: token('color.text.selected', B400),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const counterLabelStyle = css({
	fontVariantNumeric: 'tabular-nums',
});

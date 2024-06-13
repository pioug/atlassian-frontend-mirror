import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { checkeredBg } from '../src/image-placer/styles';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const labelStyles = css({
	display: 'block',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> input': {
		marginLeft: token('space.100', '8px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> span': {
		display: 'inline-block',
		minWidth: '120px',
		textAlign: 'right',
	},
});
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const exportedImageStyles = css({
	border: `1px solid ${token('color.border', '#ccc')}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const exportedImageWrapperStyles = css({
	display: 'inline-block',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	background: `url('${checkeredBg}')`,
	marginTop: token('space.250', '20px'),
	position: 'relative',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const layoutStyles = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'space-around',
	height: '80vh',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const wrapperStyles = css({
	margin: token('space.100', '8px'),
});

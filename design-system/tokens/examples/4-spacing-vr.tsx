/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Box, Inline, xcss } from '@atlaskit/primitives';

import { useVrGlobalTheme } from './utils/use-vr-global-theme';

const styleMap = {
	'space.negative.400': xcss({ marginBlockStart: 'space.negative.400' }),
	'space.negative.300': xcss({ marginBlockStart: 'space.negative.300' }),
	'space.negative.200': xcss({ marginBlockStart: 'space.negative.200' }),
	'space.negative.150': xcss({ marginBlockStart: 'space.negative.150' }),
	'space.negative.100': xcss({ marginBlockStart: 'space.negative.100' }),
	'space.negative.075': xcss({ marginBlockStart: 'space.negative.075' }),
	'space.negative.050': xcss({ marginBlockStart: 'space.negative.050' }),
	'space.negative.025': xcss({ marginBlockStart: 'space.negative.025' }),
	'0': xcss({ marginBlockStart: '0' }),
	'space.025': xcss({ marginBlockStart: 'space.025' }),
	'space.050': xcss({ marginBlockStart: 'space.050' }),
	'space.075': xcss({ marginBlockStart: 'space.075' }),
	'space.100': xcss({ marginBlockStart: 'space.100' }),
	'space.150': xcss({ marginBlockStart: 'space.150' }),
	'space.200': xcss({ marginBlockStart: 'space.200' }),
	'space.300': xcss({ marginBlockStart: 'space.300' }),
	'space.400': xcss({ marginBlockStart: 'space.400' }),
	'space.500': xcss({ marginBlockStart: 'space.500' }),
	'space.600': xcss({ marginBlockStart: 'space.600' }),
	'space.800': xcss({ marginBlockStart: 'space.800' }),
	'space.1000': xcss({ marginBlockStart: 'space.1000' }),
};
const rootStyles = xcss({
	// To ensure the VR snapshot captures the absolutely-positioned negative Boxes
	height: '200px',
});

const containerStyles = xcss({
	paddingBlockStart: 'space.500',
});
const baseBoxStyles = xcss({
	backgroundColor: 'color.background.discovery.bold',
	height: '64px',
	width: '64px',
});

export default () => {
	useVrGlobalTheme();
	return (
		<Box testId="spacing" xcss={rootStyles}>
			<h1>Spacing scale</h1>
			<Inline space="space.100" xcss={containerStyles}>
				<Box xcss={[baseBoxStyles, styleMap['space.negative.400']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.negative.300']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.negative.200']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.negative.150']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.negative.100']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.negative.075']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.negative.050']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.negative.025']]} />
				<Box xcss={[baseBoxStyles, styleMap['0']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.050']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.075']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.100']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.150']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.200']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.300']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.400']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.500']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.600']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.800']]} />
				<Box xcss={[baseBoxStyles, styleMap['space.1000']]} />
			</Inline>
		</Box>
	);
};

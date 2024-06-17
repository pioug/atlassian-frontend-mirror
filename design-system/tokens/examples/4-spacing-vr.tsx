/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Box, Inline, xcss } from '@atlaskit/primitives';

import { token } from '../src';
import type defaultTokenValues from '../src/artifacts/token-default-values';

const ExampleSizeBox = ({
	scaleToken,
	fallback,
}: {
	scaleToken: keyof typeof defaultTokenValues;
	fallback: string;
}) => {
	// Since we're using this for the width/height it needs to be positive
	const absToken = scaleToken.replace('.negative', '') as keyof typeof defaultTokenValues;

	const boxStyles = xcss({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: token(absToken, fallback),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: token(absToken, fallback),
		backgroundColor: 'color.background.brand.bold',
		position: 'relative',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		insetBlockStart: scaleToken.includes('negative') ? token(absToken, fallback) : '0',
	});

	return <Box xcss={boxStyles}></Box>;
};

const containerStyles = xcss({
	// To ensure the VR snapshot captures the absolutely-positioned negative Boxes
	height: '200px',
});

export default () => {
	return (
		<Box testId="spacing" xcss={containerStyles}>
			<h1>Spacing scale</h1>
			<Inline space="space.100" alignBlock="end">
				{/* fallbacks specifically chosen to validate tokens are applied correctly when present and not applied when not */}
				<ExampleSizeBox scaleToken="space.negative.400" fallback="2em" />
				<ExampleSizeBox scaleToken="space.negative.300" fallback="12px" />
				<ExampleSizeBox scaleToken="space.negative.200" fallback="32px" />
				<ExampleSizeBox scaleToken="space.negative.150" fallback="4rem" />
				<ExampleSizeBox scaleToken="space.negative.100" fallback="40px" />
				<ExampleSizeBox scaleToken="space.negative.075" fallback="22px" />
				<ExampleSizeBox scaleToken="space.negative.050" fallback="6px" />
				<ExampleSizeBox scaleToken="space.negative.025" fallback="12px" />
				<ExampleSizeBox scaleToken="space.025" fallback="12px" />
				<ExampleSizeBox scaleToken="space.050" fallback="6px" />
				<ExampleSizeBox scaleToken="space.075" fallback="22px" />
				<ExampleSizeBox scaleToken="space.100" fallback="40px" />
				<ExampleSizeBox scaleToken="space.150" fallback="4rem" />
				<ExampleSizeBox scaleToken="space.200" fallback="32px" />
				<ExampleSizeBox scaleToken="space.300" fallback="12px" />
				<ExampleSizeBox scaleToken="space.400" fallback="2em" />
				<ExampleSizeBox scaleToken="space.500" fallback="52px" />
				<ExampleSizeBox scaleToken="space.600" fallback="0.5rem" />
				<ExampleSizeBox scaleToken="space.800" fallback="0.5rem" />
				<ExampleSizeBox scaleToken="space.1000" fallback="0.5rem" />
			</Inline>
		</Box>
	);
};

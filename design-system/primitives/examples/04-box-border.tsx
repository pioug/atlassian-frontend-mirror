/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
import React from 'react';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

const borderColors = [
	'color.border.discovery',
	'color.border.success',
	'color.border.warning',
	'color.border.danger',
	'color.border.information',
	'color.border.brand',
] as const;

const borderStyles = ['none', 'solid'] as const;
const borderWidths = ['border.width', 'border.width.selected', 'border.width.focused'] as const;
const borderRadii = [
	'radius.xsmall',
	'radius.small',
	'radius.medium',
	'radius.large',
	'radius.xlarge',
	'radius.full',
] as const;

const baseBorderStyles = xcss({
	borderStyle: 'solid',
});
const squareStyles = xcss({
	height: 'size.600',
	width: 'size.600',
});

/**
 * Box permutations
 */
export default (): React.JSX.Element => {
	return (
		<Stack space="space.400" alignInline="start">
			<Stack space="space.200" testId="box-with-borderWidth">
				<Heading size="medium">borderWidth</Heading>
				<Inline space="space.200" alignBlock="center">
					{borderWidths.map((borderWidth) => (
						<Box
							key={borderWidth}
							backgroundColor="color.background.neutral"
							padding="space.400"
							xcss={[
								baseBorderStyles,
								// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								xcss({
									borderColor: 'color.border.danger',
									borderWidth,
								}),
							]}
						>
							<Box>{borderWidth}</Box>
						</Box>
					))}
				</Inline>
			</Stack>

			<Stack space="space.200" testId="box-with-borderStyle">
				<Heading size="medium">borderStyle</Heading>
				<Inline space="space.200" alignBlock="center">
					{borderStyles.map((borderStyle) => (
						<Box
							key={borderStyle}
							backgroundColor="color.background.neutral"
							padding="space.400"
							xcss={[
								baseBorderStyles,
								// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								xcss({
									borderStyle,
								}),
							]}
						>
							<Box>{borderStyle}</Box>
						</Box>
					))}
				</Inline>
			</Stack>

			<Stack space="space.200" testId="box-with-borderColor">
				<Heading size="medium">borderColor</Heading>
				<Inline space="space.200" alignBlock="center">
					{borderColors.map((borderColor) => (
						<Box
							key={borderColor}
							backgroundColor="color.background.neutral"
							padding="space.400"
							// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
							xcss={xcss({
								borderStyle: 'solid',
								borderColor,
							})}
						>
							<Box>{borderColor}</Box>
						</Box>
					))}
				</Inline>
			</Stack>

			<Stack space="space.200" testId="box-with-borderColor">
				<Heading size="medium">borderRadius</Heading>
				<Inline space="space.800" alignBlock="center">
					{borderRadii.map((borderRadius) => (
						<Box
							key={borderRadius}
							backgroundColor="color.background.neutral"
							padding="space.400"
							xcss={[
								baseBorderStyles,
								squareStyles,
								// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								xcss({
									borderRadius,
								}),
							]}
						>
							{borderRadius}
						</Box>
					))}
				</Inline>
			</Stack>
		</Stack>
	);
};

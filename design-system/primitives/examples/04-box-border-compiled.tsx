/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { token } from '@atlaskit/tokens';

import { Box, Inline, Stack } from '../src/compiled';

const borderColors = [
	'color.border.discovery',
	'color.border.success',
	'color.border.warning',
	'color.border.danger',
	'color.border.information',
	'color.border.brand',
] as const;

const borderStyles = ['none', 'solid'] as const;
const borderWidths = ['border.width', 'border.width.outline', 'border.width.indicator'] as const;
const borderRadii = [
	'border.radius.100',
	'border.radius.200',
	'border.radius.300',
	'border.radius.400',
	'border.radius.circle',
] as const;

const styles = cssMap({
	border: { borderStyle: 'solid' },
	danger: { borderColor: token('color.border.danger') },
	square: { width: '6rem', height: '6rem' },
});

const borderColorMap = cssMap({
	'color.border.discovery': { borderColor: token('color.border.discovery') },
	'color.border.success': { borderColor: token('color.border.success') },
	'color.border.warning': { borderColor: token('color.border.warning') },
	'color.border.danger': { borderColor: token('color.border.danger') },
	'color.border.information': { borderColor: token('color.border.information') },
	'color.border.brand': { borderColor: token('color.border.brand') },
});

const borderStyleMap = cssMap({
	none: { borderStyle: 'none' },
	solid: { borderStyle: 'solid' },
});

const borderWidthMap = cssMap({
	'border.width': { borderWidth: token('border.width') },
	'border.width.outline': { borderWidth: token('border.width.outline') },
	'border.width.indicator': { borderWidth: token('border.width.indicator') },
});

const borderRadiusMap = cssMap({
	'border.radius.100': { borderRadius: token('border.radius.100') },
	'border.radius.200': { borderRadius: token('border.radius.200') },
	'border.radius.300': { borderRadius: token('border.radius.300') },
	'border.radius.400': { borderRadius: token('border.radius.400') },
	'border.radius.circle': { borderRadius: token('border.radius.circle') },
});

/**
 * Box permutations
 */
export default () => {
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
							xcss={cx(styles.border, styles.danger, borderWidthMap[borderWidth])}
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
							xcss={cx(styles.border, borderStyleMap[borderStyle])}
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
							xcss={cx(styles.border, borderColorMap[borderColor])}
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
							xcss={cx(styles.border, styles.square, borderRadiusMap[borderRadius])}
						>
							{borderRadius}
						</Box>
					))}
				</Inline>
			</Stack>
		</Stack>
	);
};

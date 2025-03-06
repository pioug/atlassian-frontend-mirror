/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const spacingValues = [
	'space.0',
	'space.025',
	'space.050',
	'space.075',
	'space.100',
	'space.150',
	'space.200',
	'space.250',
	'space.300',
	'space.400',
	'space.500',
	'space.600',
	'space.800',
	'space.1000',
] as const;

const backgroundColors = [
	'color.background.discovery.bold',
	'color.background.success.bold',
	'color.background.selected.bold',
	'color.background.danger.bold',
	'color.background.information.bold',
	'color.background.brand.bold',
] as const;

const borderColors = [
	'color.border.discovery',
	'color.border.success',
	'color.border.warning',
	'color.border.danger',
	'color.border.information',
	'color.border.brand',
] as const;
const elevations = [
	'elevation.shadow.raised',
	'elevation.shadow.overflow',
	'elevation.shadow.overlay',
] as const;

const styles = cssMap({
	inverse: { color: token('color.text.inverse') },
	warningInverse: { color: token('color.text.warning.inverse') },
	bordered: {
		borderStyle: 'solid',
		borderWidth: token('border.width'),
	},
});

const borderMap = cssMap({
	'color.border.discovery': { borderColor: token('color.border.discovery') },
	'color.border.success': { borderColor: token('color.border.success') },
	'color.border.warning': { borderColor: token('color.border.warning') },
	'color.border.danger': { borderColor: token('color.border.danger') },
	'color.border.information': { borderColor: token('color.border.information') },
	'color.border.brand': { borderColor: token('color.border.brand') },
});

const shadowMap = cssMap({
	'elevation.shadow.raised': { boxShadow: token('elevation.shadow.raised') },
	'elevation.shadow.overflow': { boxShadow: token('elevation.shadow.overflow') },
	'elevation.shadow.overlay': { boxShadow: token('elevation.shadow.overlay') },
});

/**
 * Box permutations
 */
export default () => {
	return (
		<Stack space="space.400" alignInline="start">
			<Stack space="space.200" testId="box-with-background-and-paddingBlock">
				<Heading size="medium">paddingBlock</Heading>
				<Inline space="space.200" alignBlock="center">
					{spacingValues.map((space) => (
						<Box key={space} backgroundColor="color.background.discovery.bold" paddingBlock={space}>
							<Box backgroundColor="elevation.surface">{space}</Box>
						</Box>
					))}
				</Inline>
			</Stack>
			<Stack space="space.200" testId="box-with-background-and-paddingInline">
				<Heading size="medium">paddingInline</Heading>
				<Stack space="space.200" alignInline="center">
					{spacingValues.map((space) => (
						<Box
							key={space}
							backgroundColor="color.background.discovery.bold"
							paddingInline={space}
						>
							<Box backgroundColor="elevation.surface">{space}</Box>
						</Box>
					))}
				</Stack>
			</Stack>
			<Stack space="space.200" testId="box-with-background-and-padding">
				<Heading size="medium">padding</Heading>
				<Inline space="space.200" alignBlock="center">
					{spacingValues.map((space) => (
						<Box key={space} backgroundColor="color.background.discovery.bold" padding={space}>
							<Box backgroundColor="elevation.surface">{space}</Box>
						</Box>
					))}
				</Inline>
			</Stack>
			<Stack space="space.200" testId="box-with-backgroundColor">
				<Heading size="medium">backgroundColor</Heading>
				<Inline space="space.200" alignBlock="center">
					{backgroundColors.map((backgroundColor) => (
						<Box
							key={backgroundColor}
							backgroundColor={backgroundColor}
							padding="space.400"
							xcss={styles.inverse}
						>
							<Box>{backgroundColor}</Box>
						</Box>
					))}
					<Box
						backgroundColor={'color.background.warning.bold'}
						padding="space.400"
						xcss={styles.warningInverse}
					>
						<Box>color.background.warning</Box>
					</Box>
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
							xcss={cx(styles.bordered, borderMap[borderColor])}
						>
							<Box>{borderColor}</Box>
						</Box>
					))}
				</Inline>
			</Stack>
			<Stack space="space.200" testId="box-with-shadow">
				<Heading size="medium">shadow</Heading>
				<Inline space="space.200" alignBlock="center">
					{elevations.map((shadow) => (
						<Box
							key={shadow}
							backgroundColor="elevation.surface"
							padding="space.400"
							xcss={shadowMap[shadow]}
						>
							<Box>{shadow}</Box>
						</Box>
					))}
				</Inline>
			</Stack>
		</Stack>
	);
};

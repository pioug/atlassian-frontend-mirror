/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type FC } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { type AppearanceType, type SizeType } from './types';

export interface SkeletonProps {
	/**
	 * Indicates the shape of the avatar skeleton. Most avatars are circular, but square avatars can be used for container objects.
	 */
	appearance?: AppearanceType;
	/**
	 * Color of the skeleton. By default, it will inherit the current text color.
	 */
	color?: string;
	/**
	 * Defines the size of the avatar skeleton.
	 */
	size?: SizeType;
	/**
	 * Defines the opacity of the avatar skeleton. Use `weight="normal"` for the default opacity, or `weight="strong"` for a bolder opacity.
	 */
	weight?: 'normal' | 'strong';
}

const bgColorCssVar = '--avatar-skeleton-background-color';

const styles = cssMap({
	root: {
		display: 'inline-block',
		backgroundColor: `var(${bgColorCssVar})`,
		borderWidth: token('border.width.selected', '2px'),
		borderStyle: 'solid',
		borderColor: 'transparent',
		borderRadius: token('radius.full', '50%'),
		opacity: '0.15',
	},
	square: {
		borderRadius: token('radius.tile'),
	},
	hexagon: {
		// NOTE: This is reused from `avatar-content.tsx`
		clipPath: `polygon(45% 1.33975%, 46.5798% 0.60307%, 48.26352% 0.15192%, 50% 0%, 51.73648% 0.15192%, 53.4202% 0.60307%, 55% 1.33975%, 89.64102% 21.33975%, 91.06889% 22.33956%, 92.30146% 23.57212%, 93.30127% 25%, 94.03794% 26.5798%, 94.48909% 28.26352%, 94.64102% 30%, 94.64102% 70%, 94.48909% 71.73648%, 94.03794% 73.4202%, 93.30127% 75%, 92.30146% 76.42788%, 91.06889% 77.66044%, 89.64102% 78.66025%, 55% 98.66025%, 53.4202% 99.39693%, 51.73648% 99.84808%, 50% 100%, 48.26352% 99.84808%, 46.5798% 99.39693%, 45% 98.66025%, 10.35898% 78.66025%, 8.93111% 77.66044%, 7.69854% 76.42788%, 6.69873% 75%, 5.96206% 73.4202%, 5.51091% 71.73648%, 5.35898% 70%, 5.35898% 30%, 5.51091% 28.26352%, 5.96206% 26.5798%, 6.69873% 25%, 7.69854% 23.57212%, 8.93111% 22.33956%, 10.35898% 21.33975%)`,
	},
	strongOpacity: {
		opacity: '0.3',
	},
});

const sizeStyles = cssMap({
	xsmall: { width: '16px', height: '16px' },
	small: { width: '24px', height: '24px' },
	medium: { width: '32px', height: '32px' },
	large: { width: '40px', height: '40px' },
	xlarge: { width: '96px', height: '96px' },
	xxlarge: { width: '128px', height: '128px' },
});

const borderRadiusMap = cssMap({
	xsmall: { borderRadius: token('radius.xsmall') },
	small: { borderRadius: token('radius.xsmall') },
	medium: { borderRadius: token('radius.small') },
	large: { borderRadius: token('radius.small') },
	xlarge: { borderRadius: token('radius.medium') },
	xxlarge: { borderRadius: token('radius.xlarge') },
});

/**
 * __Skeleton__
 *
 * A skeleton is the loading state for the avatar component.
 *
 * - [Examples](https://atlassian.design/components/avatar/avatar-skeleton/examples)
 * - [Code](https://atlassian.design/components/avatar/avatar-skeleton/code)
 */
const Skeleton: FC<SkeletonProps> = ({ size, appearance, color, weight }: SkeletonProps) => (
	<div
		css={[
			styles.root,
			sizeStyles[size ?? 'medium'],
			appearance === 'square' &&
				!fg('platform_dst_avatar_tile') &&
				borderRadiusMap[size ?? 'medium'],
			appearance === 'square' && fg('platform_dst_avatar_tile') && styles.square,
			appearance === 'hexagon' && styles.hexagon,
			weight === 'strong' && styles.strongOpacity,
		]}
		style={{ [bgColorCssVar]: color ?? 'currentColor' } as CSSProperties}
	/>
);

export default Skeleton;

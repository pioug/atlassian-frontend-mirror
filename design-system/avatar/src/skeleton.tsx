/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type FC } from 'react';

import { cssMap, jsx } from '@compiled/react';

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
	strongOpacity: {
		opacity: '0.3',
	},
});

const sizeStyles = cssMap({
	xsmall: {
		width: '16px',
		height: '16px',
	},
	small: {
		width: '24px',
		height: '24px',
	},
	medium: {
		width: '32px',
		height: '32px',
	},
	large: {
		width: '40px',
		height: '40px',
	},
	xlarge: {
		width: '96px',
		height: '96px',
	},
	xxlarge: {
		width: '128px',
		height: '128px',
	},
});

const borderRadiusMap = cssMap({
	xsmall: {
		borderRadius: token('radius.xsmall'),
	},
	small: {
		borderRadius: token('radius.xsmall'),
	},
	medium: {
		borderRadius: token('radius.small', '3px'),
	},
	large: {
		borderRadius: token('radius.small', '3px'),
	},
	xlarge: {
		borderRadius: token('radius.medium'),
	},
	xxlarge: {
		borderRadius: token('radius.xlarge'),
	},
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
			appearance === 'square' && borderRadiusMap[size ?? 'medium'],
			weight === 'strong' && styles.strongOpacity,
		]}
		style={{ [bgColorCssVar]: color ?? 'currentColor' } as CSSProperties}
	/>
);

export default Skeleton;

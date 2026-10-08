/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import Image from '@atlaskit/image/image';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import { token } from '@atlaskit/tokens';

import { lightenColorByHct } from './utils/color-utils';

const templateStyles = cssMap({
	container: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
	},
	templateGridColors: {
		display: 'grid',
		gridTemplateColumns: 'repeat(6, 1fr)',
		gap: token('space.100'),
	},
	templateGridRectangles: {
		display: 'grid',
		gridTemplateColumns: 'repeat(3, 1fr)',
		gap: token('space.100'),
	},
	templateGridImages: {
		display: 'grid',
		gridTemplateColumns: 'repeat(4, 1fr)',
		gap: token('space.100'),
	},
	templateButton: {
		overflow: 'hidden',
		cursor: 'pointer',
		padding: 0,
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderWidth: token('border.width.selected'),
		borderRadius: token('radius.medium'),
		transition: 'border-color 0.2s, box-shadow 0.2s',
		boxSizing: 'border-box',
		'&:hover': {
			borderColor: token('color.border.bold'),
		},
	},
	templateButtonSquare: {
		aspectRatio: '1',
	},
	templateButtonRectangle: {
		minHeight: 0,
	},
	templateButtonColumn: {
		display: 'flex',
		flexDirection: 'row',
	},
	templateButtonSelected: {
		borderColor: token('color.border.bold'),
	},
	colorSwatch: {
		width: '100%',
		height: '100%',
	},
	colorSwatchColumn: {
		width: '24px',
		flexShrink: 0,
		height: '60px',
	},
	divider: {
		flexShrink: 0,
		// @ts-expect-error - token values are valid
		width: token('border.width'),
	},
	templateImageContainer: {
		flex: 1,
		height: '60px',
		flexShrink: 0,
		overflow: 'hidden',
		position: 'relative',
	},
});

export interface TemplateGridProps<T> {
	templates: T[];
	isActive: (template: T) => boolean;
	onSelect: (template: T) => void;
	renderContent: (template: T) => React.ReactNode;
	getKey: (template: T) => string;
	variant?: 'square' | 'rectangle' | 'column';
}

export const TemplateGrid = <T,>({
	templates,
	isActive,
	onSelect,
	renderContent,
	getKey,
	variant = 'square',
}: TemplateGridProps<T>): JSX.Element => {
	return (
		<Box xcss={templateStyles.container}>
			<Box
				xcss={
					variant === 'square'
						? templateStyles.templateGridColors
						: variant === 'rectangle'
							? templateStyles.templateGridRectangles
							: templateStyles.templateGridImages
				}
			>
				{templates.map((template) => {
					const active = isActive(template);
					return (
						<Pressable
							key={getKey(template)}
							onClick={() => onSelect(template)}
							xcss={cx(
								templateStyles.templateButton,
								variant === 'square' && templateStyles.templateButtonSquare,
								variant === 'rectangle' && templateStyles.templateButtonRectangle,
								variant === 'column' && templateStyles.templateButtonColumn,
								active && templateStyles.templateButtonSelected,
							)}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							style={{
								boxShadow: active
									? `inset 0 0 0 1px ${token('color.border.bold', '#091e42')}`
									: undefined,
							}}
						>
							{renderContent(template)}
						</Pressable>
					);
				})}
			</Box>
		</Box>
	);
};

export const ColorSwatch = ({
	color,
	variant,
}: {
	color: string;
	variant?: 'square' | 'column';
}): JSX.Element => (
	<Box
		xcss={variant === 'column' ? templateStyles.colorSwatchColumn : templateStyles.colorSwatch}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		style={{
			backgroundColor: color,
		}}
	/>
);

export const TemplateDivider = ({ color }: { color: string }): JSX.Element => {
	// Lighten the color relatively for a nicer divider appearance
	// Adding 20 points to the tone maintains the relative lightness relationship
	const lighterColor = lightenColorByHct(color, 20, false);

	return (
		<Box
			xcss={templateStyles.divider}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={{
				backgroundColor: lighterColor,
			}}
		/>
	);
};

export const TemplateImagePreview = ({
	imageUrl,
	name,
}: {
	imageUrl: string;
	name: string;
}): JSX.Element => (
	<Box xcss={templateStyles.templateImageContainer}>
		<Image
			src={imageUrl}
			alt={name}
			/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
			style={{
				width: '100%',
				height: '100%',
				objectFit: 'cover',
				objectPosition: 'center',
				display: 'block',
			}}
			/* eslint-enable @atlaskit/ui-styling-standard/enforce-style-prop */
		/>
	</Box>
);

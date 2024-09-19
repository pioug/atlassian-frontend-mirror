import React from 'react';

import { Box, Pressable, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { varDotsMargin, varDotsSize } from './constants';
import { type DotsAppearance } from './types';

// TODO Token usages are not consistent for dots https://product-fabric.atlassian.net/browse/DSP-3180
const colorMap = {
	default: xcss({
		backgroundColor: 'elevation.surface',
		border: `${token('border.width', '1px')} solid ${token('color.border.bold')}`,
	}),
	help: xcss({
		backgroundColor: 'elevation.surface',
		border: `${token('border.width', '1px')} solid ${token('color.border.bold')}`,
	}),
	inverted: xcss({
		// @ts-expect-error
		backgroundColor: token('color.icon.subtle'),
		border: `${token('border.width', '1px')} solid ${token('color.border.bold')}`,
	}),
	primary: xcss({
		backgroundColor: 'elevation.surface',
		border: `${token('border.width', '1px')} solid ${token('color.border.bold')}`,
	}),
};

const selectedColorMap = {
	default: xcss({
		// @ts-expect-error
		backgroundColor: token('color.icon'),
	}),
	help: xcss({
		// @ts-expect-error
		backgroundColor: token('color.icon.discovery'),
	}),
	inverted: xcss({
		// @ts-expect-error
		backgroundColor: token('color.icon.inverse'),
	}),
	primary: xcss({
		// @ts-expect-error
		backgroundColor: token('color.icon.brand'),
	}),
};

const commonStyles = xcss({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `var(${varDotsSize})`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: `var(${varDotsSize})`,
	position: 'relative',
	borderRadius: 'border.radius.circle',

	'::before': {
		display: 'block',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `calc(var(${varDotsSize}) + var(${varDotsMargin}))`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `calc(var(${varDotsSize}) + var(${varDotsMargin}))`,
		position: 'absolute',
		content: '""',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		insetBlockStart: `calc(-1 * var(${varDotsMargin}) / 2)`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		insetInlineStart: `calc(-1 * var(${varDotsMargin}) / 2)`,
	},
});

const buttonStyles = xcss({
	padding: 'space.0',
	cursor: 'pointer',
	outline: 0,
});

type CommonProps = {
	appearance: DotsAppearance;
	isSelected: boolean;
	testId?: string;
};

/**
 * __Presentational indicator__
 *
 * A presentational indicator with no interactivity
 */
export const PresentationalIndicator = ({ appearance, isSelected, testId }: CommonProps) => (
	<Box
		testId={testId}
		xcss={[
			commonStyles,
			appearance === 'default' && !isSelected && colorMap['default'],
			appearance === 'help' && !isSelected && colorMap['help'],
			appearance === 'inverted' && !isSelected && colorMap['inverted'],
			appearance === 'primary' && !isSelected && colorMap['primary'],
			appearance === 'default' && isSelected && selectedColorMap['default'],
			appearance === 'help' && isSelected && selectedColorMap['help'],
			appearance === 'inverted' && isSelected && selectedColorMap['inverted'],
			appearance === 'primary' && isSelected && selectedColorMap['primary'],
		]}
	/>
);

type ButtonIndicatorProps = {
	panelId: string;
	tabId: string;
	onClick(e: React.MouseEvent<HTMLButtonElement>): void;
} & CommonProps;

/**
 * __Button indicator__
 *
 * An interactive indicator.
 */
export const ButtonIndicator = ({
	appearance,
	panelId,
	tabId,
	isSelected,
	onClick,
	testId,
}: ButtonIndicatorProps) => {
	return (
		<Pressable
			role="tab"
			xcss={[
				commonStyles,
				buttonStyles,
				appearance === 'default' && !isSelected && colorMap['default'],
				appearance === 'help' && !isSelected && colorMap['help'],
				appearance === 'inverted' && !isSelected && colorMap['inverted'],
				appearance === 'primary' && !isSelected && colorMap['primary'],
				appearance === 'default' && isSelected && selectedColorMap['default'],
				appearance === 'help' && isSelected && selectedColorMap['help'],
				appearance === 'inverted' && isSelected && selectedColorMap['inverted'],
				appearance === 'primary' && isSelected && selectedColorMap['primary'],
			]}
			aria-controls={panelId}
			aria-selected={isSelected}
			id={tabId}
			onClick={onClick}
			tabIndex={isSelected ? -1 : undefined}
			testId={testId}
		>
			<VisuallyHidden>{tabId}</VisuallyHidden>
		</Pressable>
	);
};

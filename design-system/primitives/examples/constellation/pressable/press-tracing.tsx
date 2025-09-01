/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import __noop from '@atlaskit/ds-lib/noop';
import { FlagsProvider, useFlags } from '@atlaskit/flag';
import Heading from '@atlaskit/heading';
import CheckMarkIcon from '@atlaskit/icon/core/migration/check-mark--check';
import InformationIcon from '@atlaskit/icon/core/migration/status-information--info';
import InteractionContext from '@atlaskit/interaction-context';
import { ZoomIn } from '@atlaskit/motion';
import { Box, Inline, Pressable, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import VisuallyHidden from '@atlaskit/visually-hidden';

const styles = cssMap({
	base: {
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('radius.small'),
		height: '44px',
		width: '44px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

const colorStyles = cssMap({
	Red: {
		backgroundColor: token('color.background.accent.red.subtle'),
		'&:hover': {
			backgroundColor: token('color.background.accent.red.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.red.subtle.pressed'),
		},
	},
	Orange: {
		backgroundColor: token('color.background.accent.orange.subtle'),
		'&:hover': {
			backgroundColor: token('color.background.accent.orange.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.orange.subtle.pressed'),
		},
	},
	Yellow: {
		backgroundColor: token('color.background.accent.yellow.subtle'),
		'&:hover': {
			backgroundColor: token('color.background.accent.yellow.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.yellow.subtle.pressed'),
		},
	},
	Lime: {
		backgroundColor: token('color.background.accent.lime.subtle'),
		'&:hover': {
			backgroundColor: token('color.background.accent.lime.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.lime.subtle.pressed'),
		},
	},
	Green: {
		backgroundColor: token('color.background.accent.green.subtle'),
		'&:hover': {
			backgroundColor: token('color.background.accent.green.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.green.subtle.pressed'),
		},
	},
	Teal: {
		backgroundColor: token('color.background.accent.teal.subtle'),
		'&:hover': {
			backgroundColor: token('color.background.accent.teal.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.teal.subtle.pressed'),
		},
	},
	Blue: {
		backgroundColor: token('color.background.accent.blue.subtle'),
		'&:hover': {
			backgroundColor: token('color.background.accent.blue.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.blue.subtle.pressed'),
		},
	},
	Purple: {
		backgroundColor: token('color.background.accent.purple.subtle'),
		'&:hover': {
			backgroundColor: token('color.background.accent.purple.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.purple.subtle.pressed'),
		},
	},
	Magenta: {
		backgroundColor: token('color.background.accent.magenta.subtle'),
		'&:hover': {
			backgroundColor: token('color.background.accent.magenta.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.magenta.subtle.pressed'),
		},
	},
});

type ColorButtonProps = {
	color: keyof typeof colorStyles;
	isSelected?: boolean;
	onClick?(): void;
};

const ColorButton = ({ color, isSelected, onClick }: ColorButtonProps) => {
	return (
		<Tooltip content={color}>
			<Pressable
				interactionName={`color-${color.toLowerCase()}`}
				xcss={cx(styles.base, colorStyles[color])}
				aria-pressed={isSelected}
				onClick={onClick}
			>
				{isSelected && (
					<ZoomIn>
						{(props) => (
							<div {...props}>
								<CheckMarkIcon
									label=""
									LEGACY_size="large"
									LEGACY_primaryColor={token('color.icon.inverse')}
									color={token('color.icon.inverse')}
								/>
							</div>
						)}
					</ZoomIn>
				)}
				<VisuallyHidden>{color}</VisuallyHidden>
			</Pressable>
		</Tooltip>
	);
};

const ColorPaletteButtons = () => {
	const [selectedColor, setSelectedColor] = useState<keyof typeof colorStyles | null>('Red');

	const { showFlag } = useFlags();

	return (
		<InteractionContext.Provider
			value={{
				hold: __noop,
				tracePress: (name) => {
					showFlag({
						title: `Traced a press!`,
						description: name,
						icon: (
							<InformationIcon
								label="Info"
								LEGACY_primaryColor={token('color.icon.information')}
								color={token('color.icon.information')}
								spacing="spacious"
							/>
						),
						isAutoDismiss: true,
					});
				},
			}}
		>
			<Stack space="space.150" alignInline="start">
				<Heading size="small" id="epic-heading">
					Change epic color
				</Heading>
				<Box role="group" aria-labelledby="epic-heading">
					<Inline space="space.100">
						{Object.keys(colorStyles).map((color) => {
							const keyColor = color as keyof typeof colorStyles;
							return (
								<ColorButton
									key={keyColor}
									color={keyColor}
									isSelected={selectedColor === keyColor}
									onClick={() => setSelectedColor(keyColor)}
								/>
							);
						})}
					</Inline>
				</Box>
			</Stack>
		</InteractionContext.Provider>
	);
};

export default function PressTracing() {
	return (
		<FlagsProvider>
			<ColorPaletteButtons />
		</FlagsProvider>
	);
}

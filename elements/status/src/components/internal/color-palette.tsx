/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { token } from '@atlaskit/tokens';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { css, jsx } from '@compiled/react';
import { type Color as ColorType } from '../Status';
import Color from './color';
import { fg } from '@atlaskit/platform-feature-flags';

const paletteLegacy: [
	colorValue: ColorType,
	backgroundColor: string,
	borderColor: string,
	iconColor: string,
][] = [
	['neutral', token('color.background.neutral'), token('color.border.bold'), token('color.icon')],
	[
		'purple',
		token('color.background.discovery'),
		token('color.border.discovery'),
		token('color.icon.discovery'),
	],
	[
		'blue',
		token('color.background.information'),
		token('color.border.information'),
		token('color.icon.information'),
	],
	[
		'red',
		token('color.background.danger'),
		token('color.border.danger'),
		token('color.icon.danger'),
	],
	[
		'yellow',
		token('color.background.warning'),
		token('color.border.warning'),
		token('color.icon.warning'),
	],
	[
		'green',
		token('color.background.success'),
		token('color.border.success'),
		token('color.icon.success'),
	],
];

const paletteRefreshed: [
	colorValue: ColorType,
	backgroundColor: string,
	borderColor: string,
	iconColor: string,
][] = [
	[
		'neutral',
		token('color.background.accent.gray.subtler'),
		token('color.border.bold'),
		token('color.icon'),
	],
	[
		'blue',
		token('color.background.information.pressed'),
		token('color.border.information'),
		token('color.icon'),
	],
	[
		'green',
		token('color.background.success.pressed'),
		token('color.border.success'),
		token('color.icon'),
	],
	[
		'yellow',
		token('color.background.warning.pressed'),
		token('color.border.warning'),
		token('color.icon'),
	],
	[
		'red',
		token('color.background.danger.pressed'),
		token('color.border.danger'),
		token('color.icon'),
	],
	[
		'purple',
		token('color.background.discovery.pressed'),
		token('color.border.discovery'),
		token('color.icon'),
	],
];

const getPalette = () =>
	fg('platform-component-visual-refresh') ? paletteRefreshed : paletteLegacy;

const palette = getPalette();

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
const colorPaletteWrapperStyles = css({
	paddingLeft: '0px',
	marginTop: token('space.100'),
	marginRight: token('space.100'),
	marginBottom: '0px',
	marginLeft: token('space.100'),
	/* Firefox bug fix: https://product-fabric.atlassian.net/browse/ED-1789 */
	display: 'flex',
	flexWrap: 'wrap',
});

interface ColorPaletteProps {
	className?: string;
	cols?: number;
	onClick: (value: ColorType) => void;
	onHover?: (value: ColorType) => void;
	selectedColor?: ColorType;
}

const VK_LEFT = 37; //ArrowLeft
const VK_RIGHT = 39; //ArrowRight
const VK_UP = 38; //ArrowUp
const VK_DOWN = 40; //ArrowDown
const VK_TAB = 9;

export default ({ cols = 7, onClick, selectedColor, className, onHover }: ColorPaletteProps) => {
	const colorRefs: React.MutableRefObject<HTMLButtonElement[]> = useRef([]);
	const [currentFocusedColor, setCurrentFocusedColor] = useState(0);
	useEffect(() => {
		colorRefs.current = colorRefs.current.slice(0, palette.length);
	}, []);

	const memoizedHandleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			let newColorIndex: number | null = null;
			const nextColor = () =>
				currentFocusedColor + 1 > palette.length - 1 ? 0 : currentFocusedColor + 1;
			const previousColor = () =>
				currentFocusedColor - 1 < 0 ? palette.length - 1 : currentFocusedColor - 1;

			if (fg('editor_a11y_arrow_key_status_colour_palette')) {
				switch (e.key) {
					case 'ArrowRight':
					case 'ArrowDown':
						e.preventDefault();
						newColorIndex = nextColor();
						break;
					case 'ArrowLeft':
					case 'ArrowUp':
						e.preventDefault();
						newColorIndex = previousColor();
						break;
					case 'Tab':
						setCurrentFocusedColor(0);
						break;
				}
			} else {
				switch (e.keyCode) {
					case VK_RIGHT:
					case VK_DOWN:
						e.preventDefault();
						newColorIndex = nextColor();
						break;
					case VK_LEFT:
					case VK_UP:
						e.preventDefault();
						newColorIndex = previousColor();
						break;
					case VK_TAB:
						setCurrentFocusedColor(0);
						break;
				}
			}
			if (newColorIndex === null) {
				return;
			}
			setCurrentFocusedColor(newColorIndex);
			const newRef = colorRefs.current[newColorIndex];
			newRef?.focus();
		},
		[currentFocusedColor, setCurrentFocusedColor, colorRefs],
	);

	return (
		/**
      We need to disable below eslint rule becuase of role "radiogroup". This role was added
      in https://a11y-internal.atlassian.net/browse/AK-832 to fix accessibility issue.
      When we migrated to emotion from styled component, we started getting this error.
      Task added in https://product-fabric.atlassian.net/wiki/spaces/E/pages/3182068181/Potential+improvements#Moderate-changes.
     */
		// eslint-disable-next-line @atlassian/a11y/interactive-supports-focus, @atlassian/a11y/no-noninteractive-element-interactions
		<ul
			css={colorPaletteWrapperStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			style={{ maxWidth: cols * 32 }}
			onKeyDown={memoizedHandleKeyDown}
		>
			{palette.map(([colorValue, backgroundColor, borderColor, iconColor], i) => {
				return (
					<Color
						key={colorValue}
						value={colorValue}
						backgroundColor={backgroundColor}
						borderColor={borderColor}
						iconColor={iconColor}
						onClick={onClick}
						onHover={onHover}
						isSelected={colorValue === selectedColor}
						tabIndex={i === 0 ? 0 : -1}
						setRef={(el) => (colorRefs.current[i] = el)}
					/>
				);
			})}
		</ul>
	);
};

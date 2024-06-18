/** @jsx jsx */
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import React, { useEffect, useRef, useCallback, useState } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { type Color as ColorType } from '../Status';
import Color from './color';

const palette: [
	colorValue: ColorType,
	backgroundColor: string,
	borderColor: string,
	iconColor: string,
][] = [
	[
		'neutral',
		token('color.background.neutral', colors.N40),
		token('color.border.bold', colors.N400),
		token('color.icon', colors.N400),
	],
	[
		'purple',
		token('color.background.discovery', colors.P50),
		token('color.border.discovery', colors.P400),
		token('color.icon.discovery', colors.P400),
	],
	[
		'blue',
		token('color.background.information', colors.B50),
		token('color.border.information', colors.B400),
		token('color.icon.information', colors.B400),
	],
	[
		'red',
		token('color.background.danger', colors.R50),
		token('color.border.danger', colors.R400),
		token('color.icon.danger', colors.R400),
	],
	[
		'yellow',
		token('color.background.warning', colors.Y50),
		token('color.border.warning', colors.Y400),
		token('color.icon.warning', colors.Y400),
	],
	[
		'green',
		token('color.background.success', colors.G50),
		token('color.border.success', colors.G400),
		token('color.icon.success', colors.G400),
	],
];

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
const colorPaletteWrapperStyles = css`
	padding-left: 0px;
	margin: ${token('space.100', '8px')} ${token('space.100', '8px')} 0 ${token('space.100', '8px')};
	/* Firefox bug fix: https://product-fabric.atlassian.net/browse/ED-1789 */
	display: flex;
	flex-wrap: wrap;
`;

interface ColorPaletteProps {
	selectedColor?: ColorType;
	onClick: (value: ColorType) => void;
	onHover?: (value: ColorType) => void;
	cols?: number;
	className?: string;
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
		// eslint-disable-next-line jsx-a11y/interactive-supports-focus
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

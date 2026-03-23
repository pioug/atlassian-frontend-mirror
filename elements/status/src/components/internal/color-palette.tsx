/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { token } from '@atlaskit/tokens';
import React, { useEffect, useRef, useCallback } from 'react';
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

export default ({
	cols = 7,
	onClick,
	selectedColor,
	className,
	onHover,
}: ColorPaletteProps): JSX.Element => {
	const palette = getPalette();
	const colorRefs: React.MutableRefObject<HTMLButtonElement[]> = useRef([]);
	useEffect(() => {
		colorRefs.current = colorRefs.current.slice(0, palette.length);
	}, [palette.length]);

	const createKeyDownHandler = useCallback(
		(index: number) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
			let newColorIndex: number | null = null;
			const nextColor = () => (index + 1 > palette.length - 1 ? 0 : index + 1);
			const previousColor = () => (index - 1 < 0 ? palette.length - 1 : index - 1);

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
			}
			if (newColorIndex === null) {
				return;
			}
			colorRefs.current[newColorIndex]?.focus();
		},
		[colorRefs, palette.length],
	);

	return (
		<ul
			css={colorPaletteWrapperStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			style={{ maxWidth: cols * 32 }}
		>
			{palette.map(([colorValue, backgroundColor, borderColor, iconColor], i) => (
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
					onKeyDown={createKeyDownHandler(i)}
				/>
			))}
		</ul>
	);
};

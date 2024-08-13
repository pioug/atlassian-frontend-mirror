/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState, useCallback, useEffect, type KeyboardEvent, useMemo } from 'react';
import { Mode, type Palette } from '../types';
import {
	createAndFireEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import ColorCard, { type ColorCardRef } from './ColorCard';
import { fg } from '@atlaskit/platform-feature-flags';
import { getOptions, getWidth } from '../utils';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { N0, N40 } from '@atlaskit/theme/colors';

export type Props = {
	/** color picker button label */
	label?: string;
	/** list of available colors */
	palette: Palette;
	/** selected color */
	selectedColor?: string;
	/** maximum column length */
	cols: number;
	/** color of checkmark on selected color */
	checkMarkColor?: string;
	/** onChange handler */
	onChange: (value: string, analyticsEvent?: object) => void;
	/** You should not be accessing this prop under any circumstances. It is provided by @atlaskit/analytics-next. */
	createAnalyticsEvent?: any;
	/** style of the color-picker, either 'Compact' or 'Standard', default value is 'Standard' */
	mode?: Mode;
};

export const ColorPaletteMenuWithoutAnalytics = ({
	createAnalyticsEvent,
	onChange,
	palette,
	selectedColor,
	checkMarkColor,
	label = 'Color picker',
	cols = 6,
	mode = Mode.Standard,
}: Props) => {
	const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

	const changeAnalyticsCaller = () => {
		if (createAnalyticsEvent) {
			return createAndFireEventOnAtlaskit({
				action: 'clicked',
				actionSubject: 'color-palette-menu',

				attributes: {
					componentName: 'color-picker',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			})(createAnalyticsEvent);
		}
		return undefined;
	};

	const colorCardRefs = useMemo<(ColorCardRef | null)[]>(() => [], []);

	const handleChange = (value: string) => {
		onChange(value, changeAnalyticsCaller());
	};

	const { options, value: selectedValue } = getOptions(palette, selectedColor);
	const fullLabel = `${label}, ${selectedValue.label} selected`;

	const [focusedIndex, setFocusedIndex] = useState(
		selectedValue.value ? options.findIndex(({ value }) => value === selectedValue.value) : 0,
	);

	useEffect(() => {
		colorCardRefs[focusedIndex]?.focus();
	}, [focusedIndex, colorCardRefs]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const numItems = options.length;

			switch (event.key) {
				case 'ArrowRight':
				case 'ArrowDown':
					setFocusedIndex((prevIndex) => (prevIndex + 1) % numItems);
					break;
				case 'ArrowLeft':
				case 'ArrowUp':
					setFocusedIndex((prevIndex) => (prevIndex - 1 + numItems) % numItems);
					break;
				default:
					break;
			}
		},
		[setFocusedIndex, options],
	);

	const onTabPress = (backwards = false) => {
		setFocusedIndex(backwards ? 0 : options.length - 1);
	};

	return (
		<div
			aria-label={fullLabel}
			role={fg('platform_color_palette_menu_timeline_bar_a11y') ? 'group' : 'radiogroup'}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={[colorPaletteMenuStyles, mode === Mode.Standard && colorPaletteMenuStandardStyles]}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				width: `${getWidth(cols, mode)}px`,
			}}
		>
			<div
				css={[
					colorPaletteContainerStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					mode === Mode.Compact && colorPaletteContainerCompactStyles,
				]}
			>
				{options.map(({ label, value }, index) => (
					<div css={colorCardWrapperStyles} key={value}>
						<ColorCard
							label={label}
							value={value}
							checkMarkColor={checkMarkColor}
							isOption
							selected={value === selectedValue.value}
							onClick={handleChange}
							{...(fg('platform_color_palette_menu_timeline_bar_a11y') && {
								ref: (ref) => (colorCardRefs[index] = ref),
								onTabPress,
								onKeyDown: handleKeyDown,
							})}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default withAnalyticsContext({
	componentName: 'color-picker',
	packageName: process.env._PACKAGE_NAME_,
	packageVersion: process.env._PACKAGE_VERSION_,
})(withAnalyticsEvents()(ColorPaletteMenuWithoutAnalytics));

const colorCardWrapperStyles = css({
	display: 'flex',
	margin: token('space.025', '2px'),
	height: token('space.400', '32px'),
});

const colorPaletteContainerStyles = css({
	display: 'flex',
	flexWrap: 'wrap',
	padding: token('space.050', '4px'),
});

const colorPaletteContainerCompactStyles = css({
	padding: token('space.0', '0'),
});

const colorPaletteMenuStyles = css({
	display: 'flex',
	position: 'relative',
	margin: token('space.0', '0'),
	backgroundColor: token('elevation.surface.overlay', N0),
});

const colorPaletteMenuStandardStyles = css({
	borderRadius: token('border.radius.100', '3px'),
	boxShadow: token('elevation.shadow.overlay', `0 0 0 1px ${N40}, 0 0 8px ${N40}`),
});

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	useState,
	useCallback,
	useEffect,
	useMemo,
	type KeyboardEvent,
	type MouseEvent,
	type Ref,
} from 'react';
import { Mode, type Palette } from '../types';
import {
	type UIAnalyticsEvent,
	createAndFireEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import ColorCard, { type ColorCardRef } from './ColorCard';
import { getOptions, getWidth } from '../utils';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import {
	COLOR_PALETTE_MENU,
	KEY_ARROW_UP,
	KEY_ARROW_DOWN,
	KEY_ARROW_LEFT,
	KEY_ARROW_RIGHT,
	KEY_TAB,
} from '../constants';
import { N0, N40 } from '@atlaskit/theme/colors';

export type Props = {
	/** the toggle that decides if the selected color will be automatically focused on load */
	autoFocus?: boolean;
	/** the toggle that decides if users can tab outside the color picker (arrow keys will always cycle the focus) */
	isFocusLockEnabled?: boolean;
	/** the toggle that decides if menu-related assistive technology should be applied */
	isInsideMenu?: boolean;
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
	onChange: (
		event: MouseEvent | KeyboardEvent,
		value: string,
		analyticsEvent?: UIAnalyticsEvent,
	) => void;
	/** You should not be accessing this prop under any circumstances. It is provided by @atlaskit/analytics-next. */
	createAnalyticsEvent?: any;
	/** style of the color-picker, either 'Compact' or 'Standard', default value is 'Standard' */
	mode?: Mode;
	/** the ref object (usually the currently selected color palette) that consumer can leverage to focus on load */
	initialFocusRef?: Ref<HTMLDivElement>;
};

export const ColorPaletteMenuWithoutAnalytics = ({
	autoFocus = true,
	isFocusLockEnabled = true,
	isInsideMenu = true,
	createAnalyticsEvent,
	onChange,
	palette,
	selectedColor,
	checkMarkColor,
	label = 'Color picker',
	cols = 6,
	mode = Mode.Standard,
	initialFocusRef,
}: Props) => {
	const { options, value: selectedValue } = getOptions(palette, selectedColor);
	const fullLabel = `${label}, ${selectedValue.label} selected`;
	const selectedColorIndex = selectedValue.value
		? options.findIndex(({ value }) => value === selectedValue.value)
		: 0;

	const [focusedIndex, setFocusedIndex] = useState(selectedColorIndex);
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

	const handleChange = (event: MouseEvent | KeyboardEvent, value: string) => {
		onChange(event, value, changeAnalyticsCaller());
	};

	useEffect(() => {
		colorCardRefs[focusedIndex]?.focus();
	}, [focusedIndex, colorCardRefs]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const numItems = options.length;

			switch (event.key) {
				case KEY_ARROW_DOWN:
				case KEY_ARROW_RIGHT:
					setFocusedIndex((prevIndex) => (prevIndex + 1) % numItems);
					break;

				case KEY_ARROW_UP:
				case KEY_ARROW_LEFT:
					setFocusedIndex((prevIndex) => (prevIndex - 1 + numItems) % numItems);
					break;

				case KEY_TAB: {
					if (isFocusLockEnabled) {
						event.preventDefault();
						event.stopPropagation();

						setFocusedIndex(selectedColorIndex);
					}

					break;
				}

				default:
					break;
			}
		},
		[isFocusLockEnabled, selectedColorIndex, setFocusedIndex, options],
	);

	return (
		<div
			aria-label={fullLabel}
			role={isInsideMenu ? 'menu' : 'radiogroup'}
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
							type={COLOR_PALETTE_MENU}
							label={label}
							value={value}
							checkMarkColor={checkMarkColor}
							isOption
							selected={value === selectedValue.value}
							onClick={handleChange}
							ref={(ref) => {
								colorCardRefs[index] = ref;
							}}
							autoFocus={autoFocus}
							initialFocusRef={value === selectedValue.value ? initialFocusRef : undefined}
							isInsideMenu={isInsideMenu}
							onKeyDown={handleKeyDown}
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

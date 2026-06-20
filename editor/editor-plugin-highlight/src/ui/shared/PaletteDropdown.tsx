import React from 'react';

import type { WithOutsideClickProps } from '@atlaskit/editor-common/ui';
import {
	ColorPalette,
	REMOVE_HIGHLIGHT_COLOR,
	getSelectedRowAndColumnFromPalette,
	highlightColorPalette,
	highlightColorPaletteNew,
} from '@atlaskit/editor-common/ui-color';
import {
	ArrowKeyNavigationType,
	DropdownContainer as Dropdown,
} from '@atlaskit/editor-common/ui-menu';
import { hexToEditorTextBackgroundPaletteColor } from '@atlaskit/editor-palette';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

type PaletteDropdownProps = {
	activeColor: string | null;
	isOpen: boolean;
	isOpenedByKeyboard: boolean;
	onColorChange: (color: string) => void;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	trigger: React.ReactElement;
} & WithOutsideClickProps;

const HIGHLIGHT_COLOR_PICKER_COLUMNS = 8;
const HIGHLIGHT_COLOR_PICKER_COLUMNS_NEW = 10;

export const PaletteDropdown = (props: PaletteDropdownProps): React.JSX.Element => {
	const {
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		isOpen,
		activeColor,
		trigger,
		onColorChange,
		isOpenedByKeyboard,
		handleClickOutside,
		handleEscapeKeydown,
	} = props;

	const isNewColorPaletteEnabled = expValEquals(
		'platform_editor_lovability_text_bg_color',
		'isEnabled',
		true,
	);

	const highlightPalette = isNewColorPaletteEnabled
		? highlightColorPaletteNew
		: highlightColorPalette;

	const colorPickerColumns = isNewColorPaletteEnabled
		? HIGHLIGHT_COLOR_PICKER_COLUMNS_NEW
		: HIGHLIGHT_COLOR_PICKER_COLUMNS;

	// pixels, used to determine where to horizontally position the dropdown when space is limited
	// this should reflect the width of the dropdown when fully populated with colors, including translations due to layering
	const fitWidth = isNewColorPaletteEnabled ? 338 : 274;
	// 8 cols: 272 = (32 * 8) + (8 + 8)
	// 10 cols: 336 = (32 * 10) + (8 + 8)
	// Not sure where the extra 2px comes from

	const selectedColor = activeColor || (isNewColorPaletteEnabled ? REMOVE_HIGHLIGHT_COLOR : null);

	const { selectedRowIndex, selectedColumnIndex } = getSelectedRowAndColumnFromPalette(
		highlightPalette,
		selectedColor,
		colorPickerColumns,
	);

	return (
		<Dropdown
			mountTo={popupsMountPoint}
			boundariesElement={popupsBoundariesElement}
			scrollableElement={popupsScrollableElement}
			isOpen={isOpen}
			handleClickOutside={handleClickOutside}
			handleEscapeKeydown={handleEscapeKeydown}
			zIndex={akEditorMenuZIndex}
			fitWidth={fitWidth}
			closeOnTab={true}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			arrowKeyNavigationProviderOptions={{
				type: ArrowKeyNavigationType.COLOR,
				selectedRowIndex,
				selectedColumnIndex,
				isOpenedByKeyboard,
				isPopupPositioned: true,
			}}
			trigger={trigger}
		>
			<div data-testid="highlight-color-palette">
				<ColorPalette
					cols={colorPickerColumns}
					onClick={onColorChange}
					selectedColor={selectedColor}
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
					paletteOptions={{
						palette: highlightPalette,
						hexToPaletteColor: hexToEditorTextBackgroundPaletteColor,
					}}
				/>
			</div>
		</Dropdown>
	);
};

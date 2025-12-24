import React from 'react';

import { type WithOutsideClickProps } from '@atlaskit/editor-common/ui';
import {
	ColorPalette,
	type PaletteColor,
	colorPaletteMessages,
	getSelectedRowAndColumnFromPalette,
	highlightColorPalette,
	highlightColorPaletteNext,
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
	const isOrangeHighlightEnabled = expValEquals(
		'platform_editor_add_orange_highlight_color',
		'cohort',
		'test',
	);

	// pixels, used to determine where to horizontally position the dropdown when space is limited
	// this should reflect the width of the dropdown when fully populated with colors, including translations due to layering
	const fitWidth = isOrangeHighlightEnabled ? 274 : 242;

	let colorPalette: PaletteColor[];

	if (isOrangeHighlightEnabled) {
		colorPalette = highlightColorPaletteNext;
	} else {
		colorPalette = highlightColorPalette.map((item) => {
			if (item.label === 'Orange') {
				return {
					...item,
					label: 'Yellow' as const,
					message: colorPaletteMessages.yellow,
				};
			}
			return item;
		});
	}

	const { selectedRowIndex, selectedColumnIndex } = getSelectedRowAndColumnFromPalette(
		colorPalette,
		activeColor,
		isOrangeHighlightEnabled ? HIGHLIGHT_COLOR_PICKER_COLUMNS : undefined,
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
					cols={isOrangeHighlightEnabled ? HIGHLIGHT_COLOR_PICKER_COLUMNS : undefined}
					onClick={onColorChange}
					selectedColor={activeColor}
					paletteOptions={{
						palette: colorPalette,
						hexToPaletteColor: hexToEditorTextBackgroundPaletteColor,
					}}
				/>
			</div>
		</Dropdown>
	);
};

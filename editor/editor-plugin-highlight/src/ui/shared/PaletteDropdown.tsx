import React from 'react';

import { type WithOutsideClickProps } from '@atlaskit/editor-common/ui';
import {
	ColorPalette,
	getSelectedRowAndColumnFromPalette,
	highlightColorPalette,
} from '@atlaskit/editor-common/ui-color';
import {
	ArrowKeyNavigationType,
	DropdownContainer as Dropdown,
} from '@atlaskit/editor-common/ui-menu';
import { hexToEditorTextBackgroundPaletteColor } from '@atlaskit/editor-palette';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';

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

	// pixels, used to determine where to horizontally position the dropdown when space is limited
	// this should reflect the width of the dropdown when fully populated with colors, including translations due to layering
	const fitWidth = 274;

	const { selectedRowIndex, selectedColumnIndex } = getSelectedRowAndColumnFromPalette(
		highlightColorPalette,
		activeColor,
		HIGHLIGHT_COLOR_PICKER_COLUMNS,
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
					cols={HIGHLIGHT_COLOR_PICKER_COLUMNS}
					onClick={onColorChange}
					selectedColor={activeColor}
					paletteOptions={{
						palette: highlightColorPalette,
						hexToPaletteColor: hexToEditorTextBackgroundPaletteColor,
					}}
				/>
			</div>
		</Dropdown>
	);
};

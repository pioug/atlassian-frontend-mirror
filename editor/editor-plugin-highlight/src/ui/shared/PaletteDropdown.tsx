import React from 'react';

import { type WithOutsideClickProps } from '@atlaskit/editor-common/ui';
import {
	ColorPalette,
	colorPaletteMessages,
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
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	isOpen: boolean;
	activeColor: string | null;
	trigger: React.ReactElement;
	onColorChange: (color: string) => void;
	isOpenedByKeyboard: boolean;
} & WithOutsideClickProps;

export const PaletteDropdown = (props: PaletteDropdownProps) => {
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
	const fitWidth = 242;

	let colorPalette = highlightColorPalette;

	colorPalette = highlightColorPalette.map((item) => {
		if (item.label === 'Orange') {
			return {
				...item,
				label: 'Yellow',
				message: colorPaletteMessages.yellow,
			};
		}
		return item;
	});

	const { selectedRowIndex, selectedColumnIndex } = getSelectedRowAndColumnFromPalette(
		colorPalette,
		activeColor,
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

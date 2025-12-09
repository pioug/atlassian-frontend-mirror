import React from 'react';

import { TableSelectorPopup } from '@atlaskit/editor-common/ui';

interface TableSelectorPopupWrapperProps {
	isOpen: boolean;
	isOpenedByKeyboard: boolean;
	onClickOutside: (e: MouseEvent) => void;
	onEscapeKeydown: () => void;
	onSelection: (rowsCount: number, colsCount: number) => void;
	onUnmount: () => void;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	targetRef: React.RefObject<HTMLElement>;
}

export const TableSelectorPopupWrapper = ({
	isOpen,
	targetRef,
	isOpenedByKeyboard,
	onSelection,
	onClickOutside,
	onEscapeKeydown,
	onUnmount,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
}: TableSelectorPopupWrapperProps): React.JSX.Element | null => {
	if (!isOpen || !targetRef.current) {
		return null;
	}

	return (
		<TableSelectorPopup
			allowOutsideSelection
			target={targetRef.current}
			onUnmount={onUnmount}
			onSelection={onSelection}
			popupsMountPoint={popupsMountPoint}
			popupsBoundariesElement={popupsBoundariesElement}
			popupsScrollableElement={popupsScrollableElement}
			handleClickOutside={onClickOutside}
			handleEscapeKeydown={onEscapeKeydown}
			isOpenedByKeyboard={isOpenedByKeyboard}
		/>
	);
};

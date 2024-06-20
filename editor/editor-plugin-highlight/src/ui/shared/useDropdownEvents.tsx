import { useState } from 'react';

import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type ToolbarButtonRef } from '@atlaskit/editor-common/ui-menu';

import { changeColor } from '../../commands';
import type { HighlightPlugin } from '../../plugin';

type UseDropdownEventArgs = {
	setIsDropdownOpen: (isOpen: boolean) => void;
	isDropdownOpen: boolean;
	pluginInjectionApi: ExtractInjectionAPI<HighlightPlugin> | undefined;
	toolbarItemRef: React.RefObject<ToolbarButtonRef>;
};

export const useDropdownEvents = (args: UseDropdownEventArgs) => {
	const { toolbarItemRef, setIsDropdownOpen, isDropdownOpen, pluginInjectionApi } = args;

	const [isOpenedByKeyboard, setIsOpenedByKeyboard] = useState(false);

	return {
		handleClick: () => {
			setIsOpenedByKeyboard(false);
			setIsDropdownOpen(!isDropdownOpen);
		},
		handleKeyDown: (event: React.KeyboardEvent) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();

				setIsOpenedByKeyboard(true);
				setIsDropdownOpen(!isDropdownOpen);
			}
		},
		handleClickOutside: () => {
			if (isDropdownOpen) {
				setIsDropdownOpen(false);
				setIsOpenedByKeyboard(false);
			}
		},
		handleEscapeKeydown: () => {
			if (isDropdownOpen) {
				setIsDropdownOpen(false);
				setIsOpenedByKeyboard(false);
				toolbarItemRef?.current?.focus();
			}
		},
		handleColorChange: (color: string) => {
			pluginInjectionApi?.core?.actions.execute(
				changeColor(pluginInjectionApi?.analytics?.actions)({
					color,
				}),
			);
			setIsDropdownOpen(false);
		},
		isOpenedByKeyboard,
	};
};

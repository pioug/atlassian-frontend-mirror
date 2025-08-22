import { useState } from 'react';

import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { ToolbarButtonRef } from '@atlaskit/editor-common/ui-menu';

import { changeColor } from '../../editor-commands/change-color';
import type { HighlightPlugin } from '../../highlightPluginType';

type UseDropdownEventArgs = {
	isDropdownOpen: boolean;
	pluginInjectionApi: ExtractInjectionAPI<HighlightPlugin> | undefined;
	setIsDropdownOpen: (isOpen: boolean) => void;
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
		handleColorChange: ({ color, inputMethod }: { color: string; inputMethod: INPUT_METHOD }) => {
			pluginInjectionApi?.core?.actions.execute(
				changeColor(pluginInjectionApi?.analytics?.actions)({
					color,
					inputMethod,
				}),
			);
			setIsDropdownOpen(false);
		},
		isOpenedByKeyboard,
	};
};

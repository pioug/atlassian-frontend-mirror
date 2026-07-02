import React from 'react';

import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { GetMenuItemsFn } from '../../types';
import { useSelectionExtensionComponentContext } from '../SelectionExtensionComponentContext';
import { getBlockMenuTriggerExtensionKey } from '../utils/getBlockMenuTriggerExtensionKey';
import { isNestedDropdownMenuConfiguration } from '../utils/menu-items';

import { SelectionExtensionDropdownItem } from './SelectionExtensionDropdownItem';
import { SelectionExtensionNestedDropdownMenu } from './SelectionExtensionNestedDropdownMenu';

type SelectionExtensionMenuItemsProps = {
	getMenuItems: GetMenuItemsFn;
};

export const SelectionExtensionMenuItems = ({
	getMenuItems,
}: SelectionExtensionMenuItemsProps): React.JSX.Element | null => {
	const { api, editorView, extensionKey, extensionLocation, extensionSource } =
		useSelectionExtensionComponentContext();
	const extensionMenuItems = getMenuItems(
		expValEquals('agent-managed-blocks-stop-block-template', 'isEnabled', true)
			? {
					blockMenuTriggerExtensionKey: getBlockMenuTriggerExtensionKey({ api, editorView }),
					extensionKey,
					extensionLocation,
					extensionSource,
				}
			: undefined,
	);

	if (!extensionMenuItems?.length) {
		return null;
	}

	return (
		<>
			{extensionMenuItems.map((item) => {
				if (isNestedDropdownMenuConfiguration(item)) {
					return (
						<SelectionExtensionNestedDropdownMenu
							key={item.key || item.label}
							nestedDropdownMenu={item}
						/>
					);
				}

				return <SelectionExtensionDropdownItem key={item.key || item.label} dropdownItem={item} />;
			})}
		</>
	);
};

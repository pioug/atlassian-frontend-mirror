/**
 * @jsxRuntime classic
 * @jsx
 */

import React, { useMemo } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import { v4 as uuid } from 'uuid';

import { type EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { SelectionExtensionContract, MenuItemsType } from '../../types';

import { SelectionExtensionDropdownMenu } from './SelectionExtensionDropdownMenu';

type SelectionExtensionItemsProps = {
	editorView: EditorView;
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
	extensions: SelectionExtensionContract[];
	onExtensionClick: (extension: SelectionExtensionContract) => void;
} & WrappedComponentProps;

type SelectionExtensionContractWithIdentifier = SelectionExtensionContract & { id: string };

const transformExtensionsToItems = (
	extensions: SelectionExtensionContractWithIdentifier[],
): MenuItemsType => {
	const extensionToItems = extensions.map((extension) => {
		return {
			key: extension.id,
			content: extension.name,
			value: {
				name: extension.id,
			},
		};
	});
	return [{ items: extensionToItems }];
};

export const SelectionExtensionItemsComponent = ({
	extensions,
	onExtensionClick,
}: SelectionExtensionItemsProps) => {
	const extensionsWithIdentifier = useMemo(
		() => extensions.map((extension) => ({ ...extension, id: uuid() })),
		[extensions],
	);
	const items = useMemo(
		() => transformExtensionsToItems(extensionsWithIdentifier),
		[extensionsWithIdentifier],
	);

	const handleOnItemActivated = ({ item }: { item: MenuItem }) => {
		const extension = extensionsWithIdentifier.find((ext) => ext.id === item.value.name);
		if (extension) {
			onExtensionClick(extension);
		}
	};

	return <SelectionExtensionDropdownMenu items={items} onItemActivated={handleOnItemActivated} />;
};

export const SelectionExtensionItems = injectIntl(SelectionExtensionItemsComponent);

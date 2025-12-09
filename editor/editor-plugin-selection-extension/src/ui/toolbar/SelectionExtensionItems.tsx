/**
 * @jsxRuntime classic
 * @jsx
 */

import React, { useMemo } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuid } from 'uuid';

import {
	type EditorAnalyticsAPI,
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { SelectionExtension, MenuItemsType } from '../../types';

import { SelectionExtensionDropdownMenu } from './SelectionExtensionDropdownMenu';

type SelectionExtensionItemsProps = {
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
	editorView: EditorView;
	extensions: SelectionExtension[];
	onExtensionClick: (extension: SelectionExtension) => void;
} & WrappedComponentProps;

type SelectionExtensionContractWithIdentifier = SelectionExtension & { id: string };

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
	editorAnalyticsAPI,
}: SelectionExtensionItemsProps): React.JSX.Element => {
	const extensionsWithIdentifier = useMemo(
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
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
			if (editorAnalyticsAPI) {
				editorAnalyticsAPI.fireAnalyticsEvent({
					action: ACTION.CLICKED,
					actionSubject: ACTION_SUBJECT.BUTTON,
					actionSubjectId: ACTION_SUBJECT_ID.EDITOR_PLUGIN_SELECTION_EXTENSION_ITEM,
					eventType: EVENT_TYPE.TRACK,
				});
			}
		}
	};

	return (
		<SelectionExtensionDropdownMenu
			editorAnalyticsAPI={editorAnalyticsAPI}
			items={items}
			onItemActivated={handleOnItemActivated}
		/>
	);
};

export const SelectionExtensionItems = injectIntl(SelectionExtensionItemsComponent);

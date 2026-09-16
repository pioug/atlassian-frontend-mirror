import React, { useCallback } from 'react';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type { MenuItem } from '@atlaskit/editor-common/extensions';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { useQuickInsertContext } from '@atlaskit/editor-common/quick-insert/use-quick-insert-context';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';

import type EditorActions from '../../actions';
import { executeExtensionQuickInsertItem } from './executeExtensionQuickInsertItem';
import { ExtensionQuickInsertIcon } from './ExtensionQuickInsertIcon';
import { getExtensionQuickInsertPreviewImageUrls } from './getExtensionQuickInsertPreviewImageUrls';

export const ExtensionQuickInsertMenuItem = ({
	apiRef,
	createAnalyticsEvent,
	editorActions,
	item,
	onInsert,
}: {
	apiRef: React.MutableRefObject<PublicPluginAPI<[ExtensionPlugin]> | undefined>;
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	editorActions: EditorActions;
	item: MenuItem;
	onInsert?: () => void;
}): React.JSX.Element => {
	const { editorView, isOffline } = useQuickInsertContext();
	const onSelect = useCallback(
		({ insert, source }: OnSelectContext) => {
			const result = executeExtensionQuickInsertItem({
				apiRef,
				createAnalyticsEvent,
				editorActions,
				insert,
				item,
				source,
				state: editorView.state,
			});
			if (result) {
				onInsert?.();
			}
			return result;
		},
		[apiRef, createAnalyticsEvent, editorActions, editorView.state, item, onInsert],
	);

	return (
		<QuickInsertMenuItem
			iconBefore={
				<ExtensionQuickInsertIcon
					getIcon={item.icon}
					itemKey={item.key}
					itemTitle={item.title}
					label=""
				/>
			}
			isDisabled={isOffline}
			onSelect={onSelect}
			previewImageUrls={getExtensionQuickInsertPreviewImageUrls(item)}
			title={item.title}
		/>
	);
};

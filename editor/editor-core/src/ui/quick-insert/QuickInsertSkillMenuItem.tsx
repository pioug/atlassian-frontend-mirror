import React, { useCallback } from 'react';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type { MenuItem } from '@atlaskit/editor-common/extensions';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { SkillTag } from '@atlaskit/editor-common/quick-insert/skill-tag';
import { useQuickInsertContext } from '@atlaskit/editor-common/quick-insert/use-quick-insert-context';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Text } from '@atlaskit/primitives/compiled/text';

import type EditorActions from '../../actions';
import { executeExtensionQuickInsertItem } from './executeExtensionQuickInsertItem';
import { ExtensionQuickInsertIcon } from './ExtensionQuickInsertIcon';

export const QuickInsertSkillMenuItem = ({
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
			ariaLabel={item.title}
			description={item.description}
			iconBefore={<ExtensionQuickInsertIcon getIcon={item.icon} itemKey={item.key} label="" />}
			isDisabled={isOffline}
			onSelect={onSelect}
			preview={item.preview}
			previewIcon={
				<ExtensionQuickInsertIcon getIcon={item.icon} itemKey={item.key} label="" size="small" />
			}
			shouldClampPreview={false}
			title={item.title}
			titleContent={
				<Inline alignBlock="center" space="space.100">
					{item.moduleKey ? (
						<SkillTag isDisabled={isOffline} slug={item.moduleKey} />
					) : (
						<Text color={isOffline ? 'color.text.disabled' : 'color.text'}>{item.title}</Text>
					)}
					{item.lozenge}
				</Inline>
			}
		/>
	);
};

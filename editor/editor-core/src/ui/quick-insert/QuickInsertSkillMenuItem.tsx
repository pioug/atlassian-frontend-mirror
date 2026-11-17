import React, { useCallback, useEffect } from 'react';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import {
	CreditCheckedPopup,
	type CreditPopupTriggerProps,
} from '@atlaskit/editor-common/credit-guard/popup';
import type { AICreditCheck, GetAICreditStatus } from '@atlaskit/editor-common/credit-guard/types';
import { useAICreditGuard } from '@atlaskit/editor-common/credit-guard/use-ai-credit-guard';
import type { MenuItem } from '@atlaskit/editor-common/extensions/types/utils';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { SkillTag } from '@atlaskit/editor-common/quick-insert/skill-tag';
import { useQuickInsertContext } from '@atlaskit/editor-common/quick-insert/use-quick-insert-context';
import { REGISTERED_MENU_SURFACE_CONTEXT } from '@atlaskit/editor-common/registered-menu/surface-context';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';

import type EditorActions from '../../actions';
import { executeExtensionQuickInsertItem } from './executeExtensionQuickInsertItem';
import { ExtensionQuickInsertIcon } from './ExtensionQuickInsertIcon';

// Core reads the credit action without depending on the internal AI plugin package.
type SkillMenuPluginAPI = PublicPluginAPI<[ExtensionPlugin]> & {
	aiExperience?: {
		actions: { getAICreditStatus?: GetAICreditStatus };
	};
};

export const QuickInsertSkillMenuItem = ({
	apiRef,
	createAnalyticsEvent,
	editorActions,
	item,
	onInsert,
}: {
	apiRef: React.MutableRefObject<SkillMenuPluginAPI | undefined>;
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	editorActions: EditorActions;
	item: MenuItem;
	onInsert?: () => void;
}): React.JSX.Element => {
	const { editorView, isOffline, item: quickInsertItem, surfaceContext } = useQuickInsertContext();
	const surface = surfaceContext?.get(REGISTERED_MENU_SURFACE_CONTEXT)?.surface;
	const getAICreditStatus = useCallback(
		(context: AICreditCheck) => apiRef.current?.aiExperience?.actions.getAICreditStatus?.(context),
		[apiRef],
	);
	const guard = useAICreditGuard(getAICreditStatus);
	const creditFeatureName =
		surface === 'element-browser' ? 'elementBrowser-skill' : 'quickInsert-skill';
	const onBeforeSelect = useCallback(
		() => guard.check({ featureName: creditFeatureName }),
		[creditFeatureName, guard.check],
	);
	useEffect(() => {
		if (!quickInsertItem?.isSelected) {
			guard.close();
		}
	}, [quickInsertItem?.isSelected, guard.close]);
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

	const renderItem = useCallback(
		(triggerProps?: CreditPopupTriggerProps) => (
			<QuickInsertMenuItem
				aria-controls={triggerProps?.['aria-controls']}
				ariaLabel={item.title}
				description={item.description}
				iconBefore={<ExtensionQuickInsertIcon getIcon={item.icon} itemKey={item.key} label="" />}
				itemRef={triggerProps?.ref}
				isDisabled={isOffline}
				lozenge={item.lozenge}
				onBeforeSelect={onBeforeSelect}
				onSelect={onSelect}
				preview={item.preview}
				previewIcon={
					<ExtensionQuickInsertIcon getIcon={item.icon} itemKey={item.key} label="" size="small" />
				}
				shouldShowPreview={!guard.feedback}
				shouldClampPreview={false}
				title={item.title}
				titleContent={
					item.moduleKey ? (
						<SkillTag color={item.parameters?.color} isDisabled={isOffline} slug={item.moduleKey} />
					) : undefined
				}
			/>
		),
		[guard.feedback, isOffline, item, onBeforeSelect, onSelect],
	);

	return (
		<CreditCheckedPopup
			guard={guard}
			isNestedMenu={surface !== 'element-browser'}
			renderTrigger={renderItem}
		/>
	);
};

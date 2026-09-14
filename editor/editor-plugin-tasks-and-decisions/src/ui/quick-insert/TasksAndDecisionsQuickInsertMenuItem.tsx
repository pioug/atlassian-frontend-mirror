import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import DecisionIcon from '@atlaskit/icon/core/decision';
import FieldCheckboxGroupIcon from '@atlaskit/icon/core/field-checkbox-group';

import type { TasksAndDecisionsPlugin } from '../../tasksAndDecisionsPluginType';
import { getListTypes, insertTaskDecisionAction } from '../../pm-plugins/insert-commands';
import type { TaskDecisionListType } from '../../types';

type Props = {
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
	item: TaskDecisionListType;
};

export const TasksAndDecisionsQuickInsertMenuItem = ({ api, item }: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const { contextIdentifierProvider } = useSharedPluginStateWithSelector(
		api,
		['contextIdentifier'],
		(states) => ({
			contextIdentifierProvider: states.contextIdentifierState?.contextIdentifierProvider,
		}),
	);
	const isAction = item === 'taskList';
	const onSelect = useCallback(
		({ editorView, insert, source }: OnSelectContext) => {
			const { schema } = editorView.state;
			const addAndCreateList = ({
				listLocalId,
				itemLocalId,
			}: {
				itemLocalId?: string;
				listLocalId?: string;
			}) => {
				const { list, item: listItem } = getListTypes(item, schema);
				return insert(
					list.createChecked(
						{ localId: listLocalId },
						listItem.createChecked({ localId: itemLocalId }),
					),
				);
			};

			return insertTaskDecisionAction(api?.analytics?.actions, () => contextIdentifierProvider)(
				editorView.state,
				item,
				source ?? INPUT_METHOD.QUICK_INSERT,
				addAndCreateList,
			);
		},
		[api, contextIdentifierProvider, item],
	);

	return (
		<QuickInsertMenuItem
			iconBefore={isAction ? <FieldCheckboxGroupIcon label="" /> : <DecisionIcon label="" />}
			onSelect={onSelect}
			shortcut={isAction ? '[]' : '<>'}
			title={formatMessage(isAction ? messages.action : messages.decision)}
		/>
	);
};

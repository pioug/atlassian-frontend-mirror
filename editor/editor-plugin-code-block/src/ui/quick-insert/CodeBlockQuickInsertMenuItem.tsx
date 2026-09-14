import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';

import type { CodeBlockPlugin } from '../../codeBlockPluginType';
import { createInsertCodeBlockTransactionWithAnalytics } from '../../editor-commands';

export const CodeBlockQuickInsertMenuItem = ({
	api,
}: {
	api: ExtractInjectionAPI<CodeBlockPlugin> | undefined;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const { editorDisabled } = useSharedPluginStateWithSelector(
		api,
		['editorDisabled'],
		(states) => ({
			editorDisabled: states.editorDisabledState?.editorDisabled,
		}),
	);
	const onSelect = useCallback(
		({ editorView, source }: OnSelectContext) =>
			createInsertCodeBlockTransactionWithAnalytics({
				analyticsAPI: api?.analytics?.actions,
				inputMethod: source,
				state: editorView.state,
			}),
		[api],
	);

	return (
		<QuickInsertMenuItem
			iconBefore={<AngleBracketsIcon label="" />}
			isDisabled={editorDisabled}
			onSelect={onSelect}
			shortcut="```"
			title={formatMessage(blockTypeMessages.codeblock)}
		/>
	);
};

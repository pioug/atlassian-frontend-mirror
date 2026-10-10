import React from 'react';

import { useIntl } from 'react-intl';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics/types/enums';
import { ToolTipContent, getAriaKeyshortcuts, toggleTable } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages/insert-block';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import { TOOLBAR_BUTTON_TEST_ID } from '@atlaskit/editor-common/toolbar/keys';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { TableIcon } from '@atlaskit/editor-toolbar/table-icon';
import { ToolbarButton } from '@atlaskit/editor-toolbar/toolbar-button';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';

import type { InsertBlockPlugin } from '../../insertBlockPluginType';

type TableButtonProps = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
};
export const TableButton = ({ api }: TableButtonProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();

	const { editorView } = useEditorToolbar();

	if (!api?.table) {
		return null;
	}

	const onClick = () => {
		if (editorView) {
			const { state, dispatch } = editorView;
			// workaround to solve race condition where cursor is not placed correctly inside table
			queueMicrotask(() => {
				api?.table?.actions.insertTable?.({
					action: ACTION.INSERTED,
					actionSubject: ACTION_SUBJECT.DOCUMENT,
					actionSubjectId: ACTION_SUBJECT_ID.TABLE,
					attributes: { inputMethod: INPUT_METHOD.TOOLBAR },
					eventType: EVENT_TYPE.TRACK,
				})(state, dispatch);
			});
		}
	};

	return (
		<ToolbarTooltip
			content={<ToolTipContent description={formatMessage(messages.table)} keymap={toggleTable} />}
		>
			<ToolbarButton
				iconBefore={<TableIcon label={formatMessage(messages.table)} size="small" />}
				onClick={onClick}
				ariaKeyshortcuts={getAriaKeyshortcuts(toggleTable)}
				testId={TOOLBAR_BUTTON_TEST_ID.TABLE}
			/>
		</ToolbarTooltip>
	);
};

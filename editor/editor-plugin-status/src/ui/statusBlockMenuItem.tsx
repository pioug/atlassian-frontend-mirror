import React from 'react';

import { useIntl } from 'react-intl';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { BlockMenuItemComponentProps } from '@atlaskit/editor-plugin-block-menu/blockMenuPluginType';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import LozengeIcon from '@atlaskit/icon-lab/core/lozenge';

import { pluginKey } from '../pm-plugins/plugin-key';
import type { StatusPlugin } from '../statusPluginType';
import { createStatusNode } from '../utils/createStatusNode';

type Props = {
	api: ExtractInjectionAPI<StatusPlugin> | undefined;
	isSuggested?: boolean;
};

const StatusBlockMenuItem = ({ api, isSuggested }: Props) => {
	const { formatMessage } = useIntl();

	const handleClick = () => {
		api?.core.actions.execute(({ tr }) => {
			const command = api?.blockMenu?.commands.transformInlineNode({
				buildInlineNode: (source) =>
					createStatusNode(tr.doc.type.schema, { text: source.textContent.trim() }),
				isSuggested,
				targetTypeName: 'status',
			});
			const nextTr = command?.({ tr });
			if (!nextTr?.docChanged) {
				return null;
			}

			api?.analytics?.actions?.attachAnalyticsEvent({
				action: ACTION.INSERTED,
				actionSubject: ACTION_SUBJECT.DOCUMENT,
				actionSubjectId: ACTION_SUBJECT_ID.STATUS,
				attributes: {
					inputMethod: INPUT_METHOD.BLOCK_MENU,
				},
				eventType: EVENT_TYPE.TRACK,
			})(nextTr);

			return nextTr.setMeta(pluginKey, {
				focusStatusInput: true,
				isNew: true,
				showStatusPickerAt: nextTr.selection.from,
			});
		});
	};

	return (
		<ToolbarDropdownItem onClick={handleClick} elemBefore={<LozengeIcon label="" size="small" />}>
			{formatMessage(toolbarInsertBlockMessages.status)}
		</ToolbarDropdownItem>
	);
};

export const createStatusBlockMenuItem = (api: ExtractInjectionAPI<StatusPlugin> | undefined) => {
	return ({ isSuggested }: BlockMenuItemComponentProps = {}): React.JSX.Element => (
		<StatusBlockMenuItem api={api} isSuggested={isSuggested} />
	);
};

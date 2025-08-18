import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarButton, ToolbarTooltip, MentionIcon } from '@atlaskit/editor-toolbar';

import type { InsertBlockPlugin } from '../../insertBlockPluginType';

type MentionButtonProps = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
};

export const MentionButton = ({ api }: MentionButtonProps) => {
	const { formatMessage } = useIntl();
	const { canInsertMention, mentionProvider, isTypeAheadAllowed } =
		useSharedPluginStateWithSelector(api, ['mention', 'typeAhead'], (states) => ({
			canInsertMention: states.mentionState?.canInsertMention,
			mentionProvider: states.mentionState?.mentionProvider,
			isTypeAheadAllowed: states.typeAheadState?.isAllowed,
		}));

	if (!api?.mention) {
		return null;
	}

	const onClick = () => {
		api?.mention?.actions?.openTypeAhead(INPUT_METHOD.TOOLBAR);
	};

	return (
		<ToolbarTooltip content={formatMessage(messages.mention)}>
			<ToolbarButton
				iconBefore={<MentionIcon label={formatMessage(messages.mention)} />}
				onClick={onClick}
				ariaKeyshortcuts="Shift+2 Space"
				isDisabled={!canInsertMention || !mentionProvider || !isTypeAheadAllowed}
			/>
		</ToolbarTooltip>
	);
};

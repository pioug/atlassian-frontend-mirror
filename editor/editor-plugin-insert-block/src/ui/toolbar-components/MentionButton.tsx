import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import { ToolTipContent, insertMention } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages/insert-block';
import { TOOLBAR_BUTTON_TEST_ID } from '@atlaskit/editor-common/toolbar/keys';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import { MentionIcon } from '@atlaskit/editor-toolbar/mention-icon';
import { ToolbarButton } from '@atlaskit/editor-toolbar/toolbar-button';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { InsertBlockPlugin } from '../../insertBlockPluginType';

type MentionButtonProps = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
};

export const MentionButton = ({ api }: MentionButtonProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const {
		canInsertMention,
		mentionProvider,
		mentionProviderStatus,
		hasMentionState,
		isTypeAheadAllowed,
	} = useSharedPluginStateWithSelector(api, ['mention', 'typeAhead'], (states) => ({
		canInsertMention: states.mentionState?.canInsertMention,
		mentionProvider: states.mentionState?.mentionProvider,
		mentionProviderStatus: states.mentionState?.mentionProviderStatus,
		hasMentionState: states.mentionState !== undefined,
		isTypeAheadAllowed: states.typeAheadState?.isAllowed,
	}));

	if (!api?.mention) {
		return null;
	}

	const onClick = () => {
		api?.mention?.actions?.openTypeAhead(INPUT_METHOD.TOOLBAR);
	};

	// The SSR state cannot resolve providers. Keep pending and available visually identical,
	// while preserving known selection restrictions and settled provider failures.
	const isDisabled = isExperimentEnabled('platform_editor_ssr_toolbar_optimistic')
		? canInsertMention === false ||
			(hasMentionState && isTypeAheadAllowed === false) ||
			(mentionProviderStatus !== 'pending' && hasMentionState && !mentionProvider)
		: !canInsertMention || !mentionProvider || !isTypeAheadAllowed;

	return (
		<ToolbarTooltip
			content={
				<ToolTipContent description={formatMessage(messages.mention)} keymap={insertMention} />
			}
		>
			<ToolbarButton
				iconBefore={<MentionIcon label={formatMessage(messages.mention)} size="small" />}
				onClick={onClick}
				ariaKeyshortcuts="Shift+2 Space"
				isDisabled={isDisabled}
				testId={TOOLBAR_BUTTON_TEST_ID.MENTION}
			/>
		</ToolbarTooltip>
	);
};

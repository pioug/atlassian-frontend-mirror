import React, { useMemo } from 'react';

import { useIntl } from 'react-intl';

import { ConversationStarters } from './ConversationStarters';
import type { ConversationStartersProps } from './ConversationStarters';
import { getConversationStarters } from './getConversationStarters';
import type { GetConversationStartersParams } from './getConversationStarters';

export const AgentConversationStarters = ({
	userDefinedConversationStarters,
	isAgentDefault,
	...props
}: AgentConversationStartersProps): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const { combinedConversationStarters } = useMemo(
		() => getConversationStarters({ userDefinedConversationStarters, isAgentDefault }),
		[userDefinedConversationStarters, isAgentDefault],
	);

	const starters = useMemo(
		() =>
			combinedConversationStarters.map((starter) =>
				typeof starter.message === 'string'
					? { message: starter.message, type: starter.type }
					: { message: formatMessage(starter.message), type: starter.type },
			),
		[combinedConversationStarters, formatMessage],
	);

	return <ConversationStarters starters={starters} {...props} />;
};
export type AgentConversationStartersProps = {
	userDefinedConversationStarters?: GetConversationStartersParams['userDefinedConversationStarters'];
	isAgentDefault: GetConversationStartersParams['isAgentDefault'];
} & Omit<ConversationStartersProps, 'starters'>;

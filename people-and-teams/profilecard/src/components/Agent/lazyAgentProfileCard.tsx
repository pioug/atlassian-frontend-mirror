import { lazy, type LazyExoticComponent } from 'react';

import type { AgentProfileCardProps } from '../../types';

export const AgentProfileCardLazy: LazyExoticComponent<
	({
		agent,
		isLoading,
		cloudId,
		onChatClick,
		hasError,
		errorType,
		onConversationStartersClick,
		resourceClient,
		addFlag,
		onDeleteAgent,
		hideMoreActions,
		hideAiDisclaimer,
		hideConversationStarters,
	}: AgentProfileCardProps) => React.JSX.Element
> = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_lazy-agent-profilecard" */
			'./AgentProfileCard'
		),
);

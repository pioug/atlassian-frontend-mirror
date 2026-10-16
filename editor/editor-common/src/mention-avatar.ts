import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { MentionNodeDataUserType } from './ui/Mention/mention-node-data-provider';

const GENERIC_MENTION_IDS = ['HipChat', 'all', 'here'];

/** Shared avatar eligibility without importing mention components or resolving provider data. */
export function isMentionAvatarEnabled({
	id,
	userType,
	hasProvider,
	canReportMissingProvider = false,
}: {
	canReportMissingProvider?: boolean;
	hasProvider: boolean;
	id: string;
	userType?: MentionNodeDataUserType;
}): boolean {
	// Preserve Platform's cohort exposure, including when a provider is missing.
	const cohort = expVal<string>(
		'convo_ai_entity_hover_cards_non_hello_exp',
		'hover_card_cohort',
		'control',
	);
	return (
		(hasProvider || canReportMissingProvider) &&
		userType !== 'SPECIAL' &&
		!GENERIC_MENTION_IDS.includes(id) &&
		(cohort === 'person' ||
			cohort === 'all' ||
			isExperimentEnabled('platform_editor_mention_node_avatar') ||
			isExperimentEnabled('platform_editor_mention_node_graphql_provider') ||
			((userType === 'APP' || userType === 'AGENT') &&
				isExperimentEnabled('platform_editor_drop3_hexagon_agent_avatar')))
	);
}

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';

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
	return (
		(hasProvider || canReportMissingProvider) &&
		userType !== 'SPECIAL' &&
		!GENERIC_MENTION_IDS.includes(id) &&
		(fg('rovo_chat_people_entity_hover_cards') ||
			isExperimentEnabled('platform_editor_mention_node_avatar') ||
			isExperimentEnabled('canvas_agentic_experiences_master_exp') ||
			isExperimentEnabled('platform_editor_mention_node_graphql_provider') ||
			((userType === 'APP' || userType === 'AGENT') &&
				isExperimentEnabled('platform_editor_drop3_hexagon_agent_avatar')))
	);
}

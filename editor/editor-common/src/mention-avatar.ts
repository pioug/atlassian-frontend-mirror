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
		!GENERIC_MENTION_IDS.includes(id)
	);
}

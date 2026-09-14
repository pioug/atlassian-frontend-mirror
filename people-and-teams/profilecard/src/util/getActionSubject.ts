import { AGENT_SUBJECT, TEAM_SUBJECT, USER_SUBJECT } from './analytics';

export const getActionSubject = (
	type: string,
): 'user' | 'teamProfileCard' | 'profilecard' | 'rovoAgentProfilecard' => {
	switch (type) {
		case 'user':
			return USER_SUBJECT;
		case 'team':
			return TEAM_SUBJECT;
		case 'agent':
			return AGENT_SUBJECT;
		default:
			return 'user';
	}
};

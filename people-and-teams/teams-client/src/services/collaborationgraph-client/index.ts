import { DEFAULT_CONFIG } from '../constants';

import { CollaborationGraphClient } from './CollaborationGraphClient';

export type UserContainerArgs = {
	userId: string;
	principalId: string;
	siteId: string;
	sessionId: string;
	maxNumberOfResults: number;
};

export type RecommendedUsersArgs = {
	accountId: string;
	cloudId: string;
	maxNumberOfResults?: number;
	filter?: string;
};

type CollaborationGraphUser = {
	id: string;
	expand: {
		name: string;
		picture: string;
		nickname: string;
		account_status: string;
		extended_profile?: {
			job_title?: string;
			organization?: string;
			department?: string;
			location?: string;
		};
	};
};

export type RecommendedUsersResponse = {
	recommendedEntities: CollaborationGraphUser[];
};

const _default_1: CollaborationGraphClient = new CollaborationGraphClient({
	serviceUrl: DEFAULT_CONFIG.collaborationGraphUrl,
});

export default _default_1;

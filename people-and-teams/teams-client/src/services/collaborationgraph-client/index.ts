import { DEFAULT_CONFIG } from '../constants';
import { RestClient } from '../rest-client';

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

enum CONTAINER_TYPE {
	JIRA_PROJECT = 'jiraProject',
	CONFLUENCE_SPACE = 'confluenceSpace',
}

enum ENTITY_TYPE {
	CONTAINER = 'CONTAINER',
	USER = 'USER',
}

type CollaborationGraphContainerDetails = {
	id: string;
	key: string;
	name: string;
	url: string;
	iconUrl: string;
};

type CollaborationGraphEntities = {
	id: string;
	containerType: CONTAINER_TYPE;
	entityType: ENTITY_TYPE;
	containerDetails: CollaborationGraphContainerDetails;
};

type UserContainerResponse = {
	collaborationGraphEntities: CollaborationGraphEntities[];
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

export class CollaborationGraphClient extends RestClient {
	getUserContainers({
		userId,
		principalId,
		siteId,
		sessionId,
		maxNumberOfResults,
	}: UserContainerArgs): Promise<UserContainerResponse> {
		return this.postResource('/v1/collaborationgraph/user/container', {
			context: {
				contextType: 'atlassianDirectory',
				principalId,
				siteId,
				sessionId,
			},
			containerTypes: ['confluenceSpace', 'jiraProject'],
			maxNumberOfResults,
			userId,
			expanded: true,
		});
	}

	getRecommendedUsers({
		accountId,
		cloudId,
		maxNumberOfResults = 12,
		filter = 'account_status:"active" AND (NOT email_domain:"connect.atlassian.com") AND (NOT account_type:"app")',
	}: RecommendedUsersArgs): Promise<RecommendedUsersResponse> {
		return this.postResource('/v2/recommend/user', {
			context: {
				userId: accountId,
				tenantId: cloudId,
			},
			modelRequestParams: {
				experience: 'CgUserNearbyUser',
				caller: 'atlas',
			},
			requestingUserId: accountId,
			expand: 'existing',
			maxNumberOfResults,
			filter,
		});
	}
}

export default new CollaborationGraphClient({
	serviceUrl: DEFAULT_CONFIG.collaborationGraphUrl,
});

import { DEFAULT_CONFIG } from '../constants';
import { RestClient } from '../rest-client';

export type UserContainerArgs = {
	userId: string;
	principalId: string;
	siteId: string;
	sessionId: string;
	maxNumberOfResults: number;
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
}

export default new CollaborationGraphClient({
	serviceUrl: DEFAULT_CONFIG.collaborationGraphUrl,
});

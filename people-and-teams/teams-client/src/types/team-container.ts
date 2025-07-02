export enum ContainerType {
	CONFLUENCE_SPACE = 'CONFLUENCE_SPACE',
	JIRA_PROJECT = 'JIRA_PROJECT',
	LOOM_SPACE = 'LOOM_SPACE',
}

export interface Container {
	type: ContainerType;
	containerSiteId: string;
}

export interface ContainerNotCreatedDetails {
	containerType: ContainerType;
	reason: string;
}

export interface ApiTeamContainerCreationPayload {
	teamId: string;
	containers: Container[];
}

export interface ContainerCreatedDetails {
	containerId: string;
	containerName: string;
	containerSiteId: string;
	containerType: ContainerType;
	containerUrl: string;
}

export interface ApiTeamContainerResponse {
	teamId: string;
	containersNotCreated: ContainerNotCreatedDetails[];
	containersCreated: ContainerCreatedDetails[];
}

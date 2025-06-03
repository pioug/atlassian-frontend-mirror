export enum ContainerType {
	CONFLUENCE_SPACE = 'CONFLUENCE_SPACE',
	JIRA_PROJECT = 'JIRA_PROJECT',
	LOOM_SPACE = 'LOOM_SPACE',
}

export enum ConfluenceTemplate {
	COLLABORATION,
	KNOWLEDGE_BASE,
	CUSTOM,
	DEFAULT,
}

export interface Template {
	templateName: string;
}

export interface Container {
	type: ContainerType;
	containerSiteId: string | null;
}

export interface ConfluenceContainer extends Container {
	type: ContainerType.CONFLUENCE_SPACE;
	template: ConfluenceTemplate;
}

export interface ApiTeamContainerCreationPayload {
	teamId: string;
	containers: Container[];
}

export interface ContainerDetails {
	containerId: string;
	containerType: ContainerType;
	containerName: string;
	containerUrl: string;
	containerSiteId: string;
}

export interface ApiTeamContainerResponse {
	teamId: string;
	containersNotCreated: ContainerType[];
	containerDetails: ContainerDetails[];
}

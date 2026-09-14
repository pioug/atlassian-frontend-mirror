// Local type definitions to avoid a circular dependency with teams-public.
type ContainerTypes = 'ConfluenceSpace' | 'JiraProject' | 'LoomSpace' | 'WebLink';
type ContainerSubTypes = string;

type TeamContainer = {
	id: string;
	type: ContainerTypes;
	name: string;
	icon?: string | null;
	createdDate?: Date;
	link?: string | null;
	containerTypeProperties?: {
		subType?: ContainerSubTypes;
		name?: string;
	};
};

export type TeamContainers = Array<TeamContainer>;

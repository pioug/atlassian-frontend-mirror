export type ContainerTypes = 'ConfluenceSpace' | 'JiraProject';

export type TeamContainer = {
	id: string;
	type: ContainerTypes;
	name: string;
	icon?: string | null;
	createdDate: Date;
	link?: string | null;
};

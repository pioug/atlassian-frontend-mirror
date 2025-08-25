export type Content = {
	ari: string;
	link: string;
	title: string;
	type: string;
	workspaceAri?: string;
};

export type Comment = {
	format: 'plain_text' | 'adf';
	value: string;
};

export type MetaData = {
	atlOriginId: string;
	productId: string;
	shareeAction?: 'view' | 'edit';
};

// Third party integrations
export type ContentProps = {
	changeTab?: (index: TabType) => void;
	onClose: () => void;
};

export enum TabType {
	default = 0,
	Slack = 1,
}

export type MenuType = 'none' | 'default' | 'Slack';

export type Integration = {
	Content: React.ComponentType<ContentProps>;
	Icon: React.ComponentType;
	type: string;
};

export type IntegrationMode = 'tabs' | 'split' | 'menu' | 'off';

export type AdditionalTab = {
	Content: React.ComponentType<ContentProps>;
	label: string;
};

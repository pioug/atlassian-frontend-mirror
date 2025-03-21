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
	productId: string;
	atlOriginId: string;
	shareeAction?: 'view' | 'edit';
};

// Third party integrations
export type ContentProps = {
	onClose: () => void;
	changeTab?: (index: TabType) => void;
};

export enum TabType {
	default = 0,
	Slack = 1,
}

export type MenuType = 'none' | 'default' | 'Slack';

export type Integration = {
	type: string;
	Icon: React.ComponentType;
	Content: React.ComponentType<ContentProps>;
};

export type IntegrationMode = 'tabs' | 'split' | 'menu' | 'off';

export type AdditionalTab = {
	label: string;
	Content: React.ComponentType<ContentProps>;
};

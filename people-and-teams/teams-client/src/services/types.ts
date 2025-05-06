export type ClientContext = {
	cloudId: string;
	orgId?: string;
	userId?: string;
};

export type ClientContextProps = {
	cloudId?: string | null;
	orgId?: string;
	userId?: string;
};

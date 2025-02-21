import type { StoreActionApi } from 'react-sweet-state';

export type ProductPermissionsResponse = {
	permissionId: string;
	resourceId: string;
	permitted: boolean;
};

export type ProductPermissionsType = {
	write?: boolean;
	read?: boolean;
};

export type UserProductPermissions = {
	jira?: ProductPermissionsType;
	confluence?: ProductPermissionsType;
};

export type ProductPermissionsServiceResult = {
	loading: boolean;
	error?: Error;
	data?: UserProductPermissions;
} & ProductPermissionsStore;

export type ProductPermissions = (
	userId?: string,
	cloudId?: string,
	permissionId?: string,
	options?: {
		enabled: boolean;
	},
) => ProductPermissionsServiceResult;

export type ProductPermissionsStore = {
	error?: Error;
	hasLoaded: boolean;
	isLoading: boolean;
	permissions: UserProductPermissions;
	permissionsResponse?: ProductPermissionsResponse[];
};

type StoreApi = StoreActionApi<ProductPermissionsStore>;
type Action = (api: StoreApi) => void;

export type ProductPermissionsActions = {
	setError: (error: Error) => Action;
	setLoading: (isLoading: boolean) => Action;
	setPermissions: (permissions: ProductPermissionsResponse[]) => Action;
	getPermissions: (props: {
		userId?: string;
		cloudId?: string;
		enabled: boolean;
		permissionId: string;
	}) => Action;
};

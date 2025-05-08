import type { StoreActionApi } from 'react-sweet-state';

export const SUPPORTED_PRODUCTS = ['confluence', 'jira', 'loom'] as const;

export type ProductPermissionRequestBodyType = {
	permissionId: keyof ProductPermissionsType;
	resourceId: string;
	principalId: string;
	dontRequirePrincipalInSite: boolean;
};

export type ProductPermissionsResponse = {
	permissionId: string;
	resourceId: string;
	permitted: boolean;
};

export type ProductPermissionsType = {
	write?: boolean;
	read?: boolean;
	manage?: boolean;
};

export type SupportedProductKeys = (typeof SUPPORTED_PRODUCTS)[number];

export type UserProductPermissions = {
	[Key in SupportedProductKeys]?: ProductPermissionsType;
};

export type ProductPermissionsServiceResult = {
	loading: boolean;
	error?: Error;
	data?: UserProductPermissions;
};

export type ProductPermissions = (
	params: {
		userId?: string;
		cloudId?: string;
		permissionIds?: Array<keyof ProductPermissionsType>;
	},
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
		permissionIds: Array<keyof ProductPermissionsType>;
	}) => Action;
};

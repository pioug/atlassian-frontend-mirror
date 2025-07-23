import type { StoreActionApi } from 'react-sweet-state';

export const SUPPORTED_PRODUCTS = ['confluence', 'jira', 'loom'] as const;

export type ProductPermissionRequestBodyType = {
	permissionId: string;
	resourceId: string;
	principalId: string;
	dontRequirePrincipalInSite: boolean;
};

export type ProductPermissionsResponse = {
	permissionId: string;
	resourceId: string;
	permitted: boolean;
};

export type SupportedProductKeys = (typeof SUPPORTED_PRODUCTS)[number];

export type UserProductPermissions = {
	jira?: Record<string, boolean>;
	confluence?: Record<string, boolean>;
	loom?: Record<string, boolean>;
};

export type ProductPermissionsServiceResult = {
	loading: boolean;
	error?: Error;
	data?: UserProductPermissions;
};

export type ProductPermissions = (params: {
	userId?: string;
	cloudId?: string;
	permissionsToCheck?: {
		jira?: Array<string>;
		confluence?: Array<string>;
		loom?: Array<string>;
	};
	options?: {
		enabled: boolean;
	};
}) => ProductPermissionsServiceResult;

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
		permissionsToCheck: {
			jira?: Array<string>;
			confluence?: Array<string>;
			loom?: Array<string>;
		};
	}) => Action;
};

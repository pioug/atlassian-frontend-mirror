export interface AvailableSite {
	avatarUrl: string;
	cloudId: string;
	displayName: string;
	// TODO As part of NAVX-5287 (FG cleanup) remove this field with minor/major changeset
	/** @deprecated This field may be `undefined` and will be removed in a future major release. */
	isVertigo?: boolean;
	products: AvailableSitesProductType[];
	url: string;
}

export interface AccessibleProduct {
	products: Product[];
}

export interface Product {
	productDisplayName: string;
	productId: AvailableSitesProductType;
	workspaces: Workspace[];
}

export interface Workspace {
	cloudId: string;
	cloudUrl: string;
	isPartOf: string[];
	orgId: string;
	// TODO As part of NAVX-5287 (FG cleanup) remove this field with minor/major changeset
	/** @deprecated This field is no longer required by linking-common and will be removed in a future major release. */
	vortexMode?: string;
	workspaceAri: string;
	workspaceAvatarUrl: string;
	workspaceDisplayName: string;
	workspacePermissionIds?: string[];
	workspaceUrl: string;
}

export type ProductName = 'jira' | 'confluence';

export interface Site {
	cloudId: string;
	iconUrl: URL | null;
	name: string;
	products: ProductName[];
	url: URL;
}

export type AvailableSitesRequest = {
	/**
	 * Set the base url for network requests to the API gateway
	 */
	gatewayBaseUrl?: string;
	products: AvailableSitesProductType[];
};

export interface AvailableSitesResponse {
	sites: AvailableSite[];
}

export interface AccessibleProductResponse {
	data: AccessibleProduct;
}

export enum AvailableSitesProductType {
	WHITEBOARD = 'atlassian-whiteboard',
	BEACON = 'beacon',
	COMPASS = 'compass',
	CONFLUENCE = 'confluence.ondemand',
	JIRA_BUSINESS = 'jira-core.ondemand',
	JIRA_INCIDENT_MANAGER = 'jira-incident-manager.ondemand',
	JIRA_PRODUCT_DISCOVERY = 'jira-product-discovery',
	JIRA_SERVICE_DESK = 'jira-servicedesk.ondemand',
	JIRA_SOFTWARE = 'jira-software.ondemand',
	MERCURY = 'mercury',
	OPSGENIE = 'opsgenie',
	STATUS_PAGE = 'statuspage',
	ATLAS = 'townsquare',
	LOOM = 'loom',
}

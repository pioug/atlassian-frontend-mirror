import { AvailableSitesProductType } from './types';

export const AVAILABLE_SITES_PATH: any = '/gateway/api/available-sites';

export const AVAILABLE_SITES_UNIT_COMPLIANT_PATH: any = '/gateway/api/experimental/available-sites';

export const ACCESSIBLE_PRODUCTS_PATH: any = '/gateway/api/v2/accessible-products';

export const ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH: any =
	'/gateway/api/experimental/v2/accessible-products';

export const defaultProducts: any = [
	AvailableSitesProductType.WHITEBOARD,
	AvailableSitesProductType.BEACON,
	AvailableSitesProductType.COMPASS,
	AvailableSitesProductType.CONFLUENCE,
	AvailableSitesProductType.JIRA_BUSINESS,
	AvailableSitesProductType.JIRA_INCIDENT_MANAGER,
	AvailableSitesProductType.JIRA_PRODUCT_DISCOVERY,
	AvailableSitesProductType.JIRA_SERVICE_DESK,
	AvailableSitesProductType.JIRA_SOFTWARE,
	AvailableSitesProductType.MERCURY,
	AvailableSitesProductType.OPSGENIE,
	AvailableSitesProductType.STATUS_PAGE,
	AvailableSitesProductType.ATLAS,
	AvailableSitesProductType.LOOM,
];

import { type JsonLd } from '@atlaskit/json-ld-types';
import { extractUrlFromLinkJsonLd } from '@atlaskit/link-extractors';

import { unicornResponse } from '../content/example-responses';

const defaultUrl = 'https://atlaskit.atlassian.com/packages/linking-platform/smart-card';

export const getDefaultResponse = (): JsonLd.Response => unicornResponse as JsonLd.Response;

export const getDefaultUrl = (): string => {
	const response = getDefaultResponse();
	const data = response?.data as JsonLd.Data.BaseData;
	const url = extractUrlFromLinkJsonLd(data?.url || defaultUrl);
	return url || defaultUrl;
};

export const getBranchDeploy = (): string => {
	const urlParams = new URLSearchParams(parent.location.search);
	const branchDeploy = urlParams.get('branchDeploy');
	const region = urlParams.get('region');
	return branchDeploy && region ? `${branchDeploy}.${region}` : '';
};

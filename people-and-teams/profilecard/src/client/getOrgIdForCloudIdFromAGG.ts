import { AGGQuery } from './graphqlUtils';

type OrgIdFromCloudIdResult = {
	tenantContexts: ({ orgId: string } | null)[];
};

const ORG_ID_FROM_CLOUD_ID_QUERY = `query OrgIdFromCloudId($cloudId: ID!) {
	tenantContexts(cloudIds: [$cloudId]) {
		orgId
	}
}`;

const addHeaders = (headers: Headers): Headers => {
	headers.append('atl-client-name', process.env._PACKAGE_NAME_ as string);
	headers.append('atl-client-version', process.env._PACKAGE_VERSION_ as string);

	return headers;
};

export async function getOrgIdForCloudIdFromAGG(
	url: string,
	cloudId: string,
): Promise<string | null> {
	const query = {
		query: ORG_ID_FROM_CLOUD_ID_QUERY,
		variables: {
			cloudId,
		},
	};

	try {
		const { tenantContexts } = await AGGQuery<OrgIdFromCloudIdResult>(url, query, addHeaders);
		if (!tenantContexts || tenantContexts.length === 0 || tenantContexts[0] === null) {
			return null;
		}
		return tenantContexts[0].orgId;
	} catch (err) {
		// don't bubble up the error, and let consumers handle it as if the cloud ID
		// doesn't resolve to an org ID
		return null;
	}
}

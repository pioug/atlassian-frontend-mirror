import { useCallback, useMemo } from 'react';

import { request } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';

import { queryIncomingOutgoingLinks as queryIncomingOutgoingAris } from './query';

type Node = {
	id?: string;
};

type Aris = {
	aris?: Node[];
};

type RelatedLinksAgsResponse = {
	data?: {
		graphStore?: {
			incoming?: Aris;
			outgoing?: Aris;
		};
	};
};

/**
 * @param baseUriWithNoTrailingSlash base url which will then be appended with /gateway/api/graphql to make requests to AGG
 */
const useIncomingOutgoingAri = (baseUriWithNoTrailingSlash = '') => {
	const aggRequestCall = useCallback(
		async <Response>(body: object, headers?: HeadersInit) =>
			request<Response>(
				'post',
				baseUriWithNoTrailingSlash + '/gateway/api/graphql',
				body,
				headers,
				[200],
			),
		[baseUriWithNoTrailingSlash],
	);

	const getCurrentSiteId = useCallback(async () => {
		try {
			const response = await request<{ cloudId: string }>(
				'get',
				baseUriWithNoTrailingSlash + '/_edge/tenant_info',
			);
			return response?.cloudId;
		} catch {
			return undefined;
		}
	}, [baseUriWithNoTrailingSlash]);

	const getSiteId = useCallback(
		async (resourceAri: string) => {
			// ARI pattern that matches both formats:
			// - New format: ari:cloud:<resource_owner>::<resource_type>/<resource_id>
			// - Legacy format: ari:cloud:<resource_owner>:<cloud_id>:<resource_type>/<resource_id>
			//
			// Capture groups:
			// 1: resource_owner - [a-z][a-z.-]+
			// 2: cloud_id (siteId) - [a-zA-Z0-9_.-]+ (empty for new format, but since we need to return the siteId, we only use legacy one)
			// 3: resource_type - [a-z][a-zA-Z.-]
			// 4: resource_id
			//
			// See https://developer.atlassian.com/platform/atlassian-resource-identifier/spec/ari-latest/#syntax for more details
			const ariPattern = /^ari:cloud:([a-z][a-z.-]+):([a-zA-Z0-9_.-]+):([a-z][a-zA-Z.-]+)\/(.+)$/;

			const match = resourceAri.match(ariPattern);
			if (match && match[2]) {
				return match[2]; // Return the cloud_id (siteId)
			}

			return await getCurrentSiteId();
		},
		[getCurrentSiteId],
	);

	const getIncomingOutgoingAris = useCallback(
		/**
		 * Returning aris linking to (outgoing) and from (incoming) a given ari from AGS using
		 * https://developer.atlassian.com/cloud/ari-graph-store/relationships/content-referenced-entity/#query
		 * @param ari the ari for which the incoming outgoing aris are to be retrieved
		 * @param firstIncoming The maximum count of incoming relationships to fetch. Must not exceed 1000. This max limit is handled by AGG itself. Default is 50 (ORS batch max limit)
		 * @param firstOutgoing The maximum count of outgoing relationships to fetch. Must not exceed 1000. This max limit is handled by AGG itself. Default is 50 (ORS batch max limit)
		 *
		 */
		async (ari: string, firstIncoming: number = 50, firstOutgoing: number = 50) => {
			let headers: HeadersInit | undefined;
			if (fg('platform_navx_send_context_to_ugs_for_rel_links')) {
				const siteId = await getSiteId(ari);
				if (!siteId) {
					return { incomingAris: [], outgoingAris: [] };
				}
				headers = { 'X-Query-Context': `ari:cloud:platform::site/${siteId}` };
			}

			const response = await aggRequestCall<RelatedLinksAgsResponse>(
				{
					variables: {
						id: ari,
						firstIncoming,
						firstOutgoing,
					},
					query: queryIncomingOutgoingAris,
				},
				headers,
			);

			const incomingAris =
				response?.data?.graphStore?.incoming?.aris
					?.map((node) => node?.id)
					?.filter((id): id is string => !!id) ?? [];

			const outgoingAris =
				response?.data?.graphStore?.outgoing?.aris
					?.map((node) => node?.id)
					?.filter((id): id is string => !!id) ?? [];

			return { incomingAris, outgoingAris };
		},
		[aggRequestCall, getSiteId],
	);

	return useMemo(
		() => ({
			getIncomingOutgoingAris,
		}),
		[getIncomingOutgoingAris],
	);
};

export default useIncomingOutgoingAri;

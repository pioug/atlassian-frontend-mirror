import { useCallback, useMemo } from 'react';

import { request } from '@atlaskit/linking-common';
import { queryIncomingOutgoingLinks as queryIncomingOutgoingAris } from './query';

type Node = {
	id?: string;
};

type MayBe<T> = T | undefined | null;

type IncomingReferencedEntityNode = MayBe<
	Node & {
		from?: Node;
	}
>;

type OutgoingReferencedEntityNode = MayBe<
	Node & {
		to?: Node;
	}
>;

type RelatedLinksAgsResponse = {
	data?: {
		graphStore?: {
			incoming?: {
				nodes?: IncomingReferencedEntityNode[];
			};
			outgoing?: {
				nodes?: OutgoingReferencedEntityNode[];
			};
		};
	};
};

/**
 * @param baseUriWithNoTrailingSlash base url which will then be appended with /gateway/api/graphql to make requests to AGG
 */
export const useIncomingOutgoingAri = (baseUriWithNoTrailingSlash = '') => {
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
			const response = await aggRequestCall<RelatedLinksAgsResponse>({
				variables: {
					ids: [ari],
					firstIncoming,
					firstOutgoing,
				},
				query: queryIncomingOutgoingAris,
			});

			const incomingAris =
				response?.data?.graphStore?.incoming?.nodes
					?.map((node) => node?.from?.id)
					?.filter((id): id is string => !!id) ?? [];

			const outgoingAris =
				response?.data?.graphStore?.outgoing?.nodes
					?.map((node) => node?.to?.id)
					?.filter((id): id is string => !!id) ?? [];

			return { incomingAris, outgoingAris };
		},
		[aggRequestCall],
	);

	return useMemo(
		() => ({
			getIncomingOutgoingAris,
		}),
		[getIncomingOutgoingAris],
	);
};

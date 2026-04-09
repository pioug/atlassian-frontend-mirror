import { type CardClient } from '@atlaskit/link-provider';
import { type CardState } from '@atlaskit/linking-common';

import { type LinkDetails, type CardStore } from '../types';
import { getResolvedAttributes } from './get-resolved-attributes';

const hasMessage = (err: unknown): err is { message: unknown } => {
	return !!(typeof err === 'object' && err && 'message' in err);
};

const hasType = (err: unknown): err is { type: unknown } => {
	return !!(typeof err === 'object' && err && 'type' in err);
};

const getLinkData = async (
	{ url }: LinkDetails,
	client: CardClient,
	store: CardStore,
): Promise<[CardState['details']?, CardState['status']?]> => {
	const cachedDetails = store.getState()[url]?.details;

	// fetch data if it's not already available in the store
	if (!cachedDetails) {
		try {
			const data = await client.fetchData(url);
			return [data];
		} catch (err: unknown) {
			if (hasType(err) && typeof err.type === 'string' && err.type === 'ResolveUnsupportedError') {
				return [, 'not_found'];
			}
			if (
				hasMessage(err) &&
				typeof err.message === 'string' &&
				err.message.includes('Invalid URL')
			) {
				return [, 'not_found'];
			}
			return [, 'errored'];
		}
	}

	return [cachedDetails];
};

/**
 * Resolves the attributes for a link using the link client and store
 */
export const resolveAttributes = async (
	linkDetails: LinkDetails,
	client: CardClient,
	store: CardStore,
): Promise<{
        canBeDatasource: boolean | null;
        destinationActivationId: string | null;
        destinationCategory: string | null;
        destinationContainerId: string | null;
        destinationObjectId: string | null;
        destinationObjectType: string | null;
        destinationProduct: string | null;
        destinationSubproduct: string | null;
        destinationTenantId: string | null;
        displayCategory: "smartLink" | "link";
        extensionKey: string | null;
        status: "pending" | "resolving" | "resolved" | "errored" | "fallback" | "unauthorized" | "forbidden" | "not_found" | null;
        statusDetails: string | null;
    }> => {
	const [linkData, status] = await getLinkData(linkDetails, client, store);

	return {
		...getResolvedAttributes(linkDetails, linkData, status),
	};
};

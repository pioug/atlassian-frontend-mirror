import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

type SmartLinkMetaWithFirstPartySignal = {
	is1PLink?: boolean;
};

export const getIsFirstPartyLink = (details?: SmartLinkResponse): boolean =>
	((details?.meta as SmartLinkMetaWithFirstPartySignal | undefined)?.is1PLink ?? false) === true;

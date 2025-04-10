import type { DesignEntity, EntityType, SmartLinkResponse } from '@atlaskit/linking-types';

export const isEntityType = (response?: SmartLinkResponse): boolean => Boolean(response?.nounData);

export const extractEntity = (response?: SmartLinkResponse): EntityType | undefined =>
	response?.nounData;

export const extractEntityTitle = (response?: SmartLinkResponse): string | undefined =>
	extractEntity(response)?.displayName;

export const extractEntityEmbedUrl = (response?: SmartLinkResponse): string | undefined => {
	const entity = extractEntity(response);
	if (entity && instanceOfDesignEntity(entity)) {
		return entity['atlassian:design'].liveEmbedUrl;
	}
};

export function instanceOfDesignEntity(object: any): object is DesignEntity {
	return 'atlassian:design' in object;
}

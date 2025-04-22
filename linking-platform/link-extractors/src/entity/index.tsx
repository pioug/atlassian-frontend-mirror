import React from 'react';

import type {
	DesignEntity,
	EntityType,
	ProviderGenerator,
	SmartLinkResponse,
} from '@atlaskit/linking-types';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { JiraIcon } from '@atlaskit/logo/jira-icon';

import { LinkProvider } from '../common';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../common/constants';

export const isEntityPresent = (response?: SmartLinkResponse): boolean =>
	Boolean(response?.nounData);

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

export function instanceOfDesignEntity(object: unknown): object is DesignEntity {
	return typeof object === 'object' && object !== null && 'atlassian:design' in object;
}

export const extractEntityProvider = (response?: SmartLinkResponse): LinkProvider | undefined => {
	const { icon, id, image, name } = response?.meta.generator as ProviderGenerator;
	if (!name || !icon) {
		throw Error('Link.generator requires a name and icon.');
	}

	let providerIcon;
	switch (id) {
		case CONFLUENCE_GENERATOR_ID:
			providerIcon = <ConfluenceIcon appearance="brand" size="xsmall" />;
			break;
		case JIRA_GENERATOR_ID:
			providerIcon = <JiraIcon appearance="brand" size="xsmall" />;
			break;
		default:
			providerIcon = icon.url;
	}

	return {
		text: name,
		icon: providerIcon,
		id,
		image: image ? image : icon.url,
	};
};

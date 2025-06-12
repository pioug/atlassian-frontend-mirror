import React from 'react';

import type { EntityType, ProviderGenerator, SmartLinkResponse } from '@atlaskit/linking-types';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { fg } from '@atlaskit/platform-feature-flags';

import { type LinkProvider } from '../common';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../common/constants';

export const extractEntity = (response?: SmartLinkResponse): EntityType | undefined =>
	fg('smart_links_noun_support') ? response?.entityData : undefined;

export const isEntityPresent = (response?: SmartLinkResponse): boolean =>
	Boolean(extractEntity(response));

export const extractEntityEmbedUrl = (response?: SmartLinkResponse): string | undefined => {
	const entity = extractEntity(response);
	return entity && 'liveEmbedUrl' in entity && typeof entity?.liveEmbedUrl === 'string'
		? entity?.liveEmbedUrl
		: undefined;
};

export const extractEntityProvider = (response?: SmartLinkResponse): LinkProvider | undefined => {
	if (!response?.meta?.generator) {
		return undefined;
	}

	const { icon, id, image, name } = response.meta.generator as ProviderGenerator;
	if (!name || !icon) {
		throw Error('Link.generator requires a name and icon.');
	}

	let providerIcon;
	switch (id) {
		case CONFLUENCE_GENERATOR_ID:
			providerIcon = <ConfluenceIcon appearance="brand" size="xxsmall" />;
			break;
		case JIRA_GENERATOR_ID:
			providerIcon = <JiraIcon appearance="brand" size="xxsmall" />;
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

export const extractEntityIcon = (response?: SmartLinkResponse) => {
	const entity = extractEntity(response);

	const url =
		entity && 'iconUrl' in entity && typeof entity?.iconUrl === 'string'
			? entity.iconUrl
			: undefined;

	return {
		url,
		label: entity?.displayName,
	};
};

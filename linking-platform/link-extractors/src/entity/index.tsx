import React from 'react';

import {
	type EntityType,
	type ProviderGenerator,
	type SmartLinkResponse,
} from '@atlaskit/linking-types';
import { isBaseEntity, isDesignEntity, isDocumentEntity } from '@atlaskit/linking-types/entity-types';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { fg } from '@atlaskit/platform-feature-flags';

import { type LinkProvider } from '../common';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../common/constants';

export const extractEntity = (response?: SmartLinkResponse): EntityType | undefined =>
	response?.entityData;

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

	if (fg('platform_lp_use_entity_icon_url_for_icon')) {
		const entityIcon = extractEntityIcon(response);
		if (entityIcon) {
			return {
				text: response.meta.generator.name,
				icon: entityIcon.url,
				id: response.meta.generator.id,
				image: entityIcon.url,
				iconLabel: entityIcon.label,
			};
		}
	}

	const { icon, id, image, name } = response.meta.generator as ProviderGenerator;
	if (!name || !icon) {
		throw Error('Link.generator requires a name and icon.');
	}

	let providerIcon;
	switch (id) {
		case CONFLUENCE_GENERATOR_ID:
			providerIcon = (
				<ConfluenceIcon
					appearance="brand"
					{...(fg('navx-1895-new-logo-design') ? { shouldUseNewLogoDesign: true } : undefined)}
					size="xxsmall"
				/>
			);
			break;
		case JIRA_GENERATOR_ID:
			providerIcon = (
				<JiraIcon
					appearance="brand"
					{...(fg('navx-1895-new-logo-design') ? { shouldUseNewLogoDesign: true } : undefined)}
					size="xxsmall"
				/>
			);
			break;
		default:
			providerIcon = icon.url;
	}

	return {
		text: name,
		icon: providerIcon,
		id,
		image: image ? image : icon.url,
		...(fg('platform_lp_use_entity_icon_url_for_icon') ? { iconLabel: name } : undefined),
	};
};

export const extractEntityIcon = (
	response?: SmartLinkResponse,
): {
	label: string | undefined;
	url: string | undefined;
} | undefined => {
	if (fg('platform_lp_use_entity_icon_url_for_icon')) {
		const entity = extractEntity(response);
		if (!entity) {
			return undefined;
		}

		if (!isBaseEntity(entity)) {
			return undefined;
		}

		if (isDesignEntity(entity) && entity.iconUrl) {
			return {
				url: entity.iconUrl,
				label: entity.type,
			};
		}

		if (isDocumentEntity(entity) && entity.type.iconUrl) {
			return {
				url: entity.type.iconUrl,
				label: entity.type.category,
			};
		}

		// When JSON-LD is deprecated, we can change this to returning entity provider icon.
		// For now code upstream will return better result when this method returns undefined.
		return undefined;
	} else {
		const entity = extractEntity(response);

		let url: string | undefined;
		if (entity) {
			url =
				'iconUrl' in entity && typeof entity?.iconUrl === 'string'
					? entity.iconUrl
					: response?.meta.generator?.icon?.url;
		}

		return {
			url,
			label: entity?.displayName,
		};
	}
};

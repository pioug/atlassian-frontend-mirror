import React from 'react';

import type { ProviderGenerator, SmartLinkResponse } from '@atlaskit/linking-types/smart-link';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { rebrandProvider } from './common/rebrand-provider';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from './constants';
import { extractEntityIcon } from './extract-entity-icon';
import type { LinkProvider } from './types';

export const extractEntityProvider = (response?: SmartLinkResponse): LinkProvider | undefined => {
	if (!response?.meta?.generator) {
		return undefined;
	}

	if (!fg('platform_lp_use_generator_icon_for_provider')) {
		const entityIcon = extractEntityIcon(response);
		if (entityIcon) {
			return rebrandProvider({
				text: response.meta.generator.name,
				icon: entityIcon.url,
				id: response.meta.generator.id,
				image: entityIcon.url,
				iconLabel: entityIcon.label,
			});
		}
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

	return rebrandProvider({
		text: name,
		icon: providerIcon,
		id,
		image: image ? image : icon.url,
		...{ iconLabel: name },
	});
};

import React from 'react';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { fg } from '@atlaskit/platform-feature-flags';

import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../constants';
import { extractUrlFromIconJsonLd, extractUrlFromLinkJsonLd } from '../url';

export interface LinkProvider {
	icon?: React.ReactNode;
	id?: string;
	image?: string;
	text: string;
}

/**
 * @deprecated Use extractSmartLinkProvider instead
 */
export const extractProvider = (jsonLd: JsonLd.Data.BaseData): LinkProvider | undefined => {
	const generator = jsonLd.generator;
	if (generator) {
		if (typeof generator === 'string') {
			throw Error('Link.generator requires a name and icon.');
		} else if (generator['@type'] === 'Link') {
			if (generator.name) {
				return { text: generator.name };
			}
		} else {
			if (generator.name) {
				const id = generator['@id'];

				return {
					text: generator.name,
					icon: extractProviderIcon(generator.icon, id),
					id,
					image: extractProviderImage(generator.image),
				};
			}
		}
	}
	return undefined;
};

export const extractProviderIcon = (
	icon?: JsonLd.Primitives.Image | JsonLd.Primitives.Link,
	id?: string,
): React.ReactNode | undefined => {
	if (id) {
		if (id === CONFLUENCE_GENERATOR_ID) {
			return (
				<ConfluenceIcon
					appearance="brand"
					size="xxsmall"
					{...(fg('navx-1895-new-logo-design') ? { shouldUseNewLogoDesign: true } : undefined)}
				/>
			);
		} else if (id === JIRA_GENERATOR_ID) {
			return (
				<JiraIcon
					appearance="brand"
					size="xxsmall"
					{...(fg('navx-1895-new-logo-design') ? { shouldUseNewLogoDesign: true } : undefined)}
				/>
			);
		}
	}
	if (icon) {
		return extractUrlFromIconJsonLd(icon);
	}
	return undefined;
};

const extractProviderImage = (
	image?: JsonLd.Primitives.Image | JsonLd.Primitives.Link,
): string | undefined => {
	if (image) {
		if (typeof image === 'string') {
			return image;
		} else if (image['@type'] === 'Link') {
			return extractUrlFromLinkJsonLd(image);
		} else if (image['@type'] === 'Image') {
			if (image.url) {
				return extractUrlFromLinkJsonLd(image.url);
			}
		}
	}
	return undefined;
};

export const isConfluenceGenerator = (id: string) => {
	return id === CONFLUENCE_GENERATOR_ID;
};

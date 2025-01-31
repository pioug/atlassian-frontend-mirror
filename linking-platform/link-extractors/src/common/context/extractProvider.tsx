import React from 'react';

import { type JsonLd } from 'json-ld-types';

import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { JiraIcon } from '@atlaskit/logo/jira-icon';

import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../constants';
import { extractType } from '../primitives';
import { extractUrlFromIconJsonLd, extractUrlFromLinkJsonLd } from '../url';

export interface LinkProvider {
	text: string;
	id?: string;
	icon?: React.ReactNode;
	image?: string;
}

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
				const type = extractType(jsonLd);

				return {
					text: generator.name,
					icon: extractProviderIcon(generator.icon, id, type),
					id,
					image: extractProviderImage(generator.image),
				};
			}
		}
	}
};

export const extractProviderIcon = (
	icon?: JsonLd.Primitives.Image | JsonLd.Primitives.Link,
	id?: string,
	type?: JsonLd.Primitives.ObjectType[],
): React.ReactNode | undefined => {
	if (id) {
		if (id === CONFLUENCE_GENERATOR_ID) {
			if (type?.includes('schema:DigitalDocument')) {
				// TODO - make this the live docs icon
				return <ConfluenceIcon appearance="brand" size="xsmall" />;
			} else {
				return <ConfluenceIcon appearance="brand" size="xsmall" />;
			}
		} else if (id === JIRA_GENERATOR_ID) {
			return <JiraIcon appearance="brand" size="xsmall" />;
		}
	}
	if (icon) {
		return extractUrlFromIconJsonLd(icon);
	}
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
};

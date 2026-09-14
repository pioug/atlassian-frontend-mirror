import React from 'react';

import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { JiraIcon } from '@atlaskit/logo/jira-icon';

import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from './constants';
import { extractUrlFromIconJsonLd } from './extract-url-from-icon-json-ld';

export const extractProviderIcon = (
	icon?: JsonLd.Primitives.Image | JsonLd.Primitives.Link,
	id?: string,
): React.ReactNode | undefined => {
	if (id) {
		if (id === CONFLUENCE_GENERATOR_ID) {
			return <ConfluenceIcon appearance="brand" size="xxsmall" />;
		} else if (id === JIRA_GENERATOR_ID) {
			return <JiraIcon appearance="brand" size="xxsmall" />;
		}
	}
	if (icon) {
		return extractUrlFromIconJsonLd(icon);
	}
	return undefined;
};

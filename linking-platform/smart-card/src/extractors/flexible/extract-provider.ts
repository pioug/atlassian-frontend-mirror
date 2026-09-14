import { extractSmartLinkProvider } from '@atlaskit/link-extractors/extract-smart-link-provider';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { IconType } from '../../constants';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../constants';

import type { IconDescriptor } from './icon/types';

const extractProvider = (response?: SmartLinkResponse): IconDescriptor | undefined => {
	const provider = extractSmartLinkProvider(response);
	if (!provider) {
		return;
	}

	const providerName = provider.text;
	if (provider.id === CONFLUENCE_GENERATOR_ID) {
		return {
			icon: IconType.Confluence,
			label: providerName || 'Confluence',
		};
	}

	if (provider.id === JIRA_GENERATOR_ID) {
		return {
			icon: IconType.Jira,
			label: providerName || 'Jira',
		};
	}

	if (providerName) {
		return {
			label: providerName,
			url: typeof provider.icon === 'string' ? provider.icon : undefined,
		};
	}
};

export default extractProvider;

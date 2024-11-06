import { type JsonLd } from 'json-ld-types';

import { extractTitle } from '@atlaskit/link-extractors';

import { IconType } from '../../../constants';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../../constants';

import extractUrlIcon from './extract-url-icon';
import { type IconDescriptor } from './types';

/**
 * Extracts the provider icon and label from the given JSON-LD data.
 *
 * If the data is from Confluence, the icon will be the Confluence icon and the label will be 'Confluence'.
 * If the data is from Jira, the icon will be the Jira icon and the label will be 'Jira'.
 * If the data is from another provider, the icon and label will be extracted from the generator object.
 *
 * @param data - The JSON-LD data to extract the provider icon and label from.
 * @returns IconDescriptor with optional icon string name, url and label, or `undefined` if the data is not provided.
 */
const extractProviderIcon = (data?: JsonLd.Data.BaseData): IconDescriptor | undefined => {
	if (!data) {
		return undefined;
	}
	const generator = data.generator as JsonLd.Primitives.Object;
	const provider = generator?.['@id'];
	const icon = generator?.icon;
	const label = generator?.name || extractTitle(data);

	if (provider === CONFLUENCE_GENERATOR_ID) {
		return {
			icon: IconType.Confluence,
			label: label || 'Confluence',
		};
	}

	if (provider === JIRA_GENERATOR_ID) {
		return {
			icon: IconType.Jira,
			label: label || 'Jira',
		};
	}

	return extractUrlIcon(icon, label);
};

export default extractProviderIcon;

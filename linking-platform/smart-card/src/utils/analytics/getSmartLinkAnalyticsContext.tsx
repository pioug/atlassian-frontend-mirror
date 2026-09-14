import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { getResolvedAttributes } from '@atlaskit/link-analytics/get-resolved-attributes';
import { type CardState } from '@atlaskit/linking-common';
import type { CardType } from '@atlaskit/linking-common';

import { context } from './analytics';

const getExtendedResolvedAttributes = (
	linkDetails: Parameters<typeof getResolvedAttributes>[0],
	details?: JsonLd.Response,
	linkStatus?: CardType,
	error?: CardState['error'],
): ReturnType<typeof getResolvedAttributes> & {
	definitionId?: string | null;
	resourceType?: string | null;
} => ({
	definitionId: details?.meta?.definitionId ?? null,
	resourceType: details?.meta?.resourceType ?? null,
	...getResolvedAttributes(linkDetails, details, linkStatus, error),
});

type GetSmartLinkAnalyticsContextParam = {
	display?: string;
	error?: CardState['error'];
	id?: string | undefined;
	response?: JsonLd.Response;
	source?: string;
	status?: CardType;
	url: string;
};

export const getSmartLinkAnalyticsContext: any = ({
	display,
	id,
	response,
	source,
	status,
	url,
	error,
}: GetSmartLinkAnalyticsContextParam) => {
	const resolvedAttributes = getExtendedResolvedAttributes(
		{
			url,
			displayCategory: display === 'url' ? 'link' : 'smartLink',
		},
		response,
		status,
		error,
	);

	return {
		source,
		attributes: {
			...context,
			display,
			id,
			...resolvedAttributes,
		},
	};
};

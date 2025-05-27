import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractTitle as extractJsonLdTitle,
	extractLink,
	extractSmartLinkTitle,
	extractSmartLinkUrl,
} from '@atlaskit/link-extractors';
import { type SmartLinkResponse } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

import { SmartLinkStatus } from '../../constants';
import { LinkTitle } from '../../state/flexible-ui-context/types';

const extractLinkTitle = (
	status?: string,
	propUrl?: string,
	response?: SmartLinkResponse,
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>,
): LinkTitle | undefined => {
	const data = response?.data as JsonLd.Data.BaseData;
	const responseUrl = fg('smart_links_noun_support')
		? extractSmartLinkUrl(response)
		: extractLink(data);

	const url = status === SmartLinkStatus.Resolved ? responseUrl ?? propUrl : propUrl;
	const name = fg('smart_links_noun_support')
		? extractSmartLinkTitle(response)
		: extractJsonLdTitle(data);

	const text = status === SmartLinkStatus.Resolved ? name ?? responseUrl ?? propUrl : propUrl;

	return { onClick, text, url };
};

export default extractLinkTitle;

import { extractSmartLinkTitle, extractSmartLinkUrl } from '@atlaskit/link-extractors';
import { type SmartLinkResponse } from '@atlaskit/linking-types';

import { SmartLinkStatus } from '../../constants';
import { LinkTitle } from '../../state/flexible-ui-context/types';

const extractLinkTitle = (
	status?: string,
	propUrl?: string,
	response?: SmartLinkResponse,
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>,
): LinkTitle | undefined => {
	const responseUrl = extractSmartLinkUrl(response);

	const url = status === SmartLinkStatus.Resolved ? responseUrl ?? propUrl : propUrl;
	const name = extractSmartLinkTitle(response);

	const text = status === SmartLinkStatus.Resolved ? name ?? responseUrl ?? propUrl : propUrl;

	return { onClick, text, url };
};

export default extractLinkTitle;

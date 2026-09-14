import { extractSmartLinkTitle } from '@atlaskit/link-extractors/extract-smart-link-title';
import { extractSmartLinkUrl } from '@atlaskit/link-extractors/extract-smart-link-url';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

import { SmartLinkStatus } from '../../constants';
import type { LinkTitle } from '../../state/flexible-ui-context/types';

const extractLinkTitle = (
	status?: string,
	propUrl?: string,
	response?: SmartLinkResponse,
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>,
	onAuxClick?: React.EventHandler<React.MouseEvent>,
	onContextMenu?: React.EventHandler<React.MouseEvent>,
): LinkTitle | undefined => {
	const responseUrl = extractSmartLinkUrl(response);

	const url = status === SmartLinkStatus.Resolved ? (responseUrl ?? propUrl) : propUrl;
	const name = extractSmartLinkTitle(response);

	const text = status === SmartLinkStatus.Resolved ? (name ?? responseUrl ?? propUrl) : propUrl;

	return { onClick, onAuxClick, onContextMenu, text, url };
};

export default extractLinkTitle;

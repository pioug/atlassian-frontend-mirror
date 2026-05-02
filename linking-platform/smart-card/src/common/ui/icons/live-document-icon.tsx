// This file is the FG-OFF fallback for platform_sl_icons_refactor.
// Delete this file when platform_sl_icons_refactor is cleaned up.

import type { FC } from 'react';

import PageLiveDocObject from '@atlaskit/object/page-live-doc';
import PageLiveDocObjectTile from '@atlaskit/object/tile/page-live-doc';
import type { ObjectProps } from '@atlaskit/object/types';

import type { SmartLinkSize } from '../../../constants';

import { renderIconPerSize } from './utils';

const LiveDocumentIconWithColor: FC<
	Omit<ObjectProps, 'size'> & {
		size?: SmartLinkSize;
	}
> = renderIconPerSize(PageLiveDocObject, PageLiveDocObjectTile);
LiveDocumentIconWithColor.displayName = 'LiveDocumentIconWithColor';

export default LiveDocumentIconWithColor;

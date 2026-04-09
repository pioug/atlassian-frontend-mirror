import type { FC } from 'react';

import LiveDocIconSmall from '@atlaskit/icon-object/glyph/page-live-doc/16';
import LiveDocIconLarge from '@atlaskit/icon-object/glyph/page-live-doc/24';

import type { SmartLinkSize } from '../../../constants';

import { renderIconPerSize } from './utils';

const LiveDocumentIconWithColor: FC<{
    label: string;
    testId?: string;
} & {
    size?: SmartLinkSize;
}> = renderIconPerSize(LiveDocIconSmall, LiveDocIconLarge);
LiveDocumentIconWithColor.displayName = 'LiveDocumentIconWithColor';

export default LiveDocumentIconWithColor;

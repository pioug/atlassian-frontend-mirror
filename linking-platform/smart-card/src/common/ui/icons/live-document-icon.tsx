import LiveDocIconSmall from '@atlaskit/icon-object/glyph/page-live-doc/16';
import LiveDocIconLarge from '@atlaskit/icon-object/glyph/page-live-doc/24';

import { renderIconPerSize } from './utils';

const LiveDocumentIconWithColor = renderIconPerSize(LiveDocIconSmall, LiveDocIconLarge);
LiveDocumentIconWithColor.displayName = 'LiveDocumentIconWithColor';

export default LiveDocumentIconWithColor;

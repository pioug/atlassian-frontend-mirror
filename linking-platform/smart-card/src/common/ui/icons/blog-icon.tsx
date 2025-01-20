import BlogIconSmall from '@atlaskit/icon-object/glyph/blog/16';
import BlogIconLarge from '@atlaskit/icon-object/glyph/blog/24';

import { renderIconPerSize } from './utils';

const BlogIconWithColor = renderIconPerSize(BlogIconSmall, BlogIconLarge);
BlogIconWithColor.displayName = 'BlogIconWithColor';

export default BlogIconWithColor;

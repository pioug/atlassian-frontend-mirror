import type { FC } from 'react';

import BlogIconSmall from '@atlaskit/icon-object/glyph/blog/16';
import BlogIconLarge from '@atlaskit/icon-object/glyph/blog/24';

import type { SmartLinkSize } from '../../../constants';

import { renderIconPerSize } from './utils';

const BlogIconWithColor: FC<{
    label: string;
    testId?: string;
} & {
    size?: SmartLinkSize;
}> = renderIconPerSize(BlogIconSmall, BlogIconLarge);
BlogIconWithColor.displayName = 'BlogIconWithColor';

export default BlogIconWithColor;

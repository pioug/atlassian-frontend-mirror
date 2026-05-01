// This file is the FG-OFF fallback for platform_sl_icons_refactor.
// Delete this file when platform_sl_icons_refactor is cleaned up.

import type { FC } from 'react';

import BlogObject from '@atlaskit/object/blog';
import BlogObjectTile from '@atlaskit/object/tile/blog';
import type { ObjectProps } from '@atlaskit/object/types';

import type { SmartLinkSize } from '../../../constants';

import { renderIconPerSize } from './utils';

const BlogIconWithColor: FC<Omit<ObjectProps, "size"> & {
    size?: SmartLinkSize;
}> = renderIconPerSize(BlogObject, BlogObjectTile);
BlogIconWithColor.displayName = 'BlogIconWithColor';

export default BlogIconWithColor;

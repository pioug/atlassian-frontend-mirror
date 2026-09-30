import type { FC } from 'react';

import BlogObject from '@atlaskit/object/blog';
import BlogObjectTile from '@atlaskit/object/tile/blog';
import type { ObjectProps } from '@atlaskit/object/types';

import type { SmartLinkSize } from '../../../constants';
import { renderIconPerSize } from './render-icon-per-size';

const BlogIconWithColor: FC<
	Omit<ObjectProps, 'size'> & {
		size?: SmartLinkSize;
	}
> = renderIconPerSize(BlogObject, BlogObjectTile);
BlogIconWithColor.displayName = 'BlogIconWithColor';

export default BlogIconWithColor;

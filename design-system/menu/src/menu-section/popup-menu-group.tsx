/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { MenuGroupProps } from '../types';

import MenuGroup from './menu-group';

/**
 * @deprecated refer to MenuGroup, explicitly set maxWidth and minWidth
 */
const PopupMenuGroup = ({ maxWidth = 800, minWidth = 320, ...rest }: MenuGroupProps) => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	<MenuGroup maxWidth={maxWidth} minWidth={minWidth} {...rest} />
);

export default PopupMenuGroup;

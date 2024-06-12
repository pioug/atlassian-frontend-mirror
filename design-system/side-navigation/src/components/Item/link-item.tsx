import React, { forwardRef } from 'react';

import { LinkItem as Link, type LinkItemProps } from '@atlaskit/menu';

import { baseSideNavItemStyle, overrideStyleFunction } from '../../common/styles';
import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export type { LinkItemProps } from '@atlaskit/menu';

/**
 * __Link item__
 *
 * Renders an item wrapped in an anchor tag, useful when you have an item that
 * should change routes using native browser navigation. For SPA transitions use
 * a [custom item](https://atlassian.design/components/side-navigation/examples#custom-item)
 * with the respective router logic.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#link-item)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const LinkItem = forwardRef<HTMLElement, LinkItemProps>(
	// Type needed on props to extract types with extract react types.
	({ cssFn, href, ...rest }: LinkItemProps, ref) => {
		const { shouldRender } = useShouldNestedElementRender();
		if (!shouldRender) {
			return null;
		}

		const cssOverride = overrideStyleFunction(baseSideNavItemStyle, cssFn);
		// eslint-disable-next-line @atlaskit/design-system/no-deprecated-apis, @repo/internal/react/no-unsafe-overrides
		return <Link ref={ref} cssFn={cssOverride} href={href} {...rest} />;
	},
);

export default LinkItem;

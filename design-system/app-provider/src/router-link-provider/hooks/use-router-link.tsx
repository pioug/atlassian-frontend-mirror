import { useContext } from 'react';

import { type RouterLinkComponent, RouterLinkProviderContext } from '../index';

/**
 * __useRouterLink()__
 *
 * Hook: Returns app-configured router link component.
 *
 * A generic can be passed to define advanced link configuration:
 * ```
 * type MyRouterLinkConfig = {
 *  to: string;
 *  replace?: boolean;
 * }
 *
 * const RouterLink = useRouterLink<MyRouterLinkConfig>();
 * ```
 */
const useRouterLink = <RouterLinkConfig extends Record<string, any> = never>():
	| RouterLinkComponent<RouterLinkConfig>
	| undefined => {
	const { routerLinkComponent } = useContext(RouterLinkProviderContext);

	if (routerLinkComponent) {
		return routerLinkComponent as RouterLinkComponent<RouterLinkConfig>;
	}
};

export default useRouterLink;

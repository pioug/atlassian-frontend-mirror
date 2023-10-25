import { useContext } from 'react';

import { type RouterLinkComponent, RouterLinkProviderContext } from '../index';

/**
 * __useRouterLink()__
 *
 * Hook: Returns app-configured router link component
 */
const useRouterLink = (): RouterLinkComponent | undefined => {
  const { routerLinkComponent } = useContext(RouterLinkProviderContext);

  return routerLinkComponent;
};

export default useRouterLink;

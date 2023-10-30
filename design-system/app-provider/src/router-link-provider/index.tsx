import React, { createContext } from 'react';

export type RouterLinkComponent<
  RouterLinkConfig extends Record<string, any> = never,
> = React.ForwardRefExoticComponent<
  RouterLinkComponentProps<RouterLinkConfig> &
    React.RefAttributes<HTMLAnchorElement>
>;

export type RouterLinkComponentProps<
  RouterLinkConfig extends Record<string, any> = never,
> = {
  /**
   * A string which can be mapped to the underlying router link,
   * or optionally a custom object defined in the generic type for advanced use.
   *
   * @example
   * ```
   * const MyRouterLink = forwardRef(
   * (
   *   {
   *     href,
   *     children,
   *     ...rest
   *   }: RouterLinkComponentProps<{
   *     href: string;
   *     replace: boolean;
   *   }>,
   *   ref: Ref<HTMLAnchorElement>,
   * ) => { ...
   * ```
   */
  href: string | RouterLinkConfig;
  children: React.ReactNode;
};

export type RouterLinkProviderContextProps<
  RouterLinkConfig extends Record<string, any> = never,
> = {
  routerLinkComponent?: RouterLinkComponent<RouterLinkConfig>;
};

export const RouterLinkProviderContext =
  createContext<RouterLinkProviderContextProps>({});

export type RouterLinkProviderProps = {
  /**
   * The rendering mechanism of router links within Design System components.
   */
  routerLinkComponent?: RouterLinkComponent<any>;
};

/**
 * __RouterLinkProvider__
 *
 * Provides a configured router link component for use
 * within Design System components.
 */
const RouterLinkProvider = ({
  routerLinkComponent,
  children,
}: RouterLinkProviderProps & { children: React.ReactNode }) => {
  return (
    <RouterLinkProviderContext.Provider
      value={{
        routerLinkComponent,
      }}
    >
      {children}
    </RouterLinkProviderContext.Provider>
  );
};

export default RouterLinkProvider;

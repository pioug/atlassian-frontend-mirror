import React, { createContext } from 'react';

export type RouterLinkComponent<RouterLinkConfig extends Record<string, any> = never> =
	React.ForwardRefExoticComponent<
		RouterLinkComponentProps<RouterLinkConfig> & React.RefAttributes<HTMLAnchorElement>
	>;

export type RouterLinkComponentProps<RouterLinkConfig extends Record<string, any> = never> = {
	/**
	 * Standard links can be provided as a string, which should be mapped to the
	 * underlying router link component.
	 *
	 * Alternatively, you can provide an object for advanced link configurations
	 * by supplying the expected object type to the generic.
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
	children?: React.ReactNode;
};

export type RouterLinkProviderContextProps<RouterLinkConfig extends Record<string, any> = never> = {
	routerLinkComponent?: RouterLinkComponent<RouterLinkConfig>;
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const RouterLinkProviderContext = createContext<RouterLinkProviderContextProps>({});

type RouterLinkProviderProps = {
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
}: RouterLinkProviderProps & { children: React.ReactNode }): React.JSX.Element => {
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

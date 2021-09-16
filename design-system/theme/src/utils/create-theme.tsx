import React, {
  ComponentType,
  createContext,
  ReactNode,
  useCallback,
  useContext,
} from 'react';

type GetThemeTokensFn<ThemeTokens, ThemeProps> = (
  props: ThemeProps,
) => ThemeTokens;

type ThemeConsumerFn<ThemeTokens> = {
  children: (tokens: ThemeTokens) => ReactNode;
};

export type ThemeProp<ThemeTokens, ThemeProps> = (
  getTokens: GetThemeTokensFn<ThemeTokens, ThemeProps>,
  themeProps: ThemeProps,
) => ThemeTokens;

/**
 * createTheme is used to create a set of Providers and Consumers for theming components.
 * - Takes a default theme function; this theme function gets a set of props, and returns tokens
 *  based on those props. An example of this default theme function is one that produces the standard
 *  appearance of the component
 * - Returns three things - a Provider that allow for additional themes to be applied, a Consumer
 *  that can get the current theme and fetch it, and a custom hook - useTheme which provides an alternate (although functionally the same) API
 *  to the Consumer.
 */
export function createTheme<ThemeTokens, ThemeProps>(
  defaultGetTokens: GetThemeTokensFn<ThemeTokens, ThemeProps>,
): {
  Consumer: ComponentType<
    ThemeProps extends void
      ? ThemeConsumerFn<ThemeTokens>
      : ThemeConsumerFn<ThemeTokens> & ThemeProps
  >;
  Provider: ComponentType<{
    children?: ReactNode;
    value?: ThemeProp<ThemeTokens, ThemeProps>;
  }>;
  useTheme: GetThemeTokensFn<ThemeTokens, ThemeProps>;
} {
  const emptyThemeFn: ThemeProp<ThemeTokens, ThemeProps> = (getTokens, props) =>
    getTokens(props);

  /**
   * Internally, Theme uses React Context, with internal providers and consumers.
   * The React Context passes only a function that gets props, and turns them into tokens. This
   * function gets mixed as more Providers with their own themes are added. This mixed function
   * is ultimately picked up by Consumers, which implement a context consumer internally to fetch
   * the theme.
   */
  const ThemeContext = createContext(defaultGetTokens);

  function useTheme(themeProps: ThemeProps) {
    const theme = useContext(ThemeContext);
    const themeFn = theme || emptyThemeFn;

    const tokens = themeFn(themeProps);

    return tokens;
  }

  // The Theme Consumer takes a function as its child - this function takes tokens, and the
  // return value is generally a set of nodes with the tokens applied appropriately.
  function Consumer(
    props: ThemeProps extends void
      ? ThemeConsumerFn<ThemeTokens>
      : ThemeConsumerFn<ThemeTokens> & ThemeProps,
  ) {
    const { children, ...themeProps } = props;

    // @ts-ignore See issue for more info: https://github.com/Microsoft/TypeScript/issues/10727
    // Argument of type 'Pick<ThemeProps & { children: (tokens: ThemeTokens) => ReactNode; }, Exclude<keyof ThemeProps, "children">>' is not assignable to parameter of type 'ThemeProps'.ts(2345)
    const tokens = useTheme(themeProps);
    // We add a fragment to ensure we don't break people upgrading.
    // Previously they may have been able to pass in undefined without things blowing up.
    return <>{children(tokens)}</>;
  }

  /**
   * The Theme Provider takes regular nodes as its children, but also takes a *theme function*
   * - The theme function takes a set of props, as well as a function (getTokens) that can turn props into tokens.
   * - The getTokens function isn't called immediately - instead the props are passed
   *    through a mix of parent theming functions
   * Children of this provider will receive this mixed theme
   */
  function Provider(props: {
    children?: ReactNode;
    value?: ThemeProp<ThemeTokens, ThemeProps>;
  }) {
    const themeFn = useContext(ThemeContext);
    const valueFn = props.value || emptyThemeFn;
    const mixedFn: GetThemeTokensFn<ThemeTokens, ThemeProps> = useCallback(
      (themeProps: ThemeProps) => valueFn(themeFn, themeProps),
      [themeFn, valueFn],
    );

    return (
      <ThemeContext.Provider value={mixedFn}>
        {props.children}
      </ThemeContext.Provider>
    );
  }

  return { Consumer, Provider, useTheme };
}

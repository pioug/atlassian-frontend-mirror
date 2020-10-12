import memoizeOne from 'memoize-one';

import {
  ThemeProps,
  CustomThemeResult,
  ApplyThemeFn,
  ThemingPublicApi,
} from './types';

const maybeGetToken = (
  propertyName: string,
  customThemeProps: ThemingPublicApi,
  colorName: keyof ThemingPublicApi,
) => {
  const value = customThemeProps[colorName];

  if (!value) {
    return {};
  }

  return {
    [propertyName]: value,
  };
};
export const createCustomTheme = memoizeOne(
  (customThemeProps: ThemingPublicApi = {}): CustomThemeResult => {
    const topLevelItemWrapperTheme = (
      theme: ApplyThemeFn,
      props: ThemeProps,
    ) => ({
      ...theme(props),
      hover: {
        ...theme(props).hover,
        ...maybeGetToken(
          'background',
          customThemeProps,
          'secondaryHoverBackgroundColor',
        ),
      },
    });

    const itemTheme = (theme: ApplyThemeFn, props: ThemeProps) => ({
      ...theme(props),
      hover: {
        ...theme(props).hover,
        ...maybeGetToken(
          'background',
          customThemeProps,
          'primaryHoverBackgroundColor',
        ),
        ...maybeGetToken('text', customThemeProps, 'primaryTextColor'),
        ...maybeGetToken(
          'secondaryText',
          customThemeProps,
          'secondaryTextColor',
        ),
      },
      default: {
        ...theme(props).default,
        ...maybeGetToken('text', customThemeProps, 'primaryTextColor'),
        ...maybeGetToken(
          'secondaryText',
          customThemeProps,
          'secondaryTextColor',
        ),
      },
    });

    const childItemTheme = (theme: ApplyThemeFn, props: ThemeProps) => ({
      ...theme(props),
      hover: {
        ...theme(props).hover,
        ...maybeGetToken(
          'background',
          customThemeProps,
          'primaryHoverBackgroundColor',
        ),
        ...maybeGetToken('text', customThemeProps, 'primaryTextColor'),
        ...maybeGetToken(
          'secondaryText',
          customThemeProps,
          'secondaryTextColor',
        ),
      },
      default: {
        ...theme(props).default,
        ...maybeGetToken(
          'background',
          customThemeProps,
          'secondaryHoverBackgroundColor',
        ),
        ...maybeGetToken('text', customThemeProps, 'primaryTextColor'),
        ...maybeGetToken(
          'secondaryText',
          customThemeProps,
          'secondaryTextColor',
        ),
      },
    });

    return {
      topLevelItemWrapperTheme,
      itemTheme,
      childItemTheme,
    };
  },
);

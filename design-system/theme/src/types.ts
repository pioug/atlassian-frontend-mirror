// Non-deprecated types
export type colorPaletteType = '8' | '16' | '24';
export type Elevation = 'e100' | 'e200' | 'e300' | 'e400' | 'e500';

// Deprecated / legacy types
export type ThemeModes = 'light' | 'dark';
export interface Theme {
  mode: ThemeModes;
}
export interface GlobalThemeTokens extends Theme {}

export type ThemeProps = AtlaskitThemeProps | CustomThemeProps | NoThemeProps;
export interface CustomThemeProps {
  theme: Theme;
  [index: string]: any;
}
export interface AtlaskitThemeProps {
  theme: { __ATLASKIT_THEME__: Theme };
  [index: string]: any;
}
export interface NoThemeProps {
  [index: string]: any;
}

export type DefaultValue = string | number;

export type ThemedValue<V = DefaultValue> = (props?: ThemeProps) => V | '';

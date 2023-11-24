export const PRINT_SETTINGS = {
  quote: 'single' as const,
};

export const NEW_BUTTON_VARIANTS: {
  [key: string]: {
    import: string;
    as: string;
  };
} = {
  default: {
    import: 'UNSAFE_BUTTON',
    as: 'Button',
  },
  link: {
    import: 'UNSAFE_LINK_BUTTON',
    as: 'LinkButton',
  },
  icon: {
    import: 'UNSAFE_ICON_BUTTON',
    as: 'IconButton',
  },
  linkIcon: {
    import: 'UNSAFE_LINK_ICON_BUTTON',
    as: 'LinkIconButton',
  },
};

export const NEW_BUTTON_ENTRY_POINT = '@atlaskit/button/unsafe';

export const entryPointsMapping: { [key: string]: string } = {
  Button: '@atlaskit/button/standard-button',
  LoadingButton: '@atlaskit/button/loading-button',
  ButtonGroup: '@atlaskit/button/button-group',
  CustomThemeButton: '@atlaskit/button/custom-theme-button',
};

export const BUTTON_TYPES = [
  'Appearance',
  'Spacing',
  'BaseOwnProps',
  'BaseProps',
  'ButtonProps',
  'LoadingButtonProps',
  'LoadingButtonOwnProps',
  'ThemeTokens',
  'ThemeProps',
  'InteractionState',
  'CustomThemeButtonProps',
  'CustomThemeButtonOwnProps',
];

export const eslintDisableComment =
  'eslint-disable-next-line @atlaskit/design-system/no-banned-imports';

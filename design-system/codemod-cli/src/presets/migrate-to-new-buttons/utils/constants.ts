export const PRINT_SETTINGS = {
  quote: 'single' as const,
};

export const NEW_BUTTON_VARIANTS: {
  [key: string]: string;
} = {
  default: 'Button',
  link: 'LinkButton',
  icon: 'IconButton',
  linkIcon: 'LinkIconButton',
};

export const NEW_BUTTON_ENTRY_POINT = '@atlaskit/button/new';
export const entryPointsMapping: { [key: string]: string } = {
  Button: '@atlaskit/button/standard-button',
  LoadingButton: '@atlaskit/button/loading-button',
  ButtonGroup: '@atlaskit/button/button-group',
  CustomThemeButton: '@atlaskit/button/custom-theme-button',
};

export const BUTTON_TYPES = [
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

export const UNSAFE_SIZE_PROPS_MAP: Record<string, string> = {
  UNSAFE_size: 'icon',
  UNSAFE_iconAfter_size: 'iconAfter',
  UNSAFE_iconBefore_size: 'iconBefore',
};

export const unsupportedProps = ['component', 'css', 'style'];

export const linkButtonMissingHrefComment = `"link" and "subtle-link" appearances are only available in LinkButton, please either provide a href prop then migrate to LinkButton, or remove the appearance from the default button.`;

export const buttonPropsNoLongerSupportedComment = `Buttons with "component", "css" or "style" prop can't be automatically migrated with codemods. Please migrate it manually.`;

export const migrateFitContainerButtonToDefaultButtonComment = `Migrated to a default button with text which is from the icon label.`;

export const migrateFitContainerButtonToIconButtonComment = `"shouldFitContainer" is not available in icon buttons, please consider using a default button with text.`;

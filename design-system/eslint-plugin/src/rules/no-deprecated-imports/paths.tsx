import { namedLogoConstantsExports, namedLogoExports } from './logo-paths';

export const namedThemeExports = [
  {
    importName: 'assistive',
    message:
      'The assistive mixin is deprecated. Please use `@atlaskit/visually-hidden` instead.',
  },
  {
    importName: 'visuallyHidden',
    message:
      'The visuallyHidden mixin is deprecated. Please use `@atlaskit/visually-hidden` instead.',
  },
  {
    importName: 'focusRing',
    message:
      'The focusRing mixin is deprecated. Please use `@atlaskit/focus-ring` instead.',
  },
];

export const restrictedPaths = [
  {
    path: '@atlaskit/navigation-next',
    message: `navigation-next is deprecated. Please use '@atlaskit/atlassian-navigation' instead.`,
  },
  {
    path: '@atlaskit/field-base',
    message: `field-base is deprecated. Please use the '@atlaskit/form' package instead.`,
  },
  {
    path: '@atlaskit/field-radio-group',
    message: `field-radio-group is deprecated. Please use '@atlaskit/radio' instead, and check the migration guide.`,
  },
  {
    path: '@atlaskit/field-range',
    message: `field-range is deprecated. Please use '@atlaskit/range' instead.`,
  },
  {
    path: '@atlaskit/field-text',
    message: `field-text is deprecated. Please use '@atlaskit/textfield' instead.`,
  },
  {
    path: '@atlaskit/field-text-area',
    message: `field-text-area is deprecated. Please use '@atlaskit/textarea' instead.`,
  },
  {
    path: '@atlaskit/navigation',
    message: `navigation is deprecated. Please use '@atlaskit/atlassian-navigation' instead.`,
  },
  {
    path: '@atlaskit/global-navigation',
    message: `global-navigation is deprecated. Please use '@atlaskit/atlassian-navigation' for the horizontal nav bar, '@atlaskit/side-navigation' for the side nav, and '@atlaskit/page-layout' to layout your application.`,
  },
  {
    path: '@atlaskit/input',
    message:
      'input is deprecated. This was an internal component and should not be used directly.',
  },
  {
    path: '@atlaskit/layer',
    message:
      'layer is deprecated. This was an internal component and should not be used directly.',
  },
  {
    path: '@atlaskit/single-select',
    message: `single-select is deprecated. Please use '@atlaskit/select' instead.`,
  },
  {
    path: '@atlaskit/multi-select',
    message: `multi-select is deprecated. Please use '@atlaskit/select' instead.`,
  },
  {
    path: '@atlaskit/droplist',
    message: `droplist is deprecated. For the pop-up behaviour please use '@atlaskit/popup' and for common menu components please use '@atlaskit/menu'.`,
  },
  {
    path: '@atlaskit/item',
    message: `item is deprecated. Please use '@atlaskit/menu' instead.`,
  },
  // TODO uncomment me when we formally deprecate typography
  // {
  //   path: '@atlaskit/theme/typography',
  //   message: 'The typography mixins are deprecated. Please use `@atlaskit/heading` instead.',
  // },
  {
    path: '@atlaskit/theme/constants',
    imports: namedThemeExports,
  },
  {
    path: '@atlaskit/theme',
    imports: namedThemeExports,
    // .concat(
    //   { importName: 'typography', message: 'The typography mixins are deprecated. Please use `@atlaskit/heading` instead.',}
    // )
  },
  {
    path: '@atlaskit/icon-priority',
    message: `icon-priority is deprecated due to limited usage in Cloud products. It will be deleted after 21 April 2022.`,
  },
  {
    path: '@atlaskit/logo/constants',
    imports: namedLogoConstantsExports,
  },
  {
    path: '@atlaskit/logo',
    imports: namedLogoExports,
  },
] as const;

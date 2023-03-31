/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
import { token } from '@atlaskit/tokens';

// TODO: All of these maps need to be codegen'd
export const backgroundColorMap = {
  disabled: token('color.background.disabled', '#091e4289'),
  input: token('color.background.input', '#FAFBFC'),
  'inverse.subtle': token('color.background.inverse.subtle', '#00000029'),
  neutral: token('color.background.neutral', '#DFE1E6'),
  'neutral.subtle': token('color.background.neutral.subtle', 'transparent'),
  'neutral.bold': token('color.background.neutral.bold', '#42526E'),
  selected: token('color.background.selected', '#DEEBFF'),
  'selected.bold': token('color.background.selected.bold', '#0052CC'),
  'brand.bold': token('color.background.brand.bold', '#0052CC'),
  danger: token('color.background.danger', '#FFEBE6'),
  'danger.bold': token('color.background.danger.bold', '#DE350B'),
  warning: token('color.background.warning', '#FFFAE6'),
  'warning.bold': token('color.background.warning.bold', '#FFAB00'),
  success: token('color.background.success', '#E3FCEF'),
  'success.bold': token('color.background.success.bold', '#00875A'),
  discovery: token('color.background.discovery', '#EAE6FF'),
  'discovery.bold': token('color.background.discovery.bold', '#5243AA'),
  information: token('color.background.information', '#DEEBFF'),
  'information.bold': token('color.background.information.bold', '#0052CC'),
  'color.blanket': token('color.blanket', '#091e4289'),
  'color.blanket.selected': token('color.blanket.selected', '#388BFF14'),
  'color.blanket.danger': token('color.blanket.danger', '#EF5C4814'),
  'elevation.surface': token('elevation.surface', '#FFFFFF'),
  'elevation.surface.overlay': token('elevation.surface.overlay', '#FFFFFF'),
  'elevation.surface.raised': token('elevation.surface.raised', '#FFFFFF'),
  'elevation.surface.sunken': token('elevation.surface.sunken', '#F4F5F7'),
} as const;
export type BackgroundColor = keyof typeof backgroundColorMap;

export const borderColorMap = {
  'color.border': token('color.border', '#091e4221'),
  disabled: token('color.border.disabled', '#FAFBFC'),
  focused: token('color.border.focused', '#4C9AFF'),
  input: token('color.border.input', '#FAFBFC'),
  inverse: token('color.border.inverse', '#FFFFFF'),
  selected: token('color.border.selected', '#0052CC'),
  brand: token('color.border.brand', '#0052CC'),
  danger: token('color.border.danger', '#FF5630'),
  warning: token('color.border.warning', '#FFC400'),
  success: token('color.border.success', '#00875A'),
  discovery: token('color.border.discovery', '#998DD9'),
  information: token('color.border.information', '#0065FF'),
  bold: token('color.border.bold', '#344563'),
} as const;
export type BorderColor = keyof typeof borderColorMap;

export const borderWidthMap = {
  'size.0': token('border.width.0', '0'),
  'size.050': token('border.width.050', '1px'),
  'size.100': token('border.width.100', '2px'),
} as const;
export type BorderWidth = keyof typeof borderWidthMap;
export const borderRadiusMap = {
  'radius.400': token('border.radius.400', '16px'),
  'radius.300': token('border.radius.300', '12px'),
  'radius.100': token('border.radius.100', '4px'),
  'radius.050': token('border.radius.050', '2px'),
  'radius.200': token('border.radius.200', '8px'),
} as const;
export type BorderRadius = keyof typeof borderRadiusMap;

export const paddingMap = {
  'space.0': token('space.0', '0px'),
  'space.025': token('space.025', '2px'),
  'space.050': token('space.050', '4px'),
  'space.075': token('space.075', '6px'),
  'space.100': token('space.100', '8px'),
  'space.150': token('space.150', '12px'),
  'space.200': token('space.200', '16px'),
  'space.250': token('space.250', '20px'),
  'space.300': token('space.300', '24px'),
  'space.400': token('space.400', '32px'),
  'space.500': token('space.500', '40px'),
  'space.600': token('space.600', '48px'),
  'space.800': token('space.800', '64px'),
  'space.1000': token('space.1000', '80px'),
} as const;

export type Padding = keyof typeof paddingMap;
export type PaddingBlock = keyof typeof paddingMap;
export type PaddingBlockStart = keyof typeof paddingMap;
export type PaddingBlockEnd = keyof typeof paddingMap;
export type PaddingInline = keyof typeof paddingMap;
export type PaddingInlineStart = keyof typeof paddingMap;
export type PaddingInlineEnd = keyof typeof paddingMap;

export const textColorMap = {
  'color.text': token('color.text', '#172B4D'),
  'accent.red': token('color.text.accent.red', '#DE350B'),
  'accent.red.bolder': token('color.text.accent.red.bolder', '#BF2600'),
  'accent.orange': token('color.text.accent.orange', '#F18D13'),
  'accent.orange.bolder': token('color.text.accent.orange.bolder', '#B65C02'),
  'accent.yellow': token('color.text.accent.yellow', '#FF991F'),
  'accent.yellow.bolder': token('color.text.accent.yellow.bolder', '#FF8B00'),
  'accent.green': token('color.text.accent.green', '#00875A'),
  'accent.green.bolder': token('color.text.accent.green.bolder', '#006644'),
  'accent.teal': token('color.text.accent.teal', '#00A3BF'),
  'accent.teal.bolder': token('color.text.accent.teal.bolder', '#008DA6'),
  'accent.blue': token('color.text.accent.blue', '#0052CC'),
  'accent.blue.bolder': token('color.text.accent.blue.bolder', '#0747A6'),
  'accent.purple': token('color.text.accent.purple', '#5243AA'),
  'accent.purple.bolder': token('color.text.accent.purple.bolder', '#403294'),
  'accent.magenta': token('color.text.accent.magenta', '#E774BB'),
  'accent.magenta.bolder': token('color.text.accent.magenta.bolder', '#DA62AC'),
  'accent.gray': token('color.text.accent.gray', '#505F79'),
  'accent.gray.bolder': token('color.text.accent.gray.bolder', '#172B4D'),
  disabled: token('color.text.disabled', '#A5ADBA'),
  inverse: token('color.text.inverse', '#FFFFFF'),
  selected: token('color.text.selected', '#0052CC'),
  brand: token('color.text.brand', '#0065FF'),
  danger: token('color.text.danger', '#DE350B'),
  warning: token('color.text.warning', '#974F0C'),
  'warning.inverse': token('color.text.warning.inverse', '#172B4D'),
  success: token('color.text.success', '#006644'),
  discovery: token('color.text.discovery', '#403294'),
  information: token('color.text.information', '#0052CC'),
  subtlest: token('color.text.subtlest', '#7A869A'),
  subtle: token('color.text.subtle', '#42526E'),
} as const;
export type TextColor = keyof typeof textColorMap;

export const dimensionMap = {
  '100%': '100%',
  'size.100': '16px',
  'size.200': '24px',
  'size.300': '32px',
  'size.400': '40px',
  'size.500': '48px',
  'size.600': '96px',
  'size.1000': '192px',
} as const;

export type Width = keyof typeof dimensionMap;
export type Height = keyof typeof dimensionMap;
export type MinWidth = keyof typeof dimensionMap;
export type MaxWidth = keyof typeof dimensionMap;
export type MinHeight = keyof typeof dimensionMap;
export type MaxHeight = keyof typeof dimensionMap;
export type TokenisedProps = {
  backgroundColor?: BackgroundColor;
  borderColor?: BorderColor;
  borderWidth?: BorderWidth;
  color?: TextColor;
  height?: Height;
  minHeight?: MinHeight;
  minWidth?: MinWidth;
  maxHeight?: MaxHeight;
  maxWidth?: MaxWidth;
  padding?: Padding;
  paddingBlock?: Padding;
  paddingInline?: Padding;
  paddingBlockStart?: Padding;
  paddingBlockEnd?: Padding;
  paddingInlineStart?: Padding;
  paddingInlineEnd?: Padding;
  width?: Width;
};

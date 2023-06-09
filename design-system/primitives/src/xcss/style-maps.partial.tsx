import { css, SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b6657585e3df6f8017d4c35bb9150e3f>>
 * @codegenId dimensions
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenParams ["dimensions"]
 * @codegenDependency ../../scripts/codegen-file-templates/dimensions.tsx <<SignedSource::01143ff41135244db1d8ec2efe4339d6>>
 */
export const dimensionMap = {
  '100%': '100%',
  'size.100': '1rem',
  'size.200': '1.5rem',
  'size.300': '2rem',
  'size.400': '2.5rem',
  'size.500': '3rem',
  'size.600': '6rem',
  'size.1000': '12rem',
} as const;
type Dimension = keyof typeof dimensionMap;

export type Width = Dimension;
export type Height = Dimension;
export type MinWidth = Dimension;
export type MaxWidth = Dimension;
export type MinHeight = Dimension;
export type MaxHeight = Dimension;
export type Top = Dimension;
export type Left = Dimension;
export type Bottom = Dimension;
export type Right = Dimension;
export type BlockSize = Dimension;
export type InlineSize = Dimension;
export type MaxBlockSize = Dimension;
export type MaxInlineSize = Dimension;
export type MinBlockSize = Dimension;
export type MinInlineSize = Dimension;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::de092b03d79b8477034921622fcddd53>>
 * @codegenId spacing
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-spacing.tsx <<SignedSource::86e173b0e020fe5d091fdf4bff023711>>
 */
export const spaceMap = {
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
};
export type Space = keyof typeof spaceMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7d56840c81e052d4dc9e5ebb6a1a0053>>
 * @codegenId colors
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenParams ["border", "background", "shadow", "text", "fill"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::10aa7e87eca39e4d6594a764e78e0698>>
 */
export const borderColorMap = {
  'color.border': token('color.border', '#091e4221'),
  'color.border.accent.red': token('color.border.accent.red', '#FF5630'),
  'color.border.accent.orange': token('color.border.accent.orange', '#D94008'),
  'color.border.accent.yellow': token('color.border.accent.yellow', '#FFAB00'),
  'color.border.accent.green': token('color.border.accent.green', '#36B37E'),
  'color.border.accent.teal': token('color.border.accent.teal', '#00B8D9'),
  'color.border.accent.blue': token('color.border.accent.blue', '#0065FF'),
  'color.border.accent.purple': token('color.border.accent.purple', '#6554C0'),
  'color.border.accent.magenta': token(
    'color.border.accent.magenta',
    '#CD519D',
  ),
  'color.border.accent.gray': token('color.border.accent.gray', '#5E6C84'),
  'color.border.disabled': token('color.border.disabled', '#FAFBFC'),
  'color.border.focused': token('color.border.focused', '#4C9AFF'),
  'color.border.input': token('color.border.input', '#FAFBFC'),
  'color.border.inverse': token('color.border.inverse', '#FFFFFF'),
  'color.border.selected': token('color.border.selected', '#0052CC'),
  'color.border.brand': token('color.border.brand', '#0052CC'),
  'color.border.danger': token('color.border.danger', '#FF5630'),
  'color.border.warning': token('color.border.warning', '#FFC400'),
  'color.border.success': token('color.border.success', '#00875A'),
  'color.border.discovery': token('color.border.discovery', '#998DD9'),
  'color.border.information': token('color.border.information', '#0065FF'),
  'color.border.bold': token('color.border.bold', '#344563'),
} as const;

export type BorderColor = keyof typeof borderColorMap;

export const backgroundColorMap = {
  'color.background.accent.red.subtlest': token(
    'color.background.accent.red.subtlest',
    '#FF8F73',
  ),
  'color.background.accent.red.subtler': token(
    'color.background.accent.red.subtler',
    '#FF7452',
  ),
  'color.background.accent.red.subtle': token(
    'color.background.accent.red.subtle',
    '#DE350B',
  ),
  'color.background.accent.red.bolder': token(
    'color.background.accent.red.bolder',
    '#DE350B',
  ),
  'color.background.accent.orange.subtlest': token(
    'color.background.accent.orange.subtlest',
    '#F18D13',
  ),
  'color.background.accent.orange.subtler': token(
    'color.background.accent.orange.subtler',
    '#B65C02',
  ),
  'color.background.accent.orange.subtle': token(
    'color.background.accent.orange.subtle',
    '#5F3811',
  ),
  'color.background.accent.orange.bolder': token(
    'color.background.accent.orange.bolder',
    '#43290F',
  ),
  'color.background.accent.yellow.subtlest': token(
    'color.background.accent.yellow.subtlest',
    '#FFE380',
  ),
  'color.background.accent.yellow.subtler': token(
    'color.background.accent.yellow.subtler',
    '#FFC400',
  ),
  'color.background.accent.yellow.subtle': token(
    'color.background.accent.yellow.subtle',
    '#FF991F',
  ),
  'color.background.accent.yellow.bolder': token(
    'color.background.accent.yellow.bolder',
    '#FF991F',
  ),
  'color.background.accent.green.subtlest': token(
    'color.background.accent.green.subtlest',
    '#79F2C0',
  ),
  'color.background.accent.green.subtler': token(
    'color.background.accent.green.subtler',
    '#57D9A3',
  ),
  'color.background.accent.green.subtle': token(
    'color.background.accent.green.subtle',
    '#00875A',
  ),
  'color.background.accent.green.bolder': token(
    'color.background.accent.green.bolder',
    '#00875A',
  ),
  'color.background.accent.teal.subtlest': token(
    'color.background.accent.teal.subtlest',
    '#79E2F2',
  ),
  'color.background.accent.teal.subtler': token(
    'color.background.accent.teal.subtler',
    '#00C7E6',
  ),
  'color.background.accent.teal.subtle': token(
    'color.background.accent.teal.subtle',
    '#00A3BF',
  ),
  'color.background.accent.teal.bolder': token(
    'color.background.accent.teal.bolder',
    '#00A3BF',
  ),
  'color.background.accent.blue.subtlest': token(
    'color.background.accent.blue.subtlest',
    '#4C9AFF',
  ),
  'color.background.accent.blue.subtler': token(
    'color.background.accent.blue.subtler',
    '#2684FF',
  ),
  'color.background.accent.blue.subtle': token(
    'color.background.accent.blue.subtle',
    '#0052CC',
  ),
  'color.background.accent.blue.bolder': token(
    'color.background.accent.blue.bolder',
    '#0052CC',
  ),
  'color.background.accent.purple.subtlest': token(
    'color.background.accent.purple.subtlest',
    '#998DD9',
  ),
  'color.background.accent.purple.subtler': token(
    'color.background.accent.purple.subtler',
    '#8777D9',
  ),
  'color.background.accent.purple.subtle': token(
    'color.background.accent.purple.subtle',
    '#5243AA',
  ),
  'color.background.accent.purple.bolder': token(
    'color.background.accent.purple.bolder',
    '#5243AA',
  ),
  'color.background.accent.magenta.subtlest': token(
    'color.background.accent.magenta.subtlest',
    '#E774BB',
  ),
  'color.background.accent.magenta.subtler': token(
    'color.background.accent.magenta.subtler',
    '#E774BB',
  ),
  'color.background.accent.magenta.subtle': token(
    'color.background.accent.magenta.subtle',
    '#E774BB',
  ),
  'color.background.accent.magenta.bolder': token(
    'color.background.accent.magenta.bolder',
    '#E774BB',
  ),
  'color.background.accent.gray.subtlest': token(
    'color.background.accent.gray.subtlest',
    '#6B778C',
  ),
  'color.background.accent.gray.subtler': token(
    'color.background.accent.gray.subtler',
    '#5E6C84',
  ),
  'color.background.accent.gray.subtle': token(
    'color.background.accent.gray.subtle',
    '#42526E',
  ),
  'color.background.accent.gray.bolder': token(
    'color.background.accent.gray.bolder',
    '#505F79',
  ),
  'color.background.disabled': token('color.background.disabled', '#091e4289'),
  'color.background.input': token('color.background.input', '#FAFBFC'),
  'color.background.input.hovered': token(
    'color.background.input.hovered',
    '#EBECF0',
  ),
  'color.background.input.pressed': token(
    'color.background.input.pressed',
    '#FFFFFF',
  ),
  'color.background.inverse.subtle': token(
    'color.background.inverse.subtle',
    '#00000029',
  ),
  'color.background.inverse.subtle.hovered': token(
    'color.background.inverse.subtle.hovered',
    '#0000003D',
  ),
  'color.background.inverse.subtle.pressed': token(
    'color.background.inverse.subtle.pressed',
    '#00000052',
  ),
  'color.background.neutral': token('color.background.neutral', '#DFE1E6'),
  'color.background.neutral.hovered': token(
    'color.background.neutral.hovered',
    '#091e4214',
  ),
  'color.background.neutral.pressed': token(
    'color.background.neutral.pressed',
    '#B3D4FF',
  ),
  'color.background.neutral.subtle': token(
    'color.background.neutral.subtle',
    'transparent',
  ),
  'color.background.neutral.subtle.hovered': token(
    'color.background.neutral.subtle.hovered',
    '#091e4214',
  ),
  'color.background.neutral.subtle.pressed': token(
    'color.background.neutral.subtle.pressed',
    '#B3D4FF',
  ),
  'color.background.neutral.bold': token(
    'color.background.neutral.bold',
    '#42526E',
  ),
  'color.background.neutral.bold.hovered': token(
    'color.background.neutral.bold.hovered',
    '#505F79',
  ),
  'color.background.neutral.bold.pressed': token(
    'color.background.neutral.bold.pressed',
    '#344563',
  ),
  'color.background.selected': token('color.background.selected', '#DEEBFF'),
  'color.background.selected.hovered': token(
    'color.background.selected.hovered',
    '#B3D4FF',
  ),
  'color.background.selected.pressed': token(
    'color.background.selected.pressed',
    '#4C9AFF',
  ),
  'color.background.selected.bold': token(
    'color.background.selected.bold',
    '#0052CC',
  ),
  'color.background.selected.bold.hovered': token(
    'color.background.selected.bold.hovered',
    '#2684FF',
  ),
  'color.background.selected.bold.pressed': token(
    'color.background.selected.bold.pressed',
    '#0052CC',
  ),
  'color.background.brand.bold': token(
    'color.background.brand.bold',
    '#0052CC',
  ),
  'color.background.brand.bold.hovered': token(
    'color.background.brand.bold.hovered',
    '#0065FF',
  ),
  'color.background.brand.bold.pressed': token(
    'color.background.brand.bold.pressed',
    '#0747A6',
  ),
  'color.background.danger': token('color.background.danger', '#FFEBE6'),
  'color.background.danger.hovered': token(
    'color.background.danger.hovered',
    '#FFBDAD',
  ),
  'color.background.danger.pressed': token(
    'color.background.danger.pressed',
    '#FF8F73',
  ),
  'color.background.danger.bold': token(
    'color.background.danger.bold',
    '#DE350B',
  ),
  'color.background.danger.bold.hovered': token(
    'color.background.danger.bold.hovered',
    '#FF5630',
  ),
  'color.background.danger.bold.pressed': token(
    'color.background.danger.bold.pressed',
    '#BF2600',
  ),
  'color.background.warning': token('color.background.warning', '#FFFAE6'),
  'color.background.warning.hovered': token(
    'color.background.warning.hovered',
    '#FFF0B3',
  ),
  'color.background.warning.pressed': token(
    'color.background.warning.pressed',
    '#FFE380',
  ),
  'color.background.warning.bold': token(
    'color.background.warning.bold',
    '#FFAB00',
  ),
  'color.background.warning.bold.hovered': token(
    'color.background.warning.bold.hovered',
    '#FFC400',
  ),
  'color.background.warning.bold.pressed': token(
    'color.background.warning.bold.pressed',
    '#FF991F',
  ),
  'color.background.success': token('color.background.success', '#E3FCEF'),
  'color.background.success.hovered': token(
    'color.background.success.hovered',
    '#ABF5D1',
  ),
  'color.background.success.pressed': token(
    'color.background.success.pressed',
    '#79F2C0',
  ),
  'color.background.success.bold': token(
    'color.background.success.bold',
    '#00875A',
  ),
  'color.background.success.bold.hovered': token(
    'color.background.success.bold.hovered',
    '#57D9A3',
  ),
  'color.background.success.bold.pressed': token(
    'color.background.success.bold.pressed',
    '#00875A',
  ),
  'color.background.discovery': token('color.background.discovery', '#EAE6FF'),
  'color.background.discovery.hovered': token(
    'color.background.discovery.hovered',
    '#C0B6F2',
  ),
  'color.background.discovery.pressed': token(
    'color.background.discovery.pressed',
    '#998DD9',
  ),
  'color.background.discovery.bold': token(
    'color.background.discovery.bold',
    '#5243AA',
  ),
  'color.background.discovery.bold.hovered': token(
    'color.background.discovery.bold.hovered',
    '#8777D9',
  ),
  'color.background.discovery.bold.pressed': token(
    'color.background.discovery.bold.pressed',
    '#5243AA',
  ),
  'color.background.information': token(
    'color.background.information',
    '#DEEBFF',
  ),
  'color.background.information.hovered': token(
    'color.background.information.hovered',
    '#B3D4FF',
  ),
  'color.background.information.pressed': token(
    'color.background.information.pressed',
    '#4C9AFF',
  ),
  'color.background.information.bold': token(
    'color.background.information.bold',
    '#0052CC',
  ),
  'color.background.information.bold.hovered': token(
    'color.background.information.bold.hovered',
    '#2684FF',
  ),
  'color.background.information.bold.pressed': token(
    'color.background.information.bold.pressed',
    '#0052CC',
  ),
  'color.blanket': token('color.blanket', '#091e4289'),
  'color.blanket.selected': token('color.blanket.selected', '#388BFF14'),
  'color.blanket.danger': token('color.blanket.danger', '#EF5C4814'),
  'elevation.surface': token('elevation.surface', '#FFFFFF'),
  'elevation.surface.hovered': token('elevation.surface.hovered', '#FAFBFC'),
  'elevation.surface.pressed': token('elevation.surface.pressed', '#F4F5F7'),
  'elevation.surface.overlay': token('elevation.surface.overlay', '#FFFFFF'),
  'elevation.surface.overlay.hovered': token(
    'elevation.surface.overlay.hovered',
    '#FAFBFC',
  ),
  'elevation.surface.overlay.pressed': token(
    'elevation.surface.overlay.pressed',
    '#F4F5F7',
  ),
  'elevation.surface.raised': token('elevation.surface.raised', '#FFFFFF'),
  'elevation.surface.raised.hovered': token(
    'elevation.surface.raised.hovered',
    '#FAFBFC',
  ),
  'elevation.surface.raised.pressed': token(
    'elevation.surface.raised.pressed',
    '#F4F5F7',
  ),
  'elevation.surface.sunken': token('elevation.surface.sunken', '#F4F5F7'),
} as const;

export type BackgroundColor = keyof typeof backgroundColorMap;

export const shadowMap = {
  'elevation.shadow.overflow': token(
    'elevation.shadow.overflow',
    '0px 0px 8px #091e423f, 0px 0px 1px #091e424f',
  ),
  'elevation.shadow.overflow.perimeter': token(
    'elevation.shadow.overflow.perimeter',
    '#091e421f',
  ),
  'elevation.shadow.overflow.spread': token(
    'elevation.shadow.overflow.spread',
    '#091e4229',
  ),
  'elevation.shadow.overlay': token(
    'elevation.shadow.overlay',
    '0px 8px 12px #091e423f, 0px 0px 1px #091e424f',
  ),
  'elevation.shadow.raised': token(
    'elevation.shadow.raised',
    '0px 1px 1px #091e423f, 0px 0px 1px #091e4221',
  ),
} as const;

export type Shadow = keyof typeof shadowMap;

export const textColorMap = {
  'color.text': token('color.text', '#172B4D'),
  'color.text.accent.red': token('color.text.accent.red', '#DE350B'),
  'color.text.accent.red.bolder': token(
    'color.text.accent.red.bolder',
    '#BF2600',
  ),
  'color.text.accent.orange': token('color.text.accent.orange', '#F18D13'),
  'color.text.accent.orange.bolder': token(
    'color.text.accent.orange.bolder',
    '#B65C02',
  ),
  'color.text.accent.yellow': token('color.text.accent.yellow', '#FF991F'),
  'color.text.accent.yellow.bolder': token(
    'color.text.accent.yellow.bolder',
    '#FF8B00',
  ),
  'color.text.accent.green': token('color.text.accent.green', '#00875A'),
  'color.text.accent.green.bolder': token(
    'color.text.accent.green.bolder',
    '#006644',
  ),
  'color.text.accent.teal': token('color.text.accent.teal', '#00A3BF'),
  'color.text.accent.teal.bolder': token(
    'color.text.accent.teal.bolder',
    '#008DA6',
  ),
  'color.text.accent.blue': token('color.text.accent.blue', '#0052CC'),
  'color.text.accent.blue.bolder': token(
    'color.text.accent.blue.bolder',
    '#0747A6',
  ),
  'color.text.accent.purple': token('color.text.accent.purple', '#5243AA'),
  'color.text.accent.purple.bolder': token(
    'color.text.accent.purple.bolder',
    '#403294',
  ),
  'color.text.accent.magenta': token('color.text.accent.magenta', '#E774BB'),
  'color.text.accent.magenta.bolder': token(
    'color.text.accent.magenta.bolder',
    '#DA62AC',
  ),
  'color.text.accent.gray': token('color.text.accent.gray', '#505F79'),
  'color.text.accent.gray.bolder': token(
    'color.text.accent.gray.bolder',
    '#172B4D',
  ),
  'color.text.disabled': token('color.text.disabled', '#A5ADBA'),
  'color.text.inverse': token('color.text.inverse', '#FFFFFF'),
  'color.text.selected': token('color.text.selected', '#0052CC'),
  'color.text.brand': token('color.text.brand', '#0065FF'),
  'color.text.danger': token('color.text.danger', '#DE350B'),
  'color.text.warning': token('color.text.warning', '#974F0C'),
  'color.text.warning.inverse': token('color.text.warning.inverse', '#172B4D'),
  'color.text.success': token('color.text.success', '#006644'),
  'color.text.discovery': token('color.text.discovery', '#403294'),
  'color.text.information': token('color.text.information', '#0052CC'),
  'color.text.subtlest': token('color.text.subtlest', '#7A869A'),
  'color.text.subtle': token('color.text.subtle', '#42526E'),
} as const;

export type TextColor = keyof typeof textColorMap;

export const fillMap = {
  'color.icon': token('color.icon', '#505F79'),
  'color.icon.accent.red': token('color.icon.accent.red', '#FF5630'),
  'color.icon.accent.orange': token('color.icon.accent.orange', '#D94008'),
  'color.icon.accent.yellow': token('color.icon.accent.yellow', '#FFAB00'),
  'color.icon.accent.green': token('color.icon.accent.green', '#36B37E'),
  'color.icon.accent.teal': token('color.icon.accent.teal', '#00B8D9'),
  'color.icon.accent.blue': token('color.icon.accent.blue', '#0065FF'),
  'color.icon.accent.purple': token('color.icon.accent.purple', '#6554C0'),
  'color.icon.accent.magenta': token('color.icon.accent.magenta', '#CD519D'),
  'color.icon.accent.gray': token('color.icon.accent.gray', '#5E6C84'),
  'color.icon.disabled': token('color.icon.disabled', '#8993A4'),
  'color.icon.inverse': token('color.icon.inverse', '#FFFFFF'),
  'color.icon.selected': token('color.icon.selected', '#0052CC'),
  'color.icon.brand': token('color.icon.brand', '#0065FF'),
  'color.icon.danger': token('color.icon.danger', '#DE350B'),
  'color.icon.warning': token('color.icon.warning', '#FFC400'),
  'color.icon.warning.inverse': token('color.icon.warning.inverse', '#253858'),
  'color.icon.success': token('color.icon.success', '#00875A'),
  'color.icon.discovery': token('color.icon.discovery', '#8777D9'),
  'color.icon.information': token('color.icon.information', '#0747A6'),
  'color.icon.subtle': token('color.icon.subtle', '#6B778C'),
} as const;

export type Fill = keyof typeof fillMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7787d50b7bc64a9350e4cf35ae608a79>>
 * @codegenId misc
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenParams ["align-self", "border-style", "display", "flex-direction", "flex-grow", "flex-shrink", "flex", "layer", "overflow", "position"]
 * @codegenDependency ../../scripts/codegen-file-templates/align-self.tsx <<SignedSource::074079802534462de54bf882bb2073e5>>
 * @codegenDependency ../../scripts/codegen-file-templates/border-style.tsx <<SignedSource::87e7e289ffeaac901997c4af98084a5f>>
 * @codegenDependency ../../scripts/codegen-file-templates/dimensions.tsx <<SignedSource::01143ff41135244db1d8ec2efe4339d6>>
 * @codegenDependency ../../scripts/codegen-file-templates/display.tsx <<SignedSource::486569d9e228265c1688d0a7122bdedc>>
 * @codegenDependency ../../scripts/codegen-file-templates/flex-direction.tsx <<SignedSource::19809ba11675679c188b0d98fb651dc1>>
 * @codegenDependency ../../scripts/codegen-file-templates/flex-grow.tsx <<SignedSource::b8a06b122cb609170f1f42778a6c270e>>
 * @codegenDependency ../../scripts/codegen-file-templates/flex-shrink.tsx <<SignedSource::77effeb1e5c39997e34b21b000a91faf>>
 * @codegenDependency ../../scripts/codegen-file-templates/flex.tsx <<SignedSource::ffa0189d14f1f00a16ec1e9f43a17ce9>>
 * @codegenDependency ../../scripts/codegen-file-templates/layer.tsx <<SignedSource::79d24a1e558f12d671c06a7609f90dc1>>
 * @codegenDependency ../../scripts/codegen-file-templates/overflow.tsx <<SignedSource::ccb841f2f51525aed895c06e00f15089>>
 * @codegenDependency ../../scripts/codegen-file-templates/position.tsx <<SignedSource::8709494ef16c48046c1784a9aaec6d80>>
 */
export const alignSelfMap = {
  center: 'center',
  start: 'start',
  stretch: 'stretch',
  end: 'end',
  baseline: 'baseline',
} as const;

export type AlignSelf = keyof typeof alignSelfMap;

export const borderStyleMap = {
  none: 'none',
  solid: 'solid',
} as const;

export type BorderStyle = keyof typeof borderStyleMap;

export const displayMap = {
  flex: 'flex',
  block: 'block',
  inline: 'inline',
  inlineBlock: 'inline-block',
  inlineFlex: 'inline-flex',
  grid: 'grid',
} as const;

export type Display = keyof typeof displayMap;

export const flexDirectionMap = {
  row: 'row',
  column: 'column',
} as const;

export type FlexDirection = keyof typeof flexDirectionMap;

export const flexGrowMap = {
  '0': 0,
  '1': 1,
} as const;

export type FlexGrow = keyof typeof flexGrowMap;

export const flexShrinkMap = {
  '0': '0',
  '1': 1,
} as const;

export type FlexShrink = keyof typeof flexShrinkMap;

export const flexMap = {
  '1': 1,
} as const;

export type Flex = keyof typeof flexMap;

export const layerMap = {
  card: 100,
  navigation: 200,
  dialog: 300,
  layer: 400,
  blanket: 500,
  modal: 510,
  flag: 600,
  spotlight: 700,
  tooltip: 800,
} as const;

export type Layer = keyof typeof layerMap;

export const overflowMap = {
  auto: 'auto',
  hidden: 'hidden',
} as const;

export type Overflow = keyof typeof overflowMap;

export const overflowInlineMap = {
  auto: 'auto',
  hidden: 'hidden',
} as const;

export type OverflowInline = keyof typeof overflowInlineMap;

export const overflowBlockMap = {
  auto: 'auto',
  hidden: 'hidden',
} as const;

export type OverflowBlock = keyof typeof overflowBlockMap;

export const positionMap = {
  absolute: 'absolute',
  fixed: 'fixed',
  relative: 'relative',
  static: 'static',
} as const;

export type Position = keyof typeof positionMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::290c3673c7e8302a6517c5004ca82979>>
 * @codegenId border
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenParams ["width", "radius"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-shape.tsx <<SignedSource::81055547b21306c07a3e8a3c734a2f1c>>
 */
export const borderWidthMap = {
  'border.width.0': token('border.width.0', '0px'),
  'border.width.050': token('border.width.050', '1px'),
  'border.width.100': token('border.width.100', '2px'),
} as const;

export type BorderWidth = keyof typeof borderWidthMap;

export const borderRadiusMap = {
  'border.radius.050': token('border.radius.050', '2px'),
  'border.radius.100': token('border.radius.100', '3px'),
  'border.radius.200': token('border.radius.200', '8px'),
  'border.radius.300': token('border.radius.300', '12px'),
  'border.radius.400': token('border.radius.400', '16px'),
  'border.radius.round': token('border.radius.round', '50%'),
} as const;

export type BorderRadius = keyof typeof borderRadiusMap;

/**
 * @codegenEnd
 */

export type TokenisedProps = {
  alignSelf?: AlignSelf;
  backgroundColor?: BackgroundColor;
  blockSize?: BlockSize;
  borderColor?: BorderColor;
  borderRadius?: BorderRadius;
  borderStyle?: BorderStyle;
  borderWidth?: BorderWidth;
  bottom?: Bottom;
  boxShadow?: Shadow;
  color?: TextColor;
  columnGap?: Space;
  display?: Display;
  fill?: Fill;
  flex?: Flex;
  flexDirection?: FlexDirection;
  flexGrow?: FlexGrow;
  flexShrink?: FlexShrink;
  gap?: Space;
  height?: Height;
  inlineSize?: InlineSize;
  inset?: Space;
  insetBlock?: Space;
  insetBlockEnd?: Space;
  insetBlockStart?: Space;
  insetInline?: Space;
  insetInlineEnd?: Space;
  insetInlineStart?: Space;
  left?: Left;
  maxBlockSize?: MaxBlockSize;
  maxHeight?: MaxHeight;
  maxInlineSize?: MaxInlineSize;
  maxWidth?: MaxWidth;
  minBlockSize?: MinBlockSize;
  minHeight?: MinHeight;
  minInlineSize?: MinInlineSize;
  minWidth?: MinWidth;
  outlineColor?: BorderColor;
  outlineOffset?: Space;
  outlineWidth?: BorderWidth;
  overflow?: Overflow;
  overflowBlock?: OverflowBlock;
  overflowInline?: OverflowInline;
  padding?: Space;
  paddingBlock?: Space;
  paddingBlockEnd?: Space;
  paddingBlockStart?: Space;
  paddingInline?: Space;
  paddingInlineEnd?: Space;
  paddingInlineStart?: Space;
  position?: Position;
  right?: Right;
  rowGap?: Space;
  top?: Top;
  width?: Width;
  zIndex?: Layer;
};

// Generate maps for Box props. backgroundColor, padding, etc
const spacingProperties = [
  // Used by Box
  'padding',
  'paddingBlock',
  'paddingBlockStart',
  'paddingBlockEnd',
  'paddingInline',
  'paddingInlineStart',
  'paddingInlineEnd',
  // Used by Inline and Stack
  'gap',
  'rowGap',
  'columnGap',
] as const;
type SpacingProperty = (typeof spacingProperties)[number];

type TokenMappableProperty = SpacingProperty | 'backgroundColor';
type PropsToken = SpacingToken | BackgroundColorToken;
type TokenMap = Partial<Record<PropsToken, ReturnType<typeof token>>>;
type SerializedStylesMap = Record<PropsToken, SerializedStyles>;

const getSerializedStylesMap = (
  cssProperty: TokenMappableProperty,
  tokenMap: TokenMap,
): SerializedStylesMap => {
  return Object.keys(tokenMap).reduce((emotionSpacingMap, token) => {
    emotionSpacingMap[token as PropsToken] = css({
      [cssProperty]: tokenMap[token as PropsToken],
    });

    return emotionSpacingMap;
  }, {} as SerializedStylesMap);
};
type SpacingToken = keyof typeof spaceMap;
type BackgroundColorToken = keyof typeof backgroundColorMap;
type SpacingStyleMap = Record<
  SpacingProperty,
  Record<SpacingToken, SerializedStyles>
>;
type BackgroundColorStyleMap = Record<BackgroundColorToken, SerializedStyles>;

export const paddingStylesMap: SpacingStyleMap = spacingProperties.reduce(
  (styleMap, spacingProperty: SpacingProperty) => {
    styleMap[spacingProperty] = getSerializedStylesMap(
      spacingProperty,
      spaceMap,
    );

    return styleMap;
  },
  {} as SpacingStyleMap,
);

export const spaceStylesMap: SpacingStyleMap = spacingProperties.reduce(
  (styleMap, spacingProperty: SpacingProperty) => {
    styleMap[spacingProperty] = getSerializedStylesMap(
      spacingProperty,
      spaceMap,
    );

    return styleMap;
  },
  {} as SpacingStyleMap,
);

export const backgroundColorStylesMap: BackgroundColorStyleMap =
  getSerializedStylesMap('backgroundColor', backgroundColorMap);

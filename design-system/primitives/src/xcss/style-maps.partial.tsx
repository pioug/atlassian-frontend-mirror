import { css, SerializedStyles } from '@emotion/react';

import { CURRENT_SURFACE_CSS_VAR, token } from '@atlaskit/tokens';

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7af6097e56f7fb03635b6f8aaf121b02>>
 * @codegenId dimensions
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenParams ["dimensions"]
 * @codegenDependency ../../scripts/codegen-file-templates/dimensions.tsx <<SignedSource::0cd422575c3f2a3784eeef767abe71f4>>
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
export type Dimension = keyof typeof dimensionMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f8111b846d3e3be67331853f10d1b568>>
 * @codegenId spacing
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-spacing.tsx <<SignedSource::55622b91aca9b3afac4bce440f222b71>>
 */
export const positiveSpaceMap = {
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
export type Space = keyof typeof positiveSpaceMap;

export const negativeSpaceMap = {
  'space.negative.025': token('space.negative.025', '-2px'),
  'space.negative.050': token('space.negative.050', '-4px'),
  'space.negative.075': token('space.negative.075', '-6px'),
  'space.negative.100': token('space.negative.100', '-8px'),
  'space.negative.150': token('space.negative.150', '-12px'),
  'space.negative.200': token('space.negative.200', '-16px'),
  'space.negative.250': token('space.negative.250', '-20px'),
  'space.negative.300': token('space.negative.300', '-24px'),
  'space.negative.400': token('space.negative.400', '-32px'),
};
export type NegativeSpace = keyof typeof negativeSpaceMap;

export const allSpaceMap = { ...positiveSpaceMap, ...negativeSpaceMap };

export type AllSpace = keyof typeof allSpaceMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::fcf1cfc01cda3c278e69b0b564c7746d>>
 * @codegenId inverse-colors
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::f1021f8d47ab63374e371ce18db72a1c>>
 */
export const inverseColorMap = {
  'color.background.neutral.bold': 'color.text.inverse',
  'color.background.neutral.bold.hovered': 'color.text.inverse',
  'color.background.neutral.bold.pressed': 'color.text.inverse',
  'color.background.selected.bold': 'color.text.inverse',
  'color.background.selected.bold.hovered': 'color.text.inverse',
  'color.background.selected.bold.pressed': 'color.text.inverse',
  'color.background.brand.bold': 'color.text.inverse',
  'color.background.brand.bold.hovered': 'color.text.inverse',
  'color.background.brand.bold.pressed': 'color.text.inverse',
  'color.background.brand.boldest': 'color.text.inverse',
  'color.background.brand.boldest.hovered': 'color.text.inverse',
  'color.background.brand.boldest.pressed': 'color.text.inverse',
  'color.background.danger.bold': 'color.text.inverse',
  'color.background.danger.bold.hovered': 'color.text.inverse',
  'color.background.danger.bold.pressed': 'color.text.inverse',
  'color.background.warning.bold': 'color.text.warning.inverse',
  'color.background.warning.bold.hovered': 'color.text.warning.inverse',
  'color.background.warning.bold.pressed': 'color.text.warning.inverse',
  'color.background.success.bold': 'color.text.inverse',
  'color.background.success.bold.hovered': 'color.text.inverse',
  'color.background.success.bold.pressed': 'color.text.inverse',
  'color.background.discovery.bold': 'color.text.inverse',
  'color.background.discovery.bold.hovered': 'color.text.inverse',
  'color.background.discovery.bold.pressed': 'color.text.inverse',
  'color.background.information.bold': 'color.text.inverse',
  'color.background.information.bold.hovered': 'color.text.inverse',
  'color.background.information.bold.pressed': 'color.text.inverse',
} as const;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::8c10abde8168de6260b5aa120dd948bc>>
 * @codegenId elevation
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenParams ["opacity", "shadow", "surface"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::f1021f8d47ab63374e371ce18db72a1c>>
 */
export const opacityMap = {
  'opacity.disabled': token('opacity.disabled', '0.4'),
  'opacity.loading': token('opacity.loading', '0.2'),
} as const;

export type Opacity = keyof typeof opacityMap;

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

export const surfaceColorMap = {
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

export type SurfaceColor = keyof typeof surfaceColorMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::0f7982208166d5dae0e25517d29aeaef>>
 * @codegenId colors
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenParams ["border", "background", "text", "fill"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::f1021f8d47ab63374e371ce18db72a1c>>
 */
export const borderColorMap = {
  'color.border': token('color.border', '#091e4221'),
  'color.border.accent.lime': token('color.border.accent.lime', '#6A9A23'),
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
  'color.border.focused': token('color.border.focused', '#2684FF'),
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
  'color.background.accent.lime.subtlest': token(
    'color.background.accent.lime.subtlest',
    '#EEFBDA',
  ),
  'color.background.accent.lime.subtlest.hovered': token(
    'color.background.accent.lime.subtlest.hovered',
    '#D3F1A7',
  ),
  'color.background.accent.lime.subtlest.pressed': token(
    'color.background.accent.lime.subtlest.pressed',
    '#B3DF72',
  ),
  'color.background.accent.lime.subtler': token(
    'color.background.accent.lime.subtler',
    '#D3F1A7',
  ),
  'color.background.accent.lime.subtler.hovered': token(
    'color.background.accent.lime.subtler.hovered',
    '#B3DF72',
  ),
  'color.background.accent.lime.subtler.pressed': token(
    'color.background.accent.lime.subtler.pressed',
    '#94C748',
  ),
  'color.background.accent.lime.subtle': token(
    'color.background.accent.lime.subtle',
    '#94C748',
  ),
  'color.background.accent.lime.subtle.hovered': token(
    'color.background.accent.lime.subtle.hovered',
    '#B3DF72',
  ),
  'color.background.accent.lime.subtle.pressed': token(
    'color.background.accent.lime.subtle.pressed',
    '#D3F1A7',
  ),
  'color.background.accent.lime.bolder': token(
    'color.background.accent.lime.bolder',
    '#5B7F24',
  ),
  'color.background.accent.lime.bolder.hovered': token(
    'color.background.accent.lime.bolder.hovered',
    '#37471F',
  ),
  'color.background.accent.lime.bolder.pressed': token(
    'color.background.accent.lime.bolder.pressed',
    '#37471F',
  ),
  'color.background.accent.red.subtlest': token(
    'color.background.accent.red.subtlest',
    '#FF8F73',
  ),
  'color.background.accent.red.subtlest.hovered': token(
    'color.background.accent.red.subtlest.hovered',
    '#FF7452',
  ),
  'color.background.accent.red.subtlest.pressed': token(
    'color.background.accent.red.subtlest.pressed',
    '#FF5630',
  ),
  'color.background.accent.red.subtler': token(
    'color.background.accent.red.subtler',
    '#FF7452',
  ),
  'color.background.accent.red.subtler.hovered': token(
    'color.background.accent.red.subtler.hovered',
    '#FF5630',
  ),
  'color.background.accent.red.subtler.pressed': token(
    'color.background.accent.red.subtler.pressed',
    '#DE350B',
  ),
  'color.background.accent.red.subtle': token(
    'color.background.accent.red.subtle',
    '#DE350B',
  ),
  'color.background.accent.red.subtle.hovered': token(
    'color.background.accent.red.subtle.hovered',
    '#FF5630',
  ),
  'color.background.accent.red.subtle.pressed': token(
    'color.background.accent.red.subtle.pressed',
    '#FF7452',
  ),
  'color.background.accent.red.bolder': token(
    'color.background.accent.red.bolder',
    '#DE350B',
  ),
  'color.background.accent.red.bolder.hovered': token(
    'color.background.accent.red.bolder.hovered',
    '#FF5630',
  ),
  'color.background.accent.red.bolder.pressed': token(
    'color.background.accent.red.bolder.pressed',
    '#FF7452',
  ),
  'color.background.accent.orange.subtlest': token(
    'color.background.accent.orange.subtlest',
    '#F18D13',
  ),
  'color.background.accent.orange.subtlest.hovered': token(
    'color.background.accent.orange.subtlest.hovered',
    '#FEC57B',
  ),
  'color.background.accent.orange.subtlest.pressed': token(
    'color.background.accent.orange.subtlest.pressed',
    '#FFE2BD',
  ),
  'color.background.accent.orange.subtler': token(
    'color.background.accent.orange.subtler',
    '#B65C02',
  ),
  'color.background.accent.orange.subtler.hovered': token(
    'color.background.accent.orange.subtler.hovered',
    '#F18D13',
  ),
  'color.background.accent.orange.subtler.pressed': token(
    'color.background.accent.orange.subtler.pressed',
    '#FEC57B',
  ),
  'color.background.accent.orange.subtle': token(
    'color.background.accent.orange.subtle',
    '#5F3811',
  ),
  'color.background.accent.orange.subtle.hovered': token(
    'color.background.accent.orange.subtle.hovered',
    '#974F0C',
  ),
  'color.background.accent.orange.subtle.pressed': token(
    'color.background.accent.orange.subtle.pressed',
    '#B65C02',
  ),
  'color.background.accent.orange.bolder': token(
    'color.background.accent.orange.bolder',
    '#43290F',
  ),
  'color.background.accent.orange.bolder.hovered': token(
    'color.background.accent.orange.bolder.hovered',
    '#5F3811',
  ),
  'color.background.accent.orange.bolder.pressed': token(
    'color.background.accent.orange.bolder.pressed',
    '#974F0C',
  ),
  'color.background.accent.yellow.subtlest': token(
    'color.background.accent.yellow.subtlest',
    '#FFE380',
  ),
  'color.background.accent.yellow.subtlest.hovered': token(
    'color.background.accent.yellow.subtlest.hovered',
    '#FFC400',
  ),
  'color.background.accent.yellow.subtlest.pressed': token(
    'color.background.accent.yellow.subtlest.pressed',
    '#FFAB00',
  ),
  'color.background.accent.yellow.subtler': token(
    'color.background.accent.yellow.subtler',
    '#FFC400',
  ),
  'color.background.accent.yellow.subtler.hovered': token(
    'color.background.accent.yellow.subtler.hovered',
    '#FFAB00',
  ),
  'color.background.accent.yellow.subtler.pressed': token(
    'color.background.accent.yellow.subtler.pressed',
    '#FF991F',
  ),
  'color.background.accent.yellow.subtle': token(
    'color.background.accent.yellow.subtle',
    '#FF991F',
  ),
  'color.background.accent.yellow.subtle.hovered': token(
    'color.background.accent.yellow.subtle.hovered',
    '#FFAB00',
  ),
  'color.background.accent.yellow.subtle.pressed': token(
    'color.background.accent.yellow.subtle.pressed',
    '#FFC400',
  ),
  'color.background.accent.yellow.bolder': token(
    'color.background.accent.yellow.bolder',
    '#FF991F',
  ),
  'color.background.accent.yellow.bolder.hovered': token(
    'color.background.accent.yellow.bolder.hovered',
    '#FFAB00',
  ),
  'color.background.accent.yellow.bolder.pressed': token(
    'color.background.accent.yellow.bolder.pressed',
    '#FFC400',
  ),
  'color.background.accent.green.subtlest': token(
    'color.background.accent.green.subtlest',
    '#79F2C0',
  ),
  'color.background.accent.green.subtlest.hovered': token(
    'color.background.accent.green.subtlest.hovered',
    '#57D9A3',
  ),
  'color.background.accent.green.subtlest.pressed': token(
    'color.background.accent.green.subtlest.pressed',
    '#36B37E',
  ),
  'color.background.accent.green.subtler': token(
    'color.background.accent.green.subtler',
    '#57D9A3',
  ),
  'color.background.accent.green.subtler.hovered': token(
    'color.background.accent.green.subtler.hovered',
    '#36B37E',
  ),
  'color.background.accent.green.subtler.pressed': token(
    'color.background.accent.green.subtler.pressed',
    '#00875A',
  ),
  'color.background.accent.green.subtle': token(
    'color.background.accent.green.subtle',
    '#00875A',
  ),
  'color.background.accent.green.subtle.hovered': token(
    'color.background.accent.green.subtle.hovered',
    '#36B37E',
  ),
  'color.background.accent.green.subtle.pressed': token(
    'color.background.accent.green.subtle.pressed',
    '#57D9A3',
  ),
  'color.background.accent.green.bolder': token(
    'color.background.accent.green.bolder',
    '#00875A',
  ),
  'color.background.accent.green.bolder.hovered': token(
    'color.background.accent.green.bolder.hovered',
    '#36B37E',
  ),
  'color.background.accent.green.bolder.pressed': token(
    'color.background.accent.green.bolder.pressed',
    '#57D9A3',
  ),
  'color.background.accent.teal.subtlest': token(
    'color.background.accent.teal.subtlest',
    '#79E2F2',
  ),
  'color.background.accent.teal.subtlest.hovered': token(
    'color.background.accent.teal.subtlest.hovered',
    '#00C7E6',
  ),
  'color.background.accent.teal.subtlest.pressed': token(
    'color.background.accent.teal.subtlest.pressed',
    '#00B8D9',
  ),
  'color.background.accent.teal.subtler': token(
    'color.background.accent.teal.subtler',
    '#00C7E6',
  ),
  'color.background.accent.teal.subtler.hovered': token(
    'color.background.accent.teal.subtler.hovered',
    '#00B8D9',
  ),
  'color.background.accent.teal.subtler.pressed': token(
    'color.background.accent.teal.subtler.pressed',
    '#00A3BF',
  ),
  'color.background.accent.teal.subtle': token(
    'color.background.accent.teal.subtle',
    '#00A3BF',
  ),
  'color.background.accent.teal.subtle.hovered': token(
    'color.background.accent.teal.subtle.hovered',
    '#00B8D9',
  ),
  'color.background.accent.teal.subtle.pressed': token(
    'color.background.accent.teal.subtle.pressed',
    '#00C7E6',
  ),
  'color.background.accent.teal.bolder': token(
    'color.background.accent.teal.bolder',
    '#00A3BF',
  ),
  'color.background.accent.teal.bolder.hovered': token(
    'color.background.accent.teal.bolder.hovered',
    '#00B8D9',
  ),
  'color.background.accent.teal.bolder.pressed': token(
    'color.background.accent.teal.bolder.pressed',
    '#00C7E6',
  ),
  'color.background.accent.blue.subtlest': token(
    'color.background.accent.blue.subtlest',
    '#4C9AFF',
  ),
  'color.background.accent.blue.subtlest.hovered': token(
    'color.background.accent.blue.subtlest.hovered',
    '#2684FF',
  ),
  'color.background.accent.blue.subtlest.pressed': token(
    'color.background.accent.blue.subtlest.pressed',
    '#0065FF',
  ),
  'color.background.accent.blue.subtler': token(
    'color.background.accent.blue.subtler',
    '#2684FF',
  ),
  'color.background.accent.blue.subtler.hovered': token(
    'color.background.accent.blue.subtler.hovered',
    '#0065FF',
  ),
  'color.background.accent.blue.subtler.pressed': token(
    'color.background.accent.blue.subtler.pressed',
    '#0052CC',
  ),
  'color.background.accent.blue.subtle': token(
    'color.background.accent.blue.subtle',
    '#0052CC',
  ),
  'color.background.accent.blue.subtle.hovered': token(
    'color.background.accent.blue.subtle.hovered',
    '#0065FF',
  ),
  'color.background.accent.blue.subtle.pressed': token(
    'color.background.accent.blue.subtle.pressed',
    '#2684FF',
  ),
  'color.background.accent.blue.bolder': token(
    'color.background.accent.blue.bolder',
    '#0052CC',
  ),
  'color.background.accent.blue.bolder.hovered': token(
    'color.background.accent.blue.bolder.hovered',
    '#0065FF',
  ),
  'color.background.accent.blue.bolder.pressed': token(
    'color.background.accent.blue.bolder.pressed',
    '#2684FF',
  ),
  'color.background.accent.purple.subtlest': token(
    'color.background.accent.purple.subtlest',
    '#998DD9',
  ),
  'color.background.accent.purple.subtlest.hovered': token(
    'color.background.accent.purple.subtlest.hovered',
    '#8777D9',
  ),
  'color.background.accent.purple.subtlest.pressed': token(
    'color.background.accent.purple.subtlest.pressed',
    '#6554C0',
  ),
  'color.background.accent.purple.subtler': token(
    'color.background.accent.purple.subtler',
    '#8777D9',
  ),
  'color.background.accent.purple.subtler.hovered': token(
    'color.background.accent.purple.subtler.hovered',
    '#6554C0',
  ),
  'color.background.accent.purple.subtler.pressed': token(
    'color.background.accent.purple.subtler.pressed',
    '#5243AA',
  ),
  'color.background.accent.purple.subtle': token(
    'color.background.accent.purple.subtle',
    '#5243AA',
  ),
  'color.background.accent.purple.subtle.hovered': token(
    'color.background.accent.purple.subtle.hovered',
    '#6554C0',
  ),
  'color.background.accent.purple.subtle.pressed': token(
    'color.background.accent.purple.subtle.pressed',
    '#8777D9',
  ),
  'color.background.accent.purple.bolder': token(
    'color.background.accent.purple.bolder',
    '#5243AA',
  ),
  'color.background.accent.purple.bolder.hovered': token(
    'color.background.accent.purple.bolder.hovered',
    '#6554C0',
  ),
  'color.background.accent.purple.bolder.pressed': token(
    'color.background.accent.purple.bolder.pressed',
    '#8777D9',
  ),
  'color.background.accent.magenta.subtlest': token(
    'color.background.accent.magenta.subtlest',
    '#FFECF8',
  ),
  'color.background.accent.magenta.subtlest.hovered': token(
    'color.background.accent.magenta.subtlest.hovered',
    '#FDD0EC',
  ),
  'color.background.accent.magenta.subtlest.pressed': token(
    'color.background.accent.magenta.subtlest.pressed',
    '#F797D2',
  ),
  'color.background.accent.magenta.subtler': token(
    'color.background.accent.magenta.subtler',
    '#FDD0EC',
  ),
  'color.background.accent.magenta.subtler.hovered': token(
    'color.background.accent.magenta.subtler.hovered',
    '#F797D2',
  ),
  'color.background.accent.magenta.subtler.pressed': token(
    'color.background.accent.magenta.subtler.pressed',
    '#E774BB',
  ),
  'color.background.accent.magenta.subtle': token(
    'color.background.accent.magenta.subtle',
    '#E774BB',
  ),
  'color.background.accent.magenta.subtle.hovered': token(
    'color.background.accent.magenta.subtle.hovered',
    '#F797D2',
  ),
  'color.background.accent.magenta.subtle.pressed': token(
    'color.background.accent.magenta.subtle.pressed',
    '#FDD0EC',
  ),
  'color.background.accent.magenta.bolder': token(
    'color.background.accent.magenta.bolder',
    '#AE4787',
  ),
  'color.background.accent.magenta.bolder.hovered': token(
    'color.background.accent.magenta.bolder.hovered',
    '#943D73',
  ),
  'color.background.accent.magenta.bolder.pressed': token(
    'color.background.accent.magenta.bolder.pressed',
    '#50253F',
  ),
  'color.background.accent.gray.subtlest': token(
    'color.background.accent.gray.subtlest',
    '#6B778C',
  ),
  'color.background.accent.gray.subtlest.hovered': token(
    'color.background.accent.gray.subtlest.hovered',
    '#5E6C84',
  ),
  'color.background.accent.gray.subtlest.pressed': token(
    'color.background.accent.gray.subtlest.pressed',
    '#505F79',
  ),
  'color.background.accent.gray.subtler': token(
    'color.background.accent.gray.subtler',
    '#5E6C84',
  ),
  'color.background.accent.gray.subtler.hovered': token(
    'color.background.accent.gray.subtler.hovered',
    '#505F79',
  ),
  'color.background.accent.gray.subtler.pressed': token(
    'color.background.accent.gray.subtler.pressed',
    '#42526E',
  ),
  'color.background.accent.gray.subtle': token(
    'color.background.accent.gray.subtle',
    '#505F79',
  ),
  'color.background.accent.gray.subtle.hovered': token(
    'color.background.accent.gray.subtle.hovered',
    '#5E6C84',
  ),
  'color.background.accent.gray.subtle.pressed': token(
    'color.background.accent.gray.subtle.pressed',
    '#6B778C',
  ),
  'color.background.accent.gray.bolder': token(
    'color.background.accent.gray.bolder',
    '#42526E',
  ),
  'color.background.accent.gray.bolder.hovered': token(
    'color.background.accent.gray.bolder.hovered',
    '#344563',
  ),
  'color.background.accent.gray.bolder.pressed': token(
    'color.background.accent.gray.bolder.pressed',
    '#253858',
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
  'color.background.brand.subtlest': token(
    'color.background.brand.subtlest',
    '#B3D4FF',
  ),
  'color.background.brand.subtlest.hovered': token(
    'color.background.brand.subtlest.hovered',
    '#DEEBFF',
  ),
  'color.background.brand.subtlest.pressed': token(
    'color.background.brand.subtlest.pressed',
    '#4C9AFF',
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
  'color.background.brand.boldest': token(
    'color.background.brand.boldest',
    '#0747A6',
  ),
  'color.background.brand.boldest.hovered': token(
    'color.background.brand.boldest.hovered',
    '#0052CC',
  ),
  'color.background.brand.boldest.pressed': token(
    'color.background.brand.boldest.pressed',
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
  'utility.elevation.surface.current': token(
    'utility.elevation.surface.current',
    '#FFFFFF',
  ),
} as const;

export type BackgroundColor = keyof typeof backgroundColorMap;

export const textColorMap = {
  'color.text': token('color.text', '#172B4D'),
  'color.text.accent.lime': token('color.text.accent.lime', '#4C6B1F'),
  'color.text.accent.lime.bolder': token(
    'color.text.accent.lime.bolder',
    '#37471F',
  ),
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
  'color.link': token('color.link', '#0052CC'),
  'color.link.pressed': token('color.link.pressed', '#0747A6'),
  'color.link.visited': token('color.link.visited', '#403294'),
} as const;

export type TextColor = keyof typeof textColorMap;

export const fillMap = {
  'color.icon': token('color.icon', '#505F79'),
  'color.icon.accent.lime': token('color.icon.accent.lime', '#6A9A23'),
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
 * @codegen <<SignedSource::01a4b055c311d198921d4e000a2d7a54>>
 * @codegenId misc
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenParams ["layer"]
 * @codegenDependency ../../scripts/codegen-file-templates/dimensions.tsx <<SignedSource::0cd422575c3f2a3784eeef767abe71f4>>
 * @codegenDependency ../../scripts/codegen-file-templates/layer.tsx <<SignedSource::79d24a1e558f12d671c06a7609f90dc1>>
 */
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

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d44c306cfe2334f9664fc122aa7d9fe6>>
 * @codegenId border
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenParams ["width", "radius"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-shape.tsx <<SignedSource::80457377fd80c31f5dfcb5cc743d7016>>
 */
export const borderWidthMap = {
  'border.width': token('border.width', '1px'),
  'border.width.0': token('border.width.0', '0px'),
  'border.width.indicator': token('border.width.indicator', '3px'),
  'border.width.outline': token('border.width.outline', '2px'),
} as const;

export type BorderWidth = keyof typeof borderWidthMap;

export const borderRadiusMap = {
  'border.radius.050': token('border.radius.050', '2px'),
  'border.radius': token('border.radius', '3px'),
  'border.radius.100': token('border.radius.100', '3px'),
  'border.radius.200': token('border.radius.200', '8px'),
  'border.radius.300': token('border.radius.300', '12px'),
  'border.radius.400': token('border.radius.400', '16px'),
  'border.radius.circle': token('border.radius.circle', '32032px'),
} as const;

export type BorderRadius = keyof typeof borderRadiusMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::648d0ff5e17d3a6a835c1119d0d5dc99>>
 * @codegenId typography
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenParams ["fontSize", "fontWeight", "fontFamily", "lineHeight", "body", "ui"]
 * @codegenDependency ../../scripts/codegen-file-templates/dimensions.tsx <<SignedSource::0cd422575c3f2a3784eeef767abe71f4>>
 * @codegenDependency ../../scripts/codegen-file-templates/layer.tsx <<SignedSource::79d24a1e558f12d671c06a7609f90dc1>>
 */
export const fontSizeMap = {
  'font.size.050': token('font.size.050', '11px'),
  'font.size.075': token('font.size.075', '12px'),
  'font.size.100': token('font.size.100', '14px'),
  'font.size.200': token('font.size.200', '16px'),
  'font.size.300': token('font.size.300', '20px'),
  'font.size.400': token('font.size.400', '24px'),
  'font.size.500': token('font.size.500', '29px'),
  'font.size.600': token('font.size.600', '35px'),
};

export type FontSize = keyof typeof fontSizeMap;

export const fontWeightMap = {
  bold: token('font.weight.bold', '700'),
  medium: token('font.weight.medium', '500'),
  regular: token('font.weight.regular', '400'),
  semibold: token('font.weight.semibold', '600'),
};

export type FontWeight = keyof typeof fontWeightMap;

export const fontFamilyMap = {
  'font.family.body': token(
    'font.family.body',
    'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
  ),
  'font.family.brand': token('font.family.brand', 'Charlie Sans'),
  'font.family.code': token(
    'font.family.code',
    'ui-monospace, Menlo, "Segoe UI Mono", "Ubuntu Mono", monospace',
  ),
  'font.family.heading': token(
    'font.family.heading',
    'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
  ),
  'font.family.monospace': token(
    'font.family.monospace',
    'ui-monospace, Menlo, "Segoe UI Mono", "Ubuntu Mono", monospace',
  ),
  'font.family.sans': token(
    'font.family.sans',
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  ),
};

export type FontFamily = keyof typeof fontFamilyMap;

export const lineHeightMap = {
  'font.lineHeight.1': token('font.lineHeight.1', '1'),
  'font.lineHeight.100': token('font.lineHeight.100', '16px'),
  'font.lineHeight.200': token('font.lineHeight.200', '20px'),
  'font.lineHeight.300': token('font.lineHeight.300', '24px'),
  'font.lineHeight.400': token('font.lineHeight.400', '28px'),
  'font.lineHeight.500': token('font.lineHeight.500', '32px'),
  'font.lineHeight.600': token('font.lineHeight.600', '40px'),
};

export type LineHeight = keyof typeof lineHeightMap;

export const bodyTextMap = {
  body: token(
    'font.body',
    'normal 400 14px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
  ),
  'body.large': token(
    'font.body.large',
    'normal 400 16px/24px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
  ),
  'body.small': token(
    'font.body.small',
    'normal 400 11px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
  ),
};

export type BodyText = keyof typeof bodyTextMap;

export const uiTextMap = {
  ui: token(
    'font.ui',
    'normal 500 14px/1 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
  ),
  'ui.small': token(
    'font.ui.small',
    'normal 400 11px/1 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
  ),
};

export type UiText = keyof typeof uiTextMap;

/**
 * @codegenEnd
 */

type MarginSpace = AllSpace | 'auto';
type AutoComplete<T extends string> = T | Omit<string, T>;

export type TokenisedProps = {
  backgroundColor?: BackgroundColor;
  blockSize?: AutoComplete<Dimension>;
  borderBlockColor?: AutoComplete<BorderColor>;
  borderBlockEndColor?: AutoComplete<BorderColor>;
  borderBlockEndWidth?: AutoComplete<BorderWidth>;
  borderBlockStartColor?: AutoComplete<BorderColor>;
  borderBlockStartWidth?: AutoComplete<BorderWidth>;
  borderBlockWidth?: AutoComplete<BorderWidth>;
  borderBottomColor?: AutoComplete<BorderColor>;
  borderBottomLeftRadius?: AutoComplete<BorderRadius>;
  borderBottomRightRadius?: AutoComplete<BorderRadius>;
  borderBottomWidth?: AutoComplete<BorderWidth>;
  borderColor?: BorderColor;
  borderEndEndRadius?: AutoComplete<BorderRadius>;
  borderEndStartRadius?: AutoComplete<BorderRadius>;
  borderInlineColor?: AutoComplete<BorderColor>;
  borderInlineEndColor?: AutoComplete<BorderColor>;
  borderInlineEndWidth?: AutoComplete<BorderWidth>;
  borderInlineStartColor?: AutoComplete<BorderColor>;
  borderInlineStartWidth?: AutoComplete<BorderWidth>;
  borderInlineWidth?: AutoComplete<BorderWidth>;
  borderLeftColor?: AutoComplete<BorderColor>;
  borderLeftWidth?: AutoComplete<BorderWidth>;
  borderRadius?: BorderRadius;
  borderRightColor?: AutoComplete<BorderColor>;
  borderRightWidth?: AutoComplete<BorderWidth>;
  borderStartEndRadius?: AutoComplete<BorderRadius>;
  borderStartStartRadius?: AutoComplete<BorderRadius>;
  borderTopColor?: AutoComplete<BorderColor>;
  borderTopLeftRadius?: AutoComplete<BorderRadius>;
  borderTopRightRadius?: AutoComplete<BorderRadius>;
  borderTopWidth?: AutoComplete<BorderWidth>;
  borderWidth?: BorderWidth;
  bottom?: AutoComplete<AllSpace>;
  boxShadow?: Shadow;
  color?: TextColor;
  columnGap?: Space;
  gap?: Space;
  height?: AutoComplete<Dimension>;
  inlineSize?: AutoComplete<Dimension>;
  inset?: AutoComplete<AllSpace>;
  insetBlock?: AutoComplete<AllSpace>;
  insetBlockEnd?: AutoComplete<AllSpace>;
  insetBlockStart?: AutoComplete<AllSpace>;
  insetInline?: AutoComplete<AllSpace>;
  insetInlineEnd?: AutoComplete<AllSpace>;
  insetInlineStart?: AutoComplete<AllSpace>;
  left?: AutoComplete<AllSpace>;
  margin?: AutoComplete<MarginSpace>;
  marginBlock?: AutoComplete<MarginSpace>;
  marginBlockEnd?: AutoComplete<MarginSpace>;
  marginBlockStart?: AutoComplete<MarginSpace>;
  marginBottom?: AutoComplete<MarginSpace>;
  marginInline?: AutoComplete<MarginSpace>;
  marginInlineEnd?: AutoComplete<MarginSpace>;
  marginInlineStart?: AutoComplete<MarginSpace>;
  marginLeft?: AutoComplete<MarginSpace>;
  marginRight?: AutoComplete<MarginSpace>;
  marginTop?: AutoComplete<MarginSpace>;
  maxBlockSize?: AutoComplete<Dimension>;
  maxHeight?: AutoComplete<Dimension>;
  maxInlineSize?: AutoComplete<Dimension>;
  maxWidth?: AutoComplete<Dimension>;
  minBlockSize?: AutoComplete<Dimension>;
  minHeight?: AutoComplete<Dimension>;
  minInlineSize?: AutoComplete<Dimension>;
  minWidth?: AutoComplete<Dimension>;
  opacity?: AutoComplete<Opacity> | number;
  outlineColor?: BorderColor;
  outlineOffset?: Space;
  outlineWidth?: BorderWidth;
  padding?: Space;
  paddingBlock?: Space;
  paddingBlockEnd?: Space;
  paddingBlockStart?: Space;
  paddingBottom?: AutoComplete<Space>;
  paddingInline?: Space;
  paddingInlineEnd?: Space;
  paddingInlineStart?: Space;
  paddingLeft?: AutoComplete<Space>;
  paddingRight?: AutoComplete<Space>;
  paddingTop?: AutoComplete<Space>;
  right?: AutoComplete<AllSpace>;
  rowGap?: Space;
  top?: AutoComplete<AllSpace>;
  width?: AutoComplete<Dimension>;
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

type TokenMappableProperty =
  | SpacingProperty
  | 'backgroundColor'
  | 'fontWeight'
  | 'fontSize'
  | 'fontFamily'
  | 'lineHeight'
  | 'color'
  | 'font'
  | typeof CURRENT_SURFACE_CSS_VAR;
type PropsToken =
  | SpacingToken
  | BackgroundColorToken
  | FontSizeToken
  | FontWeightToken
  | FontFamilyToken
  | LineHeightToken
  | TextColorToken
  | BodyTextToken
  | UITextToken;
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
type SpacingToken = keyof typeof positiveSpaceMap;
type BackgroundColorToken = keyof typeof backgroundColorMap;
type SurfaceColorToken = keyof typeof surfaceColorMap;
type TextColorToken = keyof typeof textColorMap;
type FontSizeToken = keyof typeof fontSizeMap;
type FontWeightToken = keyof typeof fontWeightMap;
type FontFamilyToken = keyof typeof fontFamilyMap;
type LineHeightToken = keyof typeof lineHeightMap;
type BodyTextToken = keyof typeof bodyTextMap;
type UITextToken = keyof typeof uiTextMap;
type SpacingStyleMap = Record<
  SpacingProperty,
  Record<SpacingToken, SerializedStyles>
>;
type BackgroundColorStyleMap = Record<BackgroundColorToken, SerializedStyles>;
type SurfaceColorStyleMap = Record<SurfaceColorToken, SerializedStyles>;
type TextColorStyleMap = Record<TextColorToken, SerializedStyles>;
type FontSizeStyleMap = Record<FontSizeToken, SerializedStyles>;
type FontWeightStyleMap = Record<FontWeightToken, SerializedStyles>;
type FontFamilyStyleMap = Record<FontFamilyToken, SerializedStyles>;
type LineHeightStyleMap = Record<LineHeightToken, SerializedStyles>;
type BodyTextStyleMap = Record<BodyTextToken, SerializedStyles>;
type UITextStyleMap = Record<UITextToken, SerializedStyles>;

export const paddingStylesMap: SpacingStyleMap = spacingProperties.reduce(
  (styleMap, spacingProperty: SpacingProperty) => {
    styleMap[spacingProperty] = getSerializedStylesMap(
      spacingProperty,
      positiveSpaceMap,
    );

    return styleMap;
  },
  {} as SpacingStyleMap,
);

export const spaceStylesMap: SpacingStyleMap = spacingProperties.reduce(
  (styleMap, spacingProperty: SpacingProperty) => {
    styleMap[spacingProperty] = getSerializedStylesMap(
      spacingProperty,
      positiveSpaceMap,
    );

    return styleMap;
  },
  {} as SpacingStyleMap,
);

export const backgroundColorStylesMap: BackgroundColorStyleMap =
  getSerializedStylesMap('backgroundColor', backgroundColorMap);

export const textColorStylesMap: TextColorStyleMap = getSerializedStylesMap(
  'color',
  textColorMap,
);
export const fontSizeStylesMap: FontSizeStyleMap = getSerializedStylesMap(
  'fontSize',
  fontSizeMap,
);
export const fontWeightStylesMap: FontWeightStyleMap = getSerializedStylesMap(
  'fontWeight',
  fontWeightMap,
);
export const fontFamilyStylesMap: FontFamilyStyleMap = getSerializedStylesMap(
  'fontFamily',
  fontFamilyMap,
);
export const lineHeightStylesMap: LineHeightStyleMap = getSerializedStylesMap(
  'lineHeight',
  lineHeightMap,
);
export const bodyTextStylesMap: BodyTextStyleMap = getSerializedStylesMap(
  'font',
  bodyTextMap,
);
export const uiTextStylesMap: UITextStyleMap = getSerializedStylesMap(
  'font',
  uiTextMap,
);

export const surfaceColorStylesMap: SurfaceColorStyleMap =
  getSerializedStylesMap(CURRENT_SURFACE_CSS_VAR, surfaceColorMap);

export const isSurfaceColorToken = (
  color: unknown,
): color is SurfaceColorToken =>
  surfaceColorMap[color as SurfaceColorToken] !== undefined;

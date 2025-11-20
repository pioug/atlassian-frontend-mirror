// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { CURRENT_SURFACE_CSS_VAR, token } from '@atlaskit/tokens';

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::df710bcd99c0a8704ca36bddb12c2154>>
 * @codegenId dimensions
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenParams ["dimensions"]
 * @codegenDependency ../../../primitives/scripts/codegen-file-templates/dimensions.tsx <<SignedSource::cc9b3f12104c6ede803da6a42daac0b0>>
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
 * @codegen <<SignedSource::513f6a7e264ea3f9fe56eda322a28f64>>
 * @codegenId spacing
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-spacing.tsx <<SignedSource::07b9c29f8d9f95e43d59a7b7ad4ce7a2>>
 */
export const positiveSpaceMap: {
	'space.0': 'var(--ds-space-0)';
	'space.025': 'var(--ds-space-025)';
	'space.050': 'var(--ds-space-050)';
	'space.075': 'var(--ds-space-075)';
	'space.100': 'var(--ds-space-100)';
	'space.150': 'var(--ds-space-150)';
	'space.200': 'var(--ds-space-200)';
	'space.250': 'var(--ds-space-250)';
	'space.300': 'var(--ds-space-300)';
	'space.400': 'var(--ds-space-400)';
	'space.500': 'var(--ds-space-500)';
	'space.600': 'var(--ds-space-600)';
	'space.800': 'var(--ds-space-800)';
	'space.1000': 'var(--ds-space-1000)';
} = {
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

export const negativeSpaceMap: {
	'space.negative.025': 'var(--ds-space-negative-025)';
	'space.negative.050': 'var(--ds-space-negative-050)';
	'space.negative.075': 'var(--ds-space-negative-075)';
	'space.negative.100': 'var(--ds-space-negative-100)';
	'space.negative.150': 'var(--ds-space-negative-150)';
	'space.negative.200': 'var(--ds-space-negative-200)';
	'space.negative.250': 'var(--ds-space-negative-250)';
	'space.negative.300': 'var(--ds-space-negative-300)';
	'space.negative.400': 'var(--ds-space-negative-400)';
} = {
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

export const allSpaceMap: {
	'space.0': 'var(--ds-space-0)';
	'space.025': 'var(--ds-space-025)';
	'space.050': 'var(--ds-space-050)';
	'space.075': 'var(--ds-space-075)';
	'space.100': 'var(--ds-space-100)';
	'space.150': 'var(--ds-space-150)';
	'space.200': 'var(--ds-space-200)';
	'space.250': 'var(--ds-space-250)';
	'space.300': 'var(--ds-space-300)';
	'space.400': 'var(--ds-space-400)';
	'space.500': 'var(--ds-space-500)';
	'space.600': 'var(--ds-space-600)';
	'space.800': 'var(--ds-space-800)';
	'space.1000': 'var(--ds-space-1000)';
	'space.negative.025': 'var(--ds-space-negative-025)';
	'space.negative.050': 'var(--ds-space-negative-050)';
	'space.negative.075': 'var(--ds-space-negative-075)';
	'space.negative.100': 'var(--ds-space-negative-100)';
	'space.negative.150': 'var(--ds-space-negative-150)';
	'space.negative.200': 'var(--ds-space-negative-200)';
	'space.negative.250': 'var(--ds-space-negative-250)';
	'space.negative.300': 'var(--ds-space-negative-300)';
	'space.negative.400': 'var(--ds-space-negative-400)';
} = { ...positiveSpaceMap, ...negativeSpaceMap };

export type AllSpace = keyof typeof allSpaceMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::391876b08f98d21b153df0b42a122d9a>>
 * @codegenId inverse-colors
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::b763fb6c355b33e6fbf23afb996f817f>>
 */
export const inverseColorMap: {
	'color.background.neutral.bold': 'color.text.inverse';
	'color.background.neutral.bold.hovered': 'color.text.inverse';
	'color.background.neutral.bold.pressed': 'color.text.inverse';
	'color.background.selected.bold': 'color.text.inverse';
	'color.background.selected.bold.hovered': 'color.text.inverse';
	'color.background.selected.bold.pressed': 'color.text.inverse';
	'color.background.brand.bold': 'color.text.inverse';
	'color.background.brand.bold.hovered': 'color.text.inverse';
	'color.background.brand.bold.pressed': 'color.text.inverse';
	'color.background.brand.boldest': 'color.text.inverse';
	'color.background.brand.boldest.hovered': 'color.text.inverse';
	'color.background.brand.boldest.pressed': 'color.text.inverse';
	'color.background.danger.bold': 'color.text.inverse';
	'color.background.danger.bold.hovered': 'color.text.inverse';
	'color.background.danger.bold.pressed': 'color.text.inverse';
	'color.background.warning.bold': 'color.text.warning.inverse';
	'color.background.warning.bold.hovered': 'color.text.warning.inverse';
	'color.background.warning.bold.pressed': 'color.text.warning.inverse';
	'color.background.success.bold': 'color.text.inverse';
	'color.background.success.bold.hovered': 'color.text.inverse';
	'color.background.success.bold.pressed': 'color.text.inverse';
	'color.background.discovery.bold': 'color.text.inverse';
	'color.background.discovery.bold.hovered': 'color.text.inverse';
	'color.background.discovery.bold.pressed': 'color.text.inverse';
	'color.background.information.bold': 'color.text.inverse';
	'color.background.information.bold.hovered': 'color.text.inverse';
	'color.background.information.bold.pressed': 'color.text.inverse';
} = {
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
 * @codegen <<SignedSource::4407d5eb027cc933eed726fed33ad1ad>>
 * @codegenId elevation
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenParams ["opacity", "shadow", "surface"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::b763fb6c355b33e6fbf23afb996f817f>>
 */
export const opacityMap: {
	'opacity.disabled': 'var(--ds-opacity-disabled)';
	'opacity.loading': 'var(--ds-opacity-loading)';
} = {
	'opacity.disabled': token('opacity.disabled', '0.4'),
	'opacity.loading': token('opacity.loading', '0.2'),
} as const;

export type Opacity = keyof typeof opacityMap;

export const shadowMap: {
	'elevation.shadow.overflow': 'var(--ds-shadow-overflow)';
	'elevation.shadow.overflow.perimeter': 'var(--ds-shadow-overflow-perimeter)';
	'elevation.shadow.overflow.spread': 'var(--ds-shadow-overflow-spread)';
	'elevation.shadow.overlay': 'var(--ds-shadow-overlay)';
	'elevation.shadow.raised': 'var(--ds-shadow-raised)';
} = {
	'elevation.shadow.overflow': token(
		'elevation.shadow.overflow',
		'0px 0px 8px #091e423f, 0px 0px 1px #091e424f',
	),
	'elevation.shadow.overflow.perimeter': token('elevation.shadow.overflow.perimeter', '#091e421f'),
	'elevation.shadow.overflow.spread': token('elevation.shadow.overflow.spread', '#091e4229'),
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

export const surfaceColorMap: {
	'elevation.surface': 'var(--ds-surface)';
	'elevation.surface.hovered': 'var(--ds-surface-hovered)';
	'elevation.surface.pressed': 'var(--ds-surface-pressed)';
	'elevation.surface.overlay': 'var(--ds-surface-overlay)';
	'elevation.surface.overlay.hovered': 'var(--ds-surface-overlay-hovered)';
	'elevation.surface.overlay.pressed': 'var(--ds-surface-overlay-pressed)';
	'elevation.surface.raised': 'var(--ds-surface-raised)';
	'elevation.surface.raised.hovered': 'var(--ds-surface-raised-hovered)';
	'elevation.surface.raised.pressed': 'var(--ds-surface-raised-pressed)';
	'elevation.surface.sunken': 'var(--ds-surface-sunken)';
} = {
	'elevation.surface': token('elevation.surface', '#FFFFFF'),
	'elevation.surface.hovered': token('elevation.surface.hovered', '#FAFBFC'),
	'elevation.surface.pressed': token('elevation.surface.pressed', '#F4F5F7'),
	'elevation.surface.overlay': token('elevation.surface.overlay', '#FFFFFF'),
	'elevation.surface.overlay.hovered': token('elevation.surface.overlay.hovered', '#FAFBFC'),
	'elevation.surface.overlay.pressed': token('elevation.surface.overlay.pressed', '#F4F5F7'),
	'elevation.surface.raised': token('elevation.surface.raised', '#FFFFFF'),
	'elevation.surface.raised.hovered': token('elevation.surface.raised.hovered', '#FAFBFC'),
	'elevation.surface.raised.pressed': token('elevation.surface.raised.pressed', '#F4F5F7'),
	'elevation.surface.sunken': token('elevation.surface.sunken', '#F4F5F7'),
} as const;

export type SurfaceColor = keyof typeof surfaceColorMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::81e488bd12e67b8ac3ac65c71e50e967>>
 * @codegenId colors
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenParams ["border", "background", "text", "fill"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::b763fb6c355b33e6fbf23afb996f817f>>
 */
export const borderColorMap: {
	'color.border': 'var(--ds-border)';
	'color.border.accent.lime': 'var(--ds-border-accent-lime)';
	'color.border.accent.red': 'var(--ds-border-accent-red)';
	'color.border.accent.orange': 'var(--ds-border-accent-orange)';
	'color.border.accent.yellow': 'var(--ds-border-accent-yellow)';
	'color.border.accent.green': 'var(--ds-border-accent-green)';
	'color.border.accent.teal': 'var(--ds-border-accent-teal)';
	'color.border.accent.blue': 'var(--ds-border-accent-blue)';
	'color.border.accent.purple': 'var(--ds-border-accent-purple)';
	'color.border.accent.magenta': 'var(--ds-border-accent-magenta)';
	'color.border.accent.gray': 'var(--ds-border-accent-gray)';
	'color.border.disabled': 'var(--ds-border-disabled)';
	'color.border.focused': 'var(--ds-border-focused)';
	'color.border.input': 'var(--ds-border-input)';
	'color.border.inverse': 'var(--ds-border-inverse)';
	'color.border.selected': 'var(--ds-border-selected)';
	'color.border.brand': 'var(--ds-border-brand)';
	'color.border.danger': 'var(--ds-border-danger)';
	'color.border.warning': 'var(--ds-border-warning)';
	'color.border.success': 'var(--ds-border-success)';
	'color.border.discovery': 'var(--ds-border-discovery)';
	'color.border.information': 'var(--ds-border-information)';
	'color.border.bold': 'var(--ds-border-bold)';
} = {
	'color.border': token('color.border', '#091e4221'),
	'color.border.accent.lime': token('color.border.accent.lime', '#6A9A23'),
	'color.border.accent.red': token('color.border.accent.red', '#FF5630'),
	'color.border.accent.orange': token('color.border.accent.orange', '#D94008'),
	'color.border.accent.yellow': token('color.border.accent.yellow', '#FFAB00'),
	'color.border.accent.green': token('color.border.accent.green', '#36B37E'),
	'color.border.accent.teal': token('color.border.accent.teal', '#00B8D9'),
	'color.border.accent.blue': token('color.border.accent.blue', '#0065FF'),
	'color.border.accent.purple': token('color.border.accent.purple', '#6554C0'),
	'color.border.accent.magenta': token('color.border.accent.magenta', '#CD519D'),
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

export const backgroundColorMap: {
	'color.background.accent.lime.subtlest': 'var(--ds-background-accent-lime-subtlest)';
	'color.background.accent.lime.subtlest.hovered': 'var(--ds-background-accent-lime-subtlest-hovered)';
	'color.background.accent.lime.subtlest.pressed': 'var(--ds-background-accent-lime-subtlest-pressed)';
	'color.background.accent.lime.subtler': 'var(--ds-background-accent-lime-subtler)';
	'color.background.accent.lime.subtler.hovered': 'var(--ds-background-accent-lime-subtler-hovered)';
	'color.background.accent.lime.subtler.pressed': 'var(--ds-background-accent-lime-subtler-pressed)';
	'color.background.accent.lime.subtle': 'var(--ds-background-accent-lime-subtle)';
	'color.background.accent.lime.subtle.hovered': 'var(--ds-background-accent-lime-subtle-hovered)';
	'color.background.accent.lime.subtle.pressed': 'var(--ds-background-accent-lime-subtle-pressed)';
	'color.background.accent.lime.bolder': 'var(--ds-background-accent-lime-bolder)';
	'color.background.accent.lime.bolder.hovered': 'var(--ds-background-accent-lime-bolder-hovered)';
	'color.background.accent.lime.bolder.pressed': 'var(--ds-background-accent-lime-bolder-pressed)';
	'color.background.accent.red.subtlest': 'var(--ds-background-accent-red-subtlest)';
	'color.background.accent.red.subtlest.hovered': 'var(--ds-background-accent-red-subtlest-hovered)';
	'color.background.accent.red.subtlest.pressed': 'var(--ds-background-accent-red-subtlest-pressed)';
	'color.background.accent.red.subtler': 'var(--ds-background-accent-red-subtler)';
	'color.background.accent.red.subtler.hovered': 'var(--ds-background-accent-red-subtler-hovered)';
	'color.background.accent.red.subtler.pressed': 'var(--ds-background-accent-red-subtler-pressed)';
	'color.background.accent.red.subtle': 'var(--ds-background-accent-red-subtle)';
	'color.background.accent.red.subtle.hovered': 'var(--ds-background-accent-red-subtle-hovered)';
	'color.background.accent.red.subtle.pressed': 'var(--ds-background-accent-red-subtle-pressed)';
	'color.background.accent.red.bolder': 'var(--ds-background-accent-red-bolder)';
	'color.background.accent.red.bolder.hovered': 'var(--ds-background-accent-red-bolder-hovered)';
	'color.background.accent.red.bolder.pressed': 'var(--ds-background-accent-red-bolder-pressed)';
	'color.background.accent.orange.subtlest': 'var(--ds-background-accent-orange-subtlest)';
	'color.background.accent.orange.subtlest.hovered': 'var(--ds-background-accent-orange-subtlest-hovered)';
	'color.background.accent.orange.subtlest.pressed': 'var(--ds-background-accent-orange-subtlest-pressed)';
	'color.background.accent.orange.subtler': 'var(--ds-background-accent-orange-subtler)';
	'color.background.accent.orange.subtler.hovered': 'var(--ds-background-accent-orange-subtler-hovered)';
	'color.background.accent.orange.subtler.pressed': 'var(--ds-background-accent-orange-subtler-pressed)';
	'color.background.accent.orange.subtle': 'var(--ds-background-accent-orange-subtle)';
	'color.background.accent.orange.subtle.hovered': 'var(--ds-background-accent-orange-subtle-hovered)';
	'color.background.accent.orange.subtle.pressed': 'var(--ds-background-accent-orange-subtle-pressed)';
	'color.background.accent.orange.bolder': 'var(--ds-background-accent-orange-bolder)';
	'color.background.accent.orange.bolder.hovered': 'var(--ds-background-accent-orange-bolder-hovered)';
	'color.background.accent.orange.bolder.pressed': 'var(--ds-background-accent-orange-bolder-pressed)';
	'color.background.accent.yellow.subtlest': 'var(--ds-background-accent-yellow-subtlest)';
	'color.background.accent.yellow.subtlest.hovered': 'var(--ds-background-accent-yellow-subtlest-hovered)';
	'color.background.accent.yellow.subtlest.pressed': 'var(--ds-background-accent-yellow-subtlest-pressed)';
	'color.background.accent.yellow.subtler': 'var(--ds-background-accent-yellow-subtler)';
	'color.background.accent.yellow.subtler.hovered': 'var(--ds-background-accent-yellow-subtler-hovered)';
	'color.background.accent.yellow.subtler.pressed': 'var(--ds-background-accent-yellow-subtler-pressed)';
	'color.background.accent.yellow.subtle': 'var(--ds-background-accent-yellow-subtle)';
	'color.background.accent.yellow.subtle.hovered': 'var(--ds-background-accent-yellow-subtle-hovered)';
	'color.background.accent.yellow.subtle.pressed': 'var(--ds-background-accent-yellow-subtle-pressed)';
	'color.background.accent.yellow.bolder': 'var(--ds-background-accent-yellow-bolder)';
	'color.background.accent.yellow.bolder.hovered': 'var(--ds-background-accent-yellow-bolder-hovered)';
	'color.background.accent.yellow.bolder.pressed': 'var(--ds-background-accent-yellow-bolder-pressed)';
	'color.background.accent.green.subtlest': 'var(--ds-background-accent-green-subtlest)';
	'color.background.accent.green.subtlest.hovered': 'var(--ds-background-accent-green-subtlest-hovered)';
	'color.background.accent.green.subtlest.pressed': 'var(--ds-background-accent-green-subtlest-pressed)';
	'color.background.accent.green.subtler': 'var(--ds-background-accent-green-subtler)';
	'color.background.accent.green.subtler.hovered': 'var(--ds-background-accent-green-subtler-hovered)';
	'color.background.accent.green.subtler.pressed': 'var(--ds-background-accent-green-subtler-pressed)';
	'color.background.accent.green.subtle': 'var(--ds-background-accent-green-subtle)';
	'color.background.accent.green.subtle.hovered': 'var(--ds-background-accent-green-subtle-hovered)';
	'color.background.accent.green.subtle.pressed': 'var(--ds-background-accent-green-subtle-pressed)';
	'color.background.accent.green.bolder': 'var(--ds-background-accent-green-bolder)';
	'color.background.accent.green.bolder.hovered': 'var(--ds-background-accent-green-bolder-hovered)';
	'color.background.accent.green.bolder.pressed': 'var(--ds-background-accent-green-bolder-pressed)';
	'color.background.accent.teal.subtlest': 'var(--ds-background-accent-teal-subtlest)';
	'color.background.accent.teal.subtlest.hovered': 'var(--ds-background-accent-teal-subtlest-hovered)';
	'color.background.accent.teal.subtlest.pressed': 'var(--ds-background-accent-teal-subtlest-pressed)';
	'color.background.accent.teal.subtler': 'var(--ds-background-accent-teal-subtler)';
	'color.background.accent.teal.subtler.hovered': 'var(--ds-background-accent-teal-subtler-hovered)';
	'color.background.accent.teal.subtler.pressed': 'var(--ds-background-accent-teal-subtler-pressed)';
	'color.background.accent.teal.subtle': 'var(--ds-background-accent-teal-subtle)';
	'color.background.accent.teal.subtle.hovered': 'var(--ds-background-accent-teal-subtle-hovered)';
	'color.background.accent.teal.subtle.pressed': 'var(--ds-background-accent-teal-subtle-pressed)';
	'color.background.accent.teal.bolder': 'var(--ds-background-accent-teal-bolder)';
	'color.background.accent.teal.bolder.hovered': 'var(--ds-background-accent-teal-bolder-hovered)';
	'color.background.accent.teal.bolder.pressed': 'var(--ds-background-accent-teal-bolder-pressed)';
	'color.background.accent.blue.subtlest': 'var(--ds-background-accent-blue-subtlest)';
	'color.background.accent.blue.subtlest.hovered': 'var(--ds-background-accent-blue-subtlest-hovered)';
	'color.background.accent.blue.subtlest.pressed': 'var(--ds-background-accent-blue-subtlest-pressed)';
	'color.background.accent.blue.subtler': 'var(--ds-background-accent-blue-subtler)';
	'color.background.accent.blue.subtler.hovered': 'var(--ds-background-accent-blue-subtler-hovered)';
	'color.background.accent.blue.subtler.pressed': 'var(--ds-background-accent-blue-subtler-pressed)';
	'color.background.accent.blue.subtle': 'var(--ds-background-accent-blue-subtle)';
	'color.background.accent.blue.subtle.hovered': 'var(--ds-background-accent-blue-subtle-hovered)';
	'color.background.accent.blue.subtle.pressed': 'var(--ds-background-accent-blue-subtle-pressed)';
	'color.background.accent.blue.bolder': 'var(--ds-background-accent-blue-bolder)';
	'color.background.accent.blue.bolder.hovered': 'var(--ds-background-accent-blue-bolder-hovered)';
	'color.background.accent.blue.bolder.pressed': 'var(--ds-background-accent-blue-bolder-pressed)';
	'color.background.accent.purple.subtlest': 'var(--ds-background-accent-purple-subtlest)';
	'color.background.accent.purple.subtlest.hovered': 'var(--ds-background-accent-purple-subtlest-hovered)';
	'color.background.accent.purple.subtlest.pressed': 'var(--ds-background-accent-purple-subtlest-pressed)';
	'color.background.accent.purple.subtler': 'var(--ds-background-accent-purple-subtler)';
	'color.background.accent.purple.subtler.hovered': 'var(--ds-background-accent-purple-subtler-hovered)';
	'color.background.accent.purple.subtler.pressed': 'var(--ds-background-accent-purple-subtler-pressed)';
	'color.background.accent.purple.subtle': 'var(--ds-background-accent-purple-subtle)';
	'color.background.accent.purple.subtle.hovered': 'var(--ds-background-accent-purple-subtle-hovered)';
	'color.background.accent.purple.subtle.pressed': 'var(--ds-background-accent-purple-subtle-pressed)';
	'color.background.accent.purple.bolder': 'var(--ds-background-accent-purple-bolder)';
	'color.background.accent.purple.bolder.hovered': 'var(--ds-background-accent-purple-bolder-hovered)';
	'color.background.accent.purple.bolder.pressed': 'var(--ds-background-accent-purple-bolder-pressed)';
	'color.background.accent.magenta.subtlest': 'var(--ds-background-accent-magenta-subtlest)';
	'color.background.accent.magenta.subtlest.hovered': 'var(--ds-background-accent-magenta-subtlest-hovered)';
	'color.background.accent.magenta.subtlest.pressed': 'var(--ds-background-accent-magenta-subtlest-pressed)';
	'color.background.accent.magenta.subtler': 'var(--ds-background-accent-magenta-subtler)';
	'color.background.accent.magenta.subtler.hovered': 'var(--ds-background-accent-magenta-subtler-hovered)';
	'color.background.accent.magenta.subtler.pressed': 'var(--ds-background-accent-magenta-subtler-pressed)';
	'color.background.accent.magenta.subtle': 'var(--ds-background-accent-magenta-subtle)';
	'color.background.accent.magenta.subtle.hovered': 'var(--ds-background-accent-magenta-subtle-hovered)';
	'color.background.accent.magenta.subtle.pressed': 'var(--ds-background-accent-magenta-subtle-pressed)';
	'color.background.accent.magenta.bolder': 'var(--ds-background-accent-magenta-bolder)';
	'color.background.accent.magenta.bolder.hovered': 'var(--ds-background-accent-magenta-bolder-hovered)';
	'color.background.accent.magenta.bolder.pressed': 'var(--ds-background-accent-magenta-bolder-pressed)';
	'color.background.accent.gray.subtlest': 'var(--ds-background-accent-gray-subtlest)';
	'color.background.accent.gray.subtlest.hovered': 'var(--ds-background-accent-gray-subtlest-hovered)';
	'color.background.accent.gray.subtlest.pressed': 'var(--ds-background-accent-gray-subtlest-pressed)';
	'color.background.accent.gray.subtler': 'var(--ds-background-accent-gray-subtler)';
	'color.background.accent.gray.subtler.hovered': 'var(--ds-background-accent-gray-subtler-hovered)';
	'color.background.accent.gray.subtler.pressed': 'var(--ds-background-accent-gray-subtler-pressed)';
	'color.background.accent.gray.subtle': 'var(--ds-background-accent-gray-subtle)';
	'color.background.accent.gray.subtle.hovered': 'var(--ds-background-accent-gray-subtle-hovered)';
	'color.background.accent.gray.subtle.pressed': 'var(--ds-background-accent-gray-subtle-pressed)';
	'color.background.accent.gray.bolder': 'var(--ds-background-accent-gray-bolder)';
	'color.background.accent.gray.bolder.hovered': 'var(--ds-background-accent-gray-bolder-hovered)';
	'color.background.accent.gray.bolder.pressed': 'var(--ds-background-accent-gray-bolder-pressed)';
	'color.background.disabled': 'var(--ds-background-disabled)';
	'color.background.input': 'var(--ds-background-input)';
	'color.background.input.hovered': 'var(--ds-background-input-hovered)';
	'color.background.input.pressed': 'var(--ds-background-input-pressed)';
	'color.background.inverse.subtle': 'var(--ds-background-inverse-subtle)';
	'color.background.inverse.subtle.hovered': 'var(--ds-background-inverse-subtle-hovered)';
	'color.background.inverse.subtle.pressed': 'var(--ds-background-inverse-subtle-pressed)';
	'color.background.neutral': 'var(--ds-background-neutral)';
	'color.background.neutral.hovered': 'var(--ds-background-neutral-hovered)';
	'color.background.neutral.pressed': 'var(--ds-background-neutral-pressed)';
	'color.background.neutral.subtle': 'var(--ds-background-neutral-subtle)';
	'color.background.neutral.subtle.hovered': 'var(--ds-background-neutral-subtle-hovered)';
	'color.background.neutral.subtle.pressed': 'var(--ds-background-neutral-subtle-pressed)';
	'color.background.neutral.bold': 'var(--ds-background-neutral-bold)';
	'color.background.neutral.bold.hovered': 'var(--ds-background-neutral-bold-hovered)';
	'color.background.neutral.bold.pressed': 'var(--ds-background-neutral-bold-pressed)';
	'color.background.selected': 'var(--ds-background-selected)';
	'color.background.selected.hovered': 'var(--ds-background-selected-hovered)';
	'color.background.selected.pressed': 'var(--ds-background-selected-pressed)';
	'color.background.selected.bold': 'var(--ds-background-selected-bold)';
	'color.background.selected.bold.hovered': 'var(--ds-background-selected-bold-hovered)';
	'color.background.selected.bold.pressed': 'var(--ds-background-selected-bold-pressed)';
	'color.background.brand.subtlest': 'var(--ds-background-brand-subtlest)';
	'color.background.brand.subtlest.hovered': 'var(--ds-background-brand-subtlest-hovered)';
	'color.background.brand.subtlest.pressed': 'var(--ds-background-brand-subtlest-pressed)';
	'color.background.brand.bold': 'var(--ds-background-brand-bold)';
	'color.background.brand.bold.hovered': 'var(--ds-background-brand-bold-hovered)';
	'color.background.brand.bold.pressed': 'var(--ds-background-brand-bold-pressed)';
	'color.background.brand.boldest': 'var(--ds-background-brand-boldest)';
	'color.background.brand.boldest.hovered': 'var(--ds-background-brand-boldest-hovered)';
	'color.background.brand.boldest.pressed': 'var(--ds-background-brand-boldest-pressed)';
	'color.background.danger': 'var(--ds-background-danger)';
	'color.background.danger.hovered': 'var(--ds-background-danger-hovered)';
	'color.background.danger.pressed': 'var(--ds-background-danger-pressed)';
	'color.background.danger.bold': 'var(--ds-background-danger-bold)';
	'color.background.danger.bold.hovered': 'var(--ds-background-danger-bold-hovered)';
	'color.background.danger.bold.pressed': 'var(--ds-background-danger-bold-pressed)';
	'color.background.warning': 'var(--ds-background-warning)';
	'color.background.warning.hovered': 'var(--ds-background-warning-hovered)';
	'color.background.warning.pressed': 'var(--ds-background-warning-pressed)';
	'color.background.warning.bold': 'var(--ds-background-warning-bold)';
	'color.background.warning.bold.hovered': 'var(--ds-background-warning-bold-hovered)';
	'color.background.warning.bold.pressed': 'var(--ds-background-warning-bold-pressed)';
	'color.background.success': 'var(--ds-background-success)';
	'color.background.success.hovered': 'var(--ds-background-success-hovered)';
	'color.background.success.pressed': 'var(--ds-background-success-pressed)';
	'color.background.success.bold': 'var(--ds-background-success-bold)';
	'color.background.success.bold.hovered': 'var(--ds-background-success-bold-hovered)';
	'color.background.success.bold.pressed': 'var(--ds-background-success-bold-pressed)';
	'color.background.discovery': 'var(--ds-background-discovery)';
	'color.background.discovery.hovered': 'var(--ds-background-discovery-hovered)';
	'color.background.discovery.pressed': 'var(--ds-background-discovery-pressed)';
	'color.background.discovery.bold': 'var(--ds-background-discovery-bold)';
	'color.background.discovery.bold.hovered': 'var(--ds-background-discovery-bold-hovered)';
	'color.background.discovery.bold.pressed': 'var(--ds-background-discovery-bold-pressed)';
	'color.background.information': 'var(--ds-background-information)';
	'color.background.information.hovered': 'var(--ds-background-information-hovered)';
	'color.background.information.pressed': 'var(--ds-background-information-pressed)';
	'color.background.information.bold': 'var(--ds-background-information-bold)';
	'color.background.information.bold.hovered': 'var(--ds-background-information-bold-hovered)';
	'color.background.information.bold.pressed': 'var(--ds-background-information-bold-pressed)';
	'color.blanket': 'var(--ds-blanket)';
	'color.blanket.selected': 'var(--ds-blanket-selected)';
	'color.blanket.danger': 'var(--ds-blanket-danger)';
	'color.skeleton': 'var(--ds-skeleton)';
	'color.skeleton.subtle': 'var(--ds-skeleton-subtle)';
	'elevation.surface': 'var(--ds-surface)';
	'elevation.surface.hovered': 'var(--ds-surface-hovered)';
	'elevation.surface.pressed': 'var(--ds-surface-pressed)';
	'elevation.surface.overlay': 'var(--ds-surface-overlay)';
	'elevation.surface.overlay.hovered': 'var(--ds-surface-overlay-hovered)';
	'elevation.surface.overlay.pressed': 'var(--ds-surface-overlay-pressed)';
	'elevation.surface.raised': 'var(--ds-surface-raised)';
	'elevation.surface.raised.hovered': 'var(--ds-surface-raised-hovered)';
	'elevation.surface.raised.pressed': 'var(--ds-surface-raised-pressed)';
	'elevation.surface.sunken': 'var(--ds-surface-sunken)';
	'utility.elevation.surface.current': 'var(--ds-elevation-surface-current)';
} = {
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
	'color.background.accent.lime.subtler': token('color.background.accent.lime.subtler', '#D3F1A7'),
	'color.background.accent.lime.subtler.hovered': token(
		'color.background.accent.lime.subtler.hovered',
		'#B3DF72',
	),
	'color.background.accent.lime.subtler.pressed': token(
		'color.background.accent.lime.subtler.pressed',
		'#94C748',
	),
	'color.background.accent.lime.subtle': token('color.background.accent.lime.subtle', '#94C748'),
	'color.background.accent.lime.subtle.hovered': token(
		'color.background.accent.lime.subtle.hovered',
		'#B3DF72',
	),
	'color.background.accent.lime.subtle.pressed': token(
		'color.background.accent.lime.subtle.pressed',
		'#D3F1A7',
	),
	'color.background.accent.lime.bolder': token('color.background.accent.lime.bolder', '#5B7F24'),
	'color.background.accent.lime.bolder.hovered': token(
		'color.background.accent.lime.bolder.hovered',
		'#37471F',
	),
	'color.background.accent.lime.bolder.pressed': token(
		'color.background.accent.lime.bolder.pressed',
		'#37471F',
	),
	'color.background.accent.red.subtlest': token('color.background.accent.red.subtlest', '#FF8F73'),
	'color.background.accent.red.subtlest.hovered': token(
		'color.background.accent.red.subtlest.hovered',
		'#FF7452',
	),
	'color.background.accent.red.subtlest.pressed': token(
		'color.background.accent.red.subtlest.pressed',
		'#FF5630',
	),
	'color.background.accent.red.subtler': token('color.background.accent.red.subtler', '#FF7452'),
	'color.background.accent.red.subtler.hovered': token(
		'color.background.accent.red.subtler.hovered',
		'#FF5630',
	),
	'color.background.accent.red.subtler.pressed': token(
		'color.background.accent.red.subtler.pressed',
		'#DE350B',
	),
	'color.background.accent.red.subtle': token('color.background.accent.red.subtle', '#DE350B'),
	'color.background.accent.red.subtle.hovered': token(
		'color.background.accent.red.subtle.hovered',
		'#FF5630',
	),
	'color.background.accent.red.subtle.pressed': token(
		'color.background.accent.red.subtle.pressed',
		'#FF7452',
	),
	'color.background.accent.red.bolder': token('color.background.accent.red.bolder', '#DE350B'),
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
	'color.background.accent.green.subtle': token('color.background.accent.green.subtle', '#00875A'),
	'color.background.accent.green.subtle.hovered': token(
		'color.background.accent.green.subtle.hovered',
		'#36B37E',
	),
	'color.background.accent.green.subtle.pressed': token(
		'color.background.accent.green.subtle.pressed',
		'#57D9A3',
	),
	'color.background.accent.green.bolder': token('color.background.accent.green.bolder', '#00875A'),
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
	'color.background.accent.teal.subtler': token('color.background.accent.teal.subtler', '#00C7E6'),
	'color.background.accent.teal.subtler.hovered': token(
		'color.background.accent.teal.subtler.hovered',
		'#00B8D9',
	),
	'color.background.accent.teal.subtler.pressed': token(
		'color.background.accent.teal.subtler.pressed',
		'#00A3BF',
	),
	'color.background.accent.teal.subtle': token('color.background.accent.teal.subtle', '#00A3BF'),
	'color.background.accent.teal.subtle.hovered': token(
		'color.background.accent.teal.subtle.hovered',
		'#00B8D9',
	),
	'color.background.accent.teal.subtle.pressed': token(
		'color.background.accent.teal.subtle.pressed',
		'#00C7E6',
	),
	'color.background.accent.teal.bolder': token('color.background.accent.teal.bolder', '#00A3BF'),
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
	'color.background.accent.blue.subtler': token('color.background.accent.blue.subtler', '#2684FF'),
	'color.background.accent.blue.subtler.hovered': token(
		'color.background.accent.blue.subtler.hovered',
		'#0065FF',
	),
	'color.background.accent.blue.subtler.pressed': token(
		'color.background.accent.blue.subtler.pressed',
		'#0052CC',
	),
	'color.background.accent.blue.subtle': token('color.background.accent.blue.subtle', '#0052CC'),
	'color.background.accent.blue.subtle.hovered': token(
		'color.background.accent.blue.subtle.hovered',
		'#0065FF',
	),
	'color.background.accent.blue.subtle.pressed': token(
		'color.background.accent.blue.subtle.pressed',
		'#2684FF',
	),
	'color.background.accent.blue.bolder': token('color.background.accent.blue.bolder', '#0052CC'),
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
	'color.background.accent.gray.subtler': token('color.background.accent.gray.subtler', '#5E6C84'),
	'color.background.accent.gray.subtler.hovered': token(
		'color.background.accent.gray.subtler.hovered',
		'#505F79',
	),
	'color.background.accent.gray.subtler.pressed': token(
		'color.background.accent.gray.subtler.pressed',
		'#42526E',
	),
	'color.background.accent.gray.subtle': token('color.background.accent.gray.subtle', '#505F79'),
	'color.background.accent.gray.subtle.hovered': token(
		'color.background.accent.gray.subtle.hovered',
		'#5E6C84',
	),
	'color.background.accent.gray.subtle.pressed': token(
		'color.background.accent.gray.subtle.pressed',
		'#6B778C',
	),
	'color.background.accent.gray.bolder': token('color.background.accent.gray.bolder', '#42526E'),
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
	'color.background.input.hovered': token('color.background.input.hovered', '#EBECF0'),
	'color.background.input.pressed': token('color.background.input.pressed', '#FFFFFF'),
	'color.background.inverse.subtle': token('color.background.inverse.subtle', '#00000029'),
	'color.background.inverse.subtle.hovered': token(
		'color.background.inverse.subtle.hovered',
		'#0000003D',
	),
	'color.background.inverse.subtle.pressed': token(
		'color.background.inverse.subtle.pressed',
		'#00000052',
	),
	'color.background.neutral': token('color.background.neutral', '#DFE1E6'),
	'color.background.neutral.hovered': token('color.background.neutral.hovered', '#091e4214'),
	'color.background.neutral.pressed': token('color.background.neutral.pressed', '#B3D4FF'),
	'color.background.neutral.subtle': token('color.background.neutral.subtle', 'transparent'),
	'color.background.neutral.subtle.hovered': token(
		'color.background.neutral.subtle.hovered',
		'#091e4214',
	),
	'color.background.neutral.subtle.pressed': token(
		'color.background.neutral.subtle.pressed',
		'#B3D4FF',
	),
	'color.background.neutral.bold': token('color.background.neutral.bold', '#42526E'),
	'color.background.neutral.bold.hovered': token(
		'color.background.neutral.bold.hovered',
		'#505F79',
	),
	'color.background.neutral.bold.pressed': token(
		'color.background.neutral.bold.pressed',
		'#344563',
	),
	'color.background.selected': token('color.background.selected', '#DEEBFF'),
	'color.background.selected.hovered': token('color.background.selected.hovered', '#B3D4FF'),
	'color.background.selected.pressed': token('color.background.selected.pressed', '#4C9AFF'),
	'color.background.selected.bold': token('color.background.selected.bold', '#0052CC'),
	'color.background.selected.bold.hovered': token(
		'color.background.selected.bold.hovered',
		'#2684FF',
	),
	'color.background.selected.bold.pressed': token(
		'color.background.selected.bold.pressed',
		'#0052CC',
	),
	'color.background.brand.subtlest': token('color.background.brand.subtlest', '#B3D4FF'),
	'color.background.brand.subtlest.hovered': token(
		'color.background.brand.subtlest.hovered',
		'#DEEBFF',
	),
	'color.background.brand.subtlest.pressed': token(
		'color.background.brand.subtlest.pressed',
		'#4C9AFF',
	),
	'color.background.brand.bold': token('color.background.brand.bold', '#0052CC'),
	'color.background.brand.bold.hovered': token('color.background.brand.bold.hovered', '#0065FF'),
	'color.background.brand.bold.pressed': token('color.background.brand.bold.pressed', '#0747A6'),
	'color.background.brand.boldest': token('color.background.brand.boldest', '#0747A6'),
	'color.background.brand.boldest.hovered': token(
		'color.background.brand.boldest.hovered',
		'#0052CC',
	),
	'color.background.brand.boldest.pressed': token(
		'color.background.brand.boldest.pressed',
		'#0747A6',
	),
	'color.background.danger': token('color.background.danger', '#FFEBE6'),
	'color.background.danger.hovered': token('color.background.danger.hovered', '#FFBDAD'),
	'color.background.danger.pressed': token('color.background.danger.pressed', '#FF8F73'),
	'color.background.danger.bold': token('color.background.danger.bold', '#DE350B'),
	'color.background.danger.bold.hovered': token('color.background.danger.bold.hovered', '#FF5630'),
	'color.background.danger.bold.pressed': token('color.background.danger.bold.pressed', '#BF2600'),
	'color.background.warning': token('color.background.warning', '#FFFAE6'),
	'color.background.warning.hovered': token('color.background.warning.hovered', '#FFF0B3'),
	'color.background.warning.pressed': token('color.background.warning.pressed', '#FFE380'),
	'color.background.warning.bold': token('color.background.warning.bold', '#FFAB00'),
	'color.background.warning.bold.hovered': token(
		'color.background.warning.bold.hovered',
		'#FFC400',
	),
	'color.background.warning.bold.pressed': token(
		'color.background.warning.bold.pressed',
		'#FF991F',
	),
	'color.background.success': token('color.background.success', '#E3FCEF'),
	'color.background.success.hovered': token('color.background.success.hovered', '#ABF5D1'),
	'color.background.success.pressed': token('color.background.success.pressed', '#79F2C0'),
	'color.background.success.bold': token('color.background.success.bold', '#00875A'),
	'color.background.success.bold.hovered': token(
		'color.background.success.bold.hovered',
		'#57D9A3',
	),
	'color.background.success.bold.pressed': token(
		'color.background.success.bold.pressed',
		'#00875A',
	),
	'color.background.discovery': token('color.background.discovery', '#EAE6FF'),
	'color.background.discovery.hovered': token('color.background.discovery.hovered', '#C0B6F2'),
	'color.background.discovery.pressed': token('color.background.discovery.pressed', '#998DD9'),
	'color.background.discovery.bold': token('color.background.discovery.bold', '#5243AA'),
	'color.background.discovery.bold.hovered': token(
		'color.background.discovery.bold.hovered',
		'#8777D9',
	),
	'color.background.discovery.bold.pressed': token(
		'color.background.discovery.bold.pressed',
		'#5243AA',
	),
	'color.background.information': token('color.background.information', '#DEEBFF'),
	'color.background.information.hovered': token('color.background.information.hovered', '#B3D4FF'),
	'color.background.information.pressed': token('color.background.information.pressed', '#4C9AFF'),
	'color.background.information.bold': token('color.background.information.bold', '#0052CC'),
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
	'color.skeleton': token('color.skeleton', '#F4F5F7'),
	'color.skeleton.subtle': token('color.skeleton.subtle', '#091e420a'),
	'elevation.surface': token('elevation.surface', '#FFFFFF'),
	'elevation.surface.hovered': token('elevation.surface.hovered', '#FAFBFC'),
	'elevation.surface.pressed': token('elevation.surface.pressed', '#F4F5F7'),
	'elevation.surface.overlay': token('elevation.surface.overlay', '#FFFFFF'),
	'elevation.surface.overlay.hovered': token('elevation.surface.overlay.hovered', '#FAFBFC'),
	'elevation.surface.overlay.pressed': token('elevation.surface.overlay.pressed', '#F4F5F7'),
	'elevation.surface.raised': token('elevation.surface.raised', '#FFFFFF'),
	'elevation.surface.raised.hovered': token('elevation.surface.raised.hovered', '#FAFBFC'),
	'elevation.surface.raised.pressed': token('elevation.surface.raised.pressed', '#F4F5F7'),
	'elevation.surface.sunken': token('elevation.surface.sunken', '#F4F5F7'),
	'utility.elevation.surface.current': token('utility.elevation.surface.current', '#FFFFFF'),
} as const;

export type BackgroundColor = keyof typeof backgroundColorMap;

export const textColorMap: {
	'color.text': 'var(--ds-text)';
	'color.text.accent.lime': 'var(--ds-text-accent-lime)';
	'color.text.accent.lime.bolder': 'var(--ds-text-accent-lime-bolder)';
	'color.text.accent.red': 'var(--ds-text-accent-red)';
	'color.text.accent.red.bolder': 'var(--ds-text-accent-red-bolder)';
	'color.text.accent.orange': 'var(--ds-text-accent-orange)';
	'color.text.accent.orange.bolder': 'var(--ds-text-accent-orange-bolder)';
	'color.text.accent.yellow': 'var(--ds-text-accent-yellow)';
	'color.text.accent.yellow.bolder': 'var(--ds-text-accent-yellow-bolder)';
	'color.text.accent.green': 'var(--ds-text-accent-green)';
	'color.text.accent.green.bolder': 'var(--ds-text-accent-green-bolder)';
	'color.text.accent.teal': 'var(--ds-text-accent-teal)';
	'color.text.accent.teal.bolder': 'var(--ds-text-accent-teal-bolder)';
	'color.text.accent.blue': 'var(--ds-text-accent-blue)';
	'color.text.accent.blue.bolder': 'var(--ds-text-accent-blue-bolder)';
	'color.text.accent.purple': 'var(--ds-text-accent-purple)';
	'color.text.accent.purple.bolder': 'var(--ds-text-accent-purple-bolder)';
	'color.text.accent.magenta': 'var(--ds-text-accent-magenta)';
	'color.text.accent.magenta.bolder': 'var(--ds-text-accent-magenta-bolder)';
	'color.text.accent.gray': 'var(--ds-text-accent-gray)';
	'color.text.accent.gray.bolder': 'var(--ds-text-accent-gray-bolder)';
	'color.text.disabled': 'var(--ds-text-disabled)';
	'color.text.inverse': 'var(--ds-text-inverse)';
	'color.text.selected': 'var(--ds-text-selected)';
	'color.text.brand': 'var(--ds-text-brand)';
	'color.text.danger': 'var(--ds-text-danger)';
	'color.text.warning': 'var(--ds-text-warning)';
	'color.text.warning.inverse': 'var(--ds-text-warning-inverse)';
	'color.text.success': 'var(--ds-text-success)';
	'color.text.discovery': 'var(--ds-text-discovery)';
	'color.text.information': 'var(--ds-text-information)';
	'color.text.subtlest': 'var(--ds-text-subtlest)';
	'color.text.subtle': 'var(--ds-text-subtle)';
	'color.link': 'var(--ds-link)';
	'color.link.pressed': 'var(--ds-link-pressed)';
	'color.link.visited': 'var(--ds-link-visited)';
	'color.link.visited.pressed': 'var(--ds-link-visited-pressed)';
} = {
	'color.text': token('color.text', '#172B4D'),
	'color.text.accent.lime': token('color.text.accent.lime', '#4C6B1F'),
	'color.text.accent.lime.bolder': token('color.text.accent.lime.bolder', '#37471F'),
	'color.text.accent.red': token('color.text.accent.red', '#DE350B'),
	'color.text.accent.red.bolder': token('color.text.accent.red.bolder', '#BF2600'),
	'color.text.accent.orange': token('color.text.accent.orange', '#F18D13'),
	'color.text.accent.orange.bolder': token('color.text.accent.orange.bolder', '#B65C02'),
	'color.text.accent.yellow': token('color.text.accent.yellow', '#FF991F'),
	'color.text.accent.yellow.bolder': token('color.text.accent.yellow.bolder', '#FF8B00'),
	'color.text.accent.green': token('color.text.accent.green', '#00875A'),
	'color.text.accent.green.bolder': token('color.text.accent.green.bolder', '#006644'),
	'color.text.accent.teal': token('color.text.accent.teal', '#00A3BF'),
	'color.text.accent.teal.bolder': token('color.text.accent.teal.bolder', '#008DA6'),
	'color.text.accent.blue': token('color.text.accent.blue', '#0052CC'),
	'color.text.accent.blue.bolder': token('color.text.accent.blue.bolder', '#0747A6'),
	'color.text.accent.purple': token('color.text.accent.purple', '#5243AA'),
	'color.text.accent.purple.bolder': token('color.text.accent.purple.bolder', '#403294'),
	'color.text.accent.magenta': token('color.text.accent.magenta', '#E774BB'),
	'color.text.accent.magenta.bolder': token('color.text.accent.magenta.bolder', '#DA62AC'),
	'color.text.accent.gray': token('color.text.accent.gray', '#505F79'),
	'color.text.accent.gray.bolder': token('color.text.accent.gray.bolder', '#172B4D'),
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
	'color.link.visited.pressed': token('color.link.visited.pressed', '#403294'),
} as const;

export type TextColor = keyof typeof textColorMap;

export const fillMap: {
	'color.icon': 'var(--ds-icon)';
	'color.icon.accent.lime': 'var(--ds-icon-accent-lime)';
	'color.icon.accent.red': 'var(--ds-icon-accent-red)';
	'color.icon.accent.orange': 'var(--ds-icon-accent-orange)';
	'color.icon.accent.yellow': 'var(--ds-icon-accent-yellow)';
	'color.icon.accent.green': 'var(--ds-icon-accent-green)';
	'color.icon.accent.teal': 'var(--ds-icon-accent-teal)';
	'color.icon.accent.blue': 'var(--ds-icon-accent-blue)';
	'color.icon.accent.purple': 'var(--ds-icon-accent-purple)';
	'color.icon.accent.magenta': 'var(--ds-icon-accent-magenta)';
	'color.icon.accent.gray': 'var(--ds-icon-accent-gray)';
	'color.icon.disabled': 'var(--ds-icon-disabled)';
	'color.icon.inverse': 'var(--ds-icon-inverse)';
	'color.icon.selected': 'var(--ds-icon-selected)';
	'color.icon.brand': 'var(--ds-icon-brand)';
	'color.icon.danger': 'var(--ds-icon-danger)';
	'color.icon.warning': 'var(--ds-icon-warning)';
	'color.icon.warning.inverse': 'var(--ds-icon-warning-inverse)';
	'color.icon.success': 'var(--ds-icon-success)';
	'color.icon.discovery': 'var(--ds-icon-discovery)';
	'color.icon.information': 'var(--ds-icon-information)';
	'color.icon.subtlest': 'var(--ds-icon-subtlest)';
	'color.icon.subtle': 'var(--ds-icon-subtle)';
} = {
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
	'color.icon.subtlest': token('color.icon.subtlest', '#6B778C'),
	'color.icon.subtle': token('color.icon.subtle', '#6B778C'),
} as const;

export type Fill = keyof typeof fillMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::042cbfe8041c09e3817ae74154994f32>>
 * @codegenId misc
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenParams ["layer"]
 * @codegenDependency ../../../primitives/scripts/codegen-file-templates/dimensions.tsx <<SignedSource::cc9b3f12104c6ede803da6a42daac0b0>>
 * @codegenDependency ../../../primitives/scripts/codegen-file-templates/layer.tsx <<SignedSource::92793ca02dbfdad66e53ffbe9f0baa0a>>
 */
export const layerMap = {
	'1': 1,
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
 * @codegen <<SignedSource::042e960cffbaf7b7d1022ee02c3c6cbb>>
 * @codegenId border
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenParams ["width", "radius"]
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-shape.tsx <<SignedSource::a98e95106b856526c36bec8851e84348>>
 */
export const borderWidthMap: {
	'border.width': 'var(--ds-border-width)';
	'border.width.selected': 'var(--ds-border-width-selected)';
	'border.width.focused': 'var(--ds-border-width-focused)';
} = {
	'border.width': token('border.width', '1px'),
	'border.width.selected': token('border.width.selected', '2px'),
	'border.width.focused': token('border.width.focused', '2px'),
};

export type BorderWidth = keyof typeof borderWidthMap;

export const borderRadiusMap: {
	'radius.xsmall': 'var(--ds-radius-xsmall)';
	'radius.small': 'var(--ds-radius-small)';
	'radius.medium': 'var(--ds-radius-medium)';
	'radius.large': 'var(--ds-radius-large)';
	'radius.xlarge': 'var(--ds-radius-xlarge)';
	'radius.xxlarge': 'var(--ds-radius-xxlarge)';
	'radius.full': 'var(--ds-radius-full)';
	'radius.tile': 'var(--ds-radius-tile)';
} = {
	'radius.xsmall': token('radius.xsmall', '2px'),
	'radius.small': token('radius.small', '3px'),
	'radius.medium': token('radius.medium', '6px'),
	'radius.large': token('radius.large', '8px'),
	'radius.xlarge': token('radius.xlarge', '12px'),
	'radius.xxlarge': token('radius.xxlarge', '16px'),
	'radius.full': token('radius.full', '9999px'),
	'radius.tile': token('radius.tile', '25%'),
};

export type BorderRadius = keyof typeof borderRadiusMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ab32bc819d015e7451c245e6a77eba28>>
 * @codegenId typography
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenParams ["fontSize", "fontWeight", "fontFamily", "lineHeight", "body", "ui"]
 * @codegenDependency ../../../primitives/scripts/codegen-file-templates/dimensions.tsx <<SignedSource::cc9b3f12104c6ede803da6a42daac0b0>>
 * @codegenDependency ../../../primitives/scripts/codegen-file-templates/layer.tsx <<SignedSource::92793ca02dbfdad66e53ffbe9f0baa0a>>
 */
export const fontMap: {
	'font.body': 'var(--ds-font-body)';
	'font.body.UNSAFE_small': 'var(--ds-font-body-UNSAFE_small)';
	'font.body.large': 'var(--ds-font-body-large)';
	'font.body.small': 'var(--ds-font-body-small)';
	'font.code': 'var(--ds-font-code)';
	'font.heading.large': 'var(--ds-font-heading-large)';
	'font.heading.medium': 'var(--ds-font-heading-medium)';
	'font.heading.small': 'var(--ds-font-heading-small)';
	'font.heading.xlarge': 'var(--ds-font-heading-xlarge)';
	'font.heading.xsmall': 'var(--ds-font-heading-xsmall)';
	'font.heading.xxlarge': 'var(--ds-font-heading-xxlarge)';
	'font.heading.xxsmall': 'var(--ds-font-heading-xxsmall)';
	'font.metric.large': 'var(--ds-font-metric-large)';
	'font.metric.medium': 'var(--ds-font-metric-medium)';
	'font.metric.small': 'var(--ds-font-metric-small)';
} = {
	'font.body': token(
		'font.body',
		'normal 400 14px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.body.UNSAFE_small': token(
		'font.body.UNSAFE_small',
		'normal 400 12px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.body.large': token(
		'font.body.large',
		'normal 400 16px/24px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.body.small': token(
		'font.body.small',
		'normal 400 11px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.code': token(
		'font.code',
		'normal 400 0.875em/1 ui-monospace, Menlo, "Segoe UI Mono", "Ubuntu Mono", monospace',
	),
	'font.heading.large': token(
		'font.heading.large',
		'normal 500 24px/28px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.heading.medium': token(
		'font.heading.medium',
		'normal 500 20px/24px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.heading.small': token(
		'font.heading.small',
		'normal 600 16px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.heading.xlarge': token(
		'font.heading.xlarge',
		'normal 600 29px/32px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.heading.xsmall': token(
		'font.heading.xsmall',
		'normal 600 14px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.heading.xxlarge': token(
		'font.heading.xxlarge',
		'normal 500 35px/40px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.heading.xxsmall': token(
		'font.heading.xxsmall',
		'normal 600 12px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.metric.large': token(
		'font.metric.large',
		'normal 653 28px/32px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.metric.medium': token(
		'font.metric.medium',
		'normal 653 24px/28px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.metric.small': token(
		'font.metric.small',
		'normal 653 16px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
};

export type Font = keyof typeof fontMap;

export const fontWeightMap: {
	'font.weight.bold': 'var(--ds-font-weight-bold)';
	'font.weight.medium': 'var(--ds-font-weight-medium)';
	'font.weight.regular': 'var(--ds-font-weight-regular)';
	'font.weight.semibold': 'var(--ds-font-weight-semibold)';
} = {
	'font.weight.bold': token('font.weight.bold', '700'),
	'font.weight.medium': token('font.weight.medium', '500'),
	'font.weight.regular': token('font.weight.regular', '400'),
	'font.weight.semibold': token('font.weight.semibold', '600'),
};

export type FontWeight = keyof typeof fontWeightMap;

export const fontFamilyMap: {
	'font.family.body': 'var(--ds-font-family-body)';
	'font.family.brand.body': 'var(--ds-font-family-brand-body)';
	'font.family.brand.heading': 'var(--ds-font-family-brand-heading)';
	'font.family.code': 'var(--ds-font-family-code)';
	'font.family.heading': 'var(--ds-font-family-heading)';
} = {
	'font.family.body': token(
		'font.family.body',
		'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.family.brand.body': token(
		'font.family.brand.body',
		'"Charlie Text", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.family.brand.heading': token(
		'font.family.brand.heading',
		'"Charlie Display", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.family.code': token(
		'font.family.code',
		'ui-monospace, Menlo, "Segoe UI Mono", "Ubuntu Mono", monospace',
	),
	'font.family.heading': token(
		'font.family.heading',
		'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
};

export type FontFamily = keyof typeof fontFamilyMap;

/**
 * @codegenEnd
 */

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::379f638b84496f34817234c7f3c58f74>>
 * @codegenId text
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../primitives/scripts/codegen-file-templates/dimensions.tsx <<SignedSource::cc9b3f12104c6ede803da6a42daac0b0>>
 * @codegenDependency ../../../primitives/scripts/codegen-file-templates/layer.tsx <<SignedSource::92793ca02dbfdad66e53ffbe9f0baa0a>>
 */
export const textSizeMap: {
	medium: 'var(--ds-font-body)';
	UNSAFE_small: 'var(--ds-font-body-UNSAFE_small)';
	large: 'var(--ds-font-body-large)';
	small: 'var(--ds-font-body-small)';
} = {
	medium: token(
		'font.body',
		'normal 400 14px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	UNSAFE_small: token(
		'font.body.UNSAFE_small',
		'normal 400 12px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	large: token(
		'font.body.large',
		'normal 400 16px/24px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	small: token(
		'font.body.small',
		'normal 400 11px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
};

export type TextSize = keyof typeof textSizeMap;

export const textWeightMap: {
	bold: 'var(--ds-font-weight-bold)';
	medium: 'var(--ds-font-weight-medium)';
	regular: 'var(--ds-font-weight-regular)';
	semibold: 'var(--ds-font-weight-semibold)';
} = {
	bold: token('font.weight.bold', '700'),
	medium: token('font.weight.medium', '500'),
	regular: token('font.weight.regular', '400'),
	semibold: token('font.weight.semibold', '600'),
};

export type TextWeight = keyof typeof textWeightMap;

export const metricTextSizeMap: {
	large: 'var(--ds-font-metric-large)';
	medium: 'var(--ds-font-metric-medium)';
	small: 'var(--ds-font-metric-small)';
} = {
	large: token(
		'font.metric.large',
		'normal 653 28px/32px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	medium: token(
		'font.metric.medium',
		'normal 653 24px/28px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	small: token(
		'font.metric.small',
		'normal 653 16px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
};

export type MetricTextSize = keyof typeof metricTextSizeMap;

/**
 * @codegenEnd
 */

// Margin needs some bespoke types: https://atlassian.slack.com/archives/CKRHB23K8/p1712623192772909
type MarginSpace = AllSpace | 'auto' | '0';
type PaddingSpace = Space | '0';
type GlobalValue = 'inherit' | 'initial' | 'revert' | 'revert-layer' | 'unset';
type AutoComplete<T extends string> = T | Omit<string, T>;

export type TokenisedProps = {
	backgroundColor?: BackgroundColor;
	blockSize?: Dimension | string;
	borderBlockColor?: AutoComplete<BorderColor>;
	borderBlockEndColor?: AutoComplete<BorderColor>;
	borderBlockEndWidth?: BorderWidth | string;
	borderBlockStartColor?: AutoComplete<BorderColor>;
	borderBlockStartWidth?: BorderWidth | string;
	borderBlockWidth?: BorderWidth | string;
	borderBottomColor?: AutoComplete<BorderColor>;
	borderBottomLeftRadius?: BorderRadius | string;
	borderBottomRightRadius?: BorderRadius | string;
	borderBottomWidth?: BorderWidth | string;
	borderColor?: BorderColor;
	borderEndEndRadius?: BorderRadius | string;
	borderEndStartRadius?: BorderRadius | string;
	borderInlineColor?: AutoComplete<BorderColor>;
	borderInlineEndColor?: AutoComplete<BorderColor>;
	borderInlineEndWidth?: BorderWidth | string;
	borderInlineStartColor?: AutoComplete<BorderColor>;
	borderInlineStartWidth?: BorderWidth | string;
	borderInlineWidth?: BorderWidth | string;
	borderLeftColor?: AutoComplete<BorderColor>;
	borderLeftWidth?: BorderWidth | string;
	borderRadius?: BorderRadius | string;
	borderRightColor?: AutoComplete<BorderColor>;
	borderRightWidth?: BorderWidth | string;
	borderStartEndRadius?: BorderRadius | string;
	borderStartStartRadius?: BorderRadius | string;
	borderTopColor?: AutoComplete<BorderColor>;
	borderTopLeftRadius?: BorderRadius | string;
	borderTopRightRadius?: BorderRadius | string;
	borderTopWidth?: BorderWidth | string;
	borderWidth?: BorderWidth | string;
	bottom?: AutoComplete<AllSpace>;
	boxShadow?: Shadow;
	color?: TextColor;
	columnGap?: Space;
	font?: Font | string;
	fontFamily?: FontFamily | string;
	fontStyle?: 'normal' | 'italic';
	fontWeight?: FontWeight | string | number;
	gap?: Space;
	height?: Dimension | string;
	inlineSize?: Dimension | string;
	inset?: AutoComplete<AllSpace>;
	insetBlock?: AutoComplete<AllSpace>;
	insetBlockEnd?: AutoComplete<AllSpace>;
	insetBlockStart?: AutoComplete<AllSpace>;
	insetInline?: AutoComplete<AllSpace>;
	insetInlineEnd?: AutoComplete<AllSpace>;
	insetInlineStart?: AutoComplete<AllSpace>;
	left?: AutoComplete<AllSpace>;
	margin?: MarginSpace | '0 auto' | GlobalValue;
	marginBlock?: MarginSpace | GlobalValue;
	marginInline?: MarginSpace | GlobalValue;
	marginBlockEnd?: MarginSpace | GlobalValue;
	marginBlockStart?: MarginSpace | GlobalValue;
	marginBottom?: MarginSpace | GlobalValue;
	marginInlineEnd?: MarginSpace | GlobalValue;
	marginInlineStart?: MarginSpace | GlobalValue;
	marginLeft?: MarginSpace | GlobalValue;
	marginRight?: MarginSpace | GlobalValue;
	marginTop?: MarginSpace | GlobalValue;
	maxBlockSize?: Dimension | string;
	maxHeight?: Dimension | string;
	maxInlineSize?: Dimension | string;
	maxWidth?: Dimension | string;
	minBlockSize?: Dimension | string;
	minHeight?: Dimension | string;
	minInlineSize?: Dimension | string;
	minWidth?: Dimension | string;
	opacity?: AutoComplete<Opacity> | number;
	outlineColor?: BorderColor;
	outlineOffset?: AllSpace;
	outlineWidth?: BorderWidth | string;
	padding?: PaddingSpace | GlobalValue;
	paddingBlock?: PaddingSpace | GlobalValue;
	paddingBlockEnd?: PaddingSpace | GlobalValue;
	paddingBlockStart?: PaddingSpace | GlobalValue;
	paddingBottom?: PaddingSpace | GlobalValue;
	paddingInline?: PaddingSpace | GlobalValue;
	paddingInlineEnd?: PaddingSpace | GlobalValue;
	paddingInlineStart?: PaddingSpace | GlobalValue;
	paddingLeft?: PaddingSpace | GlobalValue;
	paddingRight?: PaddingSpace | GlobalValue;
	paddingTop?: PaddingSpace | GlobalValue;
	right?: AutoComplete<AllSpace>;
	rowGap?: Space;
	top?: AutoComplete<AllSpace>;
	width?: Dimension | string;
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
	| FontWeightToken
	| FontFamilyToken
	| TextColorToken
	| FontToken
	| TextWeightToken
	| TextSizeToken;

type TokenMap = Partial<Record<PropsToken, ReturnType<typeof token>>>;
type SerializedStylesMap = Record<PropsToken, SerializedStyles>;

export const getSerializedStylesMap = (
	cssProperty: TokenMappableProperty,
	tokenMap: TokenMap,
): SerializedStylesMap => {
	return Object.keys(tokenMap).reduce((emotionSpacingMap, token) => {
		// eslint-disable-next-line @repo/internal/styles/no-exported-styles
		emotionSpacingMap[token as PropsToken] = css({
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			[cssProperty]: tokenMap[token as PropsToken],
		});

		return emotionSpacingMap;
	}, {} as SerializedStylesMap);
};
type SpacingToken = keyof typeof positiveSpaceMap;
type BackgroundColorToken = keyof typeof backgroundColorMap;
type SurfaceColorToken = keyof typeof surfaceColorMap;
type TextColorToken = keyof typeof textColorMap;
type FontWeightToken = keyof typeof fontWeightMap;
type FontFamilyToken = keyof typeof fontFamilyMap;
type FontToken = keyof typeof fontMap;
type TextWeightToken = keyof typeof textWeightMap;
type TextSizeToken = keyof typeof textSizeMap;
type MetricTextSizeToken = keyof typeof metricTextSizeMap;
type SpacingStyleMap = Record<SpacingProperty, Record<SpacingToken, SerializedStyles>>;
type BackgroundColorStyleMap = Record<BackgroundColorToken, SerializedStyles>;
type SurfaceColorStyleMap = Record<SurfaceColorToken, SerializedStyles>;
type TextColorStyleMap = Record<TextColorToken, SerializedStyles>;
type FontWeightStyleMap = Record<FontWeightToken, SerializedStyles>;
type FontFamilyStyleMap = Record<FontFamilyToken, SerializedStyles>;
type FontStyleMap = Record<FontToken, SerializedStyles>;
type TextWeightStyleMap = Record<TextWeightToken, SerializedStyles>;
type TextStyleMap = Record<TextSizeToken, SerializedStyles>;
type MetricTextStyleMap = Record<MetricTextSizeToken, SerializedStyles>;

export const paddingStylesMap: SpacingStyleMap = spacingProperties.reduce(
	(styleMap, spacingProperty: SpacingProperty) => {
		styleMap[spacingProperty] = getSerializedStylesMap(spacingProperty, positiveSpaceMap);

		return styleMap;
	},
	{} as SpacingStyleMap,
);

export const spaceStylesMap: SpacingStyleMap = spacingProperties.reduce(
	(styleMap, spacingProperty: SpacingProperty) => {
		styleMap[spacingProperty] = getSerializedStylesMap(spacingProperty, positiveSpaceMap);

		return styleMap;
	},
	{} as SpacingStyleMap,
);

export const backgroundColorStylesMap: BackgroundColorStyleMap = getSerializedStylesMap(
	'backgroundColor',
	backgroundColorMap,
);

export const textColorStylesMap: TextColorStyleMap = getSerializedStylesMap('color', textColorMap);
export const fontWeightStylesMap: FontWeightStyleMap = getSerializedStylesMap(
	'fontWeight',
	fontWeightMap,
);
export const fontFamilyStylesMap: FontFamilyStyleMap = getSerializedStylesMap(
	'fontFamily',
	fontFamilyMap,
);
export const fontStylesMap: FontStyleMap = getSerializedStylesMap('font', fontMap);

export const textSizeStylesMap: TextStyleMap = getSerializedStylesMap('font', textSizeMap);

export const textWeightStylesMap: TextWeightStyleMap = getSerializedStylesMap(
	'fontWeight',
	textWeightMap,
);

export const surfaceColorStylesMap: SurfaceColorStyleMap = getSerializedStylesMap(
	CURRENT_SURFACE_CSS_VAR,
	surfaceColorMap,
);

export const isSurfaceColorToken = (color: unknown): color is SurfaceColorToken =>
	surfaceColorMap[color as SurfaceColorToken] !== undefined;

export const metricTextSizeStylesMap: MetricTextStyleMap = getSerializedStylesMap(
	'font',
	metricTextSizeMap,
);

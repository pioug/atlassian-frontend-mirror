/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ccc2f8099477ab616059b3ca3af61579>>
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../tokens/src/artifacts/tokens-raw/atlassian-light.tsx <<SignedSource::4e25079e2363933fae45ad0f1e9c123b>>
 */
import { token } from '@atlaskit/tokens';

export const surfaceColorMap: {
	'elevation.surface': 'var(--ds-surface)';
	'elevation.surface.hovered': 'var(--ds-surface-hovered)';
	'elevation.surface.pressed': 'var(--ds-surface-pressed)';
	'elevation.surface.container': 'var(--ds-surface-container)';
	'elevation.surface.container.hovered': 'var(--ds-surface-container-hovered)';
	'elevation.surface.container.pressed': 'var(--ds-surface-container-pressed)';
	'elevation.surface.overlay': 'var(--ds-surface-overlay)';
	'elevation.surface.overlay.hovered': 'var(--ds-surface-overlay-hovered)';
	'elevation.surface.overlay.pressed': 'var(--ds-surface-overlay-pressed)';
	'elevation.surface.raised': 'var(--ds-surface-raised)';
	'elevation.surface.raised.hovered': 'var(--ds-surface-raised-hovered)';
	'elevation.surface.raised.pressed': 'var(--ds-surface-raised-pressed)';
	'elevation.surface.sunken': 'var(--ds-surface-sunken)';
} = {
	'elevation.surface': token('elevation.surface', '#FFFFFF'),
	'elevation.surface.hovered': token('elevation.surface.hovered', '#F0F1F2'),
	'elevation.surface.pressed': token('elevation.surface.pressed', '#DDDEE1'),
	'elevation.surface.container': token('elevation.surface.container', '#17171708'),
	'elevation.surface.container.hovered': token('elevation.surface.container.hovered', '#0515240F'),
	'elevation.surface.container.pressed': token('elevation.surface.container.pressed', '#0B120E24'),
	'elevation.surface.overlay': token('elevation.surface.overlay', '#FFFFFF'),
	'elevation.surface.overlay.hovered': token('elevation.surface.overlay.hovered', '#F0F1F2'),
	'elevation.surface.overlay.pressed': token('elevation.surface.overlay.pressed', '#DDDEE1'),
	'elevation.surface.raised': token('elevation.surface.raised', '#FFFFFF'),
	'elevation.surface.raised.hovered': token('elevation.surface.raised.hovered', '#F0F1F2'),
	'elevation.surface.raised.pressed': token('elevation.surface.raised.pressed', '#DDDEE1'),
	'elevation.surface.sunken': token('elevation.surface.sunken', '#F8F8F8'),
} as const;

export type SurfaceColor = keyof typeof surfaceColorMap;

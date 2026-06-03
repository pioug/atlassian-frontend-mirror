/**
 * Structured MCP docs for `@atlaskit/layering`.
 *
 * ⚠️ Pilot / not yet final. This file is part of the libraries-content pilot
 * for the "Libraries, hooks, utilities in structured content" RFC. The
 * container schema and per-kind shapes are still in review — expect breaking
 * changes before this is rolled out broadly. Do not depend on the format yet.
 *
 * Layering is a mixed-kind package: a `<Layering>` provider component plus two
 * hooks. The hooks have first-class parameters and return shapes, so they live
 * under the `hooks` key rather than being shoehorned into the component schema.
 *
 * Contact #dst-structured-content in Slack with questions.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/layering',
		packagePath,
		packageJson,
		overview:
			'Coordinates layered UI (modals, popups, drawers, spotlights) so only the topmost layer responds to dismissal interactions like the Escape key. Wrap a layered surface in `<Layering>`, then use `useCloseOnEscapePress` to wire up dismissal — disabled layers will automatically defer to whichever layer is currently on top.',
	},
	components: [
		{
			name: 'Layering',
			description:
				'Registers its subtree as a layer in the layering tree. When `isDisabled` is false, this layer participates in topmost-layer tracking; sibling hooks like `useCloseOnEscapePress` only fire on the layer that is actually on top.',
			status: 'general-availability',
			import: {
				name: 'Layering',
				package: '@atlaskit/layering',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Wrap the root of any layered surface (modal, popup, drawer, spotlight) in `<Layering>` so dismissal hooks can tell which layer is on top.',
				'Leave `isDisabled` at its default while the layer is mounted but inactive (for example, a modal that is open but covered by a nested popup). The disabled layer stops claiming the top spot until it becomes active again.',
			],
			accessibilityGuidelines: [
				'Layering does not render any DOM itself — it is purely a context provider. Keep the underlying surface accessible (focus trap, aria attributes, restore focus on close) using the host component, not this wrapper.',
			],
			keywords: ['layering', 'layer', 'modal', 'popup', 'drawer', 'spotlight', 'top-layer'],
			categories: ['layering', 'overlays'],
			examples: [],
		},
	],
	hooks: [
		{
			name: 'useLayering',
			description:
				'Returns information about the current layer in the layering tree: the layer depth, a check for whether this layer is currently disabled (i.e. not on top), and the top-most depth in the tree.',
			status: 'general-availability',
			parameters: [],
			returns: {
				type: '{ currentLevel: number; isLayerDisabled: () => boolean; getTopLevel: () => number | null }',
				description:
					'`currentLevel` is the depth of the calling layer. `isLayerDisabled()` returns true when a deeper layer is currently on top. `getTopLevel()` returns the deepest registered layer, or `null` if no layers are mounted.',
			},
			usageGuidelines: [
				'Use inside a layered surface to gate behaviour that should only run for the top-most layer (for example, registering global keyboard listeners or auto-focusing content).',
				'Prefer `useCloseOnEscapePress` for the common case of closing on Escape — only reach for `useLayering` when you need raw level info.',
			],
			keywords: ['layering', 'hook', 'useLayering', 'top-layer'],
			categories: ['layering', 'hooks'],
			examples: [],
		},
		{
			name: 'useCloseOnEscapePress',
			description:
				'Calls `onClose` when the Escape key is pressed and this layer is currently on top of the layering tree. Layers covered by a deeper layer are skipped, so Escape closes the topmost surface first.',
			status: 'general-availability',
			parameters: [
				{
					name: 'options',
					type: '{ onClose: (e: KeyboardEvent) => void; isDisabled?: boolean }',
					description:
						'`onClose` runs on the first Escape keydown per press. Set `isDisabled` to opt out without unmounting the hook (for example, when the surface is mounted but in a non-closable state).',
				},
			],
			returns: { type: 'void' },
			usageGuidelines: [
				'Mount inside the component that owns the surface (modal body, popup body, drawer body). Wrap that component in `<Layering>` or it will not receive layer information.',
				'Do not pair with a second top-level Escape listener — the hook already coordinates dismissal across stacked layers.',
			],
			accessibilityGuidelines: [
				'Escape-to-close is the expected dismissal pattern for overlay surfaces (WAI-ARIA Authoring Practices). Always wire it up alongside an explicit close button.',
			],
			keywords: ['layering', 'hook', 'useCloseOnEscapePress', 'escape', 'dismiss'],
			categories: ['layering', 'hooks', 'a11y'],
			examples: [],
		},
	],
};

export default documentation;

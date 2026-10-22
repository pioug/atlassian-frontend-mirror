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

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/layering',
		packagePath,
		packageJson,
		overview:
			"Deprecated. The browser top layer handles stacking and Escape natively, so use `@atlaskit/top-layer` instead (DS components use it on their `platform-dst-top-layer` path). To check whether an overlay is open, use `hasOpenDialogOrPopover` from `@atlaskit/top-layer/page-surface/has-open-dialog-or-popover`. During the rollout, pass `isEnabled: !fg('platform-dst-top-layer')` to the layering hooks, and do not render `Layering` when the gate is on.",
	},
	components: [
		{
			name: 'Layering',
			description:
				'Registers its subtree as a layer in the layering tree. When `isDisabled` is false, this layer participates in topmost-layer tracking; sibling hooks like `useCloseOnEscapePress` only fire on the layer that is actually on top.',
			status: 'deprecated',
			import: {
				name: 'Layering',
				package: '@atlaskit/layering/layering',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				"Deprecated. Do not add new usages. Render the surface with `@atlaskit/top-layer`. During the rollout, do not render `Layering` when `fg('platform-dst-top-layer')` is on.",
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
			status: 'deprecated',
			parameters: [
				{
					name: 'options',
					type: '{ isEnabled?: boolean }',
					description:
						'Set `isEnabled` to false to opt out, for example on the `platform-dst-top-layer` path. The hook then reports no layering.',
				},
			],
			returns: {
				type: '{ currentLevel: number; isLayerDisabled: () => boolean; getTopLevel: () => number | null }',
				description:
					'`currentLevel` is the depth of the calling layer. `isLayerDisabled()` returns true when a deeper layer is currently on top. `getTopLevel()` returns the deepest registered layer, or `null` if no layers are mounted.',
			},
			usageGuidelines: [
				"Deprecated. Do not add new usages. To ignore keys while an overlay is open, call `hasOpenDialogOrPopover({ within })` from `@atlaskit/top-layer/page-surface/has-open-dialog-or-popover` at event time. During the rollout, pass `isEnabled: !fg('platform-dst-top-layer')`.",
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
			status: 'deprecated',
			parameters: [
				{
					name: 'options',
					type: '{ onClose: (e: KeyboardEvent) => void; isDisabled?: boolean; isEnabled?: boolean }',
					description:
						'`onClose` runs on the first Escape keydown per press. Set `isDisabled` to opt out without unmounting the hook (for example, when the surface is mounted but in a non-closable state). Set `isEnabled` to false to bind no listener at all, for example on the `platform-dst-top-layer` path.',
				},
			],
			returns: { type: 'void' },
			usageGuidelines: [
				"Deprecated. Do not add new usages. Top-layer surfaces close on Escape natively. To close a page surface (for example a side panel) on Escape, use `useCloseOnUnclaimedEscape` from `@atlaskit/top-layer/page-surface/use-close-on-unclaimed-escape`. During the rollout, pass `isEnabled: !fg('platform-dst-top-layer')`.",
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

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'ColorPicker',
			description:
				'A button that opens a palette for choosing one color to apply to a host object, such as a label or card.',
			status: 'general-availability',
			import: {
				name: 'default',
				package: '@atlaskit/color-picker',
				type: 'default',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use ColorPicker when a color choice belongs to a specific object and should open from a compact trigger.',
				'Choose palette colors with clear labels and keep the selected value in app state so the trigger and applied object stay in sync.',
			],
			contentGuidelines: [
				'Name the choice by its purpose (for example, “Card background color”) and use familiar color names for palette entries.',
				'Pair color with another visible state or label when it carries meaning; do not rely on hue alone.',
			],
			accessibilityGuidelines: [
				'Give the trigger a descriptive label; the picker adds the currently selected color to its accessible name.',
			],
			examples: [
				{
					name: 'Controlled color choice',
					description: 'Keep the selected color in host state and show the updated choice.',
					source: `${packagePath}/examples/ai/color-picker-controlled.tsx`,
				},
			],
			keywords: ['color', 'picker', 'palette', 'select'],
			categories: ['interaction'],
		},
		{
			name: 'ColorPickerWithoutAnalytics',
			description:
				'The color picker trigger and palette without the package analytics wrappers, for consumers that handle analytics separately.',
			status: 'general-availability',
			import: {
				name: 'ColorPickerWithoutAnalytics',
				package: '@atlaskit/color-picker',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use this variant only when the app already records the picker’s analytics events; otherwise use the default ColorPicker, which adds the package analytics wrappers.',
			],
			contentGuidelines: [
				'Use a label that names what the chosen color affects and familiar names for the palette options.',
			],
			accessibilityGuidelines: [
				'Give the trigger a descriptive label; the picker adds the selected color to its accessible name.',
			],
			keywords: ['color', 'picker', 'palette', 'analytics'],
			categories: ['interaction'],
			examples: [
				{
					name: 'Controlled color choice',
					description:
						'Render the default and non-analytics color picker with controlled selections.',
					source: `${packagePath}/examples/ai/color-picker-controlled.tsx`,
				},
			],
		},
		{
			name: 'ColorPaletteMenu',
			description:
				'A palette of color choices for menu or standalone group contexts; the host applies the chosen value.',
			status: 'general-availability',
			import: {
				name: 'ColorPaletteMenu',
				package: '@atlaskit/color-picker',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use ColorPaletteMenu to show all color choices in a page or panel.',
				'Use the same selected color in the palette and the item it changes.',
			],
			contentGuidelines: [
				'Use a concise label that identifies the target of the color choice, and provide recognizable names for each swatch.',
			],
			accessibilityGuidelines: [
				'Set isInsideMenu={false} when the palette is outside a menu so it exposes radio-group semantics; retain the default menu semantics when composing it inside a menu.',
				'Set isFocusLockEnabled={false} for a standalone palette so Tab can move to surrounding controls; this is separate from isInsideMenu, which selects the accessibility role.',
				'When multiple palettes are mounted together, disable autoFocus on all but the intended initial palette so they do not compete for focus.',
			],
			keywords: ['color', 'palette', 'menu', 'radio'],
			categories: ['interaction'],
			examples: [
				{
					name: 'Standalone color palette',
					description: 'Show a labelled palette as a radio group and update the host selection.',
					source: `${packagePath}/examples/ai/color-palette-menu-controlled.tsx`,
				},
			],
		},
		{
			name: 'ColorPaletteMenuWithoutAnalytics',
			description:
				'The color palette menu without the package analytics wrappers, for consumers that handle analytics separately.',
			status: 'general-availability',
			import: {
				name: 'ColorPaletteMenuWithoutAnalytics',
				package: '@atlaskit/color-picker',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use this variant only when the app already records the palette menu’s analytics events; otherwise use the default ColorPaletteMenu, which adds the package analytics wrappers.',
			],
			contentGuidelines: [
				'Use a concise label that identifies the target of the color choice and recognizable palette option names.',
			],
			accessibilityGuidelines: [
				'Set isInsideMenu={false} when the palette is outside a menu so it exposes radio-group semantics; retain the default menu semantics when composing it inside a menu.',
				'Set isFocusLockEnabled={false} for a standalone palette so Tab can move to surrounding controls; this is separate from isInsideMenu, which selects the accessibility role.',
				'When multiple palettes are mounted together, disable autoFocus on all but the intended initial palette so they do not compete for focus.',
			],
			keywords: ['color', 'palette', 'menu', 'analytics'],
			categories: ['interaction'],
			examples: [
				{
					name: 'Standalone color palette',
					description: 'Render the standard and non-analytics palettes with controlled selections.',
					source: `${packagePath}/examples/ai/color-palette-menu-controlled.tsx`,
				},
			],
		},
	],
};

export default documentation;

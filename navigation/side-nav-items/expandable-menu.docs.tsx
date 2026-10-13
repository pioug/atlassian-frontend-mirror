import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'ExpandableMenuItem',
			description:
				'A collapsible navigation container that groups related items under a parent trigger. Supports non-selectable (button) and selectable (link) variants, with optional flyout menus for overflow. Used to create navigation hierarchies in the side navigation rail.',
			status: 'open-beta',
			import: {
				name: 'ExpandableMenuItem',
				package: '@atlaskit/side-nav-items/expandable-menu-item',
				type: 'named',
				packagePath,
				packageJson: require('./package.json'),
			},
			usageGuidelines: [
				'Use to reveal a group of related destinations. Put child rows in ExpandableMenuItemContent so they open and close together.',
				'Set href when the label should open the parent page; the separate chevron opens and closes the child list. Omit href when the label only groups links.',
				'For a long list, provide a link to the full collection rather than adding more nested groups.',
				'Set selection from the current route. Control expansion in the app when it needs to follow navigation.',
			],
			contentGuidelines: [
				'Label should be a noun or noun phrase describing what the section contains (e.g., "Projects", "Settings", "Notifications"). Do not use verbs or actions like "Manage" or "View".',
				'Avoid vague or generic terms like "More" or "Misc" that do not help users understand what they will find inside.',
				'Use "View all {objects}" for directory links and "All/More {objects}" for flyouts, consistently.',
			],
			accessibilityGuidelines: [
				'Use button semantics (role=button) for non-selectable expandable triggers. Set aria-expanded=true/false and aria-controls to the expanded region id.',
				'For selectable (navigable) parents, use link semantics for the label and separate the expand affordance (chevron) as its own button with aria-expanded.',
				'Keyboard: Tab moves focus to the expandable trigger; Enter/Space toggles expand/collapse; Left Arrow collapses; Right Arrow expands; Up/Down Arrow moves between items; Home/End jump to first/last item; Esc closes flyouts.',
				'Focus: After expanding via keyboard, keep focus on the trigger; do not auto-move focus. On collapse, keep focus on the trigger. Preserve focus-visible styles.',
				'Announcements: On toggle, do not announce the entire list. Use concise labels, e.g., "Projects, expanded, 12 items". Update aria-expanded only; rely on screen reader verbosity settings.',
				'Touch targets: Minimum 44x44 px for trigger and chevron. Provide at least 8 px spacing between adjacent targets.',
				'Contrast: Trigger text and chevron must meet 4.5:1 against background in default state and 3:1 for icons in active/hover states.',
				'Defer flyout population until trigger focus/hover to reduce initial payload; announce loading with aria-busy on the container.',
				'Show skeleton states (3-5 placeholder rows per section) while loading. Keep chevron disabled until data is ready; preserve container height to avoid layout shift.',
			],
			examples: [
				{
					name: 'Expandable menu - non-selectable top-level',
					description:
						'A non-selectable expandable menu button for a top-level section (e.g., Projects) with Starred and Recent groups, a directory link, and a flyout for overflow items.',
					source: `${packagePath}/examples/docs/expandable-menu-item-default-variant.tsx`,
				},
				{
					name: 'Expandable menu - selectable with landing page',
					description:
						'A selectable expandable menu link where the label navigates to a landing page and the chevron toggles expansion of child items.',
					source: `${packagePath}/examples/docs/expandable-menu-item-link-variant.tsx`,
				},
				{
					name: 'Expandable menu - loading and empty states',
					description:
						'Expandable menu showing skeleton loading placeholders and an inline empty state with a create action.',
					source: `${packagePath}/examples/docs/expandable-menu-item-default-variant.tsx`,
				},
			],
			keywords: [
				'expandable',
				'menu',
				'navigation',
				'sidebar',
				'collapsible',
				'accordion',
				'hierarchy',
				'flyout',
			],
			categories: ['navigation'],
		},
	],
};

export default documentation;

import path from 'path';

import type { ComponentStructuredContentSource } from '@atlassian/structured-docs-types';

const packagePath = path.resolve(__dirname);

const documentation: ComponentStructuredContentSource[] = [
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
			'Group related objects under a parent where users frequently navigate between siblings (e.g., Projects, Dashboards, Spaces).',
			'Surface a scannable subset of max 15 items per section heading, with a clear path to the full set via a "View all {objects}" directory link or an "All/More {objects}" flyout.',
			'Use system-generated views like Starred (user-ordered) and Recent (most-recently-accessed) to speed access to frequent items.',
			'If the selected item is not currently visible (e.g., accessed via flyout), temporarily pin it to the top of the expanded view until the user navigates away.',
			'Do not use an expandable as the very first top-level item in the sidebar; start with a link menu item landing page instead.',
			'Do not use a selectable expandable (link variant) that both navigates and expands unless there is a strong precedent (e.g., Confluence page trees).',
			'Do not mix a selectable expandable with a separate directory link in the same container; the dual destinations confuse users.',
			'Do not exceed 15 items per section heading or introduce a third navigation level in the sidebar.',
			'Do not leave empty sections without guidance; always provide an action or link to create/find items.',
			'Render <ExpandableMenuItem> as a child of <SideNav> within the Navigation System layout.',
			'Choose between non-selectable (button) or selectable (link) variant based on whether the parent label is itself a navigation destination.',
			'For non-selectable triggers: clicking anywhere on the label or chevron toggles expansion. Do not navigate on click. Use for top-level groupings where the parent is not a destination page.',
			'For selectable triggers: label click navigates to the parent route; chevron click toggles expand/collapse. Provide both when the parent has its own landing page and contains children.',
			'Show Starred items first (user-ordered), then Recent items (most-recently-accessed) under separate section headings.',
			'For empty states, display a message (e.g., "No {objects} yet") with a primary action (e.g., "Create {object}") and a link (e.g., "View all {objects}").',
			'Do not nest multiple expandable menu items to create deep hierarchies.',
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
				source: path.resolve(packagePath, './examples/expandable-menu-item.tsx'),
			},
			{
				name: 'Expandable menu - selectable with landing page',
				description:
					'A selectable expandable menu link where the label navigates to a landing page and the chevron toggles expansion of child items.',
				source: path.resolve(packagePath, './examples/docs/expandable-menu-item-link-variant.tsx'),
			},
			{
				name: 'Expandable menu - loading and empty states',
				description:
					'Expandable menu showing skeleton loading placeholders and an inline empty state with a create action.',
				source: path.resolve(
					packagePath,
					'./examples/docs/expandable-menu-item-default-variant.tsx',
				),
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
];

export default documentation;

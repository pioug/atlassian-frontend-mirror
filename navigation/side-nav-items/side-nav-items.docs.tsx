import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'ButtonMenuItem',
			description:
				'A button-shaped item for an action that stays within the current navigation context, such as opening a picker or creating an item. Use LinkMenuItem when activating the row should navigate to a destination.',
			status: 'general-availability',
			import: {
				name: 'ButtonMenuItem',
				package: '@atlaskit/side-nav-items/button-menu-item',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use a button item for an in-place action such as opening a workspace switcher or starting creation; do not use it as a substitute for a route link.',
				'Keep the row label focused on the action or destination. Put secondary controls in `actions` or `actionsOnHover` only when they act on this row, rather than adding unrelated navigation choices.',
				'Use a leading icon or avatar only when it helps distinguish the action or the object; avoid decorative duplication beside an already distinctive label.',
			],
			accessibilityGuidelines: [
				'Keep the visible row label meaningful as the button name; icon-only secondary actions need their own accessible labels.',
				'If the action expands or opens a popup, expose the matching expanded/has-popup state and connect it to the controlled region.',
			],
			contentGuidelines: [
				'Use a concise verb-led label for an action (for example, "Create project") and a noun phrase for a destination.',
			],
			examples: [
				{
					name: 'Action alongside destinations',
					description:
						'A compact side-nav composition separates route links from an in-place create action and groups destinations by section.',
					source: `${packagePath}/examples/ai/sectioned-navigation.tsx`,
				},
				{
					name: 'Button actions and row context',
					description:
						'Shows in-place actions, selected state, descriptions, and secondary row actions in side navigation.',
					source: `${packagePath}/examples/docs/button-menu-item.tsx`,
				},
			],
			keywords: ['navigation', 'menu-item', 'button', 'side-nav'],
			categories: ['navigation'],
		},
		{
			name: 'LinkMenuItem',
			description:
				'A side-navigation link to a real route or resource. Use ButtonMenuItem for in-place actions that do not change the current destination.',
			status: 'general-availability',
			import: {
				name: 'LinkMenuItem',
				package: '@atlaskit/side-nav-items/link-menu-item',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use for a sidebar destination and set href to its route.',
				'Set selection from the current route or item so it follows navigation, including browser back and forward.',
				'Use the description for details that help distinguish similar links, such as a project owner or recent activity.',
				'Keep secondary row actions separate from the link so they do not unexpectedly navigate.',
			],
			accessibilityGuidelines: [
				'Use descriptive link text that makes sense out of context; do not rely on an icon or tooltip to explain the destination.',
				'Give icon-only row actions accessible names and ensure hover actions are also discoverable and operable by keyboard focus.',
			],
			contentGuidelines: [
				'Name the destination with the object or section users recognize; reserve verb-led labels for actions.',
			],
			examples: [
				{
					name: 'Grouped destinations',
					description:
						'A compact side-nav composition with sections, a selected destination, and supporting context.',
					source: `${packagePath}/examples/ai/sectioned-navigation.tsx`,
				},
				{
					name: 'Destination, selection, and secondary actions',
					description:
						'Shows route links with selected state, supporting descriptions, and row-level actions.',
					source: `${packagePath}/examples/docs/link-menu-item.tsx`,
				},
			],
			keywords: ['navigation', 'menu-item', 'link', 'side-nav'],
			categories: ['navigation'],
		},
		{
			name: 'ContainerAvatar',
			description:
				'A compact, decorative image treatment for identifying a project or other object beside a side-navigation item.',
			status: 'general-availability',
			import: {
				name: 'ContainerAvatar',
				package: '@atlaskit/side-nav-items/container-avatar',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use this only for an image that helps users identify the object represented by the row; it is decorative and does not provide the row label.',
				'Prefer a consistent image style across sibling objects so the sidebar remains scannable.',
			],
			accessibilityGuidelines: [
				'Provide the object name in the adjacent menu-item text; the image is rendered with empty alt text.',
			],
			examples: [
				{
					name: 'Project identity in a navigation row',
					description:
						'Renders host-provided project icons beside labels that carry the destination names.',
					source: `${packagePath}/examples/ai/project-links.tsx`,
				},
			],
			keywords: ['avatar', 'project', 'navigation'],
			categories: ['navigation'],
		},
		{
			name: 'MenuList',
			description:
				'Groups related side-navigation items into a list, including links, actions, and expandable groups.',
			status: 'general-availability',
			import: {
				name: 'MenuList',
				package: '@atlaskit/side-nav-items/menu-list',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Keep each list scoped to one section or related set of destinations; use MenuSection and MenuSectionHeading when the hierarchy needs a visible label.',
			],
			examples: [
				{
					name: 'Compose related navigation items',
					description:
						'Groups links, an in-place action, and custom list content within a side-nav body.',
					source: `${packagePath}/examples/ai/sectioned-navigation.tsx`,
				},
			],
			keywords: ['menu', 'list', 'navigation'],
			categories: ['navigation'],
		},
		{
			name: 'MenuListItem',
			description:
				'A list-item wrapper for custom content that must participate in the side-navigation list layout.',
			status: 'general-availability',
			import: {
				name: 'MenuListItem',
				package: '@atlaskit/side-nav-items/menu-list-item',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Prefer LinkMenuItem or ButtonMenuItem for interactive rows so link and button semantics stay explicit; use this wrapper for custom list content only.',
			],
			examples: [
				{
					name: 'Custom list content',
					description: 'Shows custom status content within the side-nav list-item layout.',
					source: `${packagePath}/examples/ai/sectioned-navigation.tsx`,
				},
			],
			keywords: ['list-item', 'navigation'],
			categories: ['navigation'],
		},
		{
			name: 'MenuSection',
			description:
				'Groups related items within side navigation, optionally with a section heading.',
			status: 'general-availability',
			import: {
				name: 'MenuSection',
				package: '@atlaskit/side-nav-items/menu-section',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use sections to separate meaningful groups such as Starred and Recent; avoid headings that merely repeat the surrounding page title.',
				'Keep related destinations close together and avoid adding extra hierarchy when a flat list is easier to scan.',
			],
			contentGuidelines: [
				'Use short noun phrases for section headings so users can scan the kind of destinations in each group.',
			],
			examples: [
				{
					name: 'Workspace and shortcut groups',
					description:
						'Organizes related links under clear section headings and separates a top-level action.',
					source: `${packagePath}/examples/ai/sectioned-navigation.tsx`,
				},
			],
			keywords: ['section', 'heading', 'navigation'],
			categories: ['navigation'],
		},
		{
			name: 'MenuSectionHeading',
			description: 'Labels a group of related items inside a side-navigation section.',
			status: 'general-availability',
			import: {
				name: 'MenuSectionHeading',
				package: '@atlaskit/side-nav-items/menu-section',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use a heading when it clarifies why the following destinations belong together; omit it when the section is already self-explanatory.',
			],
			contentGuidelines: [
				'Prefer concise category names such as "Starred" or "Recent" over instructions or promotional copy.',
			],
			examples: [
				{
					name: 'Label related destinations',
					description: 'Labels related navigation rows with concise section headings.',
					source: `${packagePath}/examples/ai/sectioned-navigation.tsx`,
				},
			],
			keywords: ['heading', 'navigation'],
			categories: ['navigation'],
		},
		{
			name: 'Divider',
			description: 'A visual separator for distinct groups in a side-navigation list.',
			status: 'general-availability',
			import: {
				name: 'Divider',
				package: '@atlaskit/side-nav-items/menu-section',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use sparingly between groups that have a meaningful change in context; prefer a labeled section when users need to understand the relationship.',
			],
			accessibilityGuidelines: [
				'The divider is presentational and does not expose separator semantics; do not use it as the only cue for important grouping.',
			],
			examples: [
				{
					name: 'Separate navigation groups',
					description: 'Uses a visual rule between distinct sets of side-nav rows.',
					source: `${packagePath}/examples/ai/sectioned-navigation.tsx`,
				},
			],
			keywords: ['divider', 'separator', 'navigation'],
			categories: ['navigation'],
		},
		{
			name: 'TopLevelSpacer',
			description:
				'Adds visual spacing between top-level side-navigation items when a separation in hierarchy is needed.',
			status: 'general-availability',
			import: {
				name: 'TopLevelSpacer',
				package: '@atlaskit/side-nav-items/top-level-spacer',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use only between top-level groups; do not use repeated blank space to imply structure between items at the same level.',
			],
			examples: [
				{
					name: 'Separate top-level groups',
					description: 'Shows spacing between major side-nav groups.',
					source: `${packagePath}/examples/ai/sectioned-navigation.tsx`,
				},
			],
			keywords: ['spacer', 'navigation'],
			categories: ['navigation'],
		},
		{
			name: 'FlyoutMenuItem',
			description:
				'A side-navigation trigger that opens a flyout for a focused set of related links or controls.',
			status: 'general-availability',
			import: {
				name: 'FlyoutMenuItem',
				package: '@atlaskit/side-nav-items/flyout-menu-item',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use a flyout when a secondary set of choices should be available without expanding the main navigation hierarchy.',
				'Keep flyout content focused and provide a clear destination for the full set when the list is large.',
			],
			accessibilityGuidelines: [
				'Give the trigger a descriptive label and ensure the flyout can be opened, navigated, and dismissed with a keyboard.',
			],
			contentGuidelines: [
				'Name the trigger after the group users will find inside; avoid vague labels such as "More" when the contents can be named.',
			],
			examples: [
				{
					name: 'Recent items flyout',
					description:
						'Combines a labeled trigger with a headed list and a destination to view all recent items.',
					source: `${packagePath}/examples/ai/recent-items-flyout.tsx`,
				},
			],
			keywords: ['flyout', 'menu', 'navigation'],
			categories: ['navigation'],
		},
		{
			name: 'FlyoutMenuItemTrigger',
			description: 'The labeled trigger row that opens a side-navigation flyout.',
			status: 'general-availability',
			import: {
				name: 'FlyoutMenuItemTrigger',
				package: '@atlaskit/side-nav-items/flyout-menu-item',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: ['Name the trigger for the focused set of choices inside the flyout.'],
			accessibilityGuidelines: [
				'Use a concise, meaningful trigger name and keep the flyout operable by keyboard.',
			],
			examples: [
				{
					name: 'Open a recent-items flyout',
					description: 'Composed with the flyout header, body, and footer.',
					source: `${packagePath}/examples/ai/recent-items-flyout.tsx`,
				},
			],
			keywords: ['flyout', 'trigger'],
			categories: ['navigation'],
		},
		{
			name: 'FlyoutMenuItemContent',
			description: 'The panel content displayed when a FlyoutMenuItem is open.',
			status: 'general-availability',
			import: {
				name: 'FlyoutMenuItemContent',
				package: '@atlaskit/side-nav-items/flyout-menu-item',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Keep the panel focused on the trigger’s subject and include a full-list destination when the panel is only a shortcut.',
			],
			accessibilityGuidelines: [
				'Ensure content has a clear heading or trigger relationship and does not strand keyboard focus.',
			],
			examples: [
				{
					name: 'Compose flyout content',
					description: 'See the headed body and destination footer in a complete flyout.',
					source: `${packagePath}/examples/ai/recent-items-flyout.tsx`,
				},
			],
			keywords: ['flyout', 'content'],
			categories: ['navigation'],
		},
		{
			name: 'FlyoutHeader',
			description: 'A title and close control for a side-navigation flyout panel.',
			status: 'general-availability',
			import: {
				name: 'FlyoutHeader',
				package: '@atlaskit/side-nav-items/flyout-menu-item',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use the title to reinforce what the trigger opened; keep the close action available when the panel contains a longer task.',
			],
			accessibilityGuidelines: ['Provide an explicit accessible label for the close control.'],
			examples: [
				{
					name: 'Title and close a flyout',
					description: 'Shows a descriptive flyout title and labeled close control.',
					source: `${packagePath}/examples/ai/recent-items-flyout.tsx`,
				},
			],
			keywords: ['flyout', 'header'],
			categories: ['navigation'],
		},
		{
			name: 'FlyoutBody',
			description: 'The main content region of a side-navigation flyout.',
			status: 'general-availability',
			import: {
				name: 'FlyoutBody',
				package: '@atlaskit/side-nav-items/flyout-menu-item',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Keep the body focused and scannable; split genuinely distinct groups with section headings.',
			],
			examples: [
				{
					name: 'Group flyout destinations',
					description: 'Shows recent items grouped in the body of a flyout.',
					source: `${packagePath}/examples/ai/recent-items-flyout.tsx`,
				},
			],
			keywords: ['flyout', 'body'],
			categories: ['navigation'],
		},
		{
			name: 'FlyoutFooter',
			description: 'A supporting action region at the bottom of a side-navigation flyout.',
			status: 'general-availability',
			import: {
				name: 'FlyoutFooter',
				package: '@atlaskit/side-nav-items/flyout-menu-item',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Reserve the footer for a useful continuation such as viewing the complete collection, not another copy of a body item.',
			],
			contentGuidelines: [
				'Use a destination-specific action label such as "View all recent items".',
			],
			examples: [
				{
					name: 'Continue to the full collection',
					description: 'Adds a clear destination after the flyout’s recent-item list.',
					source: `${packagePath}/examples/ai/recent-items-flyout.tsx`,
				},
			],
			keywords: ['flyout', 'footer'],
			categories: ['navigation'],
		},
		{
			name: 'SkeletonMenuItem',
			description: 'A placeholder matching a side-navigation item while its content is loading.',
			status: 'general-availability',
			import: {
				name: 'SkeletonMenuItem',
				package: '@atlaskit/side-nav-items/skeleton',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Reserve skeletons for a short loading interval when the final navigation shape is known; replace them with real rows or an informative empty state once loading ends.',
			],
			accessibilityGuidelines: [
				'Expose loading status on the containing region and avoid announcing each placeholder as a real destination.',
			],
			examples: [
				{
					name: 'Match placeholders to expected rows',
					description:
						'Shows loading placeholders with a single region-level loading announcement.',
					source: `${packagePath}/examples/ai/navigation-loading.tsx`,
				},
			],
			keywords: ['skeleton', 'loading', 'navigation'],
			categories: ['navigation'],
		},
		{
			name: 'SkeletonMenuItemNext',
			description:
				'An alternate skeleton treatment for a side-navigation item while its content is loading.',
			status: 'general-availability',
			import: {
				name: 'SkeletonMenuItemNext',
				package: '@atlaskit/side-nav-items/skeleton',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use the same loading-state timing and replacement behavior as SkeletonMenuItem; do not leave placeholders in place after the request resolves.',
			],
			accessibilityGuidelines: [
				'Expose loading status on the containing region and avoid announcing each placeholder as a real destination.',
			],
			examples: [
				{
					name: 'Loading navigation rows',
					description: 'Demonstrates the alternate skeleton row within a labeled loading region.',
					source: `${packagePath}/examples/ai/navigation-loading.tsx`,
				},
			],
			keywords: ['skeleton', 'loading', 'navigation'],
			categories: ['navigation'],
		},
		{
			name: 'SkeletonMenuSectionHeading',
			description:
				'A placeholder for a side-navigation section heading while section content is loading.',
			status: 'general-availability',
			import: {
				name: 'SkeletonMenuSectionHeading',
				package: '@atlaskit/side-nav-items/skeleton',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use alongside loading rows only when the final navigation has a section heading; replace it with the real heading when data is ready.',
			],
			examples: [
				{
					name: 'Loading section heading',
					description: 'Shows a placeholder where a section heading will appear.',
					source: `${packagePath}/examples/ai/navigation-loading.tsx`,
				},
			],
			keywords: ['skeleton', 'heading', 'loading'],
			categories: ['navigation'],
		},
		{
			name: 'DragHandle',
			description: 'The visual grip used to indicate that a side-navigation item can be reordered.',
			status: 'general-availability',
			import: {
				name: 'DragHandle',
				package: '@atlaskit/side-nav-items/drag-and-drop/drag-handle',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use on a row configured for dragging. The handle does not make the row draggable itself.',
			],
			accessibilityGuidelines: [
				'Provide a keyboard-accessible reorder path in addition to pointer dragging; the decorative grip is not an instruction or accessible name.',
			],
			examples: [
				{
					name: 'Sortable navigation visual pieces',
					description:
						'Shows the handle alongside the host-integrated drag preview and drop indicators.',
					source: `${packagePath}/examples/ai/drag-and-drop-visuals.tsx`,
				},
			],
			keywords: ['drag', 'reorder', 'handle'],
			categories: ['navigation'],
		},
		{
			name: 'DragPreview',
			description: 'A compact preview of a side-navigation row while it is being dragged.',
			status: 'general-availability',
			import: {
				name: 'DragPreview',
				package: '@atlaskit/side-nav-items/drag-and-drop/drag-preview',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Render while dragging a row. Include its label and the icon or avatar needed to identify it.',
				'Use the pointer offset expected by the Pragmatic drag and drop integration.',
			],
			accessibilityGuidelines: [
				'Keep the draggable item’s accessible name available independently of the visual preview.',
			],
			examples: [
				{
					name: 'Preview a dragged row',
					description: 'Shows a compact row preview alongside reorder feedback visuals.',
					source: `${packagePath}/examples/ai/drag-and-drop-visuals.tsx`,
				},
			],
			keywords: ['drag', 'preview'],
			categories: ['navigation'],
		},
		{
			name: 'DropIndicator',
			description: 'An insertion marker showing where a navigation row will be reordered.',
			status: 'general-availability',
			import: {
				name: 'DropIndicator',
				package: '@atlaskit/side-nav-items/drag-and-drop/drop-indicator',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Set from the active drop target so it shows the actual insertion position and only appears for allowed drops.',
			],
			accessibilityGuidelines: [
				'Communicate the proposed reorder and blocked state through the host drag-and-drop interaction; do not rely on the visual marker alone.',
			],
			examples: [
				{
					name: 'Show a reorder insertion point',
					description:
						'Shows a vertical before-item marker; the host must supply the live drop instruction.',
					source: `${packagePath}/examples/ai/drag-and-drop-visuals.tsx`,
				},
			],
			keywords: ['drag', 'drop', 'reorder'],
			categories: ['navigation'],
		},
		{
			name: 'GroupDropIndicator',
			description: 'A visual highlight for a navigation group while it is an active drop target.',
			status: 'general-availability',
			import: {
				name: 'GroupDropIndicator',
				package: '@atlaskit/side-nav-items/drag-and-drop/group-drop-indicator',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Set the active state from the current drop target. Allow grouping only when that destination accepts the dragged item.',
			],
			accessibilityGuidelines: [
				'Expose the target and operation through the host drag-and-drop announcements, including non-pointer operation.',
			],
			examples: [
				{
					name: 'Highlight a valid group target',
					description: 'Shows the active group treatment with a group-specific drop affordance.',
					source: `${packagePath}/examples/ai/drag-and-drop-visuals.tsx`,
				},
			],
			keywords: ['drag', 'drop', 'group'],
			categories: ['navigation'],
		},
	],
};

export default documentation;

/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Structured content components from design-system *.docs.tsx files
 *
 * @codegen <<SignedSource::18b8254ef184bd32e1ba88b25bbce029>>
 * @codegenCommand yarn workspace @af/ads-ai-tooling codegen:structured-docs-components
 */
/* eslint-disable @repo/internal/react/boolean-prop-naming-convention -- not our types */
import type { ComponentMcpPayload } from './types';

export const components: ComponentMcpPayload[] = [
	{
		name: 'Avatar',
		package: '@atlaskit/avatar',
		description:
			'A component for displaying user avatars with support for images, initials, and status indicators.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for user or entity (repo, space). Circle = person; hexagon = agent/AI; square = project/repo/space',
			'Use presence for availability; status for approval/permission states',
			'Use consistent sizing within the same context',
			'Place avatars in logical groupings (e.g., team members)',
			'Use presence indicators sparingly for real-time status only',
			'Provide fallback initials when images fail to load',
			'Always provide meaningful names for accessibility',
			'Use the `name` prop to include alternative text for screen readers',
			'For decorative images, remove the `name` prop or leave it empty so it will be ignored by assistive technologies',
			"Don't use a tooltip with an avatar when it's non-interactive or disabled. The tooltip won't work for keyboard users and screen readers",
		],
		contentGuidelines: [
			'Use full names when possible for better recognition',
			'For companies/projects, use descriptive names',
			"Avoid generic terms like 'User' or 'Admin'",
			'Use consistent naming conventions across your app',
			'Keep names concise but meaningful',
		],
		keywords: ['avatar', 'user', 'profile', 'image', 'presence', 'status', 'representation'],
		category: 'images',
		examples: [
			'import Avatar from \'@atlaskit/avatar\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<Avatar src="https://example.com/avatar.jpg" name="John Doe" />\n\t\t<Avatar name="Jane Smith" appearance="hexagon" size="large" status="locked" />\n\t\t<Avatar\n\t\t\tname="Bob Wilson"\n\t\t\tappearance="square"\n\t\t\tsize="small"\n\t\t\tpresence="online"\n\t\t\tstatus="approved"\n\t\t/>\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'appearance',
				type: '"circle" | "square" | "hexagon"',
				description:
					"Indicates the shape of the avatar. Most avatars are circular, but square avatars\ncan be used for 'container' objects.",
			},
			{
				name: 'aria-controls',
				type: 'string',
				description:
					'Identifies the popup element that the avatar controls.\nUsed when Avatar is a trigger for a popup.',
			},
			{
				name: 'aria-expanded',
				type: 'boolean',
				description:
					'Announces to assistive technology whether the controlled popup is currently open or closed.',
			},
			{
				name: 'aria-haspopup',
				type: 'boolean | "dialog"',
				description:
					'Informs assistive technology that this element triggers a popup.\nWhen set, Avatar will render as a `<button>` element even without `onClick`.',
			},
			{
				name: 'as',
				type: 'keyof global.JSX.IntrinsicElements | ComponentType<AllHTMLAttributes<HTMLElement>>',
				description:
					'Replace the wrapping element. This accepts the name of a html tag which will\nbe used to wrap the element.',
			},
			{
				name: 'borderColor',
				type: 'string',
				description:
					'Used to override the default border color around the avatar body.\nAccepts any color argument that the border-color CSS property accepts.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Supply a custom avatar component instead of the default.',
			},
			{
				name: 'href',
				type: 'string',
				description: 'Provides a url for avatars being used as a link.',
			},
			{
				name: 'imgLoading',
				type: '"lazy" | "eager"',
				description: 'Defines the loading behaviour of the avatar image. Default value is eager.',
			},
			{
				name: 'isDecorative',
				type: 'boolean',
				description: 'whether disable aria-labelledby for avatar img',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Change the style to indicate the avatar is disabled.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Used to provide custom content to screen readers.\nStatus or presence is not added to the label by default if it passed as nodes.\nIf status or presence is passed as a string, the default content format is "John Smith (online)".',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Provides alt text for the avatar image.',
			},
			{
				name: 'onClick',
				type: '(event: MouseEvent<Element, globalThis.MouseEvent>, analyticsEvent?: UIAnalyticsEvent) => void',
				description: 'Handler to be called on click.',
			},
			{
				name: 'presence',
				type: 'Presence | Omit<ReactNode, string> | (string & {})',
				description:
					"Indicates a user's online status by showing a small icon on the avatar.\nRefer to presence values on the presence component.\nAlternatively accepts any React element. For best results, it is recommended to\nuse square content with height and width of 100%.",
			},
			{
				name: 'size',
				type: '"small" | "xsmall" | "medium" | "large" | "xlarge" | "xxlarge"',
				description:
					"Defines the size of the avatar. Default value is `medium`.\n\nThis can also be controlled by the `size` property of the\n`AvatarContext` export from this package. If no prop is given when the\n`size` is set via this context, the context's value will be used.",
			},
			{
				name: 'src',
				type: 'string',
				description: 'A url to load an image from (this can also be a base64 encoded image).',
			},
			{
				name: 'stackIndex',
				type: 'number',
				description: 'The index of where this avatar is in the group `stack`.',
			},
			{
				name: 'status',
				type: 'Omit<ReactNode, string> | (string & {}) | Status',
				description:
					'Indicates contextual information by showing a small icon on the avatar.\nRefer to status values on the Status component.',
			},
			{
				name: 'tabIndex',
				type: 'number',
				description: 'Assign specific tabIndex order to the underlying node.',
			},
			{
				name: 'target',
				type: '"_blank" | "_self" | "_top" | "_parent"',
				description: 'Pass target down to the anchor, if href is provided.',
			},
		],
	},
	{
		name: 'AvatarGroup',
		package: '@atlaskit/avatar-group',
		description:
			'A component for displaying multiple avatars in a group with overlap and overflow handling.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for displaying multiple users or team members',
			'Consider overflow behavior for large groups',
			'Use appropriate sizing for context',
			'Provide clear user identification',
		],
		contentGuidelines: [
			'Use meaningful names for users',
			'Consider group context and purpose',
			'Provide clear overflow indicators',
			'Use consistent naming patterns',
		],
		accessibilityGuidelines: [
			'Provide clear labels for avatar groups',
			'Use appropriate overflow handling',
			'Ensure keyboard navigation support',
			'Provide clear user identification',
		],
		keywords: ['avatar', 'group', 'multiple', 'users', 'team', 'overlap'],
		category: 'data-display',
		examples: [
			"import AvatarGroup from '@atlaskit/avatar-group';\nconst Example = (): React.JSX.Element => (\n\t<AvatarGroup\n\t\tappearance=\"stack\"\n\t\tsize=\"large\"\n\t\tonAvatarClick={console.log}\n\t\tdata={[\n\t\t\t{ key: 'uid1', name: 'Bob Smith' },\n\t\t\t{ key: 'uid2', name: 'Design System Team', appearance: 'square' },\n\t\t\t{ key: 'uid3', name: 'Review Agent', appearance: 'hexagon' },\n\t\t\t{ key: 'uid4', name: 'Carol Davis' },\n\t\t]}\n\t\tmaxCount={3}\n\t/>\n);\nexport default Example;",
		],
		props: [
			{
				name: 'appearance',
				type: '"grid" | "stack"',
				description:
					'Indicates the layout of the avatar group.\nAvatars will either be overlapped in a stack, or\nlaid out in an even grid formation.\nDefaults to "stack".',
				defaultValue: '"stack"',
			},
			{
				name: 'avatar',
				type: 'React.ForwardRefExoticComponent<AvatarPropTypes & React.RefAttributes<HTMLElement>> | React.ElementType<AvatarProps, keyof React.JSX.IntrinsicElements>',
				description: 'Component used to render each avatar.',
				defaultValue: 'Avatar',
			},
			{
				name: 'borderColor',
				type: 'string',
				description:
					'Typically the background color that the avatar is presented on.\nAccepts any color argument that the CSS border-color property accepts.',
			},
			{
				name: 'boundariesElement',
				type: '"viewport" | "window" | "scrollParent"',
				description: 'Element the overflow popup should be attached to.\nDefaults to "viewport".',
			},
			{
				name: 'data',
				type: '(AvatarPropTypes & { name: string; key?: string | number; })[]',
				description:
					"An array of avatar prop data, that are spread onto each `avatar` component.\n\nFor further usage information on AvatarPropTypes, the supported props for `avatar`, refer to [Avatar's prop documentation](https://atlassian.design/components/avatar/code).",
				isRequired: true,
			},
			{
				name: 'isTooltipDisabled',
				type: 'boolean',
				description: 'Disables tooltips.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Text to be used as aria-label for the list of avatars.\nScreen reader announcement with default label, which is `avatar group`, is `list, avatar group, X items`.\n\nThe label should describe the `AvatarGroup`\'s entities, for instance:\n- `label="team members"`, screen reader announcement would be `list team members, X items`\n- `label="reviewers"` screen reader announcement would be `list reviewers, X items`\n\nWhen there are several AvatarGroups on the page you should use a unique label to let users distinguish different lists.',
				defaultValue: '"avatar group"',
			},
			{
				name: 'maxCount',
				type: 'number',
				description:
					'The maximum number of avatars allowed in the list.\nDefaults to 5 when displayed as a stack,\nand 11 when displayed as a grid.',
			},
			{
				name: 'moreIndicatorAppearance',
				type: '"circle" | "square" | "hexagon"',
				description:
					"Indicates the shape of the more indicator. Most more indicators are circular, but square more indicators\ncan be used for 'container' objects.",
			},
			{
				name: 'moreIndicatorLabel',
				type: 'string',
				description:
					'Text to be used as aria-label for the more indicator.\nIf provided, this will be used exactly as-is for the aria-label.\nIf not provided, but an `aria-label` is provided via `showMoreButtonProps`, that will be used instead.\nIf neither is provided, the aria-label will default to "N more people" where N is the number of people that are not visible (e.g. "5 more people").',
			},
			{
				name: 'onAvatarClick',
				type: '(event: React.MouseEvent<Element, MouseEvent>, analyticsEvent: AnalyticsEvent, index: number) => void',
				description:
					'Handle the click event on the avatar item.\nNote that if an onClick prop is provided as part of avatar data, it will take precedence over onAvatarClick.',
			},
			{
				name: 'onMoreClick',
				type: '(event: React.MouseEvent<Element, MouseEvent>) => void',
				description:
					'Take control of the click event on the more indicator.\nThis will cancel the default dropdown behavior.',
			},
			{
				name: 'overrides',
				type: 'AvatarGroupOverrides',
				description: 'Custom overrides for the composed components.',
			},
			{
				name: 'shouldPopupRenderToParent',
				type: 'boolean',
				description: "Determines whether the 'show more' popup has `shouldRenderToParent` applied.",
				defaultValue: 'false',
			},
			{
				name: 'showMoreButtonProps',
				type: '{ defaultChecked?: boolean; defaultValue?: string | number | readonly string[]; suppressContentEditableWarning?: boolean; suppressHydrationWarning?: boolean; accessKey?: string; autoCapitalize?: (string & {}) | ... 5 more ... | "characters"; ... 257 more ...; onTransitionEndCapture?: React.TransitionEventHandler<......',
				description:
					'Provide additional props to the MoreButton.\nExample use cases: altering tab order by providing tabIndex;\nadding onClick behaviour without losing the default dropdown',
				defaultValue: '{}',
			},
			{
				name: 'size',
				type: '"small" | "medium" | "large" | "xlarge" | "xxlarge"',
				description:
					'Defines the size of the avatar.\nDefaults to "medium".\n\nNote: The "xsmall" size that exists on Avatar is not supported here because elements such as the more indicator cannot be displayed in an accessible manner at that size.',
				defaultValue: '"medium"',
			},
			{
				name: 'tooltipPosition',
				type: '"top" | "bottom"',
				description:
					'Where the tooltip should appear relative to its target.\nDefaults to tooltip position "bottom".',
				defaultValue: '"bottom"',
			},
		],
	},
	{
		name: 'Badge',
		package: '@atlaskit/badge',
		description:
			'A badge is a visual indicator for numeric values such as tallies and scores, providing quick visual feedback.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for displaying counts, scores, or status indicators for a single item or label',
			'Use with one item/label only to avoid ambiguity',
			'Keep badge content concise and meaningful',
			'Use appropriate appearance variants for different contexts',
			'Position badges near relevant content',
			'Consider maximum value display limits',
			'Add a tooltip when the badge has an icon or needs extra context.',
			'Use Lozenge for non-numeric status; use Tag for labels',
		],
		contentGuidelines: [
			'Use clear, concise numeric or text values',
			'Ensure values are meaningful to users',
			'Use consistent formatting across similar badges',
			'Consider localization for number formatting (locale-aware numbers)',
		],
		accessibilityGuidelines: [
			'Ensure badge content is announced by screen readers',
			'Do not rely on color alone for positive/negative meaning',
			'Use appropriate color contrast for text readability',
			'Provide meaningful context for numeric values',
			'Consider alternative text for non-numeric badges',
		],
		keywords: ['badge', 'indicator', 'numeric', 'tally', 'score', 'count', 'status'],
		category: 'status-indicators',
		examples: [
			'import Badge from \'@atlaskit/badge\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<Badge appearance="primary">5</Badge>\n\t\t<Badge appearance="important" max={99}>\n\t\t\t150\n\t\t</Badge>\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'appearance',
				type: '"added" | "default" | "important" | "primary" | "primaryInverted" | "removed" | "warning" | "discovery" | "danger" | "neutral" | "success" | "information" | "inverse"',
				description: 'Affects the visual style of the badge.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'The value displayed within the badge. A `ReactNode` can be provided for\ncustom-formatted numbers, however, badge should only be used in cases where you want to represent\na number.\nUse a [lozenge](/packages/design-system/lozenge) for non-numeric information.',
			},
			{
				name: 'max',
				type: 'number | false',
				description:
					'The maximum value to display. Defaults to `99`. If the value is 100, and max is 50, "50+" will be displayed.\nThis value should be greater than 0. If set to `false` the original value will be displayed regardless of\nwhether it is larger than the default maximum value.',
			},
		],
	},
	{
		name: 'Banner',
		package: '@atlaskit/banner',
		description:
			'A banner displays a prominent message at the top of the screen to communicate important information to users.',
		status: 'general-availability',
		usageGuidelines: [
			'Use only for critical messaging: loss of data/functionality or important site-wide information',
			'Show one banner at a time and push content down',
			'Place at the top of the screen for maximum visibility',
			'Keep messaging concise and actionable',
			'Consider dismissibility for non-critical messages',
			'Use Flag for confirmations or minimal interaction; use Inline message when action is required',
		],
		contentGuidelines: [
			'Use "we" not "you" in error messages',
			'Write clear, concise, scannable messages',
			'Include follow-up actions where relevant',
			'Use action-oriented language when appropriate',
			'Ensure messages are relevant to the current context',
		],
		accessibilityGuidelines: [
			'Do not rely on color alone for severity; provide accessible label for warning/error icons',
			'Alert role is a live region and very noisy—use only when the message is very important',
			'Keep content concise to avoid truncation (truncation is not accessible)',
			'Use appropriate color contrast for text readability',
			'Provide clear, actionable messaging',
			'Consider keyboard navigation for interactive banners',
		],
		keywords: ['banner', 'message', 'notification', 'alert', 'prominent', 'top', 'screen'],
		category: 'messaging',
		examples: [
			"import Banner from '@atlaskit/banner';\nimport { cssMap } from '@atlaskit/css';\nimport WarningIcon from '@atlaskit/icon/core/status-warning';\nimport Box from '@atlaskit/primitives/box';\nimport { Flex } from '@atlaskit/primitives/compiled';\nimport { token } from '@atlaskit/tokens';\nconst iconSpacingStyles = cssMap({\n\tspace050: {\n\t\tpaddingBlock: token('space.050'),\n\t\tpaddingInline: token('space.050'),\n\t},\n});\nexport default (): React.JSX.Element => (\n\t<Box>\n\t\t<Banner\n\t\t\ticon={\n\t\t\t\t<Flex xcss={iconSpacingStyles.space050}>\n\t\t\t\t\t<WarningIcon label=\"Warning\" />\n\t\t\t\t</Flex>\n\t\t\t}\n\t\t\ttestId=\"basicTestId\"\n\t\t>\n\t\t\tYour license is about to expire. Please renew your license within the next week.\n\t\t</Banner>\n\t</Box>\n);",
		],
		props: [
			{
				name: 'appearance',
				type: '"warning" | "error" | "announcement"',
				description: 'Visual style to be used for the banner',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'Content to be shown next to the icon. Typically text content but can contain links.',
			},
			{
				name: 'icon',
				type: 'ReactElement<any, string | JSXElementConstructor<any>>',
				description:
					'Icon to be shown left of the main content. Typically an Atlaskit [@atlaskit/icon](packages/design-system/icon)',
			},
		],
	},
	{
		name: 'Blanket',
		package: '@atlaskit/blanket',
		description:
			'A component for creating overlay backgrounds behind modals and other layered content.',
		status: 'general-availability',
		usageGuidelines: [
			'Use behind modals and overlays',
			'Consider click-to-dismiss behavior',
			'Use appropriate tinting for context',
			'Ensure proper z-index layering',
		],
		contentGuidelines: [
			'Use consistently across similar overlay contexts',
			'Consider visual hierarchy with overlays',
			'Ensure appropriate contrast with content',
		],
		accessibilityGuidelines: [
			"Ensure blanket doesn't interfere with focus management",
			'Provide appropriate click handling for dismissal',
			'Consider screen reader experience with overlays',
		],
		keywords: ['blanket', 'overlay', 'backdrop', 'modal', 'layer'],
		category: 'overlay',
		examples: [
			"import Blanket from '@atlaskit/blanket';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<Blanket />\n\t\t<Blanket isTinted onBlanketClicked={() => console.log('Blanket clicked')} />\n\t</>\n);\nexport default Examples;",
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'The children to be rendered within the blanket.',
			},
			{
				name: 'isTinted',
				type: 'boolean',
				description: 'Sets whether the blanket has a tinted background color.',
			},
			{
				name: 'onBlanketClicked',
				type: '(event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
				description: 'Handler function to be called when the blanket is clicked.',
			},
			{
				name: 'shouldAllowClickThrough',
				type: 'boolean',
				description:
					'Whether mouse events can pass through the blanket. If `true`, `onBlanketClicked` will not be called.',
			},
		],
	},
	{
		name: 'Breadcrumbs',
		package: '@atlaskit/breadcrumbs',
		description: 'A navigation component showing the current page hierarchy.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for orientation; supplement main nav, do not replace it',
			'Hierarchy from top to current; each item is a link',
			'Place top left, above page title; use when user lands from external or on large/hierarchical sites',
			'Do not overwhelm; in-app avoid topmost level unless sidebar is collapsed',
		],
		contentGuidelines: [
			'Use page or section titles for items',
			'Keep labels concise but meaningful',
			'Use consistent naming conventions',
		],
		accessibilityGuidelines: [
			'Ensure separator contrast; separators are not announced to screen readers',
			'Collapsed state = single item (e.g. "Show more breadcrumbs")',
			'Use isNavigation={false} when breadcrumbs are not main nav (e.g. search results) to reduce assistive tech noise',
			'Provide clear navigation labels',
			'Use appropriate ARIA landmarks',
			'Ensure keyboard navigation support',
			'Provide clear path context',
		],
		keywords: ['breadcrumbs', 'navigation', 'hierarchy', 'path', 'location'],
		category: 'navigation',
		examples: [
			'import Breadcrumbs, { BreadcrumbsItem } from \'@atlaskit/breadcrumbs\';\nconst Example = (): React.JSX.Element => (\n\t<Breadcrumbs maxItems={3}>\n\t\t<BreadcrumbsItem href="/" text="Home" />\n\t\t<BreadcrumbsItem href="/category" text="Category" />\n\t\t<BreadcrumbsItem href="/category/products" text="Products" />\n\t\t<BreadcrumbsItem text="Current Page" />\n\t</Breadcrumbs>\n);\nexport default Example;',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'The items to be included inside the Breadcrumbs wrapper.',
			},
			{
				name: 'defaultExpanded',
				type: 'boolean',
			},
			{
				name: 'ellipsisLabel',
				type: 'string',
				description: 'Text to be used as an accessible label for the ellipsis button.',
			},
			{
				name: 'isExpanded',
				type: 'boolean',
				description:
					'Override collapsing of the nav when there are more than the maximum number of items.',
			},
			{
				name: 'itemsAfterCollapse',
				type: 'number',
				description: 'If max items is exceeded, the number of items to show after the ellipsis.',
			},
			{
				name: 'itemsBeforeCollapse',
				type: 'number',
				description: 'If max items is exceeded, the number of items to show before the ellipsis.',
			},
			{
				name: 'label',
				type: 'string',
				description: 'Text to be used as label of navigation region that wraps the breadcrumbs.',
			},
			{
				name: 'maxItems',
				type: 'number',
				description:
					'Set the maximum number of breadcrumbs to display. When there are more\nthan the maximum number, only the first and last will be shown, with an\nellipsis in between.',
			},
			{
				name: 'onExpand',
				type: '(event: MouseEvent<Element, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
				description:
					'A function to be called when you are in the collapsed view and click the ellipsis.',
			},
		],
	},
	{
		name: 'BreadcrumbsItem',
		package: '@atlaskit/breadcrumbs',
		description:
			'An individual breadcrumb item within the breadcrumb trail. Each item can be a link (with href) or plain text for the current page.',
		status: 'general-availability',
		usageGuidelines: [
			'Use within Breadcrumbs wrapper to define each step in the hierarchy',
			'Use href for navigable items; omit href for the current page',
			'Support iconBefore and iconAfter for contextual indicators',
			'Use truncationWidth when items may be long to prevent overflow',
		],
		contentGuidelines: [
			'Use page or section titles for the text prop',
			'Keep labels concise but meaningful',
			'Use consistent naming conventions across the breadcrumb trail',
		],
		accessibilityGuidelines: [
			'Provide meaningful text for screen readers',
			'Ensure link targets are descriptive',
		],
		keywords: ['breadcrumbs', 'item', 'navigation', 'link', 'hierarchy'],
		category: 'navigation',
		examples: [
			'import Breadcrumbs, { BreadcrumbsItem } from \'@atlaskit/breadcrumbs\';\nconst BreadcrumbsDefaultExample = (): React.JSX.Element => {\n\treturn (\n\t\t<Breadcrumbs>\n\t\t\t<BreadcrumbsItem href="/item" text="Item 1" />\n\t\t\t<BreadcrumbsItem href="/item" text="Item 2" />\n\t\t\t<BreadcrumbsItem href="/item" text="Item 3" />\n\t\t\t<BreadcrumbsItem href="/item" text="Item 4" />\n\t\t\t<BreadcrumbsItem href="/item" text="Item 5" />\n\t\t\t<BreadcrumbsItem href="/item" text="Item 6" />\n\t\t\t<BreadcrumbsItem href="/item" text="Item 7" />\n\t\t\t<BreadcrumbsItem href="/item" text="Item 8" />\n\t\t</Breadcrumbs>\n\t);\n};\nexport default BreadcrumbsDefaultExample;',
		],
		props: [
			{
				name: 'href',
				type: 'string',
				description: 'The url or path which the breadcrumb should act as a link to.',
			},
			{
				name: 'iconAfter',
				type: 'string | number | ReactElement<any, string | JSXElementConstructor<any>>',
				description: 'An icon to display after the breadcrumb.',
			},
			{
				name: 'iconBefore',
				type: 'string | number | ReactElement<any, string | JSXElementConstructor<any>>',
				description: 'An icon to display before the breadcrumb.',
			},
			{
				name: 'onClick',
				type: '(event: MouseEvent<Element, globalThis.MouseEvent>) => void',
				description: 'Handler to be called on click. *',
			},
			{
				name: 'onTooltipShown',
				type: '() => void',
				description: "A function to be called when a truncated breadcrumb item's tooltip is shown.",
			},
			{
				name: 'target',
				type: '"" | "_blank" | "_parent" | "_self" | "_top"',
			},
			{
				name: 'text',
				type: 'string',
				description: 'The text to appear within the breadcrumb as a link.',
				isRequired: true,
			},
			{
				name: 'truncationWidth',
				type: 'number',
				description:
					'The maximum width in pixels that an item can have before it is truncated.\nIf this is not set, truncation will only occur when it cannot fit alone on a\nline. If there is no truncationWidth, tooltips are not provided on truncation.',
			},
		],
	},
	{
		name: 'ButtonGroup',
		package: '@atlaskit/button',
		description:
			'A component for grouping related buttons together with consistent spacing and alignment.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for related actions that belong together',
			'Group buttons that perform similar or complementary actions',
			'Maintain consistent spacing and alignment',
			'Consider the visual hierarchy within the group',
			"Don't group unrelated actions together",
			'Use when you have multiple related actions that should be visually grouped',
			'Provides consistent spacing and alignment between buttons',
		],
		contentGuidelines: [
			'Ensure button labels are consistent in tone and style',
			'Use parallel structure for related actions',
			'Keep labels concise but descriptive',
			'Consider the order of actions within the group',
		],
		keywords: ['button', 'group', 'container', 'layout', 'spacing'],
		category: 'form',
		examples: [
			'import { ButtonGroup } from \'@atlaskit/button\';\nimport Button from \'@atlaskit/button/new\';\nconst _default_1: React.JSX.Element[] = [\n\t<ButtonGroup titleId="heading-options">\n\t\t<Button appearance="primary">Save</Button>\n\t\t<Button appearance="danger">Delete</Button>\n\t\t<Button appearance="subtle">Cancel</Button>\n\t</ButtonGroup>,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'The buttons to render inside the button group.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Refers to an `aria-label` attribute. Sets an accessible name for the button group wrapper to announce it to users of assistive technology.\nUsage of either this, or the `titleId` attribute is strongly recommended.',
			},
			{
				name: 'titleId',
				type: 'string',
				description:
					"ID referenced by the button group wrapper's `aria-labelledby` attribute. This ID should be assigned to the group-button title element.\nUsage of either this, or the `label` attribute is strongly recommended.",
			},
		],
	},
	{
		name: 'Button',
		package: '@atlaskit/button',
		description:
			'A versatile button component with multiple appearances and states for triggering actions. A button triggers an event or action. They let users know what will happen next. Note the root entrypoint of `@atlaskit/button` is deprecated and being replaced with `@atlaskit/button/new`.',
		status: 'general-availability',
		usageGuidelines: [
			'Use primary buttons for the main action on a page',
			'Limit to one primary button per section',
			'Use compact size for tight spaces',
			'Use subtle buttons for secondary actions',
			'Use danger buttons sparingly for destructive actions',
			'Group related buttons together with ButtonGroup',
			'Use buttons for actions; use links for navigation (different semantics and assistive tech behavior)',
		],
		contentGuidelines: [
			'Use action verbs that describe the interaction',
			'Keep text concise (1-3 words ideal)',
			'Avoid generic terms like "Submit" or "Click here"',
			'Use sentence case',
			'Keep button labels consistent with surrounding UI (e.g. modal primary button should reflect modal intent)',
			'Use buttons for actions, links for navigation',
			'Only include one primary call to action (CTA) per area',
			"Start with the verb and specify what's being acted on",
			"Don't use punctuation in button labels",
		],
		accessibilityGuidelines: [
			'Always provide meaningful labels for screen readers',
			'Provide loading state announcements for async actions',
		],
		keywords: ['button', 'action', 'click', 'submit', 'form', 'interactive', 'cta'],
		category: 'form',
		examples: [
			'import Button from \'@atlaskit/button/new\';\nexport default function ButtonDisabledExample(): React.JSX.Element {\n\treturn (\n\t\t<Button appearance="primary" isDisabled>\n\t\t\tDisabled button\n\t\t</Button>\n\t);\n}',
			'import Button from \'@atlaskit/button/new\';\nexport default function ButtonDangerExample(): React.JSX.Element {\n\treturn <Button appearance="danger">Danger button</Button>;\n}',
			"import Button from '@atlaskit/button/new';\nimport StarIcon from '@atlaskit/icon/core/star-starred';\nexport default function ButtonIconAfterExample(): React.JSX.Element {\n\treturn (\n\t\t<Button iconAfter={StarIcon} appearance=\"primary\">\n\t\t\tIcon after\n\t\t</Button>\n\t);\n}",
		],
		props: [
			{
				name: 'appearance',
				type: '"default" | "danger" | "primary" | "subtle" | "warning" | "discovery"',
				description: 'The button style variation.',
			},
			{
				name: 'autoFocus',
				type: 'boolean',
				description: 'Set the button to autofocus on mount.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Text content to be rendered in the button.',
				isRequired: true,
			},
			{
				name: 'iconAfter',
				type: 'ComponentClass<Omit<IconProps, "size"> | Omit<NewIconProps, "spacing" | "size">, any> | FunctionComponent<Omit<IconProps, "size"> | Omit<...>>',
				description: "Places an icon within the button, after the button's text.",
			},
			{
				name: 'iconBefore',
				type: 'ComponentClass<Omit<IconProps, "size"> | Omit<NewIconProps, "spacing" | "size">, any> | FunctionComponent<Omit<IconProps, "size"> | Omit<...>>',
				description: "Places an icon within the button, before the button's text.",
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Disable the button to prevent user interaction.',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description: 'Conditionally show a spinner over the top of a button',
			},
			{
				name: 'isSelected',
				type: 'boolean',
				description: 'Indicates that the button is selected.',
			},
			{
				name: 'onBlur',
				type: '(event: FocusEvent<HTMLButtonElement, Element>) => void',
				description: 'Handler called on blur.',
			},
			{
				name: 'onClick',
				type: '(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
				description:
					'Handler called on click. You can use the second argument to fire Atlaskit analytics events on custom channels. They could then be routed to GASv3 analytics. See the pressable or anchor primitive code examples for information on [firing Atlaskit analytics events](https://atlassian.design/components/primitives/pressable/examples#atlaskit-analytics) or [routing these to GASv3 analytics](https://atlassian.design/components/primitives/pressable/examples#gasv3-analytics).',
			},
			{
				name: 'onFocus',
				type: '(event: FocusEvent<HTMLButtonElement, Element>) => void',
				description: 'Handler called on focus.',
			},
			{
				name: 'shouldFitContainer',
				type: 'boolean',
				description: 'Option to fit button width to its parent width.',
			},
			{
				name: 'spacing',
				type: '"compact" | "default"',
				description: 'Controls the amount of padding in the button.',
			},
		],
	},
	{
		name: 'IconButton',
		package: '@atlaskit/button',
		description:
			'A button that displays only an icon with an optional tooltip. Perfect for toolbar actions, compact interfaces, and when space is limited.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for toolbar actions and compact interfaces',
			'Choose icons that clearly represent their function',
			'Group related icon buttons together',
			'Use sparingly to avoid visual clutter',
			'Consider using tooltips for additional context',
			'Always provide a meaningful label for accessibility',
			'The icon should clearly represent the action it performs',
		],
		contentGuidelines: [
			'Use clear, concise, descriptive labels',
			'Use action verbs (e.g., "Edit item", "Delete comment")',
			'Choose icons that are universally understood',
			'Avoid using icons without labels in critical actions',
		],
		keywords: ['button', 'icon', 'action', 'click', 'interactive', 'toolbar'],
		category: 'form',
		examples: [
			'import { IconButton } from \'@atlaskit/button/new\';\nimport AddIcon from \'@atlaskit/icon/core/add\';\nimport DeleteIcon from \'@atlaskit/icon/core/delete\';\nimport InfoIcon from \'@atlaskit/icon/core/status-information\';\nconst _default_1: React.JSX.Element[] = [\n\t<IconButton icon={AddIcon} label="Add new item" appearance="primary" />,\n\t<IconButton icon={InfoIcon} label="Show information" appearance="subtle" spacing="compact" />,\n\t<IconButton icon={DeleteIcon} label="Delete permanently" appearance="discovery" shape="circle" />,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'appearance',
				type: '"default" | "primary" | "discovery" | "subtle"',
				description: 'The button style variation.\nThe button style variation.',
			},
			{
				name: 'autoFocus',
				type: 'boolean',
				description: 'Set the button to autofocus on mount.',
			},
			{
				name: 'icon',
				type: 'ComponentClass<Omit<IconProps, "size"> | Omit<NewIconProps, "spacing" | "size">, any> | FunctionComponent<Omit<IconProps, "size"> | Omit<...>>',
				description: 'Places an icon within the button.',
				isRequired: true,
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Disable the button to prevent user interaction.',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description: 'Conditionally show a spinner over the top of a button',
			},
			{
				name: 'isSelected',
				type: 'boolean',
				description: 'Indicates that the button is selected.',
			},
			{
				name: 'isTooltipDisabled',
				type: 'boolean',
				description:
					'Prevents a tooltip with the label text from showing. Use sparingly, as most icon-only buttons benefit from a tooltip or some other text clarifying the action.',
			},
			{
				name: 'label',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Provide an accessible label, often used by screen readers.',
				isRequired: true,
			},
			{
				name: 'onBlur',
				type: '(event: FocusEvent<HTMLButtonElement, Element>) => void',
				description: 'Handler called on blur.',
			},
			{
				name: 'onClick',
				type: '(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
				description:
					'Handler called on click. You can use the second argument to fire Atlaskit analytics events on custom channels. They could then be routed to GASv3 analytics. See the pressable or anchor primitive code examples for information on [firing Atlaskit analytics events](https://atlassian.design/components/primitives/pressable/examples#atlaskit-analytics) or [routing these to GASv3 analytics](https://atlassian.design/components/primitives/pressable/examples#gasv3-analytics).',
			},
			{
				name: 'onFocus',
				type: '(event: FocusEvent<HTMLButtonElement, Element>) => void',
				description: 'Handler called on focus.',
			},
			{
				name: 'shape',
				type: '"default" | "circle"',
				description: 'Set the shape of the icon, defaults to square with rounded corners.',
			},
			{
				name: 'spacing',
				type: '"default" | "compact"',
				description: 'Controls the amount of padding in the button.',
			},
			{
				name: 'tooltip',
				type: '{ testId?: string; analyticsContext?: Record<string, any>; content?: ReactNode | (({ update }: { update?: () => void; }) => ReactNode); component?: ComponentType<TooltipPrimitiveProps> | ForwardRefExoticComponent<...>; ... 15 more ...; UNSAFE_shouldRenderToParent?: boolean; }',
				description: 'Props passed down to the Tooltip component.',
			},
		],
	},
	{
		name: 'Calendar',
		package: '@atlaskit/calendar',
		description:
			"A calendar component for date selection and display. This component is in Beta phase, meaning it's stable at version 1.0+ but may receive improvements based on customer feedback.",
		status: 'general-availability',
		usageGuidelines: [
			'Use for date selection interfaces',
			'Consider date range limitations',
			'Provide clear visual feedback for selected dates',
			'Handle disabled dates appropriately',
		],
		contentGuidelines: [
			'Use clear date formatting',
			'Provide helpful date labels',
			'Use consistent date terminology',
			'Consider localization for date display (e.g. locale prop, month/day names, first day of week)',
		],
		accessibilityGuidelines: [
			'Provide clear date selection feedback',
			'Ensure keyboard navigation between dates',
			'Use appropriate ARIA labels for dates',
			'Support screen reader announcements for date changes',
		],
		keywords: ['calendar', 'date', 'picker', 'selection', 'month', 'year', 'beta'],
		category: 'form',
		examples: [
			"import Calendar from '@atlaskit/calendar';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<Calendar\n\t\t\tselected={['2024-03-15']}\n\t\t\tonChange={(dates) => console.log('Selected dates:', dates)}\n\t\t/>\n\t\t<Calendar\n\t\t\tselected={['2024-03-20', '2024-03-21', '2024-03-22']}\n\t\t\tonChange={(dates) => console.log('Multiple dates:', dates)}\n\t\t\tdefaultMonth={3}\n\t\t\tdefaultYear={2024}\n\t\t/>\n\t\t<Calendar\n\t\t\tselected={[]}\n\t\t\tdisabled={['2024-03-10', '2024-03-11']}\n\t\t\tminDate=\"2024-03-01\"\n\t\t\tmaxDate=\"2024-03-31\"\n\t\t\tonChange={(dates) => console.log('Constrained dates:', dates)}\n\t\t/>\n\t</>\n);\nexport default Examples;",
		],
		props: [
			{
				name: 'day',
				type: 'number',
				description:
					'The number of the day currently focused. Places border around the date. Enter `0` to highlight no date.',
			},
			{
				name: 'defaultDay',
				type: 'number',
				description: 'Sets the default value for `day`.',
			},
			{
				name: 'defaultMonth',
				type: 'number',
				description: 'Sets the default value for `month`.',
			},
			{
				name: 'defaultPreviouslySelected',
				type: 'string[]',
				description: 'Sets the default value for `previouslySelected`.',
			},
			{
				name: 'defaultSelected',
				type: 'string[]',
				description: 'Sets the default value for `selected`.',
			},
			{
				name: 'defaultYear',
				type: 'number',
				description: 'Sets the default value for `year`.',
			},
			{
				name: 'disabled',
				type: 'string[]',
				description:
					"Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates provided are greyed out and not selectable.",
			},
			{
				name: 'disabledDateFilter',
				type: '(date: string) => boolean',
				description:
					"A filter function that takes a date string in the format 'YYYY-MM-DD' and returns true if that date should be disabled.",
			},
			{
				name: 'locale',
				type: 'string',
				description:
					'BCP 47 language tag (e.g. `ja-JP`) that ensures dates are in the official format for the locale.',
			},
			{
				name: 'maxDate',
				type: 'string',
				description:
					'The latest enabled date. All dates in the future after this date will be disabled.',
			},
			{
				name: 'minDate',
				type: 'string',
				description:
					'The earliest enabled date. All dates in the past before this date will be disabled.',
			},
			{
				name: 'month',
				type: 'number',
				description: 'The number of the month (from 1 to 12) which the calendar should be on.',
			},
			{
				name: 'nextMonthLabel',
				type: 'string',
				description:
					'The aria-label attribute associated with the next month arrow, to describe it to assistive technology.',
			},
			{
				name: 'onBlur',
				type: '(event: FocusEvent<Element, Element>) => void',
				description: 'Function which is called when the calendar is no longer focused.',
			},
			{
				name: 'onChange',
				type: '(event: ChangeEvent, analyticsEvent: UIAnalyticsEvent) => void',
				description:
					"Called when the calendar is navigated. This can be triggered by the keyboard, or by clicking the navigational buttons.\nThe 'interface' property indicates the the direction the calendar was navigated whereas the 'iso' property is a string of the format YYYY-MM-DD.",
			},
			{
				name: 'onFocus',
				type: '(event: FocusEvent<Element, Element>) => void',
				description:
					'Called when the calendar receives focus. This could be called from a mouse event on the container, or by tabbing into it.',
			},
			{
				name: 'onSelect',
				type: '(event: SelectEvent, analyticsEvent: UIAnalyticsEvent) => void',
				description:
					"Function called when a day is clicked on. Calls with an object that has\na day, month and year property as numbers, representing the date just clicked.\nIt also has an 'iso' property, which is a string of the selected date in the\nformat YYYY-MM-DD.",
			},
			{
				name: 'previouslySelected',
				type: 'string[]',
				description:
					"Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates\nprovided are given a background color.",
			},
			{
				name: 'previousMonthLabel',
				type: 'string',
				description:
					'The aria-label attribute associated with the previous month arrow, to describe it to assistive technology.',
			},
			{
				name: 'selected',
				type: 'string[]',
				description:
					"Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates\nprovided are given a background color.",
			},
			{
				name: 'shouldSetFocusOnCurrentDay',
				type: 'boolean',
				description:
					'This allows the calendar to automatically set the focus to the current day.\nThe default is false.',
			},
			{
				name: 'tabIndex',
				type: '0 | -1',
				description:
					'Indicates if the calendar can be focused by keyboard or only\nprogrammatically. Defaults to "0".',
			},
			{
				name: 'today',
				type: 'string',
				description: "Value of current day, as a string in the format 'YYYY-MM-DD'.",
			},
			{
				name: 'weekStartDay',
				type: '0 | 1 | 2 | 3 | 4 | 5 | 6',
				description:
					'Start day of the week for the calendar. The mapping between numbers and days of the week is as follows:\n- `0` Sunday (default value)\n- `1` Monday\n- `2` Tuesday\n- `3` Wednesday\n- `4` Thursday\n- `5` Friday\n- `6` Saturday',
			},
			{
				name: 'year',
				type: 'number',
				description: 'Year to display the calendar for.',
			},
		],
	},
	{
		name: 'Checkbox',
		package: '@atlaskit/checkbox',
		description:
			'A checkbox is an input control that allows a user to select one or more options from a number of choices.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for multiple choice selections from a list, or for explicit confirmation (e.g. settings)',
			'Use indeterminate state when some but not all children in a group are selected',
			'Group related checkboxes logically',
			'Provide clear labels for each option',
			'Consider default states carefully',
			'Use Radio for single selection; Dropdown for compact single choice; Toggle for on/off',
		],
		contentGuidelines: [
			'Write short, descriptive labels; no punctuation after labels',
			'Use consistent language across related options',
			'Avoid negative phrasing when possible',
			'Group related options together',
		],
		accessibilityGuidelines: [
			'Include error messages for required or invalid checkbox state',
			'Do not use disabled if the control must stay in tab order; use validation and error message so screen reader users hear why and how to proceed',
			'Ensure proper labeling for all checkboxes',
			'Use clear, descriptive labels that explain the choice',
			'Provide keyboard navigation support',
			'Indicate required fields clearly',
			'Use appropriate error states and messaging',
		],
		keywords: ['checkbox', 'input', 'form', 'selection', 'choice', 'option', 'multiple'],
		category: 'forms-and-input',
		examples: [
			'import Checkbox from \'@atlaskit/checkbox\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<Checkbox label="Basic checkbox" />\n\t\t<Checkbox label="Checked checkbox" isChecked />\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'defaultChecked',
				type: 'boolean',
				description: 'Sets whether the checkbox begins as checked or unchecked.',
			},
			{
				name: 'id',
				type: 'string',
				description: 'The ID assigned to the input.',
			},
			{
				name: 'isChecked',
				type: 'boolean',
				description: 'Sets whether the checkbox is checked or unchecked.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					'Sets whether the checkbox is disabled. Don’t use a disabled checkbox if it needs to remain in the tab order for assistive technologies.',
			},
			{
				name: 'isIndeterminate',
				type: 'boolean',
				description:
					'Sets whether the checkbox is indeterminate. This only affects the\nstyle and does not modify the isChecked property.',
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description: 'Marks the field as invalid. Changes style of unchecked component.',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'Marks the field as required & changes the label style.',
			},
			{
				name: 'label',
				type: 'string | number | ReactElement<any, string | JSXElementConstructor<any>>',
				description:
					'The label to be displayed to the right of the checkbox. The label is part\nof the clickable element to select the checkbox.',
			},
			{
				name: 'name',
				type: 'string',
				description: 'The name of the submitted field in a checkbox.',
			},
			{
				name: 'onChange',
				type: '(e: ChangeEvent<HTMLInputElement>, analyticsEvent: UIAnalyticsEvent) => void',
				description:
					'Function that is called whenever the state of the checkbox changes. It will\nbe called with an object containing the react synthetic event. Use `currentTarget` to get value, name and checked.',
			},
			{
				name: 'value',
				type: 'string | number',
				description:
					'The value to be used in the checkbox input. This is the value that will be returned on form submission.',
			},
			{
				name: 'xcss',
				type: 'false | (XCSSValue<"alignItems", DesignTokenStyles, ""> & {} & XCSSPseudo<"alignItems", never, never, DesignTokenStyles> & XCSSMediaQuery<...> & { ...; } & { ...; })',
				description:
					'Bounded style API. Defining allowed styles through this prop will be supported for future component\niterations. Any styles that are not allowed by this API will result in type and land blocking violations.',
			},
		],
	},
	{
		name: 'Code',
		package: '@atlaskit/code',
		description: 'Use for short code snippets inline with body text.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for short, inline code snippets with body text',
			'Default styling is overridable',
			'Consider code block vs inline code',
		],
		contentGuidelines: [
			'Use clear, readable code examples',
			'Keep code snippets concise',
			'Use meaningful variable names in examples',
		],
		accessibilityGuidelines: [
			'When overriding styles, ensure contrast ratio ≥ 4.5:1 for text readability',
			'Ensure code content is announced properly by screen readers',
			'Consider code context and meaning',
		],
		keywords: ['code', 'snippet', 'inline', 'syntax', 'programming'],
		category: 'data-display',
		examples: [
			"import { Code } from '@atlaskit/code';\nconst _default_1: React.JSX.Element[] = [<Code>{`<Code />`}</Code>];\nexport default _default_1;",
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Content to be rendered in the inline code block.',
			},
			{
				name: 'codeBidiWarningLabel',
				type: 'string',
				description:
					'Label for the bidi warning tooltip.\n\nDefaults to `Bidirectional characters change the order that text is rendered.\nThis could be used to obscure malicious code.`',
			},
			{
				name: 'hasBidiWarnings',
				type: 'boolean',
				description:
					'When set to `false`, disables code decorating with bidi warnings. Defaults to `true`.',
			},
			{
				name: 'isBidiWarningTooltipEnabled',
				type: 'boolean',
				description:
					'Sets whether to render tooltip with the warning or not. Intended to be\ndisabled when used in a mobile view, such as in the editor via mobile\nbridge, where the tooltip could end up being cut off or otherwise not work\nas expected. Defaults to `true`.',
			},
		],
	},
	{
		name: 'CodeBlock',
		package: '@atlaskit/code',
		description: 'A component for displaying multi-line code blocks with syntax highlighting.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for multi-line code examples',
			'Specify appropriate language for syntax highlighting',
			'Consider code block sizing and scrolling',
			'Use for code snippets that need formatting',
		],
		contentGuidelines: [
			'Use clear, readable code examples',
			'Consider code formatting and indentation',
			'Use meaningful variable names in examples',
			'Keep code blocks focused and relevant',
		],
		accessibilityGuidelines: [
			'Ensure code blocks are announced properly by screen readers',
			'Use appropriate contrast for code readability',
			'Consider code context and meaning',
			'Provide proper language identification',
		],
		keywords: ['code', 'block', 'syntax', 'highlighting', 'multiline'],
		category: 'data-display',
		examples: [
			'import { CodeBlock } from \'@atlaskit/code\';\nconst exampleCodeBlock = `export default ({ name }: { name: string }) => <div>Hello {name}</div>;`;\nconst _default_1: React.JSX.Element[] = [\n\t<CodeBlock highlight="15" language="tsx" text={exampleCodeBlock} />,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'codeBidiWarningLabel',
				type: 'string',
				description: 'Label for the bidi warning tooltip.',
				defaultValue:
					"'Bidirectional characters change the order that text is rendered. This could be used to obscure malicious code.'",
			},
			{
				name: 'firstLineNumber',
				type: 'number',
				description: 'Sets the number of the first line, if showLineNumbers is set to true.',
				defaultValue: '1',
			},
			{
				name: 'hasBidiWarnings',
				type: 'boolean',
				description: 'When set to `false`, disables code decorating with bidi warnings.',
				defaultValue: 'true',
			},
			{
				name: 'highlight',
				type: 'string',
				description:
					'Comma delimited lines to highlight.\n\nExample uses:\n- To highlight one line `highlight="3"`\n- To highlight a group of lines `highlight="1-5"`\n- To highlight multiple groups `highlight="1-5,7,10,15-20"`',
			},
			{
				name: 'highlightedEndText',
				type: 'string',
				description: 'Screen reader text for the end of a highlighted line.',
			},
			{
				name: 'highlightedStartText',
				type: 'string',
				description: 'Screen reader text for the start of a highlighted line.',
			},
			{
				name: 'isBidiWarningTooltipEnabled',
				type: 'boolean',
				description:
					'Sets whether to render tooltip with the warning or not.\nIntended to be disabled when used in a mobile view, such as in the editor via mobile bridge,\nwhere the tooltip could end up being cut off or otherwise not work as expected.',
				defaultValue: 'true',
			},
			{
				name: 'label',
				type: 'string',
				description:
					"Text used to describe that the content of the code block is scrollable.\nSet only if the code block is scrollable. Defaults to 'Scrollable content'.",
			},
			{
				name: 'language',
				type: '"PHP" | "php" | "php3" | "php4" | "php5" | "Java" | "java" | "CSharp" | "csharp" | "c#" | "Python" | "python" | "py" | "JavaScript" | "javascript" | "js" | "Html" | "html" | "xml" | ... 234 more ... | "markdown"',
				description:
					'Language reference designed to be populated from `SUPPORTED_LANGUAGES` in\n`design-system/code`. Run against language grammars from PrismJS (full list\navailable at [PrismJS documentation](https://prismjs.com/#supported-languages)).\n\nWhen set to "text" will not perform highlighting. If unsupported language\nprovided - code will be treated as "text" with no highlighting.',
				defaultValue: "'text'",
			},
			{
				name: 'shouldShowLineNumbers',
				type: 'boolean',
				description: 'Sets whether to display code line numbers or not.',
				defaultValue: 'true',
			},
			{
				name: 'shouldWrapLongLines',
				type: 'boolean',
				description:
					'Sets whether long lines will create a horizontally scrolling container.\nWhen set to `true`, these lines will visually wrap instead.',
				defaultValue: 'false',
			},
			{
				name: 'text',
				type: 'string',
				description: 'The code to be formatted.',
				isRequired: true,
			},
		],
	},
	{
		name: 'Comment',
		package: '@atlaskit/comment',
		description: 'A component for displaying comments and discussions.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for comment threads and discussions',
			'Provide clear comment attribution',
			'Handle comment nesting appropriately',
			'Consider comment moderation features',
		],
		contentGuidelines: [
			'Use clear, constructive comment content',
			'Provide meaningful comment attribution',
			'Use appropriate comment formatting',
			'Consider comment context and purpose',
		],
		accessibilityGuidelines: [
			'Ensure proper comment structure',
			'Provide clear comment attribution',
			'Use appropriate heading hierarchy',
			'Consider screen reader navigation',
		],
		keywords: ['comment', 'discussion', 'thread', 'conversation', 'chat'],
		category: 'data-display',
		examples: [
			'import Comment from \'@atlaskit/comment\';\nconst Example = (): React.JSX.Element => (\n\t<Comment\n\t\tauthor="Bob Johnson"\n\t\ttime="30 minutes ago"\n\t\tcontent="Another comment in the thread"\n\t\tavatar="https://picsum.photos/32/32"\n\t/>\n);\nexport default Example;',
		],
		props: [
			{
				name: 'actions',
				type: 'React.ReactNode[]',
				description:
					'A list of `CommentAction` items rendered as a row of buttons below the content.',
				defaultValue: '[]',
			},
			{
				name: 'afterContent',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: "Content that is rendered after the comment's content.",
			},
			{
				name: 'author',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'A `CommentAuthor` element containing the name of the author.',
			},
			{
				name: 'avatar',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: "The element to display as the avatar. It's best to use `@atlaskit/avatar`.",
				isRequired: true,
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Provide nested comments as children.',
			},
			{
				name: 'content',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'The main content for the comment.',
			},
			{
				name: 'edited',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'A `CommentEdited` element which displays next to the time. Indicates whether the comment has been edited.',
			},
			{
				name: 'errorActions',
				type: 'React.ReactNode[]',
				description:
					'A list of `CommentAction` items rendered with a warning icon instead of the actions.',
				defaultValue: '[]',
			},
			{
				name: 'errorIconLabel',
				type: 'string',
				description: 'Text to show in the error icon label.',
				defaultValue: '""',
			},
			{
				name: 'headingLevel',
				type: '"3" | "1" | "2" | "4" | "5" | "6"',
				description:
					'Use this to set the semantic heading level of the comment. The default comment heading has an `h3` tag. Make sure that headings are in the correct order and don’t skip levels.',
				defaultValue: '"3"',
			},
			{
				name: 'highlighted',
				type: 'boolean',
				description: 'Sets whether this comment should be highlighted.',
				defaultValue: 'false',
			},
			{
				name: 'id',
				type: 'string',
				description: 'An ID to be applied to the comment.',
			},
			{
				name: 'isError',
				type: 'boolean',
				description:
					'Indicates whether the component is in an error state. Hides actions and time.',
				defaultValue: 'false',
			},
			{
				name: 'isSaving',
				type: 'boolean',
				description:
					'Enables "optimistic saving" mode which removes actions and displays text from the `savingText` prop.',
				defaultValue: 'false',
			},
			{
				name: 'restrictedTo',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'Text for the "restricted to" label. This will display in the top items, before the main content.',
				defaultValue: '""',
			},
			{
				name: 'savingText',
				type: 'string',
				description: 'Text to show when in "optimistic saving" mode.',
				defaultValue: '"Sending..."',
			},
			{
				name: 'shouldHeaderWrap',
				type: 'boolean',
				description: 'Controls if the comment header should wrap.',
			},
			{
				name: 'shouldRenderNestedCommentsInline',
				type: 'boolean',
				description:
					'Controls if nested comments are rendered at the same depth as the parent comment.',
			},
			{
				name: 'time',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'A `CommentTime` element containing the time to display.',
			},
			{
				name: 'type',
				type: 'string',
				description:
					'The type of comment. This will be rendered in a lozenge at the top of the comment, before the main content.',
			},
		],
	},
	{
		name: 'DatePicker',
		package: '@atlaskit/datetime-picker',
		description: 'A component for selecting date values with calendar support.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for date selection only',
			'Provide clear date formats',
			'Handle date validation appropriately',
			'Consider calendar button visibility',
		],
		contentGuidelines: [
			'Use clear, descriptive labels',
			'Provide helpful placeholder text',
			'Keep labels concise but descriptive',
			'Use locale prop for date format localization',
		],
		accessibilityGuidelines: [
			'Ensure proper keyboard navigation',
			'Use appropriate date formats',
			'Provide clear date labels',
			'Consider screen reader announcements',
		],
		keywords: ['date', 'picker', 'calendar', 'selection', 'form'],
		category: 'form',
		examples: [
			'import { DatePicker } from \'@atlaskit/datetime-picker\';\nimport __noop from \'@atlaskit/ds-lib/noop\';\nconst Example = (): React.JSX.Element => (\n\t<DatePicker\n\t\tclearControlLabel="Clear select date"\n\t\tonChange={__noop}\n\t\tshouldShowCalendarButton\n\t\topenCalendarLabel="open calendar"\n\t/>\n);\nexport default Example;',
		],
		props: [
			{
				name: 'aria-describedby',
				type: 'string',
				description: 'Used to associate accessible descriptions to the date picker.',
			},
			{
				name: 'autoFocus',
				type: 'boolean',
				description: 'Set the picker to autofocus on mount.',
			},
			{
				name: 'clearControlLabel',
				type: 'string',
				description:
					'Set the `aria-label` for the clear button.\nAdd the word "Clear" at the beginning of the clearControlLabel.\nFor instance, for a field to set an appointment, use "Clear appointment date and time".',
			},
			{
				name: 'dateFormat',
				type: 'string',
				description:
					"Format the date with a string that is accepted by [date-fns's format\nfunction](https://date-fns.org/v1.29.0/docs/format). **This does not affect\nhow the input is parsed.** This must be done using the `parseInputValue`\nprop.\n\nNote that though we are using `date-fns` version 2, we use [the tokens from\n`date-fns` version 1](https://date-fns.org/v1.30.1/docs/format) under the\nhood.",
			},
			{
				name: 'defaultValue',
				type: 'string',
				description: 'The default for `value`.',
			},
			{
				name: 'disabled',
				type: 'string[]',
				description:
					'An array of ISO dates that should be disabled on the calendar. This does not affect what users can type into the picker.',
			},
			{
				name: 'disabledDateFilter',
				type: '(date: string) => boolean',
				description:
					'A filter function for disabling dates on the calendar. This does not affect what users can type into the picker.\n\nThe function is called with a date string in the format `YYYY-MM-DD` and should return `true` if the date should be disabled.',
			},
			{
				name: 'formatDisplayLabel',
				type: '(value: string, dateFormat: string) => string',
				description:
					"A function for formatting the date displayed in the input. By default composes together [`date-fns`'s parse method](https://date-fns.org/v1.29.0/docs/parse) and [`date-fns`'s format method](https://date-fns.org/v1.29.0/docs/format) to return a correctly formatted date string.\n\nNote that this does not affect how the input is parsed. This must be done using the `parseInputValue` prop.",
			},
			{
				name: 'id',
				type: 'string',
				description: 'Set the id of the field.\nAssociates a `<label></label>` with the field.',
			},
			{
				name: 'inputLabel',
				type: 'string',
				description:
					'The name of the input, used when `shouldShowCalendarButton` is true. See `shouldShowCalendarButton` description for more details.',
				defaultValue: "'Date picker'",
			},
			{
				name: 'inputLabelId',
				type: 'string',
				description:
					'The ID of the label for the input, used when `shouldShowCalendarButton` is\ntrue. See `shouldShowCalendarButton` description for more details.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Set if the picker is disabled.',
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description: 'Set if the picker has an invalid value.',
			},
			{
				name: 'isOpen',
				type: 'boolean',
				description: 'Set if the picker is open.',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'Set the field as required.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Accessible name for the Date Picker Select, rendered as `aria-label`. This will override any other method of providing a label.',
			},
			{
				name: 'locale',
				type: 'string',
				description:
					'Locale used to format the date and calendar. See [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).',
			},
			{
				name: 'maxDate',
				type: 'string',
				description:
					'The latest enabled date. Dates after this are disabled on the calendar. This does not affect what users can type into the picker.',
			},
			{
				name: 'menuInnerWrapper',
				type: 'ComponentClass<{ children: ReactNode; }, any> | FunctionComponent<{ children: ReactNode; }>',
				description:
					'This overrides the inner wrapper the Calendar.\n@private Please use this with extreme caution, this API may be changed in the future.',
			},
			{
				name: 'minDate',
				type: 'string',
				description:
					'The earliest enabled date. Dates before this are disabled on the calendar. This does not affect what users can type into the picker.',
			},
			{
				name: 'name',
				type: 'string',
				description: 'The name of the field.',
			},
			{
				name: 'nextMonthLabel',
				type: 'string',
				description: 'The aria-label attribute associated with the next-month arrow.',
			},
			{
				name: 'onBlur',
				type: '(event: FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Called when the field is blurred.',
			},
			{
				name: 'onChange',
				type: '(value: string) => void',
				description:
					'Called when the value changes. The only argument is an ISO time or empty string.',
			},
			{
				name: 'onFocus',
				type: '(event: FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Called when the field is focused.',
			},
			{
				name: 'openCalendarLabel',
				type: 'string',
				description:
					'The label associated with the button to open the calendar, rendered via the\n`shouldShowCalendarButton` prop. If a `label` prop is provided, this\ncalendar button label will be prefixed by the value of `label`. If no\n`label` prop is provided, this prefix should be manually added. For\nexample,\n\n```tsx\n<label id="label" htmlFor="datepicker">Desired Appointment Date</label>\n<DatePicker\n\tid="datepicker"\n\tshouldShowCalendarButton\n\tinputLabel="Desired Appointment Date"\n\topenCalendarLabel="open calendar"\n/>\n```',
				defaultValue: "'open calendar'",
			},
			{
				name: 'parseInputValue',
				type: '(date: string, dateFormat: string) => Date',
				description:
					'A function for parsing input characters and transforming them into a Date object.\nBy default parses the date string based off the locale. Note that this does\nnot affect how the resulting value is displayed in the input. Use the\n`dateFormat` or `formatDisplayLabel` prop to handle how the value is\ndisplayed.',
			},
			{
				name: 'placeholder',
				type: 'string',
				description: 'Placeholder text displayed in input.',
			},
			{
				name: 'previousMonthLabel',
				type: 'string',
				description: 'The aria-label attribute associated with the previous-month arrow.',
			},
			{
				name: 'selectProps',
				type: 'Omit<SelectProps<OptionType, false>, "aria-label" | "aria-describedby" | "inputId" | "placeholder"> & { \'aria-describedby\'?: never; \'aria-label\'?: never; inputId?: never; placeholder?: never; } & { ...; }',
				description: '',
			},
			{
				name: 'shouldShowCalendarButton',
				type: 'boolean',
				description:
					'Provides a functional calendar button that opens the calendar picker that\nlives on the right side of the date picker.\n\nThe accessible name for this button is caculated using either the `label`,\n`inputLabel`, or `inputLabelId` props, along with the `openCalendarLabel`\nprop.',
				defaultValue: 'false',
			},
			{
				name: 'spacing',
				type: '"default" | "compact"',
				description:
					'The spacing for the select control.\n\nCompact is `gridSize() * 4`, default is `gridSize * 5`.',
			},
			{
				name: 'value',
				type: 'string',
				description: 'The ISO time used as the input value.',
			},
			{
				name: 'weekStartDay',
				type: '0 | 1 | 2 | 3 | 4 | 5 | 6',
				description:
					'Start day of the week for the calendar.\n- `0` sunday (default value)\n- `1` monday\n- `2` tuesday\n- `3` wednesday\n- `4` thursday\n- `5` friday\n- `6` saturday',
			},
		],
	},
	{
		name: 'DateTimePicker',
		package: '@atlaskit/datetime-picker',
		description: 'A component for selecting both date and time values.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for combined date and time selection',
			'Provide clear date/time formats',
			'Handle timezone considerations',
			'Consider validation requirements',
		],
		contentGuidelines: [
			'Use clear, descriptive labels',
			'Provide helpful placeholder text',
			'Use appropriate date/time formats',
			'Keep labels concise but descriptive',
			'Use locale prop for date and time format localization',
		],
		accessibilityGuidelines: [
			'Ensure proper keyboard navigation',
			'Use appropriate date/time formats',
			'Provide clear date/time labels',
			'Consider screen reader announcements',
		],
		keywords: ['datetime', 'picker', 'date', 'time', 'calendar'],
		category: 'form',
		examples: [
			"import { DateTimePicker } from '@atlaskit/datetime-picker';\nimport __noop from '@atlaskit/ds-lib/noop';\nconst Example = (): React.JSX.Element => (\n\t<DateTimePicker\n\t\tclearControlLabel=\"Clear date / time picker (editable times)\"\n\t\tdefaultValue=\"2018-01-02T14:30+10:00\"\n\t\tonChange={__noop}\n\t\ttimePickerProps={{\n\t\t\ttimeIsEditable: true,\n\t\t\tlabel: 'Time picker (editable)',\n\t\t}}\n\t\tdatePickerProps={{\n\t\t\tlabel: 'Date picker (editable times)',\n\t\t\tshouldShowCalendarButton: true,\n\t\t\topenCalendarLabel: 'open calendar',\n\t\t}}\n\t/>\n);\nexport default Example;",
		],
		props: [
			{
				name: 'aria-describedby',
				type: 'string',
				description:
					'Used to associate accessible descriptions to both the date and time\npicker. If you want to associate individual accessible descriptions, this\nshould be done through the `aria-describedby` props on the\n`datePickerProps` and `timePickerProps`.',
			},
			{
				name: 'autoFocus',
				type: 'boolean',
				description: 'Set the picker to autofocus on mount.',
			},
			{
				name: 'clearControlLabel',
				type: 'string',
				description:
					'Set the `aria-label` for the clear button.\nAdd the word "Clear" at the beginning of the clearControlLabel.\nFor instance, for a field to set an appointment, use "Clear appointment date and time".',
			},
			{
				name: 'datePickerProps',
				type: 'DatePickerBaseProps',
				description: 'Props applied to the `DatePicker`.',
			},
			{
				name: 'defaultValue',
				type: 'string',
				description: 'The default for `value`.',
			},
			{
				name: 'id',
				type: 'string',
				description: 'Set the id of the field.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Set if the field is disabled.',
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description: 'Set if the picker has an invalid value.',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'Set the field as required.',
			},
			{
				name: 'locale',
				type: 'string',
				description:
					'Locale used for formatting dates and times. See [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).',
			},
			{
				name: 'name',
				type: 'string',
				description: 'The name of the field.',
			},
			{
				name: 'onBlur',
				type: '(event: FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Called when the field is blurred.',
			},
			{
				name: 'onChange',
				type: '((value: string) => void) & ((value: string) => void)',
				description:
					'Called when the value changes and the date / time is a complete value, or empty. The only value is an ISO string or empty string.',
			},
			{
				name: 'onFocus',
				type: '(event: FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Called when the field is focused.',
			},
			{
				name: 'parseValue',
				type: '((dateTimeValue: string, date: string, time: string, timezone: string) => { dateValue: string; timeValue: string; zoneValue: string; }) & ((dateTimeValue: string, date: string, time: string, timezone: string) => { ...; })',
				description:
					'Function used to parse datetime values into their date, time and timezone sub-values. *',
			},
			{
				name: 'spacing',
				type: '"default" | "compact"',
				description:
					'The spacing for the select control.\n\nCompact is `gridSize() * 4`, default is `gridSize() * 5`.',
			},
			{
				name: 'timePickerProps',
				type: 'TimePickerBaseProps',
				description: 'Props applied to the `TimePicker`.',
			},
			{
				name: 'value',
				type: 'string',
				description: 'The ISO time that should be used as the input value.',
			},
		],
	},
	{
		name: 'TimePicker',
		package: '@atlaskit/datetime-picker',
		description: 'A component for selecting time values with clock interface.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for time selection only',
			'Provide clear time formats',
			'Handle time validation appropriately',
			'Consider editable time input',
		],
		contentGuidelines: [
			'Use clear, descriptive labels',
			'Provide helpful placeholder text',
			'Use appropriate time formats',
			'Keep labels concise but descriptive',
			'Use locale prop for time format localization (e.g. 12h vs 24h)',
		],
		accessibilityGuidelines: [
			'Ensure proper keyboard navigation',
			'Use appropriate time formats',
			'Provide clear time labels',
			'Consider screen reader announcements',
		],
		keywords: ['time', 'picker', 'clock', 'selection', 'form'],
		category: 'form',
		examples: [
			'import { TimePicker } from \'@atlaskit/datetime-picker\';\nimport __noop from \'@atlaskit/ds-lib/noop\';\nconst Example = (): React.JSX.Element => (\n\t<TimePicker\n\t\tclearControlLabel="Clear select time (editable)"\n\t\tdefaultValue="14:30"\n\t\tonChange={__noop}\n\t\ttimeFormat="HH:mm:ss A"\n\t\ttimeIsEditable\n\t\tselectProps={{\n\t\t\tclassNamePrefix: \'timepicker-select\',\n\t\t}}\n\t/>\n);\nexport default Example;',
		],
		props: [
			{
				name: 'aria-describedby',
				type: 'string',
				description: 'Used to associate accessible descriptions to the time picker.',
			},
			{
				name: 'autoFocus',
				type: 'boolean',
				description: 'Set the picker to autofocus on mount.',
			},
			{
				name: 'clearControlLabel',
				type: 'string',
				description:
					'Set the `aria-label` for the clear button.\nAdd the word "Clear" at the beginning of the clearControlLabel.\nFor instance, for a field to set an appointment, use "Clear appointment date and time".',
			},
			{
				name: 'defaultValue',
				type: 'string',
				description: 'The default for `value`.',
			},
			{
				name: 'formatDisplayLabel',
				type: '(time: string, timeFormat: string) => string',
				description:
					'A function for formatting the displayed time value in the input. By default\nparses with an internal time parser, and formats using the [date-fns format\nfunction]((https://date-fns.org/v1.29.0/docs/format)).\n\nNote that this does not affect how the input is parsed. This must be done\nusing the `parseInputValue` prop.',
			},
			{
				name: 'hideIcon',
				type: 'boolean',
				description: 'Hides icon for dropdown indicator.',
			},
			{
				name: 'id',
				type: 'string',
				description: 'Set the id of the field.\nAssociates a `<label></label>` with the field.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Set if the field is disabled.',
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description: 'Set if the picker has an invalid value.',
			},
			{
				name: 'isOpen',
				type: 'boolean',
				description: 'Set if the dropdown is open. Will be `false` if not provided.',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'Set the field as required.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Accessible name for the Time Picker Select, rendered as `aria-label`. This will override any other method of providing a label.',
			},
			{
				name: 'locale',
				type: 'string',
				description:
					'Locale used to format the time. See [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).',
			},
			{
				name: 'name',
				type: 'string',
				description: 'The name of the field.',
			},
			{
				name: 'onBlur',
				type: '(event: FocusEvent<HTMLElement, Element>) => void',
				description: 'Called when the field is blurred.',
			},
			{
				name: 'onChange',
				type: '(value: string) => void',
				description:
					'Called when the value changes. The only argument is an ISO time or empty string.',
			},
			{
				name: 'onFocus',
				type: '(event: FocusEvent<HTMLElement, Element>) => void',
				description: 'Called when the field is focused.',
			},
			{
				name: 'parseInputValue',
				type: '(time: string, timeFormat: string) => string | Date',
				description:
					'A function for parsing input characters and transforming them into either a\nstring or a Date object. By default parses the string based off the locale.\nNote that this does not affect how the resulting value is displayed in the\ninput. To handle this, use either the `timeFormat` or `formatDisplayLabel`\nprop.',
			},
			{
				name: 'placeholder',
				type: 'string',
				description: 'Placeholder text displayed in input.',
			},
			{
				name: 'selectProps',
				type: 'Omit<SelectProps<OptionType, false>, "aria-describedby" | "placeholder" | "aria-label" | "inputId"> & { \'aria-describedby\'?: never; \'aria-label\'?: never; inputId?: never; placeholder?: never; }',
			},
			{
				name: 'spacing',
				type: '"default" | "compact"',
				description:
					'The spacing for the select control.\n\nCompact is `gridSize() * 4`, default is `gridSize * 5`.',
			},
			{
				name: 'timeFormat',
				type: 'string',
				description:
					"Format the time with a string that is accepted by [date-fns's format\nfunction](https://date-fns.org/v1.29.0/docs/format). **This does not affect\nhow the input is parsed.** This must be done using the `parseInputValue`\nprop.\n\nNote that though we are using `date-fns` version 2, we use [the tokens from\n`date-fns` version 1](https://date-fns.org/v1.30.1/docs/format) under the\nhood.",
			},
			{
				name: 'timeIsEditable',
				type: 'boolean',
				description: 'Set if users can edit the input, allowing them to add custom times.',
			},
			{
				name: 'times',
				type: 'string[]',
				description: 'The times shown in the dropdown.',
			},
			{
				name: 'value',
				type: 'string',
				description: 'The ISO time that should be used as the input value.',
			},
		],
	},
	{
		name: 'DropdownItem',
		package: '@atlaskit/dropdown-menu',
		description:
			'A dropdown item populates the dropdown menu with items. Use for links or actions; every item must be inside a DropdownItemGroup. Can also be used as the trigger for a nested submenu.',
		status: 'general-availability',
		usageGuidelines: [
			'Use inside DropdownMenu with DropdownItemGroup (required parent)',
			'Use for links (href) or actions (onClick); verbs for actions, nouns for links; no articles; single line per item',
			'For a nested submenu: use as the trigger (pass triggerRef and trigger props, use elemAfter e.g. chevron); keep to maximum two layers',
		],
		contentGuidelines: [
			'Use clear, descriptive menu item labels',
			'Keep menu item text concise',
			'Use consistent terminology across menu items',
		],
		accessibilityGuidelines: [
			'Avoid truncation—ensure max width does not cut off labels',
			'Ensure keyboard navigation with arrow keys',
		],
		keywords: ['dropdown', 'menu', 'item', 'action', 'link', 'menuitem'],
		category: 'navigation',
		examples: [
			'import { IconButton } from \'@atlaskit/button/new\';\nimport DropdownMenu, { DropdownItem, DropdownItemGroup } from \'@atlaskit/dropdown-menu\';\nimport MoreIcon from \'@atlaskit/icon/core/show-more-horizontal\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<DropdownMenu\n\t\t\tshouldRenderToParent\n\t\t\ttrigger={({ triggerRef, ...props }) => (\n\t\t\t\t<IconButton ref={triggerRef} {...props} icon={MoreIcon} label="More" />\n\t\t\t)}\n\t\t>\n\t\t\t<DropdownItemGroup>\n\t\t\t\t<DropdownItem href="/dashboard">Dashboard</DropdownItem>\n\t\t\t\t<DropdownItem>Create</DropdownItem>\n\t\t\t\t<DropdownItem>Delete</DropdownItem>\n\t\t\t</DropdownItemGroup>\n\t\t</DropdownMenu>\n\t\t<DropdownMenu shouldRenderToParent trigger="Actions">\n\t\t\t<DropdownItemGroup>\n\t\t\t\t<DropdownItem>Export</DropdownItem>\n\t\t\t\t<DropdownItem>Share</DropdownItem>\n\t\t\t</DropdownItemGroup>\n\t\t</DropdownMenu>\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'aria-haspopup',
				type: 'boolean | "dialog"',
				description:
					'An optional boolean value used to indicate if the dropdown item has popup or not.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Primary content for the item.',
				isRequired: true,
			},
			{
				name: 'component',
				type: 'ComponentClass<PropsWithChildren<CustomItemComponentProps>, any> | FunctionComponent<PropsWithChildren<CustomItemComponentProps>>',
				description:
					'Custom component to render as an item.\nShould be wrapped in `forwardRef` to avoid accessibility issues when controlling keyboard focus.',
			},
			{
				name: 'description',
				type: 'string | global.JSX.Element',
				description:
					'Description of the item.\nThis will render smaller text below the primary text of the item as well as slightly increasing the height of the item.',
			},
			{
				name: 'elemAfter',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'Element to render after the item text.\nGenerally should be an [icon](https://atlaskit.atlassian.com/packages/design-system/icon) component.',
			},
			{
				name: 'elemBefore',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'Element to render before the item text.\nGenerally should be an [icon](https://atlaskit.atlassian.com/packages/design-system/icon) component.',
			},
			{
				name: 'href',
				type: 'string',
				description: 'Link to another page.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					"Makes the element appear disabled. This will remove interactivity and the item won't appear in the focus order.",
			},
			{
				name: 'isSelected',
				type: 'boolean',
				description: 'Makes the element appear selected.',
			},
			{
				name: 'onClick',
				type: '(e: MouseEvent<Element, globalThis.MouseEvent> | KeyboardEvent<Element>) => void',
				description: 'Event that is triggered when the element is clicked.',
			},
			{
				name: 'rel',
				type: 'string',
				description:
					'The relationship of the linked URL as space-separated link types.\nGenerally you\'ll want to set this to "noopener noreferrer" when `target` is "_blank".',
			},
			{
				name: 'returnFocusRef',
				type: 'RefObject<HTMLElement>',
				description:
					'If ref is passed, focus returns to that specific ref element after dropdown item clicked.',
			},
			{
				name: 'role',
				type: 'string',
				description:
					'An optional string value that specifies the role of the dropdown item.\nUse this to indicate whether the item is\nor presentational (e.g., \'presentation\') for accessibility purposes.\nIf not specified, it defaults to role="menuitem".',
			},
			{
				name: 'shouldDescriptionWrap',
				type: 'boolean',
				description:
					'When `true` the description of the item will wrap multiple lines if it exceeds the width of the dropdown menu.',
			},
			{
				name: 'shouldTitleWrap',
				type: 'boolean',
				description:
					'When `true` the title of the item will wrap multiple lines if it exceeds the width of the dropdown menu.',
			},
			{
				name: 'target',
				type: 'string',
				description:
					'Where to display the linked URL,\nsee [anchor information](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) on mdn for more information.',
			},
			{
				name: 'title',
				type: 'string',
				description: 'Adds a title attribute to the root item element.',
			},
		],
	},
	{
		name: 'DropdownItemCheckbox',
		package: '@atlaskit/dropdown-menu',
		description:
			'A dropdown menu item with checkbox selection. Use for multiple selection from a list (e.g. status filters, show/hide toggles).',
		status: 'general-availability',
		usageGuidelines: [
			'Use with DropdownItemCheckboxGroup; control selection with isSelected and onClick',
			'Use for multiple selection from a list or toggles (e.g. categories, column visibility)',
			'Group related checkboxes; use short uppercase title on DropdownItemCheckboxGroup',
		],
		contentGuidelines: ['Use clear, descriptive labels', 'Keep menu item text concise'],
		accessibilityGuidelines: [
			'Ensure keyboard navigation and clear selection state',
			'Use appropriate ARIA attributes',
		],
		keywords: ['dropdown', 'menu', 'checkbox', 'multi-select', 'toggle'],
		category: 'navigation',
		examples: [
			'import { IconButton } from \'@atlaskit/button/new\';\nimport DropdownMenu, { DropdownItem, DropdownItemGroup } from \'@atlaskit/dropdown-menu\';\nimport MoreIcon from \'@atlaskit/icon/core/show-more-horizontal\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<DropdownMenu\n\t\t\tshouldRenderToParent\n\t\t\ttrigger={({ triggerRef, ...props }) => (\n\t\t\t\t<IconButton ref={triggerRef} {...props} icon={MoreIcon} label="More" />\n\t\t\t)}\n\t\t>\n\t\t\t<DropdownItemGroup>\n\t\t\t\t<DropdownItem href="/dashboard">Dashboard</DropdownItem>\n\t\t\t\t<DropdownItem>Create</DropdownItem>\n\t\t\t\t<DropdownItem>Delete</DropdownItem>\n\t\t\t</DropdownItemGroup>\n\t\t</DropdownMenu>\n\t\t<DropdownMenu shouldRenderToParent trigger="Actions">\n\t\t\t<DropdownItemGroup>\n\t\t\t\t<DropdownItem>Export</DropdownItem>\n\t\t\t\t<DropdownItem>Share</DropdownItem>\n\t\t\t</DropdownItemGroup>\n\t\t</DropdownMenu>\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Primary content for the item.',
				isRequired: true,
			},
			{
				name: 'defaultSelected',
				type: 'boolean',
				description: 'Sets whether the checkbox begins selected.',
			},
			{
				name: 'description',
				type: 'string | JSX.Element',
				description:
					'Description of the item.\nThis will render smaller text below the primary text of the item as well as slightly increasing the height of the item.',
			},
			{
				name: 'id',
				type: 'string',
				description: 'Unique id of a checkbox.',
				isRequired: true,
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Makes the checkbox appear disabled as well as removing interactivity.',
			},
			{
				name: 'isSelected',
				type: 'boolean',
				description: 'Sets whether the checkbox is checked or unchecked.',
			},
			{
				name: 'onClick',
				type: '(e: React.MouseEvent<Element, globalThis.MouseEvent> | React.KeyboardEvent<Element>) => void',
				description: 'Event that is triggered when the checkbox is clicked.',
			},
			{
				name: 'shouldDescriptionWrap',
				type: 'boolean',
				description:
					"When `true` the description of the item will wrap multiple lines if it's long enough.",
				defaultValue: 'true',
			},
			{
				name: 'shouldTitleWrap',
				type: 'boolean',
				description:
					"When `true` the title of the item will wrap multiple lines if it's long enough.",
				defaultValue: 'true',
			},
			{
				name: 'title',
				type: 'string',
				description: 'Adds a title attribute to the root item element.',
			},
		],
	},
	{
		name: 'DropdownItemCheckboxGroup',
		package: '@atlaskit/dropdown-menu',
		description:
			'Groups DropdownItemCheckbox components for multi-select options within a dropdown menu.',
		status: 'general-availability',
		usageGuidelines: [
			'Use to group related DropdownItemCheckbox items',
			'Use for multiple selection from a list',
		],
		contentGuidelines: ['Group related checkboxes logically', 'Use consistent terminology'],
		keywords: ['dropdown', 'menu', 'checkbox', 'group', 'multi-select'],
		category: 'navigation',
		examples: [
			"import React, { useState } from 'react';\nimport DropdownMenu, {\n\tDropdownItemCheckbox,\n\tDropdownItemCheckboxGroup,\n} from '@atlaskit/dropdown-menu';\nconst DropdownItemCheckboxExample = (): React.JSX.Element => {\n\tconst [checked, setChecked] = useState<Record<string, boolean>>({\n\t\ttodo: true,\n\t});\n\tconst toggle = (name: string) => {\n\t\tsetChecked((prev) => ({\n\t\t\t...prev,\n\t\t\t[name]: !prev[name],\n\t\t}));\n\t};\n\treturn (\n\t\t<DropdownMenu trigger=\"Status\" shouldRenderToParent>\n\t\t\t<DropdownItemCheckboxGroup title=\"Categories\" id=\"actions\">\n\t\t\t\t<DropdownItemCheckbox id=\"todo\" onClick={() => toggle('todo')} isSelected={checked['todo']}>\n\t\t\t\t\tTo do\n\t\t\t\t</DropdownItemCheckbox>\n\t\t\t\t<DropdownItemCheckbox\n\t\t\t\t\tid=\"inprogress\"\n\t\t\t\t\tonClick={() => toggle('inprogress')}\n\t\t\t\t\tisSelected={checked['inprogress']}\n\t\t\t\t>\n\t\t\t\t\tIn progress\n\t\t\t\t</DropdownItemCheckbox>\n\t\t\t\t<DropdownItemCheckbox id=\"done\" onClick={() => toggle('done')} isSelected={checked['done']}>\n\t\t\t\t\tDone\n\t\t\t\t</DropdownItemCheckbox>\n\t\t\t</DropdownItemCheckboxGroup>\n\t\t</DropdownMenu>\n\t);\n};\nexport default DropdownItemCheckboxExample;",
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'Children of the section.\nThis should generally be `Item` or `Heading` components,\nbut can also be [`EmptyState`](https://atlaskit.atlassian.com/packages/design-system/empty-state)s if you want to render errors.',
				isRequired: true,
			},
			{
				name: 'hasSeparator',
				type: 'boolean',
				description: 'Use this to render a border at the top of the section.',
			},
			{
				name: 'id',
				type: 'string',
				description: 'Unique identifier for the checkbox group.',
				isRequired: true,
			},
			{
				name: 'isList',
				type: 'boolean',
				description:
					'If your menu contains a list, use this to add `<ul>` and `<li>` tags around the items. This is essential for offering better, accessible semantic markup in a list of items.',
			},
			{
				name: 'isScrollable',
				type: 'boolean',
				description:
					"Enables scrolling within the section.\nThis won't work unless `maxHeight` is set on the parent `MenuGroup` component.",
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Provide an accessible label for the section via `aria-label` for assistive technology.',
			},
			{
				name: 'title',
				type: 'string',
				description:
					"The text passed into the internal `HeadingItem`. If a title isn't provided,\nthe `HeadingItem` won't be rendered, and this component will act as a regular `Section`.",
			},
			{
				name: 'titleId',
				type: 'string',
				description:
					"ID referenced by the menu group wrapper's `aria-labelledby` attribute. This ID should be assigned to the group title element.\nUsage of either this, or the `label` attribute is strongly recommended.",
			},
		],
	},
	{
		name: 'DropdownItemGroup',
		package: '@atlaskit/dropdown-menu',
		description:
			'Wrapping element for dropdown menu items. Use to group related items; optional short uppercase title (e.g. "Edit page", "Tools") separates sections.',
		status: 'general-availability',
		usageGuidelines: [
			'Use inside DropdownMenu to group related items',
			'Use short, uppercase title to describe the group',
			'Nested menu: maximum two layers',
		],
		contentGuidelines: [
			'Group related actions logically',
			'Use consistent terminology across menu items',
		],
		accessibilityGuidelines: ['Provide clear group titles', 'Nested menu: maximum two layers'],
		keywords: ['dropdown', 'menu', 'group', 'section', 'title'],
		category: 'navigation',
		examples: [
			'import { IconButton } from \'@atlaskit/button/new\';\nimport DropdownMenu, { DropdownItem, DropdownItemGroup } from \'@atlaskit/dropdown-menu\';\nimport MoreIcon from \'@atlaskit/icon/core/show-more-horizontal\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<DropdownMenu\n\t\t\tshouldRenderToParent\n\t\t\ttrigger={({ triggerRef, ...props }) => (\n\t\t\t\t<IconButton ref={triggerRef} {...props} icon={MoreIcon} label="More" />\n\t\t\t)}\n\t\t>\n\t\t\t<DropdownItemGroup>\n\t\t\t\t<DropdownItem href="/dashboard">Dashboard</DropdownItem>\n\t\t\t\t<DropdownItem>Create</DropdownItem>\n\t\t\t\t<DropdownItem>Delete</DropdownItem>\n\t\t\t</DropdownItemGroup>\n\t\t</DropdownMenu>\n\t\t<DropdownMenu shouldRenderToParent trigger="Actions">\n\t\t\t<DropdownItemGroup>\n\t\t\t\t<DropdownItem>Export</DropdownItem>\n\t\t\t\t<DropdownItem>Share</DropdownItem>\n\t\t\t</DropdownItemGroup>\n\t\t</DropdownMenu>\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'Children of the section.\nThis should generally be `Item` or `Heading` components,\nbut can also be [`EmptyState`](https://atlaskit.atlassian.com/packages/design-system/empty-state)s if you want to render errors.',
				isRequired: true,
			},
			{
				name: 'hasSeparator',
				type: 'boolean',
				description: 'Use this to render a border at the top of the section.',
			},
			{
				name: 'id',
				type: 'string',
				description: 'Unique identifier for the element.',
			},
			{
				name: 'isList',
				type: 'boolean',
				description:
					'If your menu contains a list, use this to add `<ul>` and `<li>` tags around the items. This is essential for offering better, accessible semantic markup in a list of items.',
			},
			{
				name: 'isScrollable',
				type: 'boolean',
				description:
					"Enables scrolling within the section.\nThis won't work unless `maxHeight` is set on the parent `MenuGroup` component.",
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Provide an accessible label for the section via `aria-label` for assistive technology.',
			},
			{
				name: 'title',
				type: 'string',
				description:
					"The text passed into the internal `HeadingItem`. If a title isn't provided,\nthe `HeadingItem` won't be rendered, and this component will act as a regular `Section`.",
			},
			{
				name: 'titleId',
				type: 'string',
				description:
					"ID referenced by the menu group wrapper's `aria-labelledby` attribute. This ID should be assigned to the group title element.\nUsage of either this, or the `label` attribute is strongly recommended.",
			},
		],
	},
	{
		name: 'DropdownItemRadio',
		package: '@atlaskit/dropdown-menu',
		description:
			'A dropdown menu item with radio selection. Use for single selection from a short list (e.g. view mode, sort order).',
		status: 'general-availability',
		usageGuidelines: [
			'Use with DropdownItemRadioGroup; control selection with isSelected and onClick',
			'Use for single selection from a short list (e.g. views, density)',
			'Group related radio items; use short uppercase title on DropdownItemRadioGroup',
		],
		contentGuidelines: ['Use clear, descriptive labels', 'Keep menu item text concise'],
		accessibilityGuidelines: [
			'Ensure keyboard navigation and clear selection state',
			'Use appropriate ARIA attributes',
		],
		keywords: ['dropdown', 'menu', 'radio', 'single-select', 'choice'],
		category: 'navigation',
		examples: [
			'import { IconButton } from \'@atlaskit/button/new\';\nimport DropdownMenu, { DropdownItem, DropdownItemGroup } from \'@atlaskit/dropdown-menu\';\nimport MoreIcon from \'@atlaskit/icon/core/show-more-horizontal\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<DropdownMenu\n\t\t\tshouldRenderToParent\n\t\t\ttrigger={({ triggerRef, ...props }) => (\n\t\t\t\t<IconButton ref={triggerRef} {...props} icon={MoreIcon} label="More" />\n\t\t\t)}\n\t\t>\n\t\t\t<DropdownItemGroup>\n\t\t\t\t<DropdownItem href="/dashboard">Dashboard</DropdownItem>\n\t\t\t\t<DropdownItem>Create</DropdownItem>\n\t\t\t\t<DropdownItem>Delete</DropdownItem>\n\t\t\t</DropdownItemGroup>\n\t\t</DropdownMenu>\n\t\t<DropdownMenu shouldRenderToParent trigger="Actions">\n\t\t\t<DropdownItemGroup>\n\t\t\t\t<DropdownItem>Export</DropdownItem>\n\t\t\t\t<DropdownItem>Share</DropdownItem>\n\t\t\t</DropdownItemGroup>\n\t\t</DropdownMenu>\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Primary content for the item.',
				isRequired: true,
			},
			{
				name: 'defaultSelected',
				type: 'boolean',
				description: 'Sets whether the checkbox begins selected.',
			},
			{
				name: 'description',
				type: 'string | JSX.Element',
				description:
					'Description of the item.\nThis will render smaller text below the primary text of the item as well as slightly increasing the height of the item.',
			},
			{
				name: 'id',
				type: 'string',
				description: 'Unique ID of the checkbox.',
				isRequired: true,
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Makes the checkbox appear disabled as well as removing interactivity.',
			},
			{
				name: 'isSelected',
				type: 'boolean',
				description: 'Sets whether the checkbox is checked or unchecked.',
			},
			{
				name: 'onClick',
				type: '(e: React.MouseEvent<Element, globalThis.MouseEvent> | React.KeyboardEvent<Element>) => void',
				description: 'Event that is triggered when the checkbox is clicked.',
			},
			{
				name: 'shouldDescriptionWrap',
				type: 'boolean',
				description:
					"When `true` the description of the item will wrap multiple lines if it's long enough.",
				defaultValue: 'true',
			},
			{
				name: 'shouldTitleWrap',
				type: 'boolean',
				description:
					"When `true` the title of the item will wrap multiple lines if it's long enough.",
				defaultValue: 'true',
			},
			{
				name: 'title',
				type: 'string',
				description: 'Adds a title attribute to the root item element.',
			},
		],
	},
	{
		name: 'DropdownItemRadioGroup',
		package: '@atlaskit/dropdown-menu',
		description:
			'Groups DropdownItemRadio components for single-select options within a dropdown menu.',
		status: 'general-availability',
		usageGuidelines: [
			'Use to group related DropdownItemRadio items',
			'Use for single selection from a short list',
		],
		contentGuidelines: ['Group related radio items logically', 'Use consistent terminology'],
		keywords: ['dropdown', 'menu', 'radio', 'group', 'single-select'],
		category: 'navigation',
		examples: [
			"import React, { useState } from 'react';\nimport DropdownMenu, { DropdownItemRadio, DropdownItemRadioGroup } from '@atlaskit/dropdown-menu';\nconst DropdownItemRadioExample = (): React.JSX.Element => {\n\tconst [selected, setSelected] = useState<string>('detail');\n\treturn (\n\t\t<DropdownMenu trigger=\"Views\" shouldRenderToParent>\n\t\t\t<DropdownItemRadioGroup title=\"Views\" id=\"actions\">\n\t\t\t\t<DropdownItemRadio\n\t\t\t\t\tid=\"detail\"\n\t\t\t\t\tonClick={() => setSelected('detail')}\n\t\t\t\t\tisSelected={selected === 'detail'}\n\t\t\t\t>\n\t\t\t\t\tDetail view\n\t\t\t\t</DropdownItemRadio>\n\t\t\t\t<DropdownItemRadio\n\t\t\t\t\tid=\"list\"\n\t\t\t\t\tonClick={() => setSelected('list')}\n\t\t\t\t\tisSelected={selected === 'list'}\n\t\t\t\t>\n\t\t\t\t\tList view\n\t\t\t\t</DropdownItemRadio>\n\t\t\t</DropdownItemRadioGroup>\n\t\t</DropdownMenu>\n\t);\n};\nexport default DropdownItemRadioExample;",
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'Children of the section.\nThis should generally be `Item` or `Heading` components,\nbut can also be [`EmptyState`](https://atlaskit.atlassian.com/packages/design-system/empty-state)s if you want to render errors.',
				isRequired: true,
			},
			{
				name: 'hasSeparator',
				type: 'boolean',
				description: 'Use this to render a border at the top of the section.',
			},
			{
				name: 'id',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'isList',
				type: 'boolean',
				description:
					'If your menu contains a list, use this to add `<ul>` and `<li>` tags around the items. This is essential for offering better, accessible semantic markup in a list of items.',
			},
			{
				name: 'isScrollable',
				type: 'boolean',
				description:
					"Enables scrolling within the section.\nThis won't work unless `maxHeight` is set on the parent `MenuGroup` component.",
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Provide an accessible label for the section via `aria-label` for assistive technology.',
			},
			{
				name: 'title',
				type: 'string',
				description:
					"The text passed into the internal `HeadingItem`. If a title isn't provided,\nthe `HeadingItem` won't be rendered, and this component will act as a regular `Section`.",
			},
			{
				name: 'titleId',
				type: 'string',
				description:
					"ID referenced by the menu group wrapper's `aria-labelledby` attribute. This ID should be assigned to the group title element.\nUsage of either this, or the `label` attribute is strongly recommended.",
			},
		],
	},
	{
		name: 'DropdownMenu',
		package: '@atlaskit/dropdown-menu',
		description: 'A dropdown menu component for displaying contextual actions and options.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for 5–15 items; navigation or command (action on selection)',
			'Avoid truncation—check max width; avoid truncated labels',
			'Nested menu: maximum two layers',
			'In a modal, use shouldRenderToParent for correct focus and screen reader behavior',
			'Disabled triggers are not supported (see Button a11y)',
			'Use Select for search/select; Checkbox for multiple from list; Radio for short single choice',
		],
		contentGuidelines: [
			'Logical order (e.g. most selected first); group with uppercase section title',
			'Use verbs for actions, nouns for links; no articles; single line per item',
			'Use clear, descriptive menu item labels',
			'Keep menu item text concise',
			'Group related actions logically',
			'Use consistent terminology across menu items',
		],
		accessibilityGuidelines: [
			'Avoid truncation—ensure max width does not cut off labels',
			'Focus lock when open; keyboard open should focus first item',
			'Nested menu: maximum two layers',
			'In modal use shouldRenderToParent for focus and voicing',
			'Provide clear labels for dropdown triggers',
			'Ensure keyboard navigation with arrow keys',
			'Use appropriate ARIA attributes',
		],
		keywords: ['dropdown', 'menu', 'actions', 'options', 'popup', 'contextual'],
		category: 'navigation',
		examples: [
			'import { IconButton } from \'@atlaskit/button/new\';\nimport DropdownMenu, { DropdownItem, DropdownItemGroup } from \'@atlaskit/dropdown-menu\';\nimport MoreIcon from \'@atlaskit/icon/core/show-more-horizontal\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<DropdownMenu\n\t\t\tshouldRenderToParent\n\t\t\ttrigger={({ triggerRef, ...props }) => (\n\t\t\t\t<IconButton ref={triggerRef} {...props} icon={MoreIcon} label="More" />\n\t\t\t)}\n\t\t>\n\t\t\t<DropdownItemGroup>\n\t\t\t\t<DropdownItem href="/dashboard">Dashboard</DropdownItem>\n\t\t\t\t<DropdownItem>Create</DropdownItem>\n\t\t\t\t<DropdownItem>Delete</DropdownItem>\n\t\t\t</DropdownItemGroup>\n\t\t</DropdownMenu>\n\t\t<DropdownMenu shouldRenderToParent trigger="Actions">\n\t\t\t<DropdownItemGroup>\n\t\t\t\t<DropdownItem>Export</DropdownItem>\n\t\t\t\t<DropdownItem>Share</DropdownItem>\n\t\t\t</DropdownItemGroup>\n\t\t</DropdownMenu>\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'appearance',
				type: '"default" | "tall"',
				description:
					"Controls the appearance of the menu.\nThe default menu will scroll after its height exceeds the pre-defined amount.\nThe tall menu won't scroll until the height exceeds the height of the viewport.",
			},
			{
				name: 'autoFocus',
				type: 'boolean',
				description:
					'Controls if the first menu item receives focus when menu is opened. Note that the menu has a focus lock\nwhich traps the focus within the menu. The first item gets focus automatically\nif the menu is triggered using the keyboard.',
				defaultValue: 'false',
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'Content that will be rendered inside the layer element. Should typically be\n`DropdownItemGroup` or `DropdownItem`, or the checkbox and radio variants of those.',
			},
			{
				name: 'defaultOpen',
				type: 'boolean',
				description:
					'Controls the initial open state of the dropdown. If provided, the component is considered to be controlled\nwhich means that the user is responsible for managing the open and close state of the menu.\nUsing `defaultOpen` may cause accessiblity issues because it will automatically shift focus to the first menu item; which can be disorienting.\nOnly use this if action on the menu is required to proceed.',
				defaultValue: 'false',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description: 'If true, a spinner is rendered instead of the items.',
				defaultValue: 'false',
			},
			{
				name: 'isOpen',
				type: 'boolean',
				description: 'Controls the open state of the dropdown.',
			},
			{
				name: 'label',
				type: 'string',
				description: 'Provide an accessible label via `aria-label` for assistive technology.',
			},
			{
				name: 'menuLabel',
				type: 'string',
				description: 'Provide an accessible label for the menu element for assistive technology.',
			},
			{
				name: 'onOpenChange',
				type: '(args: OnOpenChangeArgs) => void',
				description:
					'Called when the menu should be open/closed. Receives an object with `isOpen` state.\n\nIf the dropdown was closed programatically, the `event` parameter will be `null`.',
				defaultValue: 'noop',
			},
			{
				name: 'placement',
				type: '"auto-start" | "auto" | "auto-end" | "top-start" | "top" | "top-end" | "right-start" | "right" | "right-end" | "bottom-end" | "bottom" | "bottom-start" | "left-end" | "left" | "left-start"',
				description: 'Position of the menu.',
				defaultValue: '"bottom-start"',
			},
			{
				name: 'returnFocusRef',
				type: 'React.RefObject<HTMLElement>',
				description:
					'If ref is passed, focus returns to that specific ref element after dropdown dismissed.',
			},
			{
				name: 'shouldFitContainer',
				type: 'boolean',
				description:
					"This fits the dropdown menu width to its parent's width.\nWhen set to `true`, the trigger and dropdown menu elements will be wrapped in a `div` with `position: relative`.\nThe dropdown menu will be rendered as a sibling to the trigger element, and will be full width.\nThe default is `false`.\n\nThis fits the dropdown menu width to its parent's width.\nWhen set to `true`, the trigger and dropdown menu elements will be wrapped in a `div` with `position: relative`.\nThe dropdown menu will be rendered as a sibling to the trigger element, and will be full width.\nThe default is `false`.",
				defaultValue: 'false',
			},
			{
				name: 'shouldFlip',
				type: 'boolean',
				description:
					'Allows the dropdown menu to be placed on the opposite side of its trigger if it does not\nfit in the viewport.',
				defaultValue: 'true',
			},
			{
				name: 'shouldPreventEscapePropagation',
				type: 'boolean',
				description:
					'When set to true, will call stopPropagation on the ESCAPE key event.\nThis prevents the ESCAPE event from bubbling up to parent elements.',
				defaultValue: 'false',
			},
			{
				name: 'shouldRenderToParent',
				type: 'boolean',
				description:
					'Controls whether the popup is rendered inline within its parent component or in a portal at the document root.\n`true` renders the dropdown menu in the DOM node closest to the trigger; focus is not trapped inside the element.\n`false` renders the dropdown menu in React.Portal and focus is trapped inside the element.\nDefaults to `false`.\nControls whether the popup is rendered inline within its parent component or in a portal at the document root.\n`true` renders the dropdown menu in the DOM node closest to the trigger; focus is not trapped inside the element.\n`false` renders the dropdown menu in React.Portal and focus is trapped inside the element.\nDefaults to `false`.',
				defaultValue: 'false',
			},
			{
				name: 'spacing',
				type: '"compact" | "cozy"',
				description: 'Controls the spacing density of the menu.',
			},
			{
				name: 'statusLabel',
				type: 'string',
				description: 'Text to be used as status for assistive technologies. Defaults to "Loading".',
			},
			{
				name: 'strategy',
				type: '"absolute" | "fixed"',
				description:
					'This controls the positioning strategy to use. Can vary between `absolute` and `fixed`.\nThe default is `fixed`.\nThis controls the positioning strategy to use. Can vary between `absolute` and `fixed`.\nThe default is `fixed`.',
			},
			{
				name: 'trigger',
				type: 'string | ((triggerButtonProps: CustomTriggerProps<T>) => React.ReactElement<any, string | React.JSXElementConstructor<any>>)',
				description:
					'Content that triggers the dropdown menu to open and close. Use with\n`triggerType` to get a button trigger. To customize the trigger element,\nprovide a function to this prop. You can find\n[examples for custom triggers](https://atlassian.design/components/dropdown-menu/examples#custom-triggers)\nin our documentation.',
			},
			{
				name: 'zIndex',
				type: 'number',
				description:
					'Z-index that the popup should be displayed in.\nThis is passed to the portal component.\nDefaults to `layers.modal()` from `@atlaskit/theme` which is 510.',
				defaultValue: '510',
			},
		],
	},
	{
		name: 'EmptyState',
		package: '@atlaskit/empty-state',
		description:
			'A component for when there is nothing to display (no tasks, cleared inbox, no results).',
		status: 'general-availability',
		usageGuidelines: [
			'Use when nothing to display in a view (no tasks, no results, cleared inbox)',
			'Header is required; illustration, description, and buttons are optional',
			'Use wide (464px) or narrow (304px) layout as appropriate',
			'Provide one primary CTA; do not stack multiple primary buttons',
			'Use illustration as spot only—do not resize; keep relevant, neutral or humorous',
			'Explain why the state is empty and provide clear next steps',
			'Consider i18n for illustrations (e.g. culturally neutral imagery, translatable alt text)',
		],
		contentGuidelines: [
			'Blank slate: inspirational, motivating tone',
			'All done: celebratory tone',
			'No results: neutral tone with next steps',
			'Use clear, descriptive headers',
			'Provide specific next steps; avoid negative language',
		],
		accessibilityGuidelines: [
			'Avoid jargon; use simple language',
			'Use descriptive link text (not "click here")',
			'Add alt text only if the illustration is meaningful; otherwise omit or mark decorative',
			'Provide clear empty state messaging',
			'Use appropriate headings and structure',
			'Ensure actionable content is accessible',
		],
		keywords: ['empty', 'state', 'placeholder', 'no-content', 'void'],
		category: 'status',
		examples: [
			'import EmptyState from \'@atlaskit/empty-state\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<EmptyState header="No items" description="Add items to get started" />\n\t\t<EmptyState\n\t\t\theader="No search results"\n\t\t\tdescription="Try adjusting your search criteria or browse all items."\n\t\t/>\n\t\t<EmptyState\n\t\t\theader="Welcome to your dashboard"\n\t\t\tdescription="Create your first project to get started with the platform."\n\t\t/>\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'buttonGroupLabel',
				type: 'string',
				description:
					'Accessible name for the action buttons group of empty state. Can be used for internationalization. Default is "Button group".',
			},
			{
				name: 'description',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'The main block of text that holds additional supporting information.',
			},
			{
				name: 'header',
				type: 'string',
				description: 'Title that briefly describes the page to the user.',
				isRequired: true,
			},
			{
				name: 'headingLevel',
				type: 'number',
				description:
					'The value used to set the heading level of the header element.\nMust be in the range of 1 to 6. Defaults to 4.',
				defaultValue: '4',
			},
			{
				name: 'headingSize',
				type: '"xsmall" | "medium"',
				description:
					'The keyword used to set the visual appearance of the header element.\nDefaults to "medium". "xsmall" can be used for empty states in smaller contexts such as popups.',
				defaultValue: '"medium"',
			},
			{
				name: 'imageHeight',
				type: 'number',
				description:
					'Height of the image that is rendered in EmptyState component.\nUseful when you want image to be of exact height to stop it bouncing around when loading in.\nOnly set `height` if you want the image to resize down on smaller devices.',
			},
			{
				name: 'imageUrl',
				type: 'string',
				description:
					'The url of image that will be shown above the title, fed directly into the `src` prop of an <img> element.\nNote, this image will be constrained by the `maxWidth` and `maxHeight` props.',
			},
			{
				name: 'imageWidth',
				type: 'number',
				description:
					'Width of the image that is rendered in EmptyState component.\nUseful when you want image to be of exact width to stop it bouncing around when loading in.',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description:
					'Used to indicate a loading state. Will show a spinner next to the action buttons when true.',
			},
			{
				name: 'maxImageHeight',
				type: 'number',
				description: 'Maximum height (in pixels) of the image, default value is 160.',
				defaultValue: '160',
			},
			{
				name: 'maxImageWidth',
				type: 'number',
				description: 'Maximum width (in pixels) of the image, default value is 160.',
				defaultValue: '160',
			},
			{
				name: 'primaryAction',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'Primary action button for the page, usually it will be something like "Create" (or "Retry" for error pages).',
			},
			{
				name: 'renderImage',
				type: '(props: RenderImageProps) => React.ReactNode',
				description:
					'An alternative API to supply an image using a render prop. Only rendered if no `imageUrl` is supplied.',
			},
			{
				name: 'secondaryAction',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Secondary action button for the page.',
			},
			{
				name: 'tertiaryAction',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'Button with link to some external resource like documentation or tutorial, it will be opened in a new tab.',
			},
			{
				name: 'width',
				type: '"narrow" | "wide"',
				description: 'Controls how much horizontal space the component fills. Defaults to "wide".',
			},
		],
	},
	{
		name: 'Flag',
		package: '@atlaskit/flag',
		description: 'A component for displaying brief messages.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for confirmations and alerts needing minimal interaction',
			'Position at bottom left; overlays content',
			'Default: dismissible, event-driven (e.g. avatar update). Bold: not dismissible, severity (success/loading/warning/error), collapsed/expanded',
			'Use Banner for critical/system messages; Inline message when action is required; Modal for immediate action',
		],
		contentGuidelines: [
			'Be clear about what went wrong for errors',
			'Provide specific steps to resolve issues',
			'Use a helpful, non-threatening tone',
			'Clearly state potential consequences for warnings',
			'Confirm outcome then get out of the way for success messages',
			'Information: inform, no action needed',
			'Warning: before action, empathy, offer alternative',
			'Error: explain what went wrong and next step; use "we" not "you"',
			'Success: confirm outcome, then get out of the way; option to view details',
			'Be clear and concise; use a helpful, non-threatening tone',
		],
		accessibilityGuidelines: [
			'Keep copy concise for zoom and long words',
			'Use h2 for title via `headingLevel` prop; maintain heading hierarchy',
			'Do not stack dismissible and non-dismissible flags',
			'Do not rely on color alone for severity',
			'Avoid dead ends—always indicate how to proceed',
			'Do not use auto-dismiss for critical messages',
			'Use descriptive link text that describes the destination',
			'Ensure flag content is announced by screen readers',
			'Consider screen reader announcement conflicts',
		],
		keywords: ['flag', 'message', 'notification', 'alert', 'toast'],
		category: 'feedback',
		examples: [
			'import Flag, { FlagGroup } from \'@atlaskit/flag\';\nimport InfoIcon from \'@atlaskit/icon/core/status-information\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<FlagGroup>\n\t\t\t<Flag\n\t\t\t\tid="flag-1"\n\t\t\t\ticon={<InfoIcon label="Info" />}\n\t\t\t\ttitle="Success"\n\t\t\t\tdescription="Your changes have been saved successfully."\n\t\t\t\tappearance="success"\n\t\t\t/>\n\t\t</FlagGroup>\n\t\t<FlagGroup>\n\t\t\t<Flag\n\t\t\t\tid="flag-2"\n\t\t\t\ticon={<InfoIcon label="Warning" />}\n\t\t\t\ttitle="Warning"\n\t\t\t\tdescription="This action cannot be undone."\n\t\t\t\tappearance="warning"\n\t\t\t\tactions={[\n\t\t\t\t\t{\n\t\t\t\t\t\tcontent: \'Proceed\',\n\t\t\t\t\t\tonClick: () => console.log(\'Proceed clicked\'),\n\t\t\t\t\t},\n\t\t\t\t]}\n\t\t\t/>\n\t\t</FlagGroup>\n\t\t<FlagGroup>\n\t\t\t<Flag\n\t\t\t\tid="flag-3"\n\t\t\t\ticon={<InfoIcon label="Error" />}\n\t\t\t\ttitle="Error"\n\t\t\t\tdescription="Something went wrong. Please try again."\n\t\t\t\tappearance="error"\n\t\t\t\tactions={[\n\t\t\t\t\t{\n\t\t\t\t\t\tcontent: \'Retry\',\n\t\t\t\t\t\tonClick: () => console.log(\'Retry clicked\'),\n\t\t\t\t\t},\n\t\t\t\t]}\n\t\t\t/>\n\t\t</FlagGroup>\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'actions',
				type: 'ActionType[]',
				description:
					"Array of clickable actions to be shown at the bottom of the flag. For flags where appearance\nis 'normal', actions will be shown as links. For all other appearance values, actions will\nshown as buttons.\nIf href is passed the action will be shown as a link with the passed href prop.",
			},
			{
				name: 'appearance',
				type: '"error" | "info" | "success" | "warning" | "normal"',
				description:
					"Makes the flag appearance bold. Setting this to anything other than 'normal' hides the\ndismiss button.",
			},
			{
				name: 'autoDismissSeconds',
				type: 'number',
				description:
					'Duration in seconds before flag gets auto dismissed.\nDefault is 8 seconds. For a11y reasons 8s is also a strongly-suggested minimum.\nOnly applies to auto-dismissable flags.',
			},
			{
				name: 'delayAnnouncement',
				type: 'number',
				description:
					'Milliseconds to delay the screen reader announcement due to announcement conflict.',
			},
			{
				name: 'description',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'The secondary content shown below the flag title.',
			},
			{
				name: 'headingLevel',
				type: '1 | 2 | 3 | 4 | 5 | 6',
				description:
					'Specifies the heading level in the document structure.\nIf not specified, the default is `2`.',
			},
			{
				name: 'icon',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'The icon displayed in the top-left of the flag. Should be an instance of `@atlaskit/icon`.\nYour icon will receive the appropriate default color, which you can override by setting\nthe `color` prop on the icon to your preferred icon color.\nIf no icon is provided, a default icon will be used based on the appearance prop.',
			},
			{
				name: 'id',
				type: 'string | number',
				description: 'A unique identifier used for rendering and onDismissed callbacks.',
				isRequired: true,
			},
			{
				name: 'linkComponent',
				type: 'React.ComponentClass<CustomThemeButtonProps, any> | React.FunctionComponent<CustomThemeButtonProps>',
				description:
					'A link component that is passed down to the `@atlaskit/button` used by actions,\nto allow custom routers to be used. See the\n[button with router](https://atlaskit.atlassian.com/packages/design-system/button/example/ButtonWithRouter)\nexample of what this component should look like.',
			},
			{
				name: 'onBlur',
				type: '(e: React.FocusEvent<HTMLElement, Element>, analyticsEvent: UIAnalyticsEvent) => void',
				description: 'Standard onBlur event, applied to Flag by AutoDismissFlag.',
			},
			{
				name: 'onDismissed',
				type: '(id: string | number, analyticsEvent: UIAnalyticsEvent) => void',
				description:
					"Handler which will be called when a Flag's dismiss button is clicked.\nReceives the id of the dismissed Flag as a parameter.",
			},
			{
				name: 'onFocus',
				type: '(e: React.FocusEvent<HTMLElement, Element>, analyticsEvent: UIAnalyticsEvent) => void',
				description: 'Standard onFocus event, applied to Flag by AutoDismissFlag.',
			},
			{
				name: 'onMouseOut',
				type: '(event: React.MouseEvent<Element, MouseEvent>) => void',
				description: 'Standard onMouseOut event, applied to Flag by AutoDismissFlag.',
			},
			{
				name: 'onMouseOver',
				type: '(event: React.MouseEvent<Element, MouseEvent>) => void',
				description: 'Standard onMouseOver event, applied to Flag by AutoDismissFlag.',
			},
			{
				name: 'title',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'The bold text shown at the top of the flag.',
				isRequired: true,
			},
		],
	},
	{
		name: 'CharacterCounter',
		package: '@atlaskit/form',
		description:
			'Displays character count for text inputs. Can be used standalone or with CharacterCounterField.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when displaying character count for text inputs',
			'Provide current length and max length',
			'Use CharacterCounterField for integrated form field experience',
		],
		keywords: ['form', 'character', 'counter'],
		category: 'form',
		examples: [
			"import React, { useState } from 'react';\nimport { CharacterCounter, Label } from '@atlaskit/form';\nimport { Box, Stack } from '@atlaskit/primitives/compiled';\nimport TextArea from '@atlaskit/textarea';\nimport TextField from '@atlaskit/textfield';\n/**\n * Standalone CharacterCounter example - used outside of Form context\n * This is useful when you need character counting in custom implementations\n * that don't use the Form component or have a specific layout requirements\n * that CharacterCounterField does not provide. Generally speaking, it is\n * recommended to use CharacterCounterField for consistent styling.\n */\nconst StandaloneCharacterCounterExample = (): React.JSX.Element => {\n\tconst [textFieldValue, setTextFieldValue] = useState('');\n\tconst [textAreaValue, setTextAreaValue] = useState('');\n\tconst textFieldId = 'standalone-text-field';\n\tconst textAreaId = 'standalone-text-area';\n\t// Character limits\n\tconst maxCharacters = 50;\n\tconst minCharacters = 10;\n\tconst textAreaMaxCharacters = 200;\n\t// Calculate error states for styling\n\tconst isTextFieldTooLong = textFieldValue.length > maxCharacters;\n\tconst isTextAreaTooShort = textAreaValue.length < minCharacters;\n\tconst isTextAreaTooLong = textAreaValue.length > textAreaMaxCharacters;\n\tconst hasTextAreaError = isTextAreaTooShort || isTextAreaTooLong;\n\treturn (\n\t\t<Stack space=\"space.200\">\n\t\t\t{/* Example 1: TextField with maximum character limit */}\n\t\t\t<Box>\n\t\t\t\t<Label htmlFor={textFieldId}>Display name</Label>\n\t\t\t\t<TextField\n\t\t\t\t\tid={textFieldId}\n\t\t\t\t\tvalue={textFieldValue}\n\t\t\t\t\tonChange={(e) => setTextFieldValue(e.currentTarget.value)}\n\t\t\t\t\taria-describedby={`${textFieldId}-character-counter`}\n\t\t\t\t\tisInvalid={isTextFieldTooLong}\n\t\t\t\t/>\n\t\t\t\t<CharacterCounter\n\t\t\t\t\tcurrentValue={textFieldValue}\n\t\t\t\t\tmaxCharacters={maxCharacters}\n\t\t\t\t\tinputId={textFieldId}\n\t\t\t\t\tshouldShowAsError={isTextFieldTooLong}\n\t\t\t\t/>\n\t\t\t</Box>\n\t\t\t{/* Example 2: TextArea with both minimum and maximum limits */}\n\t\t\t<Box>\n\t\t\t\t<Label htmlFor={textAreaId}>Bio</Label>\n\t\t\t\t<TextArea\n\t\t\t\t\tid={textAreaId}\n\t\t\t\t\tvalue={textAreaValue}\n\t\t\t\t\tonChange={(e) => setTextAreaValue(e.currentTarget.value)}\n\t\t\t\t\taria-describedby={`${textAreaId}-character-counter`}\n\t\t\t\t\tresize=\"auto\"\n\t\t\t\t\tminimumRows={3}\n\t\t\t\t\tisInvalid={hasTextAreaError}\n\t\t\t\t\tisRequired\n\t\t\t\t/>\n\t\t\t\t<CharacterCounter\n\t\t\t\t\tcurrentValue={textAreaValue}\n\t\t\t\t\tminCharacters={minCharacters}\n\t\t\t\t\tmaxCharacters={textAreaMaxCharacters}\n\t\t\t\t\tinputId={textAreaId}\n\t\t\t\t\tshouldShowAsError={hasTextAreaError}\n\t\t\t\t/>\n\t\t\t</Box>\n\t\t</Stack>\n\t);\n};\nexport default StandaloneCharacterCounterExample;",
		],
		props: [
			{
				name: 'currentValue',
				type: 'string',
				description: 'Current value of the input field',
			},
			{
				name: 'inputId',
				type: 'string',
				description:
					"ID of the associated input for accessibility.\nNot needed if the character counter is used within CharacterCounterField.\nWhen provided, the character counter will have an ID of `${inputId}-character-counter`\nwhich should be referenced in the input's `aria-describedby` attribute.\nIf not provided, will attempt to use InputId context from Form.",
			},
			{
				name: 'maxCharacters',
				type: 'number',
				description: 'Maximum number of characters allowed (optional)',
			},
			{
				name: 'minCharacters',
				type: 'number',
				description: 'Minimum number of characters required (optional)',
			},
			{
				name: 'overMaximumMessage',
				type: 'string',
				description: 'Optional custom message to display when character limit is exceeded',
			},
			{
				name: 'shouldShowAsError',
				type: 'boolean',
				description:
					"Whether to style violations as errors (red text + icon).\nBy default, violations are automatically styled as errors.\n\nIn forms, set this to false to suppress error styling when\nthe form hasn't flagged an error yet (e.g., field not touched).\n\n// Standalone: smart default (violations = errors)\n<CharacterCounter currentValue={value} maxCharacters={100} />\n\n// Form: align with final-form error state\n<CharacterCounter\n  currentValue={value}\n  maxCharacters={100}\n  shouldShowAsError={isCharacterCountViolation}\n/>",
				defaultValue: 'true',
			},
			{
				name: 'underMaximumMessage',
				type: 'string',
				description: 'Optional custom message to display when character limit is not exceeded',
			},
			{
				name: 'underMinimumMessage',
				type: 'string',
				description:
					'Optional custom message to display when minimum character requirement is not met',
			},
		],
	},
	{
		name: 'CharacterCounterField',
		package: '@atlaskit/form',
		description:
			'A form field that includes character count display. Combines Field with CharacterCounter.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when character limits matter (e.g. descriptions, summaries)',
			'Provide maxLength for the limit',
			'Shows current count and limit',
		],
		keywords: ['form', 'character', 'counter', 'field'],
		category: 'form',
		examples: [
			'import ButtonGroup from \'@atlaskit/button/button-group\';\nimport Button from \'@atlaskit/button/new\';\nimport Form, {\n\tCharacterCounterField,\n\ttype FieldProps,\n\tFormFooter,\n\tFormHeader,\n\tFormSection,\n\tRequiredAsterisk,\n} from \'@atlaskit/form\';\nimport { Flex } from \'@atlaskit/primitives/compiled\';\nimport TextArea from \'@atlaskit/textarea\';\nimport TextField from \'@atlaskit/textfield\';\n/**\n * Mock i18n setup - in a real app, these would come from your i18n library\n * Example: import { useIntl } from \'react-intl\';\n */\nconst messages = {\n\t\'bio.underMinimum\': \'Enter at least {minimum} characters.\',\n\t\'bio.overMaximum\': \'Your bio exceeds the maximum length of {maximum} characters\',\n};\n// Mock formatMessage - in a real app: const { formatMessage } = useIntl();\nconst formatMessage = (\n\tmessageDescriptor: { id: keyof typeof messages },\n\tvalues?: Record<string, string | number>,\n): string => {\n\tlet message = messages[messageDescriptor.id];\n\tif (values) {\n\t\tObject.entries(values).forEach(([key, value]) => {\n\t\t\tmessage = message.replace(new RegExp(`\\\\{${key}\\\\}`, \'g\'), String(value));\n\t\t});\n\t}\n\treturn message;\n};\nconst FormCharacterCounterExample = (): React.JSX.Element => (\n\t<Flex direction="column">\n\t\t<Form\n\t\t\tnoValidate\n\t\t\tonSubmit={(data) => {\n\t\t\t\tconsole.log(\'form data\', data);\n\t\t\t}}\n\t\t>\n\t\t\t<FormHeader title="Profile">\n\t\t\t\t<p aria-hidden="true">\n\t\t\t\t\tRequired fields are marked with an asterisk <RequiredAsterisk />\n\t\t\t\t</p>\n\t\t\t</FormHeader>\n\t\t\t<FormSection>\n\t\t\t\t{/* Example 1: Maximum characters only with default messages */}\n\t\t\t\t<CharacterCounterField\n\t\t\t\t\tname="displayName"\n\t\t\t\t\tlabel="Display name"\n\t\t\t\t\tisRequired\n\t\t\t\t\tmaxCharacters={50}\n\t\t\t\t\thelperMessage="The name you’d like other people to see."\n\t\t\t\t\tvalidate={(value) =>\n\t\t\t\t\t\tvalue === \'Atlas\' ? \'Atlas is already in use, try something else\' : undefined\n\t\t\t\t\t}\n\t\t\t\t>\n\t\t\t\t\t{({ fieldProps }: { fieldProps: FieldProps<string> }) => (\n\t\t\t\t\t\t<TextField autoComplete="name" {...fieldProps} />\n\t\t\t\t\t)}\n\t\t\t\t</CharacterCounterField>\n\t\t\t\t{/* Example 2: Minimum characters only with default messages */}\n\t\t\t\t<CharacterCounterField<string, HTMLTextAreaElement>\n\t\t\t\t\tname="tagline"\n\t\t\t\t\tlabel="Professional tagline"\n\t\t\t\t\tminCharacters={10}\n\t\t\t\t\thelperMessage="A short headline that describes what you do."\n\t\t\t\t>\n\t\t\t\t\t{({ fieldProps }) => <TextArea {...fieldProps} resize="auto" minimumRows={2} />}\n\t\t\t\t</CharacterCounterField>\n\t\t\t\t{/* Example 3: Using i18n messages with character counter */}\n\t\t\t\t<CharacterCounterField<string, HTMLTextAreaElement>\n\t\t\t\t\tname="bio"\n\t\t\t\t\tlabel="Bio"\n\t\t\t\t\tisRequired\n\t\t\t\t\tminCharacters={10}\n\t\t\t\t\tmaxCharacters={200}\n\t\t\t\t\thelperMessage="Tell us about yourself, your interests, and experience."\n\t\t\t\t\tunderMinimumMessage={formatMessage({ id: \'bio.underMinimum\' }, { minimum: 10 })}\n\t\t\t\t\toverMaximumMessage={formatMessage({ id: \'bio.overMaximum\' }, { maximum: 200 })}\n\t\t\t\t>\n\t\t\t\t\t{({ fieldProps }) => <TextArea {...fieldProps} resize="auto" minimumRows={3} />}\n\t\t\t\t</CharacterCounterField>\n\t\t\t</FormSection>\n\t\t\t<FormFooter align="start">\n\t\t\t\t<ButtonGroup label="Form submit options">\n\t\t\t\t\t<Button type="submit" appearance="primary">\n\t\t\t\t\t\tSave profile\n\t\t\t\t\t</Button>\n\t\t\t\t\t<Button appearance="subtle">Cancel</Button>\n\t\t\t\t</ButtonGroup>\n\t\t\t</FormFooter>\n\t\t</Form>\n\t</Flex>\n);\nexport default FormCharacterCounterExample;',
		],
		props: [
			{
				name: 'children',
				type: '(args: { fieldProps: FieldProps<FieldValue, Element>; error?: string; valid: boolean; meta: Meta; }) => ReactNode',
				description:
					'The input component to render. Use a render function that receives `fieldProps`, `error`, `valid`, and `meta` state.\nSpread `fieldProps` onto your input element (such as `TextField` or `TextArea`).',
				isRequired: true,
			},
			{
				name: 'defaultValue',
				type: 'FieldValue | ((currentDefaultValue?: FieldValue) => FieldValue)',
				description:
					'Sets the default value of the field. If a function is provided, it is called with the current default value of the field.',
			},
			{
				name: 'elementAfterLabel',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description:
					'Element displayed after the label, and after the red asterisk if field is required.',
			},
			{
				name: 'helperMessage',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description:
					'Helper text displayed above the input to provide additional context or instructions.',
			},
			{
				name: 'id',
				type: 'string',
				description:
					'Passed to the ID attribute of the field. This is randomly generated if it is not specified.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					'Sets whether the field is disabled. Users cannot edit or focus on the fields. If the parent form component is disabled, then the field will always be disabled.',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description:
					'Sets whether the field is required for submission. Required fields are marked with a red asterisk.',
			},
			{
				name: 'label',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'Label displayed above the form field.',
			},
			{
				name: 'maxCharacters',
				type: 'number',
				description:
					'Maximum number of characters allowed. When exceeded, the field displays an error message or the message provided by `overMaximumMessage`.',
			},
			{
				name: 'minCharacters',
				type: 'number',
				description:
					'Minimum number of characters required. When not met, the character counter displays an error message or the message provided by `underMinimumMessage`.',
			},
			{
				name: 'name',
				type: 'string',
				description:
					'Specifies the name of the field. This is important for referencing the form data.',
				isRequired: true,
			},
			{
				name: 'overMaximumMessage',
				type: 'string',
				description:
					'Custom message displayed when input exceeds the maximum character limit. Use this to provide context-specific guidance or localized messages. Overrides the default "X characters too many" message.',
			},
			{
				name: 'underMaximumMessage',
				type: 'string',
				description:
					'Custom message displayed when input is under the maximum limit. Use this to provide context-specific guidance or localized messages. Overrides the default "X characters remaining" message.',
			},
			{
				name: 'underMinimumMessage',
				type: 'string',
				description:
					'Custom message displayed when input is under the minimum requirement. Use this to guide users on how much more they need to type. Overrides the default "Minimum of X characters required" message.',
			},
			{
				name: 'validate',
				type: '(value: FieldValue, formState: Object, fieldState: Meta) => string | void | Promise<string | void>',
				description:
					'Checks whether the field input is valid. This is usually used to display a message relevant to the current value using `ErrorMessage`, `HelperMessage` or `ValidMessage`.',
			},
		],
	},
	{
		name: 'CheckboxField',
		package: '@atlaskit/form',
		description: 'A form field for checkbox inputs. Wraps Checkbox with form field behavior.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for single or grouped checkbox options',
			'Provide name and value props',
			'Works with Checkbox from @atlaskit/checkbox',
		],
		keywords: ['form', 'checkbox', 'field'],
		category: 'form',
		examples: [
			'import Button from \'@atlaskit/button/new\';\nimport { Checkbox } from \'@atlaskit/checkbox\';\nimport Form, { CheckboxField, Fieldset, FormFooter } from \'@atlaskit/form\';\nimport { Flex } from \'@atlaskit/primitives/compiled\';\nconst FormCheckboxExample = (): React.JSX.Element => {\n\treturn (\n\t\t<Flex direction="column">\n\t\t\t<Form onSubmit={(data) => console.log(data)}>\n\t\t\t\t<Fieldset legend="Apps">\n\t\t\t\t\t<CheckboxField name="app" value="jira">\n\t\t\t\t\t\t{({ fieldProps }) => <Checkbox {...fieldProps} label="Jira" />}\n\t\t\t\t\t</CheckboxField>\n\t\t\t\t\t<CheckboxField name="app" value="confluence">\n\t\t\t\t\t\t{({ fieldProps }) => <Checkbox {...fieldProps} label="Confluence" />}\n\t\t\t\t\t</CheckboxField>\n\t\t\t\t\t<CheckboxField name="app" value="bitbucket">\n\t\t\t\t\t\t{({ fieldProps }) => <Checkbox {...fieldProps} label="Bitbucket" />}\n\t\t\t\t\t</CheckboxField>\n\t\t\t\t</Fieldset>\n\t\t\t\t<FormFooter align="start">\n\t\t\t\t\t<Button type="submit" appearance="primary">\n\t\t\t\t\t\tSubmit\n\t\t\t\t\t</Button>\n\t\t\t\t</FormFooter>\n\t\t\t</Form>\n\t\t</Flex>\n\t);\n};\nexport default FormCheckboxExample;',
		],
		props: [
			{
				name: 'children',
				type: '(args: { fieldProps: CheckboxFieldProps; error?: string; valid: boolean; meta: Meta; }) => React.ReactNode',
				description:
					'Content to render in the checkbox field. This is a function that is called with information about the field.',
				isRequired: true,
			},
			{
				name: 'defaultIsChecked',
				type: 'boolean',
				description: 'Sets the default state of the checkbox as checked.',
				defaultValue: 'false',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					'Sets whether the field is disabled. Users cannot edit or focus on the fields. If the parent form component is disabled, then the field will always be disabled.',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description:
					'Sets whether the field is required for submission. Required fields are marked with a red asterisk.',
			},
			{
				name: 'label',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Label displayed beside the checkbox.',
			},
			{
				name: 'name',
				type: 'string',
				description:
					'Specifies the name of the field. This is important for referencing the form data.',
				isRequired: true,
			},
			{
				name: 'value',
				type: 'string',
				description:
					'The value of the checkbox. This is the value used in the form state when the checkbox is checked.',
			},
		],
	},
	{
		name: 'ErrorMessage',
		package: '@atlaskit/form',
		description: 'Displays validation error text for a form field.',
		status: 'general-availability',
		usageGuidelines: [
			'Use within MessageWrapper when field validation fails',
			'Show specific, actionable error messages',
			'Place below the form control',
		],
		contentGuidelines: ['Provide specific error messages', 'Explain how to fix the error'],
		keywords: ['form', 'error', 'message', 'validation'],
		category: 'form',
		examples: [
			"import React, { Fragment } from 'react';\nimport Button from '@atlaskit/button/new';\nimport Form, {\n\tErrorMessage,\n\tField,\n\tFormFooter,\n\tFormHeader,\n\tMessageWrapper,\n\tRequiredAsterisk,\n} from '@atlaskit/form';\nimport { Flex, Text } from '@atlaskit/primitives/compiled';\nimport Select, { type ValueType } from '@atlaskit/select';\nimport TextField from '@atlaskit/textfield';\ninterface Option {\n\tlabel: string;\n\tvalue: string;\n}\nconst members = [\n\t{ label: 'Arni Singh', value: 'asingh' },\n\t{ label: 'Hermione Walters', value: 'hwalters' },\n\t{ label: 'Parvi Karan', value: 'pkaran' },\n\t{ label: 'Charlie Li', value: 'cli' },\n\t{ label: 'Silus Graham', value: 'sgraham' },\n\t{ label: 'Jorge Oroza', value: 'joroza' },\n];\nconst userNameData = ['jsmith', 'mchan'];\nconst errorMessages = {\n\tshortUsername: 'Enter a team name longer than 4 characters.',\n\tusernameInUse: 'This team name is already taken. Use a different name',\n\tusernameIsRequired: 'A team name is required.',\n\tselectError: 'Select at least one team member.',\n};\nconst checkUserName = (value: string | undefined) => {\n\treturn value && userNameData.includes(value);\n};\nexport default function FieldLevelValidationExample(): React.JSX.Element {\n\tconst handleSubmit = (formState: { command: string }) => {\n\t\tconsole.log('form state', formState);\n\t};\n\treturn (\n\t\t<Flex direction=\"column\">\n\t\t\t<Form noValidate onSubmit={handleSubmit}>\n\t\t\t\t<FormHeader title=\"Create team\">\n\t\t\t\t\t<Text as=\"p\" aria-hidden={true}>\n\t\t\t\t\t\tRequired fields are marked with an asterisk <RequiredAsterisk />\n\t\t\t\t\t</Text>\n\t\t\t\t</FormHeader>\n\t\t\t\t<Field\n\t\t\t\t\tname=\"team\"\n\t\t\t\t\tlabel=\"Team name\"\n\t\t\t\t\tdefaultValue=\"\"\n\t\t\t\t\tisRequired\n\t\t\t\t\tvalidate={(value) => {\n\t\t\t\t\t\tif (!value) {\n\t\t\t\t\t\t\treturn errorMessages.usernameIsRequired;\n\t\t\t\t\t\t} else if (value.length <= 5) {\n\t\t\t\t\t\t\treturn errorMessages.shortUsername;\n\t\t\t\t\t\t} else if (checkUserName(value)) {\n\t\t\t\t\t\t\treturn errorMessages.usernameInUse;\n\t\t\t\t\t\t}\n\t\t\t\t\t}}\n\t\t\t\t\tcomponent={({ fieldProps }) => <TextField {...fieldProps} />}\n\t\t\t\t/>\n\t\t\t\t<Field<ValueType<Option, true>>\n\t\t\t\t\tname=\"members\"\n\t\t\t\t\tlabel=\"Team members\"\n\t\t\t\t\tdefaultValue={[]}\n\t\t\t\t\tisRequired\n\t\t\t\t\tvalidate={(value) => {\n\t\t\t\t\t\tif (!value || value.length === 0) {\n\t\t\t\t\t\t\treturn errorMessages.selectError;\n\t\t\t\t\t\t}\n\t\t\t\t\t}}\n\t\t\t\t>\n\t\t\t\t\t{({ fieldProps: { id, ...rest }, error }) => {\n\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t<Fragment>\n\t\t\t\t\t\t\t\t<Select<Option, true>\n\t\t\t\t\t\t\t\t\tplaceholder=\"\"\n\t\t\t\t\t\t\t\t\tinputId={id}\n\t\t\t\t\t\t\t\t\t{...rest}\n\t\t\t\t\t\t\t\t\toptions={members}\n\t\t\t\t\t\t\t\t\tisMulti\n\t\t\t\t\t\t\t\t\tisClearable\n\t\t\t\t\t\t\t\t\tclearControlLabel=\"Clear color\"\n\t\t\t\t\t\t\t\t\tdescriptionId={error ? `${id}-error` : undefined}\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>\n\t\t\t\t\t\t\t</Fragment>\n\t\t\t\t\t\t);\n\t\t\t\t\t}}\n\t\t\t\t</Field>\n\t\t\t\t<FormFooter align=\"start\">\n\t\t\t\t\t<Button type=\"submit\" appearance=\"primary\">\n\t\t\t\t\t\tCreate\n\t\t\t\t\t</Button>\n\t\t\t\t</FormFooter>\n\t\t\t</Form>\n\t\t</Flex>\n\t);\n}",
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'The content of the message',
				isRequired: true,
			},
		],
	},
	{
		name: 'Field',
		package: '@atlaskit/form',
		description:
			'A form field wrapper that provides label, validation, and error handling. Used with any form control via the component prop.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for each form input; provide name, label, and component',
			'Use isRequired for required fields',
			'Use validate for validation logic; use helperMessage for instructions',
			'Wrap messages in MessageWrapper with HelperMessage, ErrorMessage, ValidMessage',
		],
		contentGuidelines: [
			'Use clear, descriptive labels',
			'Provide specific error messages',
			'Use helper text for complex fields',
		],
		keywords: ['form', 'field', 'input', 'validation'],
		category: 'form',
		examples: [
			'import ButtonGroup from \'@atlaskit/button/button-group\';\nimport Button from \'@atlaskit/button/new\';\nimport Form, { Field, FormFooter } from \'@atlaskit/form\';\nimport { Flex } from \'@atlaskit/primitives/compiled\';\nimport TextField from \'@atlaskit/textfield\';\nconst FormFieldExample = (): React.JSX.Element => (\n\t<Flex direction="column">\n\t\t<Form onSubmit={(data) => console.log(\'form data\', data)}>\n\t\t\t{({ formProps }) => (\n\t\t\t\t<form {...formProps}>\n\t\t\t\t\t<Field\n\t\t\t\t\t\tname="username"\n\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\tlabel="Username"\n\t\t\t\t\t\tisRequired\n\t\t\t\t\t\thelperMessage="Your username can have up to 16 characters."\n\t\t\t\t\t\tvalidMessage="Username is valid."\n\t\t\t\t\t\tvalidate={(value) => {\n\t\t\t\t\t\t\tif (!value) {\n\t\t\t\t\t\t\t\treturn \'Username is required.\';\n\t\t\t\t\t\t\t} else if (value && value.length > 16) {\n\t\t\t\t\t\t\t\treturn \'Username must be 16 characters or less.\';\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}}\n\t\t\t\t\t\tcomponent={({ fieldProps }) => <TextField {...fieldProps} />}\n\t\t\t\t\t/>\n\t\t\t\t\t<FormFooter align="start">\n\t\t\t\t\t\t<ButtonGroup label="Form submit options">\n\t\t\t\t\t\t\t<Button type="submit" appearance="primary">\n\t\t\t\t\t\t\t\tSubmit\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t<Button appearance="subtle">Cancel</Button>\n\t\t\t\t\t\t</ButtonGroup>\n\t\t\t\t\t</FormFooter>\n\t\t\t\t</form>\n\t\t\t)}\n\t\t</Form>\n\t</Flex>\n);\nexport default FormFieldExample;',
		],
		props: [
			{
				name: 'children',
				type: '(args: { fieldProps: FieldProps<FieldValue, Element>; error?: string; valid: boolean; meta: Meta; }) => React.ReactNode',
				description:
					'Content to render in the field. This is a function that is called with props for the field component and other information about the field. This cannot be used at the same time as the `component` prop, as the `children` prop will be ignored.',
			},
			{
				name: 'component',
				type: '(args: { fieldProps: FieldProps<FieldValue, Element>; }) => React.ReactNode',
				description:
					'Content to render in the field. This will be rendered with the `*Message` props. This cannot be used at the same time as the `children` prop, as the `children` prop will be ignored.',
			},
			{
				name: 'defaultValue',
				type: 'FieldValue | ((currentDefaultValue?: FieldValue) => FieldValue)',
				description:
					'Sets the default value of the field. If a function is provided, it is called with the current default value of the field.',
			},
			{
				name: 'elementAfterLabel',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'Element displayed after the label, and after the red asterisk if field is required.',
			},
			{
				name: 'errorMessage',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'Renders an `ErrorMessage` with the provided content when using the `component` prop.',
			},
			{
				name: 'helperMessage',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'Renders a `HelperMessage` with the provided content when using the `component` prop.',
			},
			{
				name: 'id',
				type: 'string',
				description:
					'Passed to the ID attribute of the field. This is randomly generated if it is not specified.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					'Sets whether the field is disabled. Users cannot edit or focus on the fields. If the parent form component is disabled, then the field will always be disabled.',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description:
					'Sets whether the field is required for submission. Required fields are marked with a red asterisk.',
			},
			{
				name: 'label',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Label displayed above the form field.',
			},
			{
				name: 'name',
				type: 'string',
				description:
					'Specifies the name of the field. This is important for referencing the form data.',
				isRequired: true,
			},
			{
				name: 'transform',
				type: '(event: FieldValue | React.FormEvent<Element>, current: FieldValue) => FieldValue',
				description:
					'Access the current field value and transform it to return a different field value.',
			},
			{
				name: 'validate',
				type: '(value: FieldValue, formState: Object, fieldState: Meta) => string | void | Promise<string | void>',
				description:
					'Checks whether the field input is valid. This is usually used to display a message relevant to the current value using `ErrorMessage`, `HelperMessage` or `ValidMessage`.',
			},
			{
				name: 'validMessage',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'Renders a `ValidMessage` with the provided content when using the `component` prop.',
			},
		],
	},
	{
		name: 'Fieldset',
		package: '@atlaskit/form',
		description:
			'Groups related form fields with a legend. Use for radio groups or logical groupings.',
		status: 'general-availability',
		usageGuidelines: [
			'Use with Legend to describe the group',
			'Use for radio groups and logical field groupings',
			'Improves accessibility',
		],
		keywords: ['form', 'fieldset', 'group'],
		category: 'form',
		examples: [
			'import { Checkbox } from \'@atlaskit/checkbox\';\nimport Form, { CheckboxField, Fieldset } from \'@atlaskit/form\';\nimport { Box } from \'@atlaskit/primitives/compiled\';\nconst FormFieldsetExample = (): React.JSX.Element => (\n\t<Box>\n\t\t<Form onSubmit={(data) => console.log(data)}>\n\t\t\t<Fieldset legend="Apps">\n\t\t\t\t<CheckboxField name="app" value="jira">\n\t\t\t\t\t{({ fieldProps }) => <Checkbox {...fieldProps} label="Jira" />}\n\t\t\t\t</CheckboxField>\n\t\t\t\t<CheckboxField name="app" value="confluence">\n\t\t\t\t\t{({ fieldProps }) => <Checkbox {...fieldProps} label="Confluence" />}\n\t\t\t\t</CheckboxField>\n\t\t\t\t<CheckboxField name="app" value="bitbucket">\n\t\t\t\t\t{({ fieldProps }) => <Checkbox {...fieldProps} label="Bitbucket" />}\n\t\t\t\t</CheckboxField>\n\t\t\t</Fieldset>\n\t\t\t<Fieldset legend="Teams">\n\t\t\t\t<CheckboxField name="teams" value="dst">\n\t\t\t\t\t{({ fieldProps }) => <Checkbox {...fieldProps} label="Design System Team" />}\n\t\t\t\t</CheckboxField>\n\t\t\t\t<CheckboxField name="teams" value="design-ops">\n\t\t\t\t\t{({ fieldProps }) => <Checkbox {...fieldProps} label="Design Ops" />}\n\t\t\t\t</CheckboxField>\n\t\t\t\t<CheckboxField name="teams" value="content">\n\t\t\t\t\t{({ fieldProps }) => <Checkbox {...fieldProps} label="Content Ops" />}\n\t\t\t\t</CheckboxField>\n\t\t\t</Fieldset>\n\t\t</Form>\n\t</Box>\n);\nexport default FormFieldsetExample;',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'Content to render in the fieldset.',
				isRequired: true,
			},
			{
				name: 'legend',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'Label describing the contents of the fieldset.',
			},
		],
	},
	{
		name: 'Form',
		package: '@atlaskit/form',
		description: 'A component for building forms with validation and state management.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when users need to provide and submit information (settings, create work item)',
			'Use with textfield, select, radio, checkbox and other form controls',
			'Structure: title, description, required legend, asterisk, helper text, labels above fields, character counter where needed, sections, footer with primary/secondary actions',
			'Provide clear field labels and instructions',
			'Mark required fields with asterisk (*)',
			'Provide specific error messages',
		],
		contentGuidelines: [
			'Use clear, concise labels',
			'Use labels and helper text for critical info—not placeholder alone (exception: search with icon + label)',
			'Provide specific error messages',
			'Use consistent terminology',
			'Always include a visible label (exception: search fields)',
			'Match field length to intended content length',
		],
		accessibilityGuidelines: [
			'Autofocus the first field when appropriate',
			'Use visible labels for all fields (search is the exception)',
			'Never disable the submit button—use validation and instructions so users know how to proceed',
			'Support autofill tokens and persist form state on refresh where appropriate',
			'Use inline validation with clear instructions',
			'Provide clear labels for all form fields',
			'Ensure keyboard navigation between fields',
			'Mark required fields clearly',
		],
		keywords: ['form', 'validation', 'field', 'input', 'submit', 'state'],
		category: 'form',
		examples: [
			'import Button from \'@atlaskit/button/new\';\nimport { Checkbox } from \'@atlaskit/checkbox\';\nimport Form, { CheckboxField, Field, FormFooter, FormHeader } from \'@atlaskit/form\';\nimport TextField from \'@atlaskit/textfield\';\nconst Example = (): React.JSX.Element => (\n\t<Form onSubmit={(data) => console.log(\'validated form\', data)}>\n\t\t<FormHeader title="Basic Form">\n\t\t\t<p>Fill out the form below</p>\n\t\t</FormHeader>\n\t\t<Field\n\t\t\tname="username"\n\t\t\tlabel="Username"\n\t\t\tisRequired\n\t\t\tvalidate={(value) =>\n\t\t\t\tvalue && value.length < 3 ? \'Username must be at least 3 characters\' : undefined\n\t\t\t}\n\t\t\tcomponent={({ fieldProps }) => <TextField {...fieldProps} />}\n\t\t/>\n\t\t<CheckboxField name="terms" value="terms">\n\t\t\t{({ fieldProps }) => <Checkbox {...fieldProps} label="I accept the terms" />}\n\t\t</CheckboxField>\n\t\t<FormFooter>\n\t\t\t<Button type="submit" appearance="primary">\n\t\t\t\tCreate Account\n\t\t\t</Button>\n\t\t</FormFooter>\n\t</Form>\n);\nexport default Example;',
		],
		props: [
			{
				name: 'autocomplete',
				type: '"off" | "on"',
				description:
					"Indicates whether the value of the form's controls can be automatically completed by the browser. It is `on` by default.",
			},
			{
				name: 'children',
				type: '(() => void) | React.ReactNode | ((args: FormChildrenArgs<FormValues>) => React.ReactNode)',
				description:
					'The contents rendered inside of the form. This is a function where the props will be passed from the form. The function props you can access are `dirty`, `submitting` and `disabled`.\nYou can read more about these props in [react-final form documentation](https://final-form.org/docs/final-form/types/FormState).\n\nIf you are only spreading `formProps` onto the HTML `<form>` element and not using any of the other props (like `submitting`, etc.), `children` can be plain JSX. All of the children will be wrapped within an HTML `<form>` element that includes all necessary props, including those provided on the form component.',
				isRequired: true,
			},
			{
				name: 'formProps',
				type: '{ [x: string]: any; } & ExcludeReservedFormProps',
				description:
					'When `Form` renders JSX children directly and not using a function to\nspread `formProps` manually, the properties in this `formProps` prop will\nbe spread on an internally rendered  HTML `form` element.',
			},
			{
				name: 'id',
				type: 'string',
				description: '`id` attribute applied to the `form` element.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					'Sets the form and its fields as disabled. Users cannot edit or focus on the fields.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Accessible name to be applied to the form element. Maps to the `aria-label` attribute.',
			},
			{
				name: 'labelId',
				type: 'string',
				description:
					'ID of the element that has the accessible name to be applied to the form element. Maps to the `aria-labelledby` attribute.',
			},
			{
				name: 'name',
				type: 'string',
				description: '`name` attribute applied to the `form` element.',
			},
			{
				name: 'noValidate',
				type: 'boolean',
				description:
					'Indicates if the inputs within the form will bypass HTML5 constraint\nvalidation when submitted. This is not recommended to be used because it\ncan cause experiences to be inaccessible. It is `false` by default but will\nbe set to `true` in the future to increase accessibility, so it is **not recommended**.',
			},
			{
				name: 'onSubmit',
				type: '(values: FormValues, form: FormApi<FormValues>, callback?: (errors?: Record<string, string>) => void) => void | Object | Promise<...>',
				description:
					'Event handler called when the form is submitted. Fields must be free of validation errors.',
				isRequired: true,
			},
			{
				name: 'xcss',
				type: 'false | (XCSSValue<"flex" | "grid" | "fill" | "stroke" | "all" | "bottom" | "left" | "right" | "top" | "clip" | "overlay" | "accentColor" | "alignContent" | "alignItems" | "alignSelf" | ... 486 more ... | "glyphOrientationVertical", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
			},
		],
	},
	{
		name: 'FormFooter',
		package: '@atlaskit/form',
		description: 'The footer section of a form, typically containing submit and cancel buttons.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for primary and secondary actions',
			'Primary button on the right; include Cancel for dismissal',
			'Use align prop for left or right alignment',
		],
		contentGuidelines: [
			'Use action verbs in button labels',
			'Primary button reflects the form action',
		],
		keywords: ['form', 'footer', 'actions', 'buttons'],
		category: 'form',
		examples: [
			'import React, { Fragment } from \'react\';\nimport ButtonGroup from \'@atlaskit/button/button-group\';\nimport Button from \'@atlaskit/button/new\';\nimport Form, {\n\tErrorMessage,\n\tField,\n\tFormFooter,\n\tFormHeader,\n\tFormSection,\n\tHelperMessage,\n\tMessageWrapper,\n\tRequiredAsterisk,\n\tValidMessage,\n} from \'@atlaskit/form\';\nimport { Flex } from \'@atlaskit/primitives/compiled\';\nimport { RadioGroup } from \'@atlaskit/radio\';\nimport TextField from \'@atlaskit/textfield\';\nconst FormDefaultExample = (): React.JSX.Element => (\n\t<Flex direction="column">\n\t\t<Form<{ schema: string; key: string; type: string }>\n\t\t\tnoValidate\n\t\t\tonSubmit={(data) => {\n\t\t\t\tconsole.log(\'form data\', data);\n\t\t\t\treturn new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>\n\t\t\t\t\t!data.schema ? { schema: \'A schema name is required\' } : undefined,\n\t\t\t\t);\n\t\t\t}}\n\t\t>\n\t\t\t{({ formProps, submitting }) => (\n\t\t\t\t<form {...formProps} name="create">\n\t\t\t\t\t<FormHeader title="Create schema">\n\t\t\t\t\t\t<p aria-hidden="true">\n\t\t\t\t\t\t\tRequired fields are marked with an asterisk <RequiredAsterisk />\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</FormHeader>\n\t\t\t\t\t<FormSection>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="schema"\n\t\t\t\t\t\t\tlabel="Schema name"\n\t\t\t\t\t\t\tisRequired\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tvalidate={(value) => (!value ? \'A schema name is required\' : undefined)}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{({ fieldProps, error }) => {\n\t\t\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t\t\t<Fragment>\n\t\t\t\t\t\t\t\t\t\t<TextField autoComplete="off" {...fieldProps} />\n\t\t\t\t\t\t\t\t\t\t<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>\n\t\t\t\t\t\t\t\t\t</Fragment>\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="key"\n\t\t\t\t\t\t\tlabel="Key"\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tisRequired\n\t\t\t\t\t\t\tvalidate={(value) => {\n\t\t\t\t\t\t\t\tif (!value) {\n\t\t\t\t\t\t\t\t\treturn \'A key is required\';\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tif (value.length < 8) {\n\t\t\t\t\t\t\t\t\treturn \'Key needs to be at least 8 characters.\';\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{({ fieldProps, error, valid, meta }) => {\n\t\t\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t\t\t<Fragment>\n\t\t\t\t\t\t\t\t\t\t<TextField type="key" {...fieldProps} />\n\t\t\t\t\t\t\t\t\t\t<MessageWrapper>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t\tCreate a unique key, minimum of 8 characters. Example key: IT-infrastructure\n\t\t\t\t\t\t\t\t\t\t\t</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t{error && <ErrorMessage>{error}</ErrorMessage>}\n\t\t\t\t\t\t\t\t\t\t\t{valid && meta.dirty ? <ValidMessage>Key is unique</ValidMessage> : null}\n\t\t\t\t\t\t\t\t\t\t</MessageWrapper>\n\t\t\t\t\t\t\t\t\t</Fragment>\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="type"\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tlabel="Schema type"\n\t\t\t\t\t\t\tcomponent={({ fieldProps }) => (\n\t\t\t\t\t\t\t\t<RadioGroup\n\t\t\t\t\t\t\t\t\toptions={[\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\tname: \'type\',\n\t\t\t\t\t\t\t\t\t\t\tvalue: \'project-admin\',\n\t\t\t\t\t\t\t\t\t\t\tlabel: \'Public\',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\tname: \'type\',\n\t\t\t\t\t\t\t\t\t\t\tvalue: \'admin\',\n\t\t\t\t\t\t\t\t\t\t\tlabel: \'Private\',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t]}\n\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t/>\n\t\t\t\t\t</FormSection>\n\t\t\t\t\t<FormFooter align="start">\n\t\t\t\t\t\t<ButtonGroup label="Form submit options">\n\t\t\t\t\t\t\t<Button type="submit" appearance="primary">\n\t\t\t\t\t\t\t\tCreate\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t<Button appearance="subtle" isLoading={submitting}>\n\t\t\t\t\t\t\t\tCancel\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t</ButtonGroup>\n\t\t\t\t\t</FormFooter>\n\t\t\t\t</form>\n\t\t\t)}\n\t\t</Form>\n\t</Flex>\n);\nexport default FormDefaultExample;',
		],
		props: [
			{
				name: 'align',
				type: '"end" | "start"',
				description:
					'Sets the alignment of the footer contents. This is often a button. This should be left-aligned in single-page forms, flags, cards, and section messages.',
				defaultValue: '"end"',
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'Content to render in the footer of the form.',
			},
		],
	},
	{
		name: 'FormHeader',
		package: '@atlaskit/form',
		description:
			'The header section of a form, typically containing the title and optional description.',
		status: 'general-availability',
		usageGuidelines: [
			'Use at the top of a form to provide context',
			'Include title and optional description or hint text',
			'Use RequiredAsterisk legend for required field indication',
		],
		contentGuidelines: ['Use clear, descriptive form titles', 'Keep descriptions concise'],
		keywords: ['form', 'header', 'title', 'description'],
		category: 'form',
		examples: [
			'import React, { Fragment } from \'react\';\nimport ButtonGroup from \'@atlaskit/button/button-group\';\nimport Button from \'@atlaskit/button/new\';\nimport Form, {\n\tErrorMessage,\n\tField,\n\tFormFooter,\n\tFormHeader,\n\tFormSection,\n\tHelperMessage,\n\tMessageWrapper,\n\tRequiredAsterisk,\n\tValidMessage,\n} from \'@atlaskit/form\';\nimport { Flex } from \'@atlaskit/primitives/compiled\';\nimport { RadioGroup } from \'@atlaskit/radio\';\nimport TextField from \'@atlaskit/textfield\';\nconst FormDefaultExample = (): React.JSX.Element => (\n\t<Flex direction="column">\n\t\t<Form<{ schema: string; key: string; type: string }>\n\t\t\tnoValidate\n\t\t\tonSubmit={(data) => {\n\t\t\t\tconsole.log(\'form data\', data);\n\t\t\t\treturn new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>\n\t\t\t\t\t!data.schema ? { schema: \'A schema name is required\' } : undefined,\n\t\t\t\t);\n\t\t\t}}\n\t\t>\n\t\t\t{({ formProps, submitting }) => (\n\t\t\t\t<form {...formProps} name="create">\n\t\t\t\t\t<FormHeader title="Create schema">\n\t\t\t\t\t\t<p aria-hidden="true">\n\t\t\t\t\t\t\tRequired fields are marked with an asterisk <RequiredAsterisk />\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</FormHeader>\n\t\t\t\t\t<FormSection>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="schema"\n\t\t\t\t\t\t\tlabel="Schema name"\n\t\t\t\t\t\t\tisRequired\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tvalidate={(value) => (!value ? \'A schema name is required\' : undefined)}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{({ fieldProps, error }) => {\n\t\t\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t\t\t<Fragment>\n\t\t\t\t\t\t\t\t\t\t<TextField autoComplete="off" {...fieldProps} />\n\t\t\t\t\t\t\t\t\t\t<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>\n\t\t\t\t\t\t\t\t\t</Fragment>\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="key"\n\t\t\t\t\t\t\tlabel="Key"\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tisRequired\n\t\t\t\t\t\t\tvalidate={(value) => {\n\t\t\t\t\t\t\t\tif (!value) {\n\t\t\t\t\t\t\t\t\treturn \'A key is required\';\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tif (value.length < 8) {\n\t\t\t\t\t\t\t\t\treturn \'Key needs to be at least 8 characters.\';\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{({ fieldProps, error, valid, meta }) => {\n\t\t\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t\t\t<Fragment>\n\t\t\t\t\t\t\t\t\t\t<TextField type="key" {...fieldProps} />\n\t\t\t\t\t\t\t\t\t\t<MessageWrapper>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t\tCreate a unique key, minimum of 8 characters. Example key: IT-infrastructure\n\t\t\t\t\t\t\t\t\t\t\t</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t{error && <ErrorMessage>{error}</ErrorMessage>}\n\t\t\t\t\t\t\t\t\t\t\t{valid && meta.dirty ? <ValidMessage>Key is unique</ValidMessage> : null}\n\t\t\t\t\t\t\t\t\t\t</MessageWrapper>\n\t\t\t\t\t\t\t\t\t</Fragment>\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="type"\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tlabel="Schema type"\n\t\t\t\t\t\t\tcomponent={({ fieldProps }) => (\n\t\t\t\t\t\t\t\t<RadioGroup\n\t\t\t\t\t\t\t\t\toptions={[\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\tname: \'type\',\n\t\t\t\t\t\t\t\t\t\t\tvalue: \'project-admin\',\n\t\t\t\t\t\t\t\t\t\t\tlabel: \'Public\',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\tname: \'type\',\n\t\t\t\t\t\t\t\t\t\t\tvalue: \'admin\',\n\t\t\t\t\t\t\t\t\t\t\tlabel: \'Private\',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t]}\n\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t/>\n\t\t\t\t\t</FormSection>\n\t\t\t\t\t<FormFooter align="start">\n\t\t\t\t\t\t<ButtonGroup label="Form submit options">\n\t\t\t\t\t\t\t<Button type="submit" appearance="primary">\n\t\t\t\t\t\t\t\tCreate\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t<Button appearance="subtle" isLoading={submitting}>\n\t\t\t\t\t\t\t\tCancel\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t</ButtonGroup>\n\t\t\t\t\t</FormFooter>\n\t\t\t\t</form>\n\t\t\t)}\n\t\t</Form>\n\t</Flex>\n);\nexport default FormDefaultExample;',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'Child content to render in the form below the title and description.',
			},
			{
				name: 'description',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'Description or subtitle of the form.',
			},
			{
				name: 'title',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'Title of the form. This is a header.',
			},
		],
	},
	{
		name: 'FormSection',
		package: '@atlaskit/form',
		description: 'A section within a form that groups related fields together.',
		status: 'general-availability',
		usageGuidelines: [
			'Use to group related fields logically',
			'Optional title for section heading',
			'Improves form scannability',
		],
		contentGuidelines: ['Use clear section titles when provided', 'Group related fields together'],
		keywords: ['form', 'section', 'group', 'fields'],
		category: 'form',
		examples: [
			'import React, { Fragment } from \'react\';\nimport ButtonGroup from \'@atlaskit/button/button-group\';\nimport Button from \'@atlaskit/button/new\';\nimport Form, {\n\tErrorMessage,\n\tField,\n\tFormFooter,\n\tFormHeader,\n\tFormSection,\n\tHelperMessage,\n\tMessageWrapper,\n\tRequiredAsterisk,\n\tValidMessage,\n} from \'@atlaskit/form\';\nimport { Flex } from \'@atlaskit/primitives/compiled\';\nimport { RadioGroup } from \'@atlaskit/radio\';\nimport TextField from \'@atlaskit/textfield\';\nconst FormDefaultExample = (): React.JSX.Element => (\n\t<Flex direction="column">\n\t\t<Form<{ schema: string; key: string; type: string }>\n\t\t\tnoValidate\n\t\t\tonSubmit={(data) => {\n\t\t\t\tconsole.log(\'form data\', data);\n\t\t\t\treturn new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>\n\t\t\t\t\t!data.schema ? { schema: \'A schema name is required\' } : undefined,\n\t\t\t\t);\n\t\t\t}}\n\t\t>\n\t\t\t{({ formProps, submitting }) => (\n\t\t\t\t<form {...formProps} name="create">\n\t\t\t\t\t<FormHeader title="Create schema">\n\t\t\t\t\t\t<p aria-hidden="true">\n\t\t\t\t\t\t\tRequired fields are marked with an asterisk <RequiredAsterisk />\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</FormHeader>\n\t\t\t\t\t<FormSection>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="schema"\n\t\t\t\t\t\t\tlabel="Schema name"\n\t\t\t\t\t\t\tisRequired\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tvalidate={(value) => (!value ? \'A schema name is required\' : undefined)}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{({ fieldProps, error }) => {\n\t\t\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t\t\t<Fragment>\n\t\t\t\t\t\t\t\t\t\t<TextField autoComplete="off" {...fieldProps} />\n\t\t\t\t\t\t\t\t\t\t<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>\n\t\t\t\t\t\t\t\t\t</Fragment>\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="key"\n\t\t\t\t\t\t\tlabel="Key"\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tisRequired\n\t\t\t\t\t\t\tvalidate={(value) => {\n\t\t\t\t\t\t\t\tif (!value) {\n\t\t\t\t\t\t\t\t\treturn \'A key is required\';\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tif (value.length < 8) {\n\t\t\t\t\t\t\t\t\treturn \'Key needs to be at least 8 characters.\';\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{({ fieldProps, error, valid, meta }) => {\n\t\t\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t\t\t<Fragment>\n\t\t\t\t\t\t\t\t\t\t<TextField type="key" {...fieldProps} />\n\t\t\t\t\t\t\t\t\t\t<MessageWrapper>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t\tCreate a unique key, minimum of 8 characters. Example key: IT-infrastructure\n\t\t\t\t\t\t\t\t\t\t\t</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t{error && <ErrorMessage>{error}</ErrorMessage>}\n\t\t\t\t\t\t\t\t\t\t\t{valid && meta.dirty ? <ValidMessage>Key is unique</ValidMessage> : null}\n\t\t\t\t\t\t\t\t\t\t</MessageWrapper>\n\t\t\t\t\t\t\t\t\t</Fragment>\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="type"\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tlabel="Schema type"\n\t\t\t\t\t\t\tcomponent={({ fieldProps }) => (\n\t\t\t\t\t\t\t\t<RadioGroup\n\t\t\t\t\t\t\t\t\toptions={[\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\tname: \'type\',\n\t\t\t\t\t\t\t\t\t\t\tvalue: \'project-admin\',\n\t\t\t\t\t\t\t\t\t\t\tlabel: \'Public\',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\tname: \'type\',\n\t\t\t\t\t\t\t\t\t\t\tvalue: \'admin\',\n\t\t\t\t\t\t\t\t\t\t\tlabel: \'Private\',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t]}\n\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t/>\n\t\t\t\t\t</FormSection>\n\t\t\t\t\t<FormFooter align="start">\n\t\t\t\t\t\t<ButtonGroup label="Form submit options">\n\t\t\t\t\t\t\t<Button type="submit" appearance="primary">\n\t\t\t\t\t\t\t\tCreate\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t<Button appearance="subtle" isLoading={submitting}>\n\t\t\t\t\t\t\t\tCancel\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t</ButtonGroup>\n\t\t\t\t\t</FormFooter>\n\t\t\t\t</form>\n\t\t\t)}\n\t\t</Form>\n\t</Flex>\n);\nexport default FormDefaultExample;',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'Content or components to render after the description.',
			},
			{
				name: 'description',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'Description of the contents of the section.',
			},
			{
				name: 'title',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'Title of the form section.',
			},
		],
	},
	{
		name: 'HelperMessage',
		package: '@atlaskit/form',
		description: 'Displays helper or hint text for a form field.',
		status: 'general-availability',
		usageGuidelines: [
			'Use within MessageWrapper to show instructions or hints',
			'Place below the form control',
			'Use for critical info—not placeholder alone',
		],
		contentGuidelines: ['Provide clear, actionable instructions', 'Keep helper text concise'],
		keywords: ['form', 'helper', 'message', 'hint'],
		category: 'form',
		examples: [
			'import React, { Fragment } from \'react\';\nimport ButtonGroup from \'@atlaskit/button/button-group\';\nimport Button from \'@atlaskit/button/new\';\nimport Form, {\n\tErrorMessage,\n\tField,\n\tFormFooter,\n\tFormHeader,\n\tFormSection,\n\tHelperMessage,\n\tMessageWrapper,\n\tRequiredAsterisk,\n\tValidMessage,\n} from \'@atlaskit/form\';\nimport { Flex } from \'@atlaskit/primitives/compiled\';\nimport { RadioGroup } from \'@atlaskit/radio\';\nimport TextField from \'@atlaskit/textfield\';\nconst FormDefaultExample = (): React.JSX.Element => (\n\t<Flex direction="column">\n\t\t<Form<{ schema: string; key: string; type: string }>\n\t\t\tnoValidate\n\t\t\tonSubmit={(data) => {\n\t\t\t\tconsole.log(\'form data\', data);\n\t\t\t\treturn new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>\n\t\t\t\t\t!data.schema ? { schema: \'A schema name is required\' } : undefined,\n\t\t\t\t);\n\t\t\t}}\n\t\t>\n\t\t\t{({ formProps, submitting }) => (\n\t\t\t\t<form {...formProps} name="create">\n\t\t\t\t\t<FormHeader title="Create schema">\n\t\t\t\t\t\t<p aria-hidden="true">\n\t\t\t\t\t\t\tRequired fields are marked with an asterisk <RequiredAsterisk />\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</FormHeader>\n\t\t\t\t\t<FormSection>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="schema"\n\t\t\t\t\t\t\tlabel="Schema name"\n\t\t\t\t\t\t\tisRequired\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tvalidate={(value) => (!value ? \'A schema name is required\' : undefined)}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{({ fieldProps, error }) => {\n\t\t\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t\t\t<Fragment>\n\t\t\t\t\t\t\t\t\t\t<TextField autoComplete="off" {...fieldProps} />\n\t\t\t\t\t\t\t\t\t\t<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>\n\t\t\t\t\t\t\t\t\t</Fragment>\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="key"\n\t\t\t\t\t\t\tlabel="Key"\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tisRequired\n\t\t\t\t\t\t\tvalidate={(value) => {\n\t\t\t\t\t\t\t\tif (!value) {\n\t\t\t\t\t\t\t\t\treturn \'A key is required\';\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tif (value.length < 8) {\n\t\t\t\t\t\t\t\t\treturn \'Key needs to be at least 8 characters.\';\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{({ fieldProps, error, valid, meta }) => {\n\t\t\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t\t\t<Fragment>\n\t\t\t\t\t\t\t\t\t\t<TextField type="key" {...fieldProps} />\n\t\t\t\t\t\t\t\t\t\t<MessageWrapper>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t\tCreate a unique key, minimum of 8 characters. Example key: IT-infrastructure\n\t\t\t\t\t\t\t\t\t\t\t</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t{error && <ErrorMessage>{error}</ErrorMessage>}\n\t\t\t\t\t\t\t\t\t\t\t{valid && meta.dirty ? <ValidMessage>Key is unique</ValidMessage> : null}\n\t\t\t\t\t\t\t\t\t\t</MessageWrapper>\n\t\t\t\t\t\t\t\t\t</Fragment>\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="type"\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tlabel="Schema type"\n\t\t\t\t\t\t\tcomponent={({ fieldProps }) => (\n\t\t\t\t\t\t\t\t<RadioGroup\n\t\t\t\t\t\t\t\t\toptions={[\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\tname: \'type\',\n\t\t\t\t\t\t\t\t\t\t\tvalue: \'project-admin\',\n\t\t\t\t\t\t\t\t\t\t\tlabel: \'Public\',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\tname: \'type\',\n\t\t\t\t\t\t\t\t\t\t\tvalue: \'admin\',\n\t\t\t\t\t\t\t\t\t\t\tlabel: \'Private\',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t]}\n\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t/>\n\t\t\t\t\t</FormSection>\n\t\t\t\t\t<FormFooter align="start">\n\t\t\t\t\t\t<ButtonGroup label="Form submit options">\n\t\t\t\t\t\t\t<Button type="submit" appearance="primary">\n\t\t\t\t\t\t\t\tCreate\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t<Button appearance="subtle" isLoading={submitting}>\n\t\t\t\t\t\t\t\tCancel\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t</ButtonGroup>\n\t\t\t\t\t</FormFooter>\n\t\t\t\t</form>\n\t\t\t)}\n\t\t</Form>\n\t</Flex>\n);\nexport default FormDefaultExample;',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'The content of the message',
				isRequired: true,
			},
		],
	},
	{
		name: 'Label',
		package: '@atlaskit/form',
		description:
			'A label component for form fields. Usually used internally by Field, but can be used standalone.',
		status: 'general-availability',
		usageGuidelines: [
			'Use with Field for field labels',
			'Associate with form controls via htmlFor',
		],
		contentGuidelines: ['Use clear, descriptive labels'],
		keywords: ['form', 'label'],
		category: 'form',
		examples: [
			'import { Label } from \'@atlaskit/form\';\nimport { Flex } from \'@atlaskit/primitives/compiled\';\nimport TextField from \'@atlaskit/textfield\';\nconst LabelStandaloneExample = (): React.JSX.Element => (\n\t<Flex direction="column">\n\t\t<Label htmlFor="label-standalone-email">Work email</Label>\n\t\t<TextField id="label-standalone-email" name="email" type="email" />\n\t</Flex>\n);\nexport default LabelStandaloneExample;',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				isRequired: true,
			},
			{
				name: 'htmlFor',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'id',
				type: 'string',
			},
		],
	},
	{
		name: 'Legend',
		package: '@atlaskit/form',
		description:
			'A legend component for fieldset groups. Used with Fieldset for grouping related fields.',
		status: 'general-availability',
		usageGuidelines: [
			'Use with Fieldset to describe a group of fields',
			'Required for accessibility',
		],
		contentGuidelines: ['Use clear, descriptive legend text'],
		keywords: ['form', 'legend', 'fieldset'],
		category: 'form',
		examples: [
			'import { Checkbox } from \'@atlaskit/checkbox\';\nimport Form, { CheckboxField, Fieldset } from \'@atlaskit/form\';\nimport { Box } from \'@atlaskit/primitives/compiled\';\nconst FormFieldsetExample = (): React.JSX.Element => (\n\t<Box>\n\t\t<Form onSubmit={(data) => console.log(data)}>\n\t\t\t<Fieldset legend="Apps">\n\t\t\t\t<CheckboxField name="app" value="jira">\n\t\t\t\t\t{({ fieldProps }) => <Checkbox {...fieldProps} label="Jira" />}\n\t\t\t\t</CheckboxField>\n\t\t\t\t<CheckboxField name="app" value="confluence">\n\t\t\t\t\t{({ fieldProps }) => <Checkbox {...fieldProps} label="Confluence" />}\n\t\t\t\t</CheckboxField>\n\t\t\t\t<CheckboxField name="app" value="bitbucket">\n\t\t\t\t\t{({ fieldProps }) => <Checkbox {...fieldProps} label="Bitbucket" />}\n\t\t\t\t</CheckboxField>\n\t\t\t</Fieldset>\n\t\t\t<Fieldset legend="Teams">\n\t\t\t\t<CheckboxField name="teams" value="dst">\n\t\t\t\t\t{({ fieldProps }) => <Checkbox {...fieldProps} label="Design System Team" />}\n\t\t\t\t</CheckboxField>\n\t\t\t\t<CheckboxField name="teams" value="design-ops">\n\t\t\t\t\t{({ fieldProps }) => <Checkbox {...fieldProps} label="Design Ops" />}\n\t\t\t\t</CheckboxField>\n\t\t\t\t<CheckboxField name="teams" value="content">\n\t\t\t\t\t{({ fieldProps }) => <Checkbox {...fieldProps} label="Content Ops" />}\n\t\t\t\t</CheckboxField>\n\t\t\t</Fieldset>\n\t\t</Form>\n\t</Box>\n);\nexport default FormFieldsetExample;',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				isRequired: true,
			},
		],
	},
	{
		name: 'MessageWrapper',
		package: '@atlaskit/form',
		description:
			'A wrapper for form field messages (HelperMessage, ErrorMessage, ValidMessage). Manages layout and visibility.',
		status: 'general-availability',
		usageGuidelines: [
			'Wrap HelperMessage, ErrorMessage, and ValidMessage in MessageWrapper',
			'Place below the form control within Field',
		],
		keywords: ['form', 'message', 'wrapper'],
		category: 'form',
		examples: [
			'import { ErrorMessage, HelperMessage, MessageWrapper, ValidMessage } from \'@atlaskit/form\';\nimport Link from \'@atlaskit/link\';\nimport Lozenge from \'@atlaskit/lozenge\';\nexport default function MessagesExample(): React.JSX.Element {\n\treturn (\n\t\t<div>\n\t\t\t{\n\t\t\t<div  style={{ width: \'max-content\' }}>\n\t\t\t\t<MessageWrapper>\n\t\t\t\t\t<HelperMessage testId="helper">This is a help message.</HelperMessage>\n\t\t\t\t\t<ErrorMessage testId="error">This is an error message.</ErrorMessage>\n\t\t\t\t\t<ValidMessage testId="valid">This is a success message.</ValidMessage>\n\t\t\t\t</MessageWrapper>\n\t\t\t</div>\n\t\t\t{\n\t\t\t<div  style={{ maxWidth: 240 }}>\n\t\t\t\t<MessageWrapper>\n\t\t\t\t\t<HelperMessage testId="helper--long">\n\t\t\t\t\t\tThis is a help message, but it\'s really really really long.\n\t\t\t\t\t</HelperMessage>\n\t\t\t\t\t<ErrorMessage testId="error--long">\n\t\t\t\t\t\tThis is an error message, but it\'s really really really long.\n\t\t\t\t\t</ErrorMessage>\n\t\t\t\t\t<ValidMessage testId="valid--long">\n\t\t\t\t\t\tThis is a validation message, but it\'s really really really long.\n\t\t\t\t\t</ValidMessage>\n\t\t\t\t</MessageWrapper>\n\t\t\t</div>\n\t\t\t{\n\t\t\t<div  style={{ maxWidth: 240 }}>\n\t\t\t\t<MessageWrapper>\n\t\t\t\t\t<HelperMessage testId="helper--long">\n\t\t\t\t\t\tThis message contains <strong>strong</strong> text.\n\t\t\t\t\t</HelperMessage>\n\t\t\t\t\t<ErrorMessage testId="error--long">\n\t\t\t\t\t\tThis message contains a link to{\' \'}\n\t\t\t\t\t\t<Link href="http://www.atlassian.com">the Atlassian website</Link>.\n\t\t\t\t\t</ErrorMessage>\n\t\t\t\t\t<ValidMessage testId="valid--long">\n\t\t\t\t\t\tThis message contains a <Lozenge appearance="success">success</Lozenge> lozenge.\n\t\t\t\t\t</ValidMessage>\n\t\t\t\t</MessageWrapper>\n\t\t\t</div>\n\t\t</div>\n\t);\n}',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'The content of the message',
				isRequired: true,
			},
		],
	},
	{
		name: 'RangeField',
		package: '@atlaskit/form',
		description: 'A form field for range/slider inputs. Wraps Range with form field behavior.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for numeric range selection',
			'Provide min, max, and step when needed',
			'Works with Range from @atlaskit/range',
		],
		keywords: ['form', 'range', 'field', 'slider'],
		category: 'form',
		examples: [
			'import Button from \'@atlaskit/button/new\';\nimport Form, { FormFooter, RangeField } from \'@atlaskit/form\';\nimport { Box } from \'@atlaskit/primitives/compiled\';\nimport Range from \'@atlaskit/range\';\nconst FormRangeFieldExample = (): React.JSX.Element => {\n\treturn (\n\t\t<Box>\n\t\t\t<Form onSubmit={(data) => console.log(data)}>\n\t\t\t\t<RangeField name="threshold" defaultValue={50} label="Threshold">\n\t\t\t\t\t{({ fieldProps }) => <Range {...fieldProps} min={0} max={70} />}\n\t\t\t\t</RangeField>\n\t\t\t\t<FormFooter align="start">\n\t\t\t\t\t<Button type="submit" appearance="primary">\n\t\t\t\t\t\tSubmit\n\t\t\t\t\t</Button>\n\t\t\t\t</FormFooter>\n\t\t\t</Form>\n\t\t</Box>\n\t);\n};\nexport default FormRangeFieldExample;',
		],
		props: [
			{
				name: 'children',
				type: '(args: { fieldProps: RangeProps; error?: string; meta: Meta; }) => React.ReactNode',
				description:
					'Content to render in the range field. This function is called with props for the field component and other information about the field.',
				isRequired: true,
			},
			{
				name: 'defaultValue',
				type: 'number | ((currentDefaultValue?: number) => number)',
				description:
					'Sets the default value of the field. If a function is provided, it is called with the current default value of the field.',
				isRequired: true,
			},
			{
				name: 'id',
				type: 'string',
				description:
					'Value passed to the `id` attribute of the field. This is randomly generated if it is not specified.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					'Sets whether the field is disabled. Users cannot edit or focus on the fields. If the parent form component is disabled, then the field will always be disabled.',
			},
			{
				name: 'label',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Displays a label above the range field and identifies the form fields.',
			},
			{
				name: 'name',
				type: 'string',
				description:
					'Specifies the name of the field. This is important for referencing the form data.',
				isRequired: true,
			},
		],
	},
	{
		name: 'RequiredAsterisk',
		package: '@atlaskit/form',
		description:
			'Visual indicator for required fields. Renders an asterisk (*) for form accessibility.',
		status: 'general-availability',
		usageGuidelines: [
			'Use in FormHeader to indicate required fields legend',
			'Or use Field isRequired which handles asterisk automatically',
		],
		contentGuidelines: ['Pair with "Required fields are marked with an asterisk" text'],
		keywords: ['form', 'required', 'asterisk'],
		category: 'form',
		examples: [
			'import React, { Fragment } from \'react\';\nimport ButtonGroup from \'@atlaskit/button/button-group\';\nimport Button from \'@atlaskit/button/new\';\nimport Form, {\n\tErrorMessage,\n\tField,\n\tFormFooter,\n\tFormHeader,\n\tFormSection,\n\tHelperMessage,\n\tMessageWrapper,\n\tRequiredAsterisk,\n\tValidMessage,\n} from \'@atlaskit/form\';\nimport { Flex } from \'@atlaskit/primitives/compiled\';\nimport { RadioGroup } from \'@atlaskit/radio\';\nimport TextField from \'@atlaskit/textfield\';\nconst FormDefaultExample = (): React.JSX.Element => (\n\t<Flex direction="column">\n\t\t<Form<{ schema: string; key: string; type: string }>\n\t\t\tnoValidate\n\t\t\tonSubmit={(data) => {\n\t\t\t\tconsole.log(\'form data\', data);\n\t\t\t\treturn new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>\n\t\t\t\t\t!data.schema ? { schema: \'A schema name is required\' } : undefined,\n\t\t\t\t);\n\t\t\t}}\n\t\t>\n\t\t\t{({ formProps, submitting }) => (\n\t\t\t\t<form {...formProps} name="create">\n\t\t\t\t\t<FormHeader title="Create schema">\n\t\t\t\t\t\t<p aria-hidden="true">\n\t\t\t\t\t\t\tRequired fields are marked with an asterisk <RequiredAsterisk />\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</FormHeader>\n\t\t\t\t\t<FormSection>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="schema"\n\t\t\t\t\t\t\tlabel="Schema name"\n\t\t\t\t\t\t\tisRequired\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tvalidate={(value) => (!value ? \'A schema name is required\' : undefined)}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{({ fieldProps, error }) => {\n\t\t\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t\t\t<Fragment>\n\t\t\t\t\t\t\t\t\t\t<TextField autoComplete="off" {...fieldProps} />\n\t\t\t\t\t\t\t\t\t\t<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>\n\t\t\t\t\t\t\t\t\t</Fragment>\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="key"\n\t\t\t\t\t\t\tlabel="Key"\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tisRequired\n\t\t\t\t\t\t\tvalidate={(value) => {\n\t\t\t\t\t\t\t\tif (!value) {\n\t\t\t\t\t\t\t\t\treturn \'A key is required\';\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tif (value.length < 8) {\n\t\t\t\t\t\t\t\t\treturn \'Key needs to be at least 8 characters.\';\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{({ fieldProps, error, valid, meta }) => {\n\t\t\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t\t\t<Fragment>\n\t\t\t\t\t\t\t\t\t\t<TextField type="key" {...fieldProps} />\n\t\t\t\t\t\t\t\t\t\t<MessageWrapper>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t\tCreate a unique key, minimum of 8 characters. Example key: IT-infrastructure\n\t\t\t\t\t\t\t\t\t\t\t</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t{error && <ErrorMessage>{error}</ErrorMessage>}\n\t\t\t\t\t\t\t\t\t\t\t{valid && meta.dirty ? <ValidMessage>Key is unique</ValidMessage> : null}\n\t\t\t\t\t\t\t\t\t\t</MessageWrapper>\n\t\t\t\t\t\t\t\t\t</Fragment>\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="type"\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tlabel="Schema type"\n\t\t\t\t\t\t\tcomponent={({ fieldProps }) => (\n\t\t\t\t\t\t\t\t<RadioGroup\n\t\t\t\t\t\t\t\t\toptions={[\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\tname: \'type\',\n\t\t\t\t\t\t\t\t\t\t\tvalue: \'project-admin\',\n\t\t\t\t\t\t\t\t\t\t\tlabel: \'Public\',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\tname: \'type\',\n\t\t\t\t\t\t\t\t\t\t\tvalue: \'admin\',\n\t\t\t\t\t\t\t\t\t\t\tlabel: \'Private\',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t]}\n\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t/>\n\t\t\t\t\t</FormSection>\n\t\t\t\t\t<FormFooter align="start">\n\t\t\t\t\t\t<ButtonGroup label="Form submit options">\n\t\t\t\t\t\t\t<Button type="submit" appearance="primary">\n\t\t\t\t\t\t\t\tCreate\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t<Button appearance="subtle" isLoading={submitting}>\n\t\t\t\t\t\t\t\tCancel\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t</ButtonGroup>\n\t\t\t\t\t</FormFooter>\n\t\t\t\t</form>\n\t\t\t)}\n\t\t</Form>\n\t</Flex>\n);\nexport default FormDefaultExample;',
		],
		props: [
			{
				name: 'autocomplete',
				type: '"off" | "on"',
				description:
					"Indicates whether the value of the form's controls can be automatically completed by the browser. It is `on` by default.",
			},
			{
				name: 'children',
				type: '((args: FormChildrenArgs<FormValues>) => ReactNode) | (() => void) | ReactNode',
				description:
					'The contents rendered inside of the form. This is a function where the props will be passed from the form. The function props you can access are `dirty`, `submitting` and `disabled`.\nYou can read more about these props in [react-final form documentation](https://final-form.org/docs/final-form/types/FormState).\n\nIf you are only spreading `formProps` onto the HTML `<form>` element and not using any of the other props (like `submitting`, etc.), `children` can be plain JSX. All of the children will be wrapped within an HTML `<form>` element that includes all necessary props, including those provided on the form component.',
				isRequired: true,
			},
			{
				name: 'formProps',
				type: '{ [x: string]: any; } & ExcludeReservedFormProps',
				description:
					'When `Form` renders JSX children directly and not using a function to\nspread `formProps` manually, the properties in this `formProps` prop will\nbe spread on an internally rendered  HTML `form` element.',
			},
			{
				name: 'id',
				type: 'string',
				description: '`id` attribute applied to the `form` element.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					'Sets the form and its fields as disabled. Users cannot edit or focus on the fields.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Accessible name to be applied to the form element. Maps to the `aria-label` attribute.',
			},
			{
				name: 'labelId',
				type: 'string',
				description:
					'ID of the element that has the accessible name to be applied to the form element. Maps to the `aria-labelledby` attribute.',
			},
			{
				name: 'name',
				type: 'string',
				description: '`name` attribute applied to the `form` element.',
			},
			{
				name: 'noValidate',
				type: 'boolean',
				description:
					'Indicates if the inputs within the form will bypass HTML5 constraint\nvalidation when submitted. This is not recommended to be used because it\ncan cause experiences to be inaccessible. It is `false` by default but will\nbe set to `true` in the future to increase accessibility, so it is **not recommended**.',
			},
			{
				name: 'onSubmit',
				type: '(values: FormValues, form: FormApi<FormValues>, callback?: (errors?: Record<string, string>) => void) => void | Object | Promise<...>',
				description:
					'Event handler called when the form is submitted. Fields must be free of validation errors.',
				isRequired: true,
			},
			{
				name: 'xcss',
				type: 'false | (XCSSValue<"flex" | "grid" | "fill" | "stroke" | "all" | "bottom" | "left" | "right" | "top" | "clip" | "overlay" | "accentColor" | "alignContent" | "alignItems" | "alignSelf" | ... 486 more ... | "glyphOrientationVertical", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
			},
		],
	},
	{
		name: 'ValidMessage',
		package: '@atlaskit/form',
		description: 'Displays success or valid state feedback for a form field.',
		status: 'general-availability',
		usageGuidelines: [
			'Use within MessageWrapper when field passes validation',
			'Show positive feedback (e.g. "Username is available")',
			'Use sparingly to avoid clutter',
		],
		contentGuidelines: ['Keep valid messages concise'],
		keywords: ['form', 'valid', 'message', 'success'],
		category: 'form',
		examples: [
			'import React, { Fragment } from \'react\';\nimport ButtonGroup from \'@atlaskit/button/button-group\';\nimport Button from \'@atlaskit/button/new\';\nimport Form, {\n\tErrorMessage,\n\tField,\n\tFormFooter,\n\tFormHeader,\n\tFormSection,\n\tHelperMessage,\n\tMessageWrapper,\n\tRequiredAsterisk,\n\tValidMessage,\n} from \'@atlaskit/form\';\nimport { Flex } from \'@atlaskit/primitives/compiled\';\nimport { RadioGroup } from \'@atlaskit/radio\';\nimport TextField from \'@atlaskit/textfield\';\nconst FormDefaultExample = (): React.JSX.Element => (\n\t<Flex direction="column">\n\t\t<Form<{ schema: string; key: string; type: string }>\n\t\t\tnoValidate\n\t\t\tonSubmit={(data) => {\n\t\t\t\tconsole.log(\'form data\', data);\n\t\t\t\treturn new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>\n\t\t\t\t\t!data.schema ? { schema: \'A schema name is required\' } : undefined,\n\t\t\t\t);\n\t\t\t}}\n\t\t>\n\t\t\t{({ formProps, submitting }) => (\n\t\t\t\t<form {...formProps} name="create">\n\t\t\t\t\t<FormHeader title="Create schema">\n\t\t\t\t\t\t<p aria-hidden="true">\n\t\t\t\t\t\t\tRequired fields are marked with an asterisk <RequiredAsterisk />\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</FormHeader>\n\t\t\t\t\t<FormSection>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="schema"\n\t\t\t\t\t\t\tlabel="Schema name"\n\t\t\t\t\t\t\tisRequired\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tvalidate={(value) => (!value ? \'A schema name is required\' : undefined)}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{({ fieldProps, error }) => {\n\t\t\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t\t\t<Fragment>\n\t\t\t\t\t\t\t\t\t\t<TextField autoComplete="off" {...fieldProps} />\n\t\t\t\t\t\t\t\t\t\t<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>\n\t\t\t\t\t\t\t\t\t</Fragment>\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="key"\n\t\t\t\t\t\t\tlabel="Key"\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tisRequired\n\t\t\t\t\t\t\tvalidate={(value) => {\n\t\t\t\t\t\t\t\tif (!value) {\n\t\t\t\t\t\t\t\t\treturn \'A key is required\';\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tif (value.length < 8) {\n\t\t\t\t\t\t\t\t\treturn \'Key needs to be at least 8 characters.\';\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{({ fieldProps, error, valid, meta }) => {\n\t\t\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t\t\t<Fragment>\n\t\t\t\t\t\t\t\t\t\t<TextField type="key" {...fieldProps} />\n\t\t\t\t\t\t\t\t\t\t<MessageWrapper>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t\tCreate a unique key, minimum of 8 characters. Example key: IT-infrastructure\n\t\t\t\t\t\t\t\t\t\t\t</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t{error && <ErrorMessage>{error}</ErrorMessage>}\n\t\t\t\t\t\t\t\t\t\t\t{valid && meta.dirty ? <ValidMessage>Key is unique</ValidMessage> : null}\n\t\t\t\t\t\t\t\t\t\t</MessageWrapper>\n\t\t\t\t\t\t\t\t\t</Fragment>\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t<Field\n\t\t\t\t\t\t\tname="type"\n\t\t\t\t\t\t\tdefaultValue=""\n\t\t\t\t\t\t\tlabel="Schema type"\n\t\t\t\t\t\t\tcomponent={({ fieldProps }) => (\n\t\t\t\t\t\t\t\t<RadioGroup\n\t\t\t\t\t\t\t\t\toptions={[\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\tname: \'type\',\n\t\t\t\t\t\t\t\t\t\t\tvalue: \'project-admin\',\n\t\t\t\t\t\t\t\t\t\t\tlabel: \'Public\',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\tname: \'type\',\n\t\t\t\t\t\t\t\t\t\t\tvalue: \'admin\',\n\t\t\t\t\t\t\t\t\t\t\tlabel: \'Private\',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t]}\n\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t/>\n\t\t\t\t\t</FormSection>\n\t\t\t\t\t<FormFooter align="start">\n\t\t\t\t\t\t<ButtonGroup label="Form submit options">\n\t\t\t\t\t\t\t<Button type="submit" appearance="primary">\n\t\t\t\t\t\t\t\tCreate\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t<Button appearance="subtle" isLoading={submitting}>\n\t\t\t\t\t\t\t\tCancel\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t</ButtonGroup>\n\t\t\t\t\t</FormFooter>\n\t\t\t\t</form>\n\t\t\t)}\n\t\t</Form>\n\t</Flex>\n);\nexport default FormDefaultExample;',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'The content of the message',
				isRequired: true,
			},
		],
	},
	{
		name: 'Heading',
		package: '@atlaskit/heading',
		description:
			'A component for creating accessible, consistently styled headings with proper hierarchy. Headings are sized to contrast with content, increase visual hierarchy, and help readers easily understand the structure of content.',
		status: 'general-availability',
		usageGuidelines: [
			'Use the `HeadingContextProvider` offering to maintain heading levels in complex layouts',
			'Maintain proper heading hierarchy',
			'Keep headings concise and meaningful',
			'Use sentence case for most headings',
			'Use the `color` prop for inverse text on dark backgrounds',
			'Do NOT use any inline styles, you must use the `size` (required) and `color` (optional) props available',
		],
		contentGuidelines: [
			'Use clear, descriptive heading text',
			'Maintain proper heading hierarchy',
			'Keep headings concise and meaningful',
			'Use sentence case for most headings',
			'Make headings descriptive of the content that follows',
		],
		accessibilityGuidelines: [
			'Maintain proper heading hierarchy (h1 to h6)',
			'Use only one h1 per page for main page titles',
			'Ensure minimum 4.5:1 color contrast for text readability',
			'Use clear, descriptive heading text that describes the content below',
		],
		keywords: [
			'heading',
			'title',
			'header',
			'typography',
			'text',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
		],
		category: 'primitive',
		examples: [
			'import Heading from \'@atlaskit/heading\';\nconst _default_1: React.JSX.Element[] = [\n\t<Heading size="xxlarge">Page Title</Heading>,\n\t<Heading size="large" color="color.text.inverse">\n\t\tInverted section title\n\t</Heading>,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'as',
				type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span"',
				description:
					'Allows the component to be rendered as the specified HTML element, overriding a default element set by the `size` prop.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'The text of the heading.',
				isRequired: true,
			},
			{
				name: 'color',
				type: '"color.text" | "color.text.inverse" | "color.text.warning.inverse"',
				description:
					'Token representing text color with a built-in fallback value.\nWill apply inverse text color automatically if placed within a Box with bold background color.\nDefaults to `color.text`.',
			},
			{
				name: 'id',
				type: 'string',
				description: 'Unique identifier for the heading HTML element.',
			},
			{
				name: 'size',
				type: '"xxlarge" | "xlarge" | "large" | "medium" | "small" | "xsmall" | "xxsmall"',
				description:
					'Determines which text styles are applied. A corresponding HTML element is automatically applied from h1 to h6 based on the size.\nThis can be overriden using the `as` prop to allow for more flexibility.',
				isRequired: true,
			},
		],
	},
	{
		name: 'HeadingContextProvider',
		package: '@atlaskit/heading',
		description:
			'A context provider that allows you to configure the default HTML heading level for all headings within its subtree. Useful for maintaining proper heading hierarchy in complex layouts.',
		status: 'general-availability',
		usageGuidelines: [
			'Wrap sections that need different heading hierarchy',
			'Use for complex layouts where heading levels need adjustment',
		],
		contentGuidelines: [
			'Ensure proper heading hierarchy is maintained',
			'Use clear, descriptive heading text',
			'Keep headings concise and meaningful',
		],
		keywords: ['heading', 'context', 'provider', 'hierarchy', 'accessibility'],
		category: 'primitive',
		examples: [
			'import Heading, { HeadingContextProvider } from \'@atlaskit/heading\';\nconst _default_1: React.JSX.Element[] = [\n\t<HeadingContextProvider>\n\t\t<Heading size="xxlarge">h1</Heading>\n\t\t<Heading size="medium">h2</Heading>\n\t\t<Heading size="large">h3</Heading>\n\t</HeadingContextProvider>,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Semantic hierarchy of content below the heading context.',
				isRequired: true,
			},
			{
				name: 'value',
				type: '0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9',
				description:
					'Optional - only apply this value if the intent is to reset the heading context outside the normal content flow, for example inside a `section`.',
			},
		],
	},
	{
		name: 'Icon',
		package: '@atlaskit/icon',
		description: 'An icon is a symbol representing a command, device, directory, or common action.',
		status: 'general-availability',
		usageGuidelines: [
			'Use icons to enhance visual communication',
			'Choose icons that clearly represent their function',
			'Maintain consistent icon style and size',
			'Use appropriate icon sizes for different contexts',
			'Consider cultural and contextual icon meanings',
		],
		contentGuidelines: [
			'Use clear, recognizable icon symbols',
			'Ensure icons are culturally appropriate',
			'Maintain visual consistency across icon sets',
			'Use appropriate icon labels and descriptions',
		],
		accessibilityGuidelines: [
			'Provide appropriate alt text or labels for icons',
			'Use meaningful icon choices that convey clear meaning',
			'Ensure sufficient color contrast for icon visibility',
			'Consider icon size for touch targets',
			'Use consistent iconography across the interface',
		],
		keywords: ['icon', 'symbol', 'command', 'device', 'directory', 'action', 'visual'],
		category: 'images-and-icons',
		examples: [
			"import AddIcon from '@atlaskit/icon/core/add';\nimport DeleteIcon from '@atlaskit/icon/core/delete';\nimport StarIcon from '@atlaskit/icon/core/star-starred';\nimport { token } from '@atlaskit/tokens';\nconst _default_1: React.JSX.Element[] = [\n\t<AddIcon label=\"Add\" />,\n\t<StarIcon label=\"Star\" color=\"currentColor\" />,\n\t<DeleteIcon label=\"Delete\" color={token('color.icon.danger')} />,\n];\nexport default _default_1;",
		],
		props: [
			{
				name: 'color',
				type: '"var(--ds-link-pressed)" | "var(--ds-link-visited-pressed)" | "var(--ds-link)" | "var(--ds-link-visited)" | "var(--ds-icon)" | "var(--ds-icon-accent-lime)" | "var(--ds-icon-accent-red)" | ... 58 more ... | "currentColor"',
				description:
					"Color for the icon. Supports any icon or text design token, or 'currentColor' to inherit the current text color.\nDefaults to `currentColor`, inheriting the current text color.",
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Text used to describe what the icon is in context.\nA label is needed when there is no pairing visible text next to the icon.\nAn empty string marks the icon as presentation only.',
				isRequired: true,
			},
			{
				name: 'name',
				type: 'string',
				description: 'Display name of the icon.',
			},
			{
				name: 'shouldRecommendSmallIcon',
				type: 'boolean',
			},
			{
				name: 'size',
				type: 'IconSize | ((iconName: string) => IconSize)',
				description:
					"There are two icon sizes available:\n- `medium` - 16px. (default).\n- `small` - 12px.\n\nAlternatively a function can be passed to determine the size\nbased on the icon's name, which can be useful for dynamic rendering.",
			},
		],
	},
	{
		name: 'IconTile',
		package: '@atlaskit/icon',
		description:
			'A tile component that displays an icon with customizable background, shape, and appearance.',
		status: 'release-candidate',
		usageGuidelines: [
			'Use for icon presentation with background styling',
			'Choose appropriate shapes and appearances',
			'Maintain consistent sizing across tiles',
			'Use for visual emphasis or categorization',
		],
		contentGuidelines: [
			'Use clear, recognizable icons',
			'Choose appropriate colors and shapes',
			'Ensure visual consistency across tiles',
		],
		accessibilityGuidelines: [
			'Provide appropriate labels for icon tiles',
			'Ensure sufficient color contrast',
			'Use meaningful icon choices',
			'Consider touch target sizes',
		],
		keywords: ['icon', 'tile', 'container', 'background', 'shape', 'appearance'],
		category: 'images-and-icons',
		examples: [
			'import { IconTile } from \'@atlaskit/icon\';\nimport AddIcon from \'@atlaskit/icon/core/add\';\nconst _default_1: React.JSX.Element[] = [\n\t<IconTile icon={AddIcon} label="Add" appearance="redBold" />,\n\t<IconTile icon={AddIcon} label="Add" shape="circle" appearance="blue" />,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'appearance',
				type: '"gray" | "blue" | "teal" | "green" | "lime" | "yellow" | "orange" | "red" | "magenta" | "purple" | "grayBold" | "blueBold" | "tealBold" | "greenBold" | "limeBold" | "yellowBold" | "orangeBold" | "redBold" | "magentaBold" | "purpleBold"',
				description: 'The appearance of the tile',
				isRequired: true,
			},
			{
				name: 'icon',
				type: 'React.ComponentClass<NewCoreIconProps, any> | React.FunctionComponent<NewCoreIconProps>',
				description: 'The icon to display',
				isRequired: true,
			},
			{
				name: 'label',
				type: 'string',
				description: 'The label for the icon',
				isRequired: true,
			},
			{
				name: 'size',
				type: 'NewIconTileSize | LegacyIconTileSize',
				description:
					'Size of the tile, in pixels. Defaults to `24`.\n\nNow supports both semantic t-shirt size names and pixel number values. Pixel number values are deprecated and will be removed in a future release, however they will both be available and backwards-compatible during a transition period.\n\nSize `16` will not have a replacement after deprecation, and should be replaced with direct icons without a tile or enlarging to the next available size `xsmall`.\n\nAll available sizes:\n- `16` (deprecated)\n- `xsmall` (new)\n- `small` or `24`\n- `medium` or `32`\n- `large` or `40`\n- `xlarge` or `48`',
			},
		],
	},
	{
		name: 'Image',
		package: '@atlaskit/image',
		description: 'A component for displaying images with theme support.',
		status: 'open-beta',
		usageGuidelines: [
			'Use for displaying images in content',
			'Provide appropriate alt text',
			'Consider responsive image sizing',
			'Handle loading and error states',
		],
		contentGuidelines: [
			'Use clear, descriptive alt text',
			'Choose appropriate image dimensions',
			'Consider image quality and file size',
			'Use meaningful image content',
		],
		accessibilityGuidelines: [
			'Always provide meaningful alt text',
			'Ensure appropriate image sizing',
			'Consider loading states and error handling',
			'Use appropriate image formats',
		],
		keywords: ['image', 'picture', 'photo', 'visual', 'media'],
		category: 'data-display',
		examples: [
			'import Image from \'@atlaskit/image\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<Image src="https://picsum.photos/300/150" alt="Wide view" width={300} height={150} />\n\t\t<Image src="https://picsum.photos/100/100" alt="User profile" width={100} height={100} />\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'srcDark',
				type: 'string',
				description:
					'Image URL to use for dark mode. This overrides `src` when the user\nhas selected dark mode either in the app or on their operating system.',
			},
		],
	},
	{
		name: 'InlineEdit',
		package: '@atlaskit/inline-edit',
		description:
			'An inline edit displays a custom input component that switches between reading and editing on the same page.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when you need custom input components or layout',
			'Use InlineEditableTextfield for standard text field use cases',
			'Provide clear edit state indicators',
		],
		contentGuidelines: [
			'Use clear, descriptive text content',
			'Provide helpful placeholder text',
			'Use appropriate validation messages',
			'Keep content concise but meaningful',
		],
		accessibilityGuidelines: [
			'Ensure proper focus management',
			'Provide clear edit state indicators',
			'Use appropriate ARIA attributes',
			'Consider keyboard navigation',
		],
		keywords: ['inline', 'edit', 'editable', 'text', 'input'],
		category: 'form',
		examples: [
			'import InlineEdit from \'@atlaskit/inline-edit\';\nconst Example = (): React.JSX.Element => (\n\t<InlineEdit\n\t\tonConfirm={() => {}}\n\t\tonCancel={() => {}}\n\t\tdefaultValue="Editable text"\n\t\teditView={() => <div>Edit view</div>}\n\t\treadView={() => <div>Read view</div>}\n\t/>\n);\nexport default Example;',
		],
		props: [
			{
				name: 'cancelButtonLabel',
				type: 'string',
				description: 'Accessibility label for the cancel action button.',
			},
			{
				name: 'confirmButtonLabel',
				type: 'string',
				description:
					'Accessibility label for the confirm action button, which saves the field value into `editValue`.',
			},
			{
				name: 'defaultValue',
				type: 'any',
				description:
					'The user input entered into the field during `editView`. This value is updated and saved by `onConfirm`.',
				isRequired: true,
			},
			{
				name: 'editButtonLabel',
				type: 'string',
				description:
					'Accessibility label for button, which is used to enter `editView` from keyboard.',
			},
			{
				name: 'editLabel',
				type: 'string',
				description:
					"Append 'edit' to the end of the button label (`editButtonLabel`)which allows\nusers of assistive technologies to understand the purpose of the button",
			},
			{
				name: 'editView',
				type: '(fieldProps: ExtendedFieldProps<FieldValue>, ref: React.RefObject<any>) => React.ReactNode',
				description:
					'The component shown when user is editing (when the inline edit is not in `readView`).',
				isRequired: true,
			},
			{
				name: 'hideActionButtons',
				type: 'boolean',
				description:
					'Sets whether the confirm and cancel action buttons are displayed in the bottom right of the field.',
			},
			{
				name: 'isEditing',
				type: 'boolean',
				description:
					'Sets whether the component shows the `readView` or the `editView`. This is used to manage the state of the input in stateless inline edit.',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'Determines whether the input value can be confirmed as empty.',
			},
			{
				name: 'keepEditViewOpenOnBlur',
				type: 'boolean',
				description:
					'Sets the view when the element blurs and loses focus (this can happen when a user clicks away).\nWhen set to true, inline edit stays in `editView` when blurred.',
			},
			{
				name: 'label',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Label above the input field that communicates what value should be entered.',
			},
			{
				name: 'onCancel',
				type: '() => void',
				description:
					'Exits `editView` and switches back to `readView`. This is called when the cancel action button (x) is clicked.',
			},
			{
				name: 'onConfirm',
				type: '(value: any, analyticsEvent: UIAnalyticsEvent) => void',
				description:
					'Saves and confirms the value entered into the field. It exits `editView` and returns to `readView`.',
				isRequired: true,
			},
			{
				name: 'onEdit',
				type: '() => void',
				description: 'Handler called when readView is clicked.',
			},
			{
				name: 'readView',
				type: '() => React.ReactNode',
				description:
					'The component shown when not in `editView`. This is when the inline edit is read-only and not being edited.',
				isRequired: true,
			},
			{
				name: 'readViewFitContainerWidth',
				type: 'boolean',
				description:
					'Determines whether the `readView` has 100% width within its container, or whether it fits the content.',
			},
			{
				name: 'startWithEditViewOpen',
				type: 'boolean',
				description:
					'Determines whether it begins in `editView` or `readView`. When set to true, `isEditing` begins as true and the inline edit\nstarts in `editView`.',
			},
			{
				name: 'validate',
				type: '(value: any, formState: {}, fieldState: {}) => string | void | Promise<string | void>',
				description:
					'Displays an inline dialog with a message when the field input is invalid. This is handled by `react-final-form`.',
			},
		],
	},
	{
		name: 'InlineEditableTextfield',
		package: '@atlaskit/inline-edit',
		description:
			'An inline editable text field displays a text field that switches between reading and editing on the same page.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for existing content in a text field that may need tweaking',
			'Use where multiple items on a page can be edited at once',
			"Don't use if the main function of the screen is editing—use a text area instead",
			'Use InlineEdit when you need custom input components',
		],
		contentGuidelines: [
			'Use concise, sentence case labels',
			'Customise placeholder text for empty state',
			'Keep labels descriptive of the field',
		],
		accessibilityGuidelines: [
			'Ensure proper focus management between read and edit states',
			'Provide clear save/cancel controls',
			'Use appropriate ARIA attributes',
		],
		keywords: ['inline', 'edit', 'editable', 'textfield', 'text', 'input'],
		category: 'form',
		examples: [
			"import React, { useState } from 'react';\nimport { InlineEditableTextfield } from '@atlaskit/inline-edit';\nimport { Box } from '@atlaskit/primitives/compiled';\nconst InlineEditableTextfieldDefault = (): React.JSX.Element => {\n\tconst placeholderLabel = 'Initial description value';\n\tconst [editValue, setEditValue] = useState('Default description value');\n\tconst validate = (value: string) => {\n\t\tif (value.length <= 6) {\n\t\t\treturn 'Please enter a description longer than 6 characters';\n\t\t}\n\t\treturn undefined;\n\t};\n\treturn (\n\t\t<Box paddingInline=\"space.100\" paddingBlockStart=\"space.100\" paddingBlockEnd=\"space.600\">\n\t\t\t<InlineEditableTextfield\n\t\t\t\tdefaultValue={editValue}\n\t\t\t\tlabel=\"Description\"\n\t\t\t\teditButtonLabel={editValue || placeholderLabel}\n\t\t\t\tonConfirm={(value) => setEditValue(value)}\n\t\t\t\tplaceholder={placeholderLabel}\n\t\t\t\tvalidate={validate}\n\t\t\t/>\n\t\t</Box>\n\t);\n};\nexport default InlineEditableTextfieldDefault;",
		],
		props: [
			{
				name: 'cancelButtonLabel',
				type: 'string',
				description: 'Accessibility label for the cancel action button.',
			},
			{
				name: 'confirmButtonLabel',
				type: 'string',
				description:
					'Accessibility label for the confirm action button, which saves the field value into `editValue`.',
			},
			{
				name: 'defaultValue',
				type: 'any',
				description:
					'The user input entered into the field during `editView`. This value is updated and saved by `onConfirm`.',
				isRequired: true,
			},
			{
				name: 'editButtonLabel',
				type: 'string',
				description:
					'Accessibility label for button, which is used to enter `editView` from keyboard.',
			},
			{
				name: 'editLabel',
				type: 'string',
				description:
					"Append 'edit' to the end of the button label (`editButtonLabel`)which allows\nusers of assistive technologies to understand the purpose of the button",
			},
			{
				name: 'hideActionButtons',
				type: 'boolean',
				description:
					'Sets whether the confirm and cancel action buttons are displayed in the bottom right of the field.',
			},
			{
				name: 'isCompact',
				type: 'boolean',
				description:
					'Sets height of the text field to compact. The top and bottom padding is decreased.',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'Determines whether the input value can be confirmed as empty.',
			},
			{
				name: 'keepEditViewOpenOnBlur',
				type: 'boolean',
				description:
					'Sets the view when the element blurs and loses focus (this can happen when a user clicks away).\nWhen set to true, inline edit stays in `editView` when blurred.',
			},
			{
				name: 'label',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Label above the input field that communicates what value should be entered.',
			},
			{
				name: 'onCancel',
				type: '() => void',
				description:
					'Exits `editView` and switches back to `readView`. This is called when the cancel action button (x) is clicked.',
			},
			{
				name: 'onConfirm',
				type: '(value: string, analyticsEvent: UIAnalyticsEvent) => void',
				description:
					'Calls the `editView` handler. It confirms the changes.\nThe field value is passed as an argument to this function.',
				isRequired: true,
			},
			{
				name: 'placeholder',
				type: 'string',
				description: 'Text shown in `readView` when the field value is an empty string.',
				isRequired: true,
			},
			{
				name: 'readViewFitContainerWidth',
				type: 'boolean',
				description:
					'Determines whether the `readView` has 100% width within its container, or whether it fits the content.',
			},
			{
				name: 'startWithEditViewOpen',
				type: 'boolean',
				description:
					'Determines whether it begins in `editView` or `readView`. When set to true, `isEditing` begins as true and the inline edit\nstarts in `editView`.',
			},
			{
				name: 'validate',
				type: '(value: any, formState: {}, fieldState: {}) => string | void | Promise<string | void>',
				description:
					'Displays an inline dialog with a message when the field input is invalid. This is handled by `react-final-form`.',
			},
		],
	},
	{
		name: 'InlineMessage',
		package: '@atlaskit/inline-message',
		description: 'In-context notification for more info, warning, error, or confirmation.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for in-context notifications: more info, warning, error, confirmation',
			'Icon/title/secondary can be used to reveal full message in a popup with context/links',
			'Keep content to a maximum of five lines (truncation is not accessible)',
			'Use Flag for minimal interaction; Banner for critical/system; Modal when immediate action is required',
		],
		contentGuidelines: [
			'Use clear, concise message text',
			'Provide specific, actionable feedback',
			'Use appropriate tone for message type',
			'Keep messages focused and relevant',
			'Warning: before action, empathy, offer alternative',
			'Error: explain and next step; use "we" not "you"',
			'Confirmation: confirm, then get out of the way',
			'Information: inform, no action needed',
			'Use clear, concise message text; keep focused and relevant',
		],
		accessibilityGuidelines: [
			'Keep to max five lines—truncation is not accessible',
			'Recommend a title; icon-only is easily missed by screen readers',
			'Use iconLabel when there is no title or when the icon adds context (e.g. error)',
			'Ensure message content is announced by screen readers',
			'Use appropriate message types and colors',
		],
		keywords: ['message', 'inline', 'feedback', 'status', 'alert'],
		category: 'feedback',
		examples: [
			'import InlineMessage from \'@atlaskit/inline-message\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<InlineMessage\n\t\t\ttitle="Success"\n\t\t\tsecondaryText="Your changes have been saved successfully."\n\t\t\tappearance="confirmation"\n\t\t/>\n\t\t<InlineMessage\n\t\t\ttitle="Warning"\n\t\t\tsecondaryText="This action cannot be undone."\n\t\t\tappearance="warning"\n\t\t/>\n\t\t<InlineMessage\n\t\t\ttitle="Error"\n\t\t\tsecondaryText="Something went wrong. Please try again."\n\t\t\tappearance="error"\n\t\t/>\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'appearance',
				type: '"connectivity" | "confirmation" | "info" | "warning" | "error"',
				description:
					'Set the icon to be used before the title. Options are: connectivity,\nconfirmation, info, warning, and error.',
				defaultValue: '"connectivity"',
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'The elements to be displayed by the popup.',
			},
			{
				name: 'fallbackPlacements',
				type: 'PopupPlacement[]',
				description:
					"This is a list of backup placements for the popup to try.\nWhen the preferred placement doesn't have enough space,\nthe modifier will test the ones provided in the list, and use the first suitable one.\nIf no fallback placements are suitable, it reverts back to the original placement.",
			},
			{
				name: 'iconLabel',
				type: 'string',
				description:
					'Text to be used as the label for the button icon. You must use this to provide information for people who use assistive technology when there is no title and/or secondaryText.',
			},
			{
				name: 'placement',
				type: 'AutoPlacement | BasePlacement | VariationPlacement',
				description:
					'The placement to be passed to the popup. Determines where around\nthe text the dialog is displayed.',
				defaultValue: '"bottom-start"',
			},
			{
				name: 'secondaryText',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'Text to display second.',
				defaultValue: '""',
			},
			{
				name: 'spacing',
				type: '"spacious" | "compact"',
				description:
					'The spacing of the underlying icon button. Options are: spacious and compact.',
				defaultValue: '"spacious"',
			},
			{
				name: 'title',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'Text to display first, bolded for emphasis.',
				defaultValue: '""',
			},
		],
	},
	{
		name: 'Link',
		package: '@atlaskit/link',
		description: 'A component for navigation links.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for navigation to other pages or sections, downloads, or contact (phone, email)',
			'Use default (underlined) with regular text so links are distinguishable',
			'Use subtle appearance only when context already indicates it is a link (e.g. nav, breadcrumbs)',
			'Use Link button when the link should look like a button',
			'Do not open in a new window without warning (e.g. icon or explicit indication)',
		],
		contentGuidelines: [
			'Use clear, descriptive link text that describes the destination',
			'Do not confuse with buttons—links navigate, buttons perform actions',
			"Avoid generic text like 'click here'",
		],
		accessibilityGuidelines: [
			'Do not use subtle appearance with regular body text—default has underline/color for distinguishability',
			'Use subtle only when context already indicates it is a link (e.g. nav, breadcrumbs)',
			'Provide clear link text that describes the destination',
			'Use appropriate ARIA attributes for links',
			'Ensure keyboard navigation support',
			'Provide clear visual indicators for link state',
		],
		keywords: ['link', 'navigation', 'href', 'anchor', 'url'],
		category: 'navigation',
		examples: [
			'import Link from \'@atlaskit/link\';\nconst _default_1: React.JSX.Element[] = [\n\t<Link href="/dashboard">Go to Dashboard</Link>,\n\t<Link href="https://atlassian.design" target="_blank">\n\t\tAtlassian Design System\n\t</Link>,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'appearance',
				type: '"default" | "subtle" | "inverse"',
				description:
					'The appearance of the link. Defaults to `default`. A `subtle` appearance will render the link with a lighter color and no underline in resting state. Use `inverse` when rendering on bold backgrounds to ensure that the link is easily visible.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'href',
				type: 'string | RouterLinkConfig',
				description:
					'Standard links can be provided as a string, which should be mapped to the\nunderlying router link component.\n\nAlternatively, you can provide an object for advanced link configurations\nby supplying the expected object type to the generic.\n\n@example\n```\nconst MyRouterLink = forwardRef(\n(\n  {\n    href,\n    children,\n    ...rest\n  }: RouterLinkComponentProps<{\n    href: string;\n    replace: boolean;\n  }>,\n  ref: Ref<HTMLAnchorElement>,\n) => { ...\n```',
				isRequired: true,
			},
			{
				name: 'newWindowLabel',
				type: 'string',
				description:
					'Override the default text to signify that a link opens in a new window.\nThis is appended to the `aria-label` attribute when the `target` prop is set to `_blank`.',
			},
			{
				name: 'onClick',
				type: '(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
				description:
					"Handler called on click. The second argument provides an Atlaskit UI analytics event that can be fired to a listening channel. See the ['analytics-next' package](https://atlaskit.atlassian.com/packages/analytics/analytics-next) documentation for more information.",
			},
		],
	},
	{
		name: 'AtlassianIcon',
		package: '@atlaskit/logo',
		description: 'A component for displaying the Atlassian icon.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for Atlassian brand representation',
			'Choose appropriate icon variants',
			'Consider icon sizing and placement',
			'Maintain brand consistency',
		],
		accessibilityGuidelines: [
			'Provide appropriate alt text for the icon',
			'Ensure icon visibility and contrast',
			'Consider icon sizing and placement',
			'Use appropriate icon variants',
		],
		keywords: ['logo', 'brand', 'atlassian', 'identity', 'header'],
		category: 'brand',
		examples: [
			'import { AtlassianIcon } from \'@atlaskit/logo\';\nconst _default_1: React.JSX.Element[] = [\n\t<AtlassianIcon appearance="brand" shouldUseNewLogoDesign />,\n\t<AtlassianIcon appearance="neutral" shouldUseNewLogoDesign />,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'appearance',
				type: '"brand" | "neutral" | "inverse"',
				description:
					'Choice of logo appearance between 3 brand-approved color combinations that will be hooked up to design tokens and theming.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					"Accessible text to be used for screen readers (it's optional since the default props provide a label that matches the logo).",
				defaultValue: '"Atlassian"',
			},
			{
				name: 'shouldUseNewLogoDesign',
				type: 'boolean',
				description:
					'For logos that support it, enables the new logo design ahead of an upcoming feature flag roll-out.',
			},
			{
				name: 'size',
				type: '"xxsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge"',
				description: 'The size of the icon.',
				defaultValue: 'defaultLogoParams.size',
			},
		],
	},
	{
		name: 'Lozenge',
		package: '@atlaskit/lozenge',
		description:
			"A lozenge is a visual indicator used to highlight an item's status for quick recognition.",
		status: 'general-availability',
		usageGuidelines: [
			'Subtle (default): for long tables and general use',
			'Bold: use sparingly (e.g. Pipeline/Jira status)',
			'Always combine color with a concise, accurate label',
			'Use Badge for tallies/counts; use Tag for labels',
		],
		contentGuidelines: [
			'Use clear, concise text; use accurate labels (e.g. "Error", "Warning")',
			'Do not use for long text—lozenge is not focusable and truncation at ~200px is not accessible',
			'Ensure text is meaningful and descriptive',
			'Use consistent terminology across lozenges',
		],
		accessibilityGuidelines: [
			'Do not rely on color alone; always pair with an accurate text label',
			'Ensure sufficient color contrast for text readability',
			'Do not use for long text—truncation is not accessible and lozenge is not focusable',
			'Provide appropriate labels for screen readers',
			'Consider color-blind users when choosing colors',
		],
		keywords: ['lozenge', 'badge', 'label', 'status', 'indicator', 'pill'],
		category: 'status-indicators',
		examples: [
			'import Lozenge from \'@atlaskit/lozenge\';\nconst _default_1: React.JSX.Element[] = [\n\t<Lozenge appearance="success">Done</Lozenge>,\n\t<Lozenge appearance="inprogress" isBold>\n\t\tIn Progress\n\t</Lozenge>,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'appearance',
				type: 'ThemeAppearance | "warning" | "danger" | "information" | "neutral" | "discovery" | AccentColor',
				description:
					'The appearance type.\nThe appearance of the lozenge. Supports legacy semantic appearances and new semantic colors.\nAccent appearance values.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'Elements to be rendered inside the lozenge. This should ideally be just a word or two.\nElements to be rendered inside the lozenge. This should ideally be just a word or two.',
			},
			{
				name: 'maxWidth',
				type: 'string | number',
				description:
					'max-width of lozenge container. Default to 200px.\nmax-width of lozenge container. Default to 200px.',
			},
		],
	},
	{
		name: 'LozengeDropdownTrigger',
		package: '@atlaskit/lozenge',
		description:
			"Lozenge dropdown trigger displays an item's status and enables switching through a menu.",
		status: 'open-beta',
		usageGuidelines: [
			'Use for status switching—only open a dropdown or popup to allow quick status changes',
			'Use spacious sizing when displayed alongside buttons',
			"Don't use to communicate other information like additional status details; use lozenge instead",
		],
		contentGuidelines: [
			'Use clear, concise status labels',
			'Keep labels short—max 200px width causes truncation and lozenges are not focusable',
			"Don't use color alone; use clear labels and supporting icons where relevant",
		],
		accessibilityGuidelines: [
			"Don't use color alone to signify state; use clear labels and icons",
			"Don't use long labels—truncation isn't accessible as lozenges can't be focused",
		],
		keywords: ['lozenge', 'dropdown', 'trigger', 'status', 'menu', 'interactive'],
		category: 'status-indicators',
		examples: [
			'import { LozengeDropdownTrigger } from \'@atlaskit/lozenge\';\nexport default (): React.JSX.Element => (\n\t<LozengeDropdownTrigger appearance="success">Success</LozengeDropdownTrigger>\n);',
		],
		props: [
			{
				name: 'appearance',
				type: '"default" | "inprogress" | "moved" | "new" | "removed" | "success" | "warning" | "danger" | "information" | "neutral" | "discovery" | AccentColor',
				description:
					'The appearance of the lozenge. Supports legacy semantic appearances and new semantic colors.\nAccent appearance values.',
			},
			{
				name: 'aria-controls',
				type: 'string',
				description:
					'Identifies the popup element that the trigger controls.\nShould match the `id` of the popup content for screen readers to understand the relationship.\nIdentifies the popup element that the trigger controls.\nShould match the `id` of the popup content for screen readers to understand the relationship.',
			},
			{
				name: 'aria-expanded',
				type: 'boolean',
				description:
					'Announces to assistive technology whether the popup is currently open or closed.\nAnnounces to assistive technology whether the popup is currently open or closed.',
			},
			{
				name: 'aria-haspopup',
				type: 'boolean | "dialog"',
				description:
					'Informs assistive technology that this element triggers a popup.\nInforms assistive technology that this element triggers a popup.',
			},
			{
				name: 'aria-label',
				type: 'string',
				description:
					'Defines a string value that labels the trigger element for assistive technology.\nDefines a string value that labels the trigger element for assistive technology.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'Elements to be rendered inside the lozenge. This should ideally be just a word or two.\nElements to be rendered inside the lozenge. This should ideally be just a word or two.',
			},
			{
				name: 'iconBefore',
				type: 'ComponentClass<Omit<NewIconProps, "spacing">, any> | FunctionComponent<Omit<NewIconProps, "spacing">>',
				description:
					'Icon to display before the text content. Should be an ADS icon component.\nIcon to display before the text content. Should be an ADS icon component.',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description:
					'Whether the dropdown trigger is in a loading state.\nWhen true, a spinner is shown and the trigger becomes non-interactive.\nWhether the dropdown trigger is in a loading state.\nWhen true, a spinner is shown and the trigger becomes non-interactive.',
			},
			{
				name: 'isSelected',
				type: 'boolean',
				description:
					'Whether the dropdown is currently selected/open.\nWhether the dropdown is currently selected/open.',
			},
			{
				name: 'maxWidth',
				type: 'string | number',
				description:
					'max-width of lozenge container. Default to 200px.\nmax-width of lozenge container. Default to 200px.',
			},
			{
				name: 'onClick',
				type: '(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
				description:
					'Callback fired when the trigger is clicked. The second argument provides an Atlaskit UI analytics event that can be fired to a listening channel. See the [analytics-next documentation](https://atlaskit.atlassian.com/packages/analytics/analytics-next) for more information.\nCallback fired when the trigger is clicked. The second argument provides an Atlaskit UI analytics event that can be fired to a listening channel. See the [analytics-next documentation](https://atlaskit.atlassian.com/packages/analytics/analytics-next) for more information.',
			},
			{
				name: 'spacing',
				type: '"default" | "spacious"',
				description:
					'Controls the overall spacing (padding + height) of the lozenge.\n\n- `default` matches the current visual appearance.\n- `spacious` increases padding and sets the lozenge height to 32px.\nControls the overall spacing (padding + height) of the lozenge.\n\n- `default` matches the current visual appearance.\n- `spacious` increases padding and sets the lozenge height to 32px.',
			},
			{
				name: 'trailingMetric',
				type: 'string',
				description:
					'Numeric metric displayed at the end of the lozenge as a badge.\nTrailing metric is not supported for accent lozenges.',
			},
			{
				name: 'trailingMetricAppearance',
				type: '"default" | "inprogress" | "moved" | "new" | "removed" | "success" | "warning" | "danger" | "information" | "neutral" | "discovery" | "inverse"',
				description:
					'Overrides the appearance of the trailing metric badge.\n\nIf not specified, the trailing metric badge inherits the lozenge appearance.\n\nThis prop is not supported for accent lozenges.\nTrailing metric appearance is not supported for accent lozenges.',
			},
		],
	},
	{
		name: 'ButtonItem',
		package: '@atlaskit/menu',
		description:
			'A menu item that triggers an action when clicked. Use for actions like Copy, Delete, or Create.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for actions that do not navigate (e.g. Copy, Create article)',
			'Combine with icons for clarity when they add meaning',
			'Use secondary text for context when helpful (e.g. project type)',
		],
		contentGuidelines: [
			'Use clear, action-oriented labels',
			'Use consistent terminology across menus',
		],
		keywords: ['menu', 'button', 'item', 'action'],
		category: 'navigation',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { cssMap, jsx } from '@compiled/react';\nimport { ButtonItem } from '@atlaskit/menu';\nimport { token } from '@atlaskit/tokens';\nimport ImgIcon from '../common/img-icon';\nimport Yeti from '../icons/yeti.png';\n// Mimics overrides in side-navigation\nconst styles = cssMap({\n\troot: {\n\t\tpaddingBlockStart: token('space.100'),\n\t\tpaddingInlineEnd: token('space.300'),\n\t\tpaddingBlockEnd: token('space.100'),\n\t\tpaddingInlineStart: token('space.300'),\n\t\tborderRadius: token('radius.small'),\n\t\tbackgroundColor: '#FAFBFC',\n\t\tcolor: '#42526E',\n\t\t'&:hover': {\n\t\t\tbackgroundColor: '#EBECF0',\n\t\t\ttextDecoration: 'none',\n\t\t\tcolor: '#42526E',\n\t\t},\n\t\t'&:active': {\n\t\t\tcolor: '#0052CC',\n\t\t\tbackgroundColor: '#DEEBFF',\n\t\t\tboxShadow: 'none',\n\t\t},\n\t\t'[data-item-elem-before]': {\n\t\t\tdisplay: 'flex',\n\t\t\theight: 8 * 1.25,\n\t\t\twidth: 8 * 1.25,\n\t\t\talignItems: 'center',\n\t\t\tjustifyContent: 'center',\n\t\t\tmarginInlineEnd: token('space.200'),\n\t\t},\n\t},\n\tdisabled: {\n\t\tcolor: token('color.text.disabled'),\n\t\tbackgroundColor: '#FAFBFC',\n\t\t'&:hover, &:active': {\n\t\t\tbackgroundColor: '#FAFBFC',\n\t\t\tcolor: token('color.text.disabled'),\n\t\t},\n\t},\n});\nconst _default: () => JSX.Element = () => (\n\t<div >\n\t\t<ButtonItem isSelected>Activate</ButtonItem>\n\t\t<ButtonItem isDisabled>Activate</ButtonItem>\n\t\t<ButtonItem>Activate</ButtonItem>\n\t\t<ButtonItem description=\"Next-gen software project\">Activate</ButtonItem>\n\t\t<ButtonItem description=\"Legacy software project\" isDisabled>\n\t\t\tActivate\n\t\t</ButtonItem>\n\t\t<ButtonItem iconBefore={<ImgIcon src={Yeti} alt=\"\" />} description=\"Next-gen software project\">\n\t\t\tActivate\n\t\t</ButtonItem>\n\t\t<ButtonItem css={styles.root} description=\"Style overrides\">\n\t\t\tActivate\n\t\t</ButtonItem>\n\t\t<ButtonItem isDisabled css={[styles.root, styles.disabled]} description=\"Style overrides\">\n\t\t\tActivate\n\t\t</ButtonItem>\n\t\t<ButtonItem css={styles.root} description=\"Style overrides\">\n\t\t\tActivate\n\t\t</ButtonItem>\n\t</div>\n);\nexport default _default;",
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Primary content for the item.',
			},
			{
				name: 'description',
				type: 'string | global.JSX.Element',
				description:
					'Description of the item.\nThis will render smaller text below the primary text of the item, and slightly increase the height of the item.',
			},
			{
				name: 'iconAfter',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'Element to render after the item text.\nUsually this is an [icon](https://atlaskit.atlassian.com/packages/design-system/icon) component.',
			},
			{
				name: 'iconBefore',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'Element to render before the item text.\nUsually this is an [icon](https://atlaskit.atlassian.com/packages/design-system/icon) component.',
			},
			{
				name: 'id',
				type: 'string',
				description: 'Unique identifier for the element.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					'Makes the element appear disabled as well as removing interactivity. Avoid disabling menu items wherever possible as this isn’t accessible or usable.',
			},
			{
				name: 'isSelected',
				type: 'boolean',
				description: 'Makes the element appear selected.',
			},
			{
				name: 'onClick',
				type: '(e: MouseEvent<HTMLElement, globalThis.MouseEvent> | KeyboardEvent<HTMLElement>) => void',
				description: "Event that's triggered when the element is clicked.",
			},
			{
				name: 'onMouseDown',
				type: '(event: MouseEvent<Element, globalThis.MouseEvent>) => void',
				description: "Event that's triggered when the element has been pressed.",
			},
			{
				name: 'role',
				type: 'string',
				description: 'Use this to override the accessibility role for the element.',
			},
			{
				name: 'shouldDescriptionWrap',
				type: 'boolean',
				description:
					"When `true`, the description of the item will wrap multiple lines if it's long enough.",
			},
			{
				name: 'shouldTitleWrap',
				type: 'boolean',
				description:
					"When `true`, the title of the item will wrap multiple lines if it's long enough.",
			},
		],
	},
	{
		name: 'CustomItem',
		package: '@atlaskit/menu',
		description:
			'A menu item that accepts a custom component for advanced use cases when ButtonItem or LinkItem do not meet your needs.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when ButtonItem or LinkItem cannot fulfill your requirements',
			'Preserve menu item styling and behavior in custom implementations',
		],
		contentGuidelines: [
			'Ensure custom components maintain accessibility',
			'Keep custom implementations minimal',
		],
		keywords: ['menu', 'custom', 'item', 'component'],
		category: 'navigation',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { cssMap, jsx } from '@compiled/react';\nimport { CustomItem, type CustomItemComponentProps } from '@atlaskit/menu';\nimport { Box } from '@atlaskit/primitives/compiled';\nimport Slack from '../icons/slack';\ntype CustomComponentWithHrefProps = CustomItemComponentProps & {\n\thref: string;\n};\nconst CustomComponent = ({ children, href, ...props }: CustomComponentWithHrefProps) => {\n\treturn (\n\t\t<a href={href} {...props}>\n\t\t\t{children}\n\t\t</a>\n\t);\n};\nconst styles = cssMap({\n\troot: {\n\t\tposition: 'relative',\n\t\toverflow: 'hidden',\n\t\tuserSelect: 'none',\n\t},\n\tinteractive: {\n\t\t'&::before': {\n\t\t\tcontent: '\"\"',\n\t\t\tposition: 'absolute',\n\t\t\tinsetInlineStart: 0,\n\t\t\tinsetBlockStart: 0,\n\t\t\tinsetBlockEnd: 0,\n\t\t\twidth: 3,\n\t\t\ttransform: 'translateX(-1px)',\n\t\t\ttransition: 'transform 70ms ease-in-out',\n\t\t\tbackgroundColor: '#4C9AFF',\n\t\t},\n\t\t'&:hover::before': {\n\t\t\ttransform: 'translateX(0)',\n\t\t},\n\t},\n});\nconst _default: () => JSX.Element = () => (\n\t/**\n\t * It is not normally acceptable to add click handlers to non-interactive elements\n\t * as this is an accessibility anti-pattern. However, because this instance is\n\t * for performance reasons (to avoid multiple click handlers) and not creating an\n\t * inaccessible custom element, we can add role=\"presentation\" so that there is\n\t * no negative impacts to assistive technologies.\n\t */\n\t<Box onClick={(e: React.MouseEvent) => e.preventDefault()} role=\"presentation\">\n\t\t<CustomItem\n\t\t\thref=\"/navigation-system\"\n\t\t\tcomponent={CustomComponent}\n\t\t\tcss={[styles.root, styles.interactive]}\n\t\t>\n\t\t\tCustomItem\n\t\t</CustomItem>\n\t\t<CustomItem\n\t\t\thref=\"/navigation-system-1\"\n\t\t\tisSelected\n\t\t\tcomponent={CustomComponent}\n\t\t\tcss={[styles.root, styles.interactive]}\n\t\t>\n\t\t\tisSelected CustomItem\n\t\t</CustomItem>\n\t\t<CustomItem\n\t\t\thref=\"/navigation-system-2\"\n\t\t\tisDisabled\n\t\t\tcomponent={CustomComponent}\n\t\t\tcss={styles.root}\n\t\t>\n\t\t\tisDisabled CustomItem\n\t\t</CustomItem>\n\t\t<CustomItem\n\t\t\thref=\"/navigation-system-3\"\n\t\t\tcomponent={CustomComponent}\n\t\t\ticonBefore={<Slack aria-label=\"\" />}\n\t\t\tcss={[styles.root, styles.interactive]}\n\t\t>\n\t\t\ticonBefore CustomItem\n\t\t</CustomItem>\n\t\t<CustomItem\n\t\t\thref=\"/navigation-system-4\"\n\t\t\tcomponent={CustomComponent}\n\t\t\ticonBefore={<Slack aria-label=\"\" />}\n\t\t\tdescription=\"Next-gen software project\"\n\t\t\tcss={[styles.root, styles.interactive]}\n\t\t>\n\t\t\ticonBefore and description CustomItem\n\t\t</CustomItem>\n\t</Box>\n);\nexport default _default;",
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Primary content for the item.',
			},
			{
				name: 'component',
				type: 'React.ComponentClass<React.PropsWithChildren<TComponentProps>, any> | React.FunctionComponent<React.PropsWithChildren<TComponentProps>>',
				description:
					'Custom component to render as an item. This can be both a functional component or a class component.\n\nWill return `null` if no component is defined.\n\nProps passed to `CustomItem` will be passed down to this component. If the props for `component` have TypeScript types,\nCustomItem will extend them, providing type safety for your custom item.\n\nE.g. `<CustomItem to="/link" component={RouterLink} />`.\n\n__NOTE:__ Make sure the reference for this component does not change between renders else undefined behavior may happen.',
			},
			{
				name: 'description',
				type: 'string | JSX.Element',
				description:
					'Description of the item.\nThis will render smaller text below the primary text of the item, and slightly increase the height of the item.',
			},
			{
				name: 'iconAfter',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'Element to render after the item text.\nUsually this is an [icon](https://atlaskit.atlassian.com/packages/design-system/icon) component.',
			},
			{
				name: 'iconBefore',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'Element to render before the item text.\nUsually this is an [icon](https://atlaskit.atlassian.com/packages/design-system/icon) component.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					'Makes the element appear disabled as well as removing interactivity. Avoid disabling menu items wherever possible as this isn’t accessible or usable.',
			},
			{
				name: 'isSelected',
				type: 'boolean',
				description: 'Makes the element appear selected.',
			},
			{
				name: 'onClick',
				type: '(e: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>) => void',
				description: "Event that's triggered when the element is clicked.",
			},
			{
				name: 'onMouseDown',
				type: '(event: React.MouseEvent<Element, MouseEvent>) => void',
				description: "Event that's triggered when the element has been pressed.",
			},
			{
				name: 'shouldDescriptionWrap',
				type: 'boolean',
				description:
					"When `true`, the description of the item will wrap multiple lines if it's long enough.",
			},
			{
				name: 'shouldTitleWrap',
				type: 'boolean',
				description:
					"When `true`, the title of the item will wrap multiple lines if it's long enough.",
			},
		],
	},
	{
		name: 'HeadingItem',
		package: '@atlaskit/menu',
		description:
			'A non-interactive heading within a menu section. Use to label groups of items when Section title is not used.',
		status: 'general-availability',
		usageGuidelines: [
			'Use to label section groups when a section title is not sufficient',
			'Do not use for interactive content—headings are display-only',
		],
		contentGuidelines: ['Use clear, descriptive headings', 'Keep headings concise'],
		keywords: ['menu', 'heading', 'item', 'label'],
		category: 'navigation',
		examples: [
			"import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';\nimport MenuGroupContainer from '../common/menu-group-container';\nexport default (): React.JSX.Element => (\n\t<MenuGroupContainer>\n\t\t<MenuGroup>\n\t\t\t<Section title=\"Actions\">\n\t\t\t\t<ButtonItem>Create article</ButtonItem>\n\t\t\t</Section>\n\t\t\t<Section>\n\t\t\t\t<ButtonItem>Create article</ButtonItem>\n\t\t\t</Section>\n\t\t</MenuGroup>\n\t</MenuGroupContainer>\n);",
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'The text of the heading.',
				isRequired: true,
			},
			{
				name: 'headingLevel',
				type: '1 | 2 | 3 | 4 | 5 | 6',
				description:
					'Specifies the heading level in the document structure.\nIf not specified, the default is `h2`.',
			},
			{
				name: 'id',
				type: 'string',
				description:
					'A unique identifier that can be referenced in the `labelledby` prop of a\nsection to allow assistive technology to announce the name of groups.',
			},
		],
	},
	{
		name: 'LinkItem',
		package: '@atlaskit/menu',
		description:
			'A menu item that navigates to a URL when clicked. Use for navigation links like Dashboard or Settings.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for navigation (e.g. Team Spaces, Settings)',
			'Indicate the current page when relevant',
			'Combine with icons for context when they add meaning',
		],
		contentGuidelines: ['Use clear, descriptive labels for destinations', 'Keep labels concise'],
		keywords: ['menu', 'link', 'item', 'navigation'],
		category: 'navigation',
		examples: [
			"import React, { type MouseEvent, useState } from 'react';\nimport { LinkItem, type LinkItemProps } from '@atlaskit/menu';\nimport { Box } from '@atlaskit/primitives/compiled';\nimport ImgIcon from '../common/img-icon';\nimport koala from '../icons/koala.png';\nconst useLinkItemComputedProps = (initialSelectedHref?: string) => {\n\tconst [currentHref, setCurrentHref] = useState<string | undefined>(initialSelectedHref);\n\tconst getComputedProps = ({ href, ...restProps }: LinkItemProps) => ({\n\t\thref,\n\t\t...restProps,\n\t\tisSelected: currentHref === href,\n\t\tonClick: () => setCurrentHref(href),\n\t});\n\treturn getComputedProps;\n};\nexport default (): React.JSX.Element => {\n\tconst getComputedProps = useLinkItemComputedProps('#link-item2');\n\treturn (\n\t\t/**\n\t\t * It is not normally acceptable to add click handlers to non-interactive elements\n\t\t * as this is an accessibility anti-pattern. However, because this instance is\n\t\t * for performance reasons (to avoid multiple click handlers) and not creating an\n\t\t * inaccessible custom element, we can add role=\"presentation\" so that there is\n\t\t * no negative impacts to assistive technologies.\n\t\t */\n\t\t<Box onClick={(e: MouseEvent) => e.preventDefault()} role=\"presentation\">\n\t\t\t<LinkItem {...getComputedProps({ href: '#link-item1' })}>Customer Feedback</LinkItem>\n\t\t\t<LinkItem {...getComputedProps({ href: '#link-item2' })}>Customer Feedback</LinkItem>\n\t\t\t<LinkItem {...getComputedProps({ href: '#link-item3' })} isDisabled>\n\t\t\t\tCustomer Feedback\n\t\t\t</LinkItem>\n\t\t\t<LinkItem {...getComputedProps({ href: '#link-item4' })} description=\"Classic service desk\">\n\t\t\t\tCustomer Feedback\n\t\t\t</LinkItem>\n\t\t\t<LinkItem\n\t\t\t\t{...getComputedProps({ href: '#link-item5' })}\n\t\t\t\ticonBefore={<ImgIcon src={koala} alt={'A koala'} />}\n\t\t\t\tdescription=\"Classic service desk\"\n\t\t\t>\n\t\t\t\tCustomer Feedback\n\t\t\t</LinkItem>\n\t\t\t<LinkItem {...getComputedProps({ href: 'https://atlassian.design' })} testId=\"link-item\">\n\t\t\t\tAtlassian Design\n\t\t\t</LinkItem>\n\t\t</Box>\n\t);\n};",
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Primary content for the item.',
			},
			{
				name: 'description',
				type: 'string | global.JSX.Element',
				description:
					'Description of the item.\nThis will render smaller text below the primary text of the item, and slightly increase the height of the item.',
			},
			{
				name: 'href',
				type: 'string',
				description: 'Link to another page.',
			},
			{
				name: 'iconAfter',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'Element to render after the item text.\nUsually this is an [icon](https://atlaskit.atlassian.com/packages/design-system/icon) component.',
			},
			{
				name: 'iconBefore',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'Element to render before the item text.\nUsually this is an [icon](https://atlaskit.atlassian.com/packages/design-system/icon) component.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					'Makes the element appear disabled as well as removing interactivity. Avoid disabling menu items wherever possible as this isn’t accessible or usable.',
			},
			{
				name: 'isSelected',
				type: 'boolean',
				description: 'Makes the element appear selected.',
			},
			{
				name: 'onClick',
				type: '(e: MouseEvent<HTMLElement, globalThis.MouseEvent> | KeyboardEvent<HTMLElement>) => void',
				description: "Event that's triggered when the element is clicked.",
			},
			{
				name: 'onMouseDown',
				type: '(event: MouseEvent<Element, globalThis.MouseEvent>) => void',
				description: "Event that's triggered when the element has been pressed.",
			},
			{
				name: 'rel',
				type: 'string',
				description:
					'The relationship of the linked URL as space-separated link types.\nGenerally you\'ll want to set this to "noopener noreferrer" when `target` is "_blank".',
			},
			{
				name: 'role',
				type: 'string',
				description: 'Use this to override the accessibility role for the element.',
			},
			{
				name: 'shouldDescriptionWrap',
				type: 'boolean',
				description:
					"When `true`, the description of the item will wrap multiple lines if it's long enough.",
			},
			{
				name: 'shouldTitleWrap',
				type: 'boolean',
				description:
					"When `true`, the title of the item will wrap multiple lines if it's long enough.",
			},
			{
				name: 'target',
				type: 'string',
				description:
					'Where to display the linked URL,\nsee [anchor information](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) on mdn for more information.',
			},
		],
	},
	{
		name: 'MenuGroup',
		package: '@atlaskit/menu',
		description: 'A list of options to action or navigate.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for list of options to action or navigate',
			'Button items = actions (e.g. Copy); Link items = navigate (e.g. Team Spaces)',
			'Group related menu items together',
			'Use clear section titles',
		],
		contentGuidelines: [
			'Use clear, descriptive menu item labels',
			'Group related items logically',
			'Use consistent terminology',
			'Keep menu structure simple',
		],
		accessibilityGuidelines: [
			'Provide clear menu item labels',
			'Use appropriate ARIA attributes',
			'Ensure keyboard navigation with arrow keys',
			'Provide clear section titles',
		],
		keywords: ['menu', 'group', 'navigation', 'section', 'items'],
		category: 'navigation',
		examples: [
			'import { ButtonItem, LinkItem, MenuGroup, Section } from \'@atlaskit/menu\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<MenuGroup spacing="cozy">\n\t\t\t<Section title="Navigation">\n\t\t\t\t<LinkItem href="/dashboard">Dashboard</LinkItem>\n\t\t\t\t<LinkItem href="/projects">Projects</LinkItem>\n\t\t\t\t<LinkItem href="/settings">Settings</LinkItem>\n\t\t\t</Section>\n\t\t</MenuGroup>\n\t\t<MenuGroup spacing="compact">\n\t\t\t<Section title="Actions">\n\t\t\t\t<ButtonItem>Create New</ButtonItem>\n\t\t\t\t<ButtonItem>Import</ButtonItem>\n\t\t\t\t<ButtonItem>Export</ButtonItem>\n\t\t\t</Section>\n\t\t\t<Section title="Help">\n\t\t\t\t<LinkItem href="/docs">Documentation</LinkItem>\n\t\t\t\t<LinkItem href="/support">Support</LinkItem>\n\t\t\t</Section>\n\t\t</MenuGroup>\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Children of the menu group.\nThis should generally be `Section` components.',
				isRequired: true,
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description: 'Used this to tell assistive technologies that the menu group is loading.',
			},
			{
				name: 'maxHeight',
				type: 'string | number',
				description:
					"Use this to constrain the menu group's height to a specific value.\nThis must be set if you want to have scrollable sections.",
			},
			{
				name: 'maxWidth',
				type: 'string | number',
				description: "Use this to constrain the menu group's maximum width to a specific value.",
			},
			{
				name: 'menuLabel',
				type: 'string',
				description:
					'Provide an accessible label via `aria-label` for the menu element for assistive technology.',
			},
			{
				name: 'minHeight',
				type: 'string | number',
				description: "Use this to constrain the menu group's minimum height to a specific value.",
			},
			{
				name: 'minWidth',
				type: 'string | number',
				description: "Use this to constrain the menu group's minimum width to a specific value.",
			},
			{
				name: 'onClick',
				type: '(event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => void',
				description:
					'Handler called when clicking on this element,\nor any children elements.\nUseful when needing to stop propagation of child events.',
			},
			{
				name: 'role',
				type: 'string',
				description: 'Use this to override the accessibility role for the element.',
			},
			{
				name: 'spacing',
				type: '"cozy" | "compact"',
				description: 'Configure the density of the menu group content.',
				defaultValue: '"cozy"',
			},
		],
	},
	{
		name: 'Section',
		package: '@atlaskit/menu',
		description: 'Groups related menu items together with an optional title or heading.',
		status: 'general-availability',
		usageGuidelines: [
			'Use to group related menu items (e.g. Actions, Settings)',
			'Use clear section titles when grouping',
			'Use visual separators between sections when helpful',
		],
		contentGuidelines: ['Use clear section titles', 'Group items logically'],
		keywords: ['menu', 'section', 'group', 'items'],
		category: 'navigation',
		examples: [
			'import { ButtonItem, HeadingItem, MenuGroup, Section } from \'@atlaskit/menu\';\nimport MenuGroupContainer from \'../common/menu-group-container\';\nexport default (): React.JSX.Element => (\n\t<MenuGroupContainer>\n\t\t<MenuGroup>\n\t\t\t<Section title="Actions">\n\t\t\t\t<ButtonItem>Create article</ButtonItem>\n\t\t\t</Section>\n\t\t\t<Section aria-labelledby="settings" hasSeparator>\n\t\t\t\t<HeadingItem id="settings">Settings</HeadingItem>\n\t\t\t\t<ButtonItem>Manage account</ButtonItem>\n\t\t\t</Section>\n\t\t</MenuGroup>\n\t</MenuGroupContainer>\n);',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'Children of the section.\nThis should generally be `Item` or `Heading` components,\nbut can also be [`EmptyState`](https://atlaskit.atlassian.com/packages/design-system/empty-state)s if you want to render errors.',
				isRequired: true,
			},
			{
				name: 'hasSeparator',
				type: 'boolean',
				description: 'Use this to render a border at the top of the section.',
			},
			{
				name: 'id',
				type: 'string',
				description: 'Unique identifier for the element.',
			},
			{
				name: 'isList',
				type: 'boolean',
				description:
					'If your menu contains a list, use this to add `<ul>` and `<li>` tags around the items. This is essential for offering better, accessible semantic markup in a list of items.',
			},
			{
				name: 'isScrollable',
				type: 'boolean',
				description:
					"Enables scrolling within the section.\nThis won't work unless `maxHeight` is set on the parent `MenuGroup` component.",
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Provide an accessible label for the section via `aria-label` for assistive technology.',
			},
			{
				name: 'title',
				type: 'string',
				description:
					"The text passed into the internal `HeadingItem`. If a title isn't provided,\nthe `HeadingItem` won't be rendered, and this component will act as a regular `Section`.",
			},
			{
				name: 'titleId',
				type: 'string',
				description:
					"ID referenced by the menu group wrapper's `aria-labelledby` attribute. This ID should be assigned to the group title element.\nUsage of either this, or the `label` attribute is strongly recommended.",
			},
		],
	},
	{
		name: 'SkeletonHeadingItem',
		package: '@atlaskit/menu',
		description: 'A skeleton placeholder for a menu heading during loading states.',
		status: 'general-availability',
		usageGuidelines: ['Use during loading when a section heading will appear'],
		keywords: ['menu', 'skeleton', 'heading', 'loading'],
		category: 'loading',
		examples: [
			"import React, { useEffect, useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport StarStarredIcon from '@atlaskit/icon/core/star-starred';\nimport StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';\nimport {\n\tButtonItem,\n\ttype ButtonItemProps,\n\tHeadingItem,\n\tMenuGroup,\n\tSection,\n\tSkeletonHeadingItem,\n\tSkeletonItem,\n} from '@atlaskit/menu';\nimport { Box, Stack, xcss } from '@atlaskit/primitives';\nimport { token } from '@atlaskit/tokens';\nimport MenuGroupContainer from '../common/menu-group-container';\nimport Invision from '../icons/invision';\nimport Portfolio from '../icons/portfolio';\nimport Slack from '../icons/slack';\nimport Tempo from '../icons/tempo';\nconst iconContainerStyles = xcss({\n\theight: 'size.200',\n\twidth: 'size.200',\n\tbackground: 'linear-gradient(180deg, #4E86EE 0%, #3562C1 100%), #4E86EE',\n\tborderRadius: 'radius.small',\n});\nconst buttonContainerStyles = xcss({\n\tdisplay: 'flex',\n\tjustifyContent: 'center',\n});\nconst Item = ({ isLoading, ...props }: ButtonItemProps & { isLoading?: boolean }) => {\n\tif (isLoading) {\n\t\treturn <SkeletonItem hasIcon isShimmering />;\n\t}\n\treturn <ButtonItem {...props} />;\n};\nconst Heading = ({ isLoading, ...props }: any) => {\n\tif (isLoading) {\n\t\treturn <SkeletonHeadingItem isShimmering />;\n\t}\n\treturn <HeadingItem {...props} />;\n};\nexport default (): React.JSX.Element => {\n\tconst [isLoading, setIsLoading] = useState(true);\n\tconst [retryLoading, setRetryLoading] = useState(true);\n\tuseEffect(() => {\n\t\tif (!retryLoading) {\n\t\t\treturn;\n\t\t}\n\t\tsetIsLoading(true);\n\t\tsetTimeout(() => {\n\t\t\tsetRetryLoading(false);\n\t\t\tsetIsLoading(false);\n\t\t}, 1500);\n\t}, [retryLoading]);\n\treturn (\n\t\t<Stack space=\"space.200\">\n\t\t\t<MenuGroupContainer>\n\t\t\t\t<MenuGroup>\n\t\t\t\t\t<Section aria-labelledby={isLoading ? '' : 'apps'}>\n\t\t\t\t\t\t<Heading aria-hidden id=\"apps\" isLoading={isLoading}>\n\t\t\t\t\t\t\tApps\n\t\t\t\t\t\t</Heading>\n\t\t\t\t\t\t<Item\n\t\t\t\t\t\t\tisLoading={isLoading}\n\t\t\t\t\t\t\ticonBefore={\n\t\t\t\t\t\t\t\t<Box xcss={iconContainerStyles}>\n\t\t\t\t\t\t\t\t\t<Portfolio color={token('color.icon.brand')} aria-label=\"\" />\n\t\t\t\t\t\t\t\t</Box>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\ticonAfter={<StarStarredIcon color={token('color.icon.accent.orange')} label=\"\" />}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\tPortfolio\n\t\t\t\t\t\t</Item>\n\t\t\t\t\t\t<Item\n\t\t\t\t\t\t\tisLoading={isLoading}\n\t\t\t\t\t\t\ticonBefore={<Tempo aria-label=\"\" />}\n\t\t\t\t\t\t\ticonAfter={<StarStarredIcon color={token('color.icon.accent.orange')} label=\"\" />}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\tTempo timesheets\n\t\t\t\t\t\t</Item>\n\t\t\t\t\t\t<Item\n\t\t\t\t\t\t\tisLoading={isLoading}\n\t\t\t\t\t\t\ticonBefore={<Invision aria-label=\"\" />}\n\t\t\t\t\t\t\ticonAfter={<StarUnstarredIcon label=\"\" />}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\tInvision\n\t\t\t\t\t\t</Item>\n\t\t\t\t\t\t<Item isLoading={isLoading} iconBefore={<Slack aria-label=\"\" />}>\n\t\t\t\t\t\t\tSlack\n\t\t\t\t\t\t</Item>\n\t\t\t\t\t</Section>\n\t\t\t\t\t<Section hasSeparator>\n\t\t\t\t\t\t<Item>Find new apps</Item>\n\t\t\t\t\t\t<Item>Manage your apps</Item>\n\t\t\t\t\t</Section>\n\t\t\t\t</MenuGroup>\n\t\t\t</MenuGroupContainer>\n\t\t\t<Box xcss={buttonContainerStyles}>\n\t\t\t\t<Button testId=\"toggle-loading\" onClick={() => setRetryLoading(true)}>\n\t\t\t\t\tReload\n\t\t\t\t</Button>\n\t\t\t</Box>\n\t\t</Stack>\n\t);\n};",
		],
		props: [
			{
				name: 'isShimmering',
				type: 'boolean',
				description:
					'Causes to the skeleton to have a slight horizontal shimmer.\nOnly use this when you want to bring more attention to the loading content.',
				defaultValue: 'false',
			},
			{
				name: 'width',
				type: 'string | number',
				description:
					"Width of the skeleton heading item.\nYou usually don't need to specify this, as it has a staggered width based on `:nth-child` by default.",
			},
			{
				name: 'xcss',
				type: 'false | (XCSSValue<"paddingBlockEnd" | "paddingBlockStart" | "paddingInlineEnd" | "paddingInlineStart" | "paddingBlock" | "paddingInline", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
				description: 'Bounded style overrides.',
			},
		],
	},
	{
		name: 'SkeletonItem',
		package: '@atlaskit/menu',
		description: 'A skeleton placeholder for a menu item during loading states.',
		status: 'general-availability',
		usageGuidelines: [
			'Use during loading to maintain layout stability',
			'Match the shape of the loaded item (e.g. with or without icon)',
		],
		keywords: ['menu', 'skeleton', 'loading', 'placeholder'],
		category: 'loading',
		examples: [
			"import React, { useEffect, useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport StarStarredIcon from '@atlaskit/icon/core/star-starred';\nimport StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';\nimport {\n\tButtonItem,\n\ttype ButtonItemProps,\n\tHeadingItem,\n\tMenuGroup,\n\tSection,\n\tSkeletonHeadingItem,\n\tSkeletonItem,\n} from '@atlaskit/menu';\nimport { Box, Stack, xcss } from '@atlaskit/primitives';\nimport { token } from '@atlaskit/tokens';\nimport MenuGroupContainer from '../common/menu-group-container';\nimport Invision from '../icons/invision';\nimport Portfolio from '../icons/portfolio';\nimport Slack from '../icons/slack';\nimport Tempo from '../icons/tempo';\nconst iconContainerStyles = xcss({\n\theight: 'size.200',\n\twidth: 'size.200',\n\tbackground: 'linear-gradient(180deg, #4E86EE 0%, #3562C1 100%), #4E86EE',\n\tborderRadius: 'radius.small',\n});\nconst buttonContainerStyles = xcss({\n\tdisplay: 'flex',\n\tjustifyContent: 'center',\n});\nconst Item = ({ isLoading, ...props }: ButtonItemProps & { isLoading?: boolean }) => {\n\tif (isLoading) {\n\t\treturn <SkeletonItem hasIcon isShimmering />;\n\t}\n\treturn <ButtonItem {...props} />;\n};\nconst Heading = ({ isLoading, ...props }: any) => {\n\tif (isLoading) {\n\t\treturn <SkeletonHeadingItem isShimmering />;\n\t}\n\treturn <HeadingItem {...props} />;\n};\nexport default (): React.JSX.Element => {\n\tconst [isLoading, setIsLoading] = useState(true);\n\tconst [retryLoading, setRetryLoading] = useState(true);\n\tuseEffect(() => {\n\t\tif (!retryLoading) {\n\t\t\treturn;\n\t\t}\n\t\tsetIsLoading(true);\n\t\tsetTimeout(() => {\n\t\t\tsetRetryLoading(false);\n\t\t\tsetIsLoading(false);\n\t\t}, 1500);\n\t}, [retryLoading]);\n\treturn (\n\t\t<Stack space=\"space.200\">\n\t\t\t<MenuGroupContainer>\n\t\t\t\t<MenuGroup>\n\t\t\t\t\t<Section aria-labelledby={isLoading ? '' : 'apps'}>\n\t\t\t\t\t\t<Heading aria-hidden id=\"apps\" isLoading={isLoading}>\n\t\t\t\t\t\t\tApps\n\t\t\t\t\t\t</Heading>\n\t\t\t\t\t\t<Item\n\t\t\t\t\t\t\tisLoading={isLoading}\n\t\t\t\t\t\t\ticonBefore={\n\t\t\t\t\t\t\t\t<Box xcss={iconContainerStyles}>\n\t\t\t\t\t\t\t\t\t<Portfolio color={token('color.icon.brand')} aria-label=\"\" />\n\t\t\t\t\t\t\t\t</Box>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\ticonAfter={<StarStarredIcon color={token('color.icon.accent.orange')} label=\"\" />}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\tPortfolio\n\t\t\t\t\t\t</Item>\n\t\t\t\t\t\t<Item\n\t\t\t\t\t\t\tisLoading={isLoading}\n\t\t\t\t\t\t\ticonBefore={<Tempo aria-label=\"\" />}\n\t\t\t\t\t\t\ticonAfter={<StarStarredIcon color={token('color.icon.accent.orange')} label=\"\" />}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\tTempo timesheets\n\t\t\t\t\t\t</Item>\n\t\t\t\t\t\t<Item\n\t\t\t\t\t\t\tisLoading={isLoading}\n\t\t\t\t\t\t\ticonBefore={<Invision aria-label=\"\" />}\n\t\t\t\t\t\t\ticonAfter={<StarUnstarredIcon label=\"\" />}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\tInvision\n\t\t\t\t\t\t</Item>\n\t\t\t\t\t\t<Item isLoading={isLoading} iconBefore={<Slack aria-label=\"\" />}>\n\t\t\t\t\t\t\tSlack\n\t\t\t\t\t\t</Item>\n\t\t\t\t\t</Section>\n\t\t\t\t\t<Section hasSeparator>\n\t\t\t\t\t\t<Item>Find new apps</Item>\n\t\t\t\t\t\t<Item>Manage your apps</Item>\n\t\t\t\t\t</Section>\n\t\t\t\t</MenuGroup>\n\t\t\t</MenuGroupContainer>\n\t\t\t<Box xcss={buttonContainerStyles}>\n\t\t\t\t<Button testId=\"toggle-loading\" onClick={() => setRetryLoading(true)}>\n\t\t\t\t\tReload\n\t\t\t\t</Button>\n\t\t\t</Box>\n\t\t</Stack>\n\t);\n};",
		],
		props: [
			{
				name: 'hasAvatar',
				type: 'boolean',
				description:
					'Renders a skeleton circle in the `iconBefore` location.\nTakes priority over `hasIcon`.',
			},
			{
				name: 'hasIcon',
				type: 'boolean',
				description: 'Renders a skeleton square in the `iconBefore` location.',
			},
			{
				name: 'isShimmering',
				type: 'boolean',
				description:
					'Causes to the skeleton to have a slight horizontal shimmer.\nOnly use this when you want to bring more attention to the loading content.',
				defaultValue: 'false',
			},
			{
				name: 'width',
				type: 'string | number',
				description:
					"Width of the skeleton item.\nYou usually don't need to specify this, as it has a staggered width based on `:nth-child` by default.",
			},
			{
				name: 'xcss',
				type: 'false | (XCSSValue<"minHeight" | "paddingBlockEnd" | "paddingBlockStart" | "paddingInlineEnd" | "paddingInlineStart" | "paddingBlock" | "paddingInline", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
				description: 'Bounded style overrides.',
			},
		],
	},
	{
		name: 'CloseButton',
		package: '@atlaskit/modal-dialog',
		description:
			'An accessible close button for use in custom modal headers. Ensures users have an obvious way to close the modal.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when customizing ModalHeader without hasCloseButton',
			'Render CloseButton first in DOM for proper focus order',
			'Use Flex with row-reverse if close should appear on the right',
			'Provide label prop for custom accessible name',
		],
		accessibilityGuidelines: [
			'Close button is required for modals (consult a11y team for rare exceptions)',
			'Ensure close button is keyboard accessible',
		],
		keywords: ['modal', 'close', 'button', 'dismiss'],
		category: 'overlay',
		examples: [
			"import React, { Fragment, useCallback, useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport { cssMap } from '@atlaskit/css';\nimport Heading from '@atlaskit/heading';\nimport Modal, {\n\tCloseButton,\n\tModalBody,\n\tModalFooter,\n\tModalTransition,\n\tuseModal,\n} from '@atlaskit/modal-dialog';\nimport { Box } from '@atlaskit/primitives/compiled';\nconst styles = cssMap({\n\theader: {\n\t\tdisplay: 'flex',\n\t\talignItems: 'center',\n\t\tjustifyContent: 'space-between',\n\t\tflexDirection: 'row-reverse',\n\t},\n});\nconst CustomHeader = () => {\n\tconst { onClose, titleId } = useModal();\n\treturn (\n\t\t<Box xcss={styles.header} padding=\"space.300\">\n\t\t\t{/* We have the close button first in the DOM and then are reversing it\n\t\t\tusing the flex styles to ensure that it is focused as the first\n\t\t\tinteractive element in the modal, *before* any other relevant content\n\t\t\tinside the modal. This ensures users of assistive technology get all\n\t\t\trelevant content. */}\n\t\t\t<CloseButton onClick={onClose} />\n\t\t\t<Heading as=\"h1\" size=\"medium\" id={titleId}>\n\t\t\t\tCustom modal header\n\t\t\t</Heading>\n\t\t</Box>\n\t);\n};\nexport default function Example(): React.JSX.Element {\n\tconst [isOpen, setIsOpen] = useState(false);\n\tconst openModal = useCallback(() => setIsOpen(true), []);\n\tconst closeModal = useCallback(() => setIsOpen(false), []);\n\treturn (\n\t\t<Fragment>\n\t\t\t<Button aria-haspopup=\"dialog\" appearance=\"primary\" onClick={openModal}>\n\t\t\t\tOpen modal\n\t\t\t</Button>\n\t\t\t<ModalTransition>\n\t\t\t\t{isOpen && (\n\t\t\t\t\t// This is fixed in the custom header\n\t\t\t\t\t<Modal onClose={closeModal}>\n\t\t\t\t\t\t<CustomHeader />\n\t\t\t\t\t\t<ModalBody>\n\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\tIf you wish to customise a modal dialog, it accepts any valid React element as\n\t\t\t\t\t\t\t\tchildren.\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\tModal header accepts any valid React element as children, so you can use modal title\n\t\t\t\t\t\t\t\tin conjunction with other elements like an exit button in the top right.\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\tModal footer accepts any valid React element as children. For example, you can add\n\t\t\t\t\t\t\t\tan avatar in the footer. For very custom use cases, you can achieve the same thing\n\t\t\t\t\t\t\t\twithout modal footer.\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t</ModalBody>\n\t\t\t\t\t\t<ModalFooter>\n\t\t\t\t\t\t\t<Button appearance=\"subtle\">About modals</Button>\n\t\t\t\t\t\t\t<Button appearance=\"primary\" onClick={closeModal}>\n\t\t\t\t\t\t\t\tClose\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t</ModalFooter>\n\t\t\t\t\t</Modal>\n\t\t\t\t)}\n\t\t\t</ModalTransition>\n\t\t</Fragment>\n\t);\n}",
		],
		props: [
			{
				name: 'label',
				type: 'string',
				description: 'The accessible name to give to the close button.',
			},
			{
				name: 'onBlur',
				type: '(event: React.FocusEvent<HTMLButtonElement, Element>) => void',
				description: 'The `onBlur` handler for the close button.',
			},
			{
				name: 'onClick',
				type: '(e: KeyboardOrMouseEvent, analyticEvent: UIAnalyticsEvent) => void',
				description: 'The same close handler you give to the top-level modal component.',
				isRequired: true,
			},
		],
	},
	{
		name: 'Modal',
		package: '@atlaskit/modal-dialog',
		description: 'A modal dialog component for important content.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for immediate task or critical/warning requiring a response; blocking until closed',
			'Use sparingly—modals are invasive',
			'One task per modal; limit interactions; no nested modals (inaccessible)',
			'Anatomy: header (h1 title), close button, body, footer with primary + cancel/close',
			'Footer: primary button on the right of secondary; multiple dismissal methods (close button, Esc, blanket click, Cancel/Close)',
			'Use Popup for smaller info + controls; Spotlight for onboarding; Inline message for alert/action',
		],
		contentGuidelines: [
			'Use clear, descriptive titles',
			'Primary button label should reflect the modal title',
			'Use action verbs in button labels',
			'Keep content focused on a single task or message',
			'Use sentence case for all text',
		],
		accessibilityGuidelines: [
			'Modal must have a title: use title component, or titleId from useModal, or label (avoid if no visual title)',
			'Close button is required (except rare cases—consult a11y team)',
			'Do not rely on color alone for severity; provide accessible label for icons',
			'Focus order: 1) close (or title or container), 2) first focusable, 3) secondary button, 4) primary, 5) return focus to trigger on close',
			'Dismiss via: close button, Esc, click blanket, Cancel/Close in footer',
			'Ensure modal content is announced by screen readers',
			'Ensure keyboard navigation and escape key support',
			'Maintain focus within modal when open',
		],
		keywords: ['modal', 'dialog', 'popup', 'overlay', 'focused', 'interaction', 'layer'],
		category: 'overlay',
		examples: [
			'import React, { Fragment, useCallback, useState } from \'react\';\nimport Button from \'@atlaskit/button/new\';\nimport Modal, {\n\tModalBody,\n\tModalFooter,\n\tModalHeader,\n\tModalTitle,\n\tModalTransition,\n} from \'@atlaskit/modal-dialog\';\nimport { Text } from \'@atlaskit/primitives/compiled\';\nexport default function Example(): React.JSX.Element {\n\tconst [isOpen, setIsOpen] = useState(false);\n\tconst openModal = useCallback(() => setIsOpen(true), []);\n\tconst closeModal = useCallback(() => setIsOpen(false), []);\n\treturn (\n\t\t<Fragment>\n\t\t\t<Button aria-haspopup="dialog" appearance="primary" onClick={openModal}>\n\t\t\t\tOpen modal\n\t\t\t</Button>\n\t\t\t<ModalTransition>\n\t\t\t\t{isOpen && (\n\t\t\t\t\t<Modal onClose={closeModal}>\n\t\t\t\t\t\t<ModalHeader hasCloseButton>\n\t\t\t\t\t\t\t<ModalTitle>Duplicate this page</ModalTitle>\n\t\t\t\t\t\t</ModalHeader>\n\t\t\t\t\t\t<ModalBody>\n\t\t\t\t\t\t\tDuplicating this page will make it a child page of{\' \'}\n\t\t\t\t\t\t\t<Text weight="bold">Search - user exploration</Text>, in the{\' \'}\n\t\t\t\t\t\t\t<Text weight="bold">Search & Smarts</Text> space.\n\t\t\t\t\t\t</ModalBody>\n\t\t\t\t\t\t<ModalFooter>\n\t\t\t\t\t\t\t<Button appearance="subtle" onClick={closeModal}>\n\t\t\t\t\t\t\t\tCancel\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t<Button appearance="primary" onClick={closeModal}>\n\t\t\t\t\t\t\t\tDuplicate\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t</ModalFooter>\n\t\t\t\t\t</Modal>\n\t\t\t\t)}\n\t\t\t</ModalTransition>\n\t\t</Fragment>\n\t);\n}',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Contents of the modal dialog.',
			},
			{
				name: 'focusLockAllowlist',
				type: '(element: HTMLElement) => boolean',
				description:
					'Callback function which lets you allowlist nodes so they can be interacted with outside of the focus lock.\nReturn `true` if focus lock should handle element, `false` if not.',
			},
			{
				name: 'height',
				type: 'string | number',
				description:
					'Height of the modal dialog.\nWhen unset the modal dialog will grow to fill the viewport and then start overflowing its contents.',
			},
			{
				name: 'isBlanketHidden',
				type: 'boolean',
				description: 'Will remove the blanket tinted background color.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'The label of the modal dialog that is announced to users of assistive\ntechnology. This should only be used if there is no modal title being\nassociated to your modal, either via using the modal title component or the\n`titleId` prop within the `useModal` context.',
			},
			{
				name: 'onClose',
				type: '(e: KeyboardOrMouseEvent, analyticEvent: UIAnalyticsEvent) => void',
				description: 'Callback function called when the modal dialog is requesting to be closed.',
			},
			{
				name: 'onCloseComplete',
				type: '(element: HTMLElement) => void',
				description: 'Callback function called when the modal dialog has finished closing.',
			},
			{
				name: 'onOpenComplete',
				type: '(node: HTMLElement, isAppearing: boolean) => void',
				description: 'Callback function called when the modal dialog has finished opening.',
			},
			{
				name: 'onStackChange',
				type: '(stackIndex: number) => void',
				description: 'Callback function called when the modal changes position in the stack.',
			},
			{
				name: 'shouldCloseOnEscapePress',
				type: 'boolean',
				description: 'Calls `onClose` when pressing escape.',
			},
			{
				name: 'shouldCloseOnOverlayClick',
				type: 'boolean',
				description: 'Calls `onClose` when clicking the blanket behind the modal dialog.',
			},
			{
				name: 'shouldReturnFocus',
				type: 'boolean | React.RefObject<HTMLElement>',
				description:
					'ReturnFocus controls what happens when the user exits\nfocus lock mode. If true, focus returns to the element that had focus before focus lock\nwas activated. If false, focus remains where it was when the FocusLock was deactivated.\nIf ref is passed, focus returns to that specific ref element.',
			},
			{
				name: 'shouldScrollInViewport',
				type: 'boolean',
				description:
					'Will set the scroll boundary to the viewport.\nIf set to false, the scroll boundary is set to the modal dialog body.',
			},
			{
				name: 'stackIndex',
				type: 'number',
				description:
					"The stackIndex is a reference to the position (index) of the calling dialog in a modal dialog stack.\nNew modals added to the stack receive the highest stack index of 0. As more modals are added to the stack, their index is dynamically increased according to their new position.\nDon't alter the modal stack position using `stackIndex` in implementations of third-party libraries (e.g. AUI modal), it may lead to unpredictable bugs, especially if the third party library has its own focus lock.\nAdditionally, each modal in the stack gets a vertical offset based on `stackIndex` value.",
			},
			{
				name: 'width',
				type: 'string | number',
				description:
					'Width of the modal dialog.\nThe recommended way to specify modal width is using named size options.',
			},
		],
	},
	{
		name: 'ModalBody',
		package: '@atlaskit/modal-dialog',
		description: 'The main content area of a modal dialog.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for the primary content between header and footer',
			'Accepts any valid React element as children',
			'Handles overflow and scrolling when content exceeds viewport',
		],
		contentGuidelines: ['Keep content focused on a single task', 'Use clear, readable content'],
		keywords: ['modal', 'body', 'content'],
		category: 'overlay',
		examples: [
			'import React, { Fragment, useCallback, useState } from \'react\';\nimport Button from \'@atlaskit/button/new\';\nimport Modal, {\n\tModalBody,\n\tModalFooter,\n\tModalHeader,\n\tModalTitle,\n\tModalTransition,\n} from \'@atlaskit/modal-dialog\';\nimport { Text } from \'@atlaskit/primitives/compiled\';\nexport default function Example(): React.JSX.Element {\n\tconst [isOpen, setIsOpen] = useState(false);\n\tconst openModal = useCallback(() => setIsOpen(true), []);\n\tconst closeModal = useCallback(() => setIsOpen(false), []);\n\treturn (\n\t\t<Fragment>\n\t\t\t<Button aria-haspopup="dialog" appearance="primary" onClick={openModal}>\n\t\t\t\tOpen modal\n\t\t\t</Button>\n\t\t\t<ModalTransition>\n\t\t\t\t{isOpen && (\n\t\t\t\t\t<Modal onClose={closeModal}>\n\t\t\t\t\t\t<ModalHeader hasCloseButton>\n\t\t\t\t\t\t\t<ModalTitle>Duplicate this page</ModalTitle>\n\t\t\t\t\t\t</ModalHeader>\n\t\t\t\t\t\t<ModalBody>\n\t\t\t\t\t\t\tDuplicating this page will make it a child page of{\' \'}\n\t\t\t\t\t\t\t<Text weight="bold">Search - user exploration</Text>, in the{\' \'}\n\t\t\t\t\t\t\t<Text weight="bold">Search & Smarts</Text> space.\n\t\t\t\t\t\t</ModalBody>\n\t\t\t\t\t\t<ModalFooter>\n\t\t\t\t\t\t\t<Button appearance="subtle" onClick={closeModal}>\n\t\t\t\t\t\t\t\tCancel\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t<Button appearance="primary" onClick={closeModal}>\n\t\t\t\t\t\t\t\tDuplicate\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t</ModalFooter>\n\t\t\t\t\t</Modal>\n\t\t\t\t)}\n\t\t\t</ModalTransition>\n\t\t</Fragment>\n\t);\n}',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Children of modal dialog footer.',
				isRequired: true,
			},
			{
				name: 'hasInlinePadding',
				type: 'boolean',
				description: 'Determines whether inline padding will be applied. Defaults to true.',
			},
		],
	},
	{
		name: 'ModalFooter',
		package: '@atlaskit/modal-dialog',
		description: 'The footer section of a modal dialog, typically containing action buttons.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for primary and secondary actions',
			'Primary button on the right of secondary',
			'Include Cancel/Close for dismissal',
			'Accepts any valid React element for custom layouts',
		],
		contentGuidelines: [
			'Primary button label should reflect the modal title',
			'Use action verbs in button labels',
		],
		keywords: ['modal', 'footer', 'actions', 'buttons'],
		category: 'overlay',
		examples: [
			'/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { Fragment, useCallback, useState } from \'react\';\nimport Avatar from \'@atlaskit/avatar\';\nimport Button from \'@atlaskit/button/new\';\nimport { cssMap, jsx } from \'@atlaskit/css\';\nimport Modal, {\n\tModalBody,\n\tModalFooter,\n\tModalHeader,\n\tModalTitle,\n\tModalTransition,\n} from \'@atlaskit/modal-dialog\';\nimport { Flex, Text } from \'@atlaskit/primitives/compiled\';\nconst styles = cssMap({\n\tfooter: { flex: \'1\' },\n});\nexport default function Example(): JSX.Element {\n\tconst [isOpen, setIsOpen] = useState(false);\n\tconst openModal = useCallback(() => setIsOpen(true), []);\n\tconst closeModal = useCallback(() => setIsOpen(false), []);\n\treturn (\n\t\t<Fragment>\n\t\t\t<Button aria-haspopup="dialog" appearance="primary" onClick={openModal}>\n\t\t\t\tOpen modal\n\t\t\t</Button>\n\t\t\t<ModalTransition>\n\t\t\t\t{isOpen && (\n\t\t\t\t\t<Modal onClose={closeModal}>\n\t\t\t\t\t\t<ModalHeader hasCloseButton>\n\t\t\t\t\t\t\t<ModalTitle>Default modal footer</ModalTitle>\n\t\t\t\t\t\t</ModalHeader>\n\t\t\t\t\t\t<ModalBody>\n\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\tIf you wish to customise a modal dialog, it accepts any valid React element as\n\t\t\t\t\t\t\t\tchildren.\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\tModal header accepts any valid React element as children, so you can use modal title\n\t\t\t\t\t\t\t\tin conjunction with other elements like an exit button in the top right.\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\tModal footer accepts any valid React element as children. For example, you can add\n\t\t\t\t\t\t\t\tan avatar in the footer. For very custom use cases, you can achieve the same thing\n\t\t\t\t\t\t\t\twithout modal footer.\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t</ModalBody>\n\t\t\t\t\t\t<ModalFooter>\n\t\t\t\t\t\t\t<Flex xcss={styles.footer} justifyContent="space-between">\n\t\t\t\t\t\t\t\t<Flex alignItems="center" gap="space.100">\n\t\t\t\t\t\t\t\t\t<Avatar\n\t\t\t\t\t\t\t\t\t\tsize="small"\n\t\t\t\t\t\t\t\t\t\tsrc="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t<Text>Hey there!</Text>\n\t\t\t\t\t\t\t\t</Flex>\n\t\t\t\t\t\t\t\t<Button appearance="primary" onClick={closeModal}>\n\t\t\t\t\t\t\t\t\tClose\n\t\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t</Flex>\n\t\t\t\t\t\t</ModalFooter>\n\t\t\t\t\t</Modal>\n\t\t\t\t)}\n\t\t\t</ModalTransition>\n\t\t</Fragment>\n\t);\n}',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'Children of modal dialog footer.',
			},
		],
	},
	{
		name: 'ModalHeader',
		package: '@atlaskit/modal-dialog',
		description:
			'The header section of a modal dialog, typically containing the title and optional close button.',
		status: 'general-availability',
		usageGuidelines: [
			'Use as the first child of Modal',
			'Use hasCloseButton prop for standard close affordance',
			'Ensure header contains ModalTitle or equivalent for accessibility',
			'For custom headers, use CloseButton as first element in DOM',
		],
		contentGuidelines: ['Use clear, descriptive titles', 'Keep header content focused'],
		keywords: ['modal', 'header', 'title', 'close'],
		category: 'overlay',
		examples: [
			'import React, { Fragment, useCallback, useState } from \'react\';\nimport Button from \'@atlaskit/button/new\';\nimport Modal, {\n\tModalBody,\n\tModalFooter,\n\tModalHeader,\n\tModalTitle,\n\tModalTransition,\n} from \'@atlaskit/modal-dialog\';\nexport default function Example(): React.JSX.Element {\n\tconst [isOpen, setIsOpen] = useState(false);\n\tconst openModal = useCallback(() => setIsOpen(true), []);\n\tconst closeModal = useCallback(() => setIsOpen(false), []);\n\treturn (\n\t\t<Fragment>\n\t\t\t<Button aria-haspopup="dialog" appearance="primary" onClick={openModal}>\n\t\t\t\tOpen modal\n\t\t\t</Button>\n\t\t\t<ModalTransition>\n\t\t\t\t{isOpen && (\n\t\t\t\t\t<Modal onClose={closeModal}>\n\t\t\t\t\t\t<ModalHeader hasCloseButton>\n\t\t\t\t\t\t\t<ModalTitle>Default modal header</ModalTitle>\n\t\t\t\t\t\t</ModalHeader>\n\t\t\t\t\t\t<ModalBody>\n\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\tIf you wish to customise a modal dialog, it accepts any valid React element as\n\t\t\t\t\t\t\t\tchildren.\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\tModal header accepts any valid React element as children, so you can use modal title\n\t\t\t\t\t\t\t\tin conjunction with other elements like an exit button in the top right.\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\tModal footer accepts any valid React element as children. For example, you can add\n\t\t\t\t\t\t\t\tan avatar in the footer. For very custom use cases, you can achieve the same thing\n\t\t\t\t\t\t\t\twithout modal footer.\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t</ModalBody>\n\t\t\t\t\t\t<ModalFooter>\n\t\t\t\t\t\t\t<Button appearance="subtle">About modals</Button>\n\t\t\t\t\t\t\t<Button appearance="primary" onClick={closeModal}>\n\t\t\t\t\t\t\t\tClose\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t</ModalFooter>\n\t\t\t\t\t</Modal>\n\t\t\t\t)}\n\t\t\t</ModalTransition>\n\t\t</Fragment>\n\t);\n}',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Children of modal dialog header.',
			},
			{
				name: 'hasCloseButton',
				type: 'boolean',
				description: 'Shows a close button at the end of the header.',
				defaultValue: 'false',
			},
		],
	},
	{
		name: 'ModalTitle',
		package: '@atlaskit/modal-dialog',
		description: 'The title element for a modal dialog. Renders as h1 for accessibility.',
		status: 'general-availability',
		usageGuidelines: [
			'Use inside ModalHeader for the modal title',
			'Modal must have a title for accessibility',
			'Supports any valid React element as children',
		],
		contentGuidelines: ['Use clear, descriptive titles', 'Use sentence case'],
		keywords: ['modal', 'title', 'heading'],
		category: 'overlay',
		examples: [
			'import React, { Fragment, useCallback, useState } from \'react\';\nimport Button from \'@atlaskit/button/new\';\nimport Modal, {\n\tModalBody,\n\tModalFooter,\n\tModalHeader,\n\tModalTitle,\n\tModalTransition,\n} from \'@atlaskit/modal-dialog\';\nimport { Text } from \'@atlaskit/primitives/compiled\';\nexport default function Example(): React.JSX.Element {\n\tconst [isOpen, setIsOpen] = useState(false);\n\tconst openModal = useCallback(() => setIsOpen(true), []);\n\tconst closeModal = useCallback(() => setIsOpen(false), []);\n\treturn (\n\t\t<Fragment>\n\t\t\t<Button aria-haspopup="dialog" appearance="primary" onClick={openModal}>\n\t\t\t\tOpen modal\n\t\t\t</Button>\n\t\t\t<ModalTransition>\n\t\t\t\t{isOpen && (\n\t\t\t\t\t<Modal onClose={closeModal}>\n\t\t\t\t\t\t<ModalHeader hasCloseButton>\n\t\t\t\t\t\t\t<ModalTitle>Duplicate this page</ModalTitle>\n\t\t\t\t\t\t</ModalHeader>\n\t\t\t\t\t\t<ModalBody>\n\t\t\t\t\t\t\tDuplicating this page will make it a child page of{\' \'}\n\t\t\t\t\t\t\t<Text weight="bold">Search - user exploration</Text>, in the{\' \'}\n\t\t\t\t\t\t\t<Text weight="bold">Search & Smarts</Text> space.\n\t\t\t\t\t\t</ModalBody>\n\t\t\t\t\t\t<ModalFooter>\n\t\t\t\t\t\t\t<Button appearance="subtle" onClick={closeModal}>\n\t\t\t\t\t\t\t\tCancel\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t<Button appearance="primary" onClick={closeModal}>\n\t\t\t\t\t\t\t\tDuplicate\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t</ModalFooter>\n\t\t\t\t\t</Modal>\n\t\t\t\t)}\n\t\t\t</ModalTransition>\n\t\t</Fragment>\n\t);\n}',
		],
		props: [
			{
				name: 'appearance',
				type: '"danger" | "warning"',
				description:
					'Appearance of the modal that changes the color of the primary action and adds an icon to the title.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'Children of modal dialog header.',
			},
			{
				name: 'isMultiline',
				type: 'boolean',
				description:
					'When `true` will allow the title to span multiple lines.\nDefaults to `true`.',
			},
		],
	},
	{
		name: 'ModalTransition',
		package: '@atlaskit/modal-dialog',
		description: 'A wrapper that provides enter/exit transitions for modal content.',
		status: 'general-availability',
		usageGuidelines: [
			'Wrap Modal with ModalTransition for animated open/close',
			'Use when modal visibility is controlled by state',
			'Children mount when visible and unmount when closed',
		],
		keywords: ['modal', 'transition', 'animation'],
		category: 'overlay',
		examples: [
			'import React, { Fragment, useCallback, useState } from \'react\';\nimport Button from \'@atlaskit/button/new\';\nimport Modal, {\n\tModalBody,\n\tModalFooter,\n\tModalHeader,\n\tModalTitle,\n\tModalTransition,\n} from \'@atlaskit/modal-dialog\';\nimport { Text } from \'@atlaskit/primitives/compiled\';\nexport default function Example(): React.JSX.Element {\n\tconst [isOpen, setIsOpen] = useState(false);\n\tconst openModal = useCallback(() => setIsOpen(true), []);\n\tconst closeModal = useCallback(() => setIsOpen(false), []);\n\treturn (\n\t\t<Fragment>\n\t\t\t<Button aria-haspopup="dialog" appearance="primary" onClick={openModal}>\n\t\t\t\tOpen modal\n\t\t\t</Button>\n\t\t\t<ModalTransition>\n\t\t\t\t{isOpen && (\n\t\t\t\t\t<Modal onClose={closeModal}>\n\t\t\t\t\t\t<ModalHeader hasCloseButton>\n\t\t\t\t\t\t\t<ModalTitle>Duplicate this page</ModalTitle>\n\t\t\t\t\t\t</ModalHeader>\n\t\t\t\t\t\t<ModalBody>\n\t\t\t\t\t\t\tDuplicating this page will make it a child page of{\' \'}\n\t\t\t\t\t\t\t<Text weight="bold">Search - user exploration</Text>, in the{\' \'}\n\t\t\t\t\t\t\t<Text weight="bold">Search & Smarts</Text> space.\n\t\t\t\t\t\t</ModalBody>\n\t\t\t\t\t\t<ModalFooter>\n\t\t\t\t\t\t\t<Button appearance="subtle" onClick={closeModal}>\n\t\t\t\t\t\t\t\tCancel\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t<Button appearance="primary" onClick={closeModal}>\n\t\t\t\t\t\t\t\tDuplicate\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t</ModalFooter>\n\t\t\t\t\t</Modal>\n\t\t\t\t)}\n\t\t\t</ModalTransition>\n\t\t</Fragment>\n\t);\n}',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'Children can be any valid react node.\nEither a single element,\nmultiple elements,\nor multiple elements in an array.',
			},
		],
	},
	{
		name: 'PageHeader',
		package: '@atlaskit/page-header',
		description: 'A component for page headers.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for consistent page header layout',
			'Include breadcrumbs for navigation context',
			'Provide relevant page actions',
			'Use appropriate header hierarchy',
		],
		contentGuidelines: [
			'Use clear, descriptive page titles',
			'Provide meaningful breadcrumb labels',
			'Use action-oriented button text',
			'Keep header content focused',
		],
		accessibilityGuidelines: [
			'Provide clear page titles',
			'Use appropriate heading hierarchy',
			'Ensure breadcrumb navigation is accessible',
			'Provide clear action labels',
		],
		keywords: ['page', 'header', 'title', 'breadcrumbs', 'actions'],
		category: 'layout',
		examples: [
			'import Breadcrumbs, { BreadcrumbsItem } from \'@atlaskit/breadcrumbs\';\nimport Button from \'@atlaskit/button/new\';\nimport PageHeader from \'@atlaskit/page-header\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<PageHeader>Page Title</PageHeader>\n\t\t<PageHeader\n\t\t\tbreadcrumbs={\n\t\t\t\t<Breadcrumbs>\n\t\t\t\t\t<BreadcrumbsItem href="/" text="Home" />\n\t\t\t\t\t<BreadcrumbsItem href="/projects" text="Projects" />\n\t\t\t\t\t<BreadcrumbsItem text="Current Project" />\n\t\t\t\t</Breadcrumbs>\n\t\t\t}\n\t\t\tactions={<Button appearance="primary">Create</Button>}\n\t\t>\n\t\t\tProject Settings\n\t\t</PageHeader>\n\t\t<PageHeader\n\t\t\tactions={\n\t\t\t\t<>\n\t\t\t\t\t<Button appearance="subtle">Cancel</Button>\n\t\t\t\t\t<Button appearance="primary">Save Changes</Button>\n\t\t\t\t</>\n\t\t\t}\n\t\t>\n\t\t\tEdit Profile\n\t\t</PageHeader>\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'actions',
				type: 'React.ReactElement<any, string | React.JSXElementConstructor<any>>',
				description: 'Contents of the action bar to be rendered next to the page title.',
			},
			{
				name: 'bottomBar',
				type: 'React.ReactElement<any, string | React.JSXElementConstructor<any>>',
				description:
					'Contents of the action bar to be rendered next to the page title. Typically a button group.',
			},
			{
				name: 'breadcrumbs',
				type: 'React.ReactElement<any, string | React.JSXElementConstructor<any>>',
				description: 'Page breadcrumbs to be rendered above the title.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'Contents of the bottom bar to be rendered below the page title. Typically contains a search bar and/or filters.',
			},
			{
				name: 'disableTitleStyles',
				type: 'boolean',
				description: 'Content of the page title. The text wraps by default.',
				defaultValue: 'false',
			},
			{
				name: 'id',
				type: 'string',
				description:
					'Used as the ID of the inner h1 tag. This is exposed so the header text can be used as label of other elements by aria-labelledby.',
			},
			{
				name: 'innerRef',
				type: '(element: HTMLElement) => void',
				description:
					'Returns the inner ref to the DOM element of the title. This is exposed so the focus can be set.',
			},
			{
				name: 'truncateTitle',
				type: 'boolean',
				description:
					'Prevent the title from wrapping across lines. Avoid using this wherever possible, as truncation can make page headings inaccessible.',
				defaultValue: 'false',
			},
		],
	},
	{
		name: 'Pagination',
		package: '@atlaskit/pagination',
		description: 'A component for pagination controls.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for navigating through paged content',
			'Provide clear page indicators',
			'Consider total page count display',
			'Use appropriate page limits',
		],
		contentGuidelines: [
			'Use clear page labels',
			'Provide meaningful navigation text',
			'Use consistent pagination terminology',
			'Consider page context information',
		],
		accessibilityGuidelines: [
			'Provide clear page navigation labels',
			'Use appropriate ARIA labels for pagination',
			'Ensure keyboard navigation support',
			'Announce page changes to screen readers',
		],
		keywords: ['pagination', 'pages', 'navigation', 'paging', 'controls'],
		category: 'navigation',
		examples: [
			"import Pagination from '@atlaskit/pagination';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<Pagination\n\t\t\tpages={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}\n\t\t\tdefaultSelectedIndex={2}\n\t\t\tmax={7}\n\t\t\tonChange={(_event, page) => console.log('Page selected:', page)}\n\t\t/>\n\t\t<Pagination\n\t\t\tpages={['A', 'B', 'C', 'D']}\n\t\t\tdefaultSelectedIndex={1}\n\t\t\tonChange={(_event, page) => console.log('Letter page:', page)}\n\t\t/>\n\t</>\n);\nexport default Examples;",
		],
		props: [
			{
				name: 'components',
				type: '{ Page?: React.ElementType<any, keyof React.JSX.IntrinsicElements>; Previous?: React.ElementType<any, keyof React.JSX.IntrinsicElements>; Next?: React.ElementType<...>; }',
				description: 'Replace the built-in page, previous, next and/ or ellipsis component',
			},
			{
				name: 'defaultSelectedIndex',
				type: 'number',
				description: 'Index of the page to be selected by default.',
			},
			{
				name: 'getPageLabel',
				type: '(page: T, pageIndex: number) => string | number',
				description:
					'Helper function to get text displayed on the page button. This is helpful in scenarios when page the page passed in is an object.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Sets whether the Paginator is disabled',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'The aria-label for the pagination nav wrapper.\nThe default value is "pagination".',
			},
			{
				name: 'max',
				type: 'number',
				description: 'Maximum number of pages to be displayed in the pagination.',
			},
			{
				name: 'nextLabel',
				type: 'string',
				description: 'The aria-label for the next button.\nThe default value is "next".',
			},
			{
				name: 'onChange',
				type: '(event: React.SyntheticEvent<Element, Event>, page: T, analyticsEvent?: UIAnalyticsEvent) => void',
				description: 'The onChange handler which is called when the page is changed.',
			},
			{
				name: 'pageLabel',
				type: 'string',
				description:
					'The aria-label for the individual page numbers.\nThe default value is "page".\nThe page number is automatically appended to the pageLabel.\nFor Example, pageLabel="página" will render aria-label="página 1"\nas the label for page 1.',
			},
			{
				name: 'pages',
				type: 'T[]',
				description: 'Array of the pages to display.',
				isRequired: true,
			},
			{
				name: 'previousLabel',
				type: 'string',
				description: 'The aria-label for the previous button.\nThe default value is "previous".',
			},
			{
				name: 'renderEllipsis',
				type: '(arg: { key: string; from: number; to: number; }) => React.ReactElement<any, string | React.JSXElementConstructor<any>>',
				description:
					'The react Node returned from the function is rendered instead of the default ellipsis node.',
			},
			{
				name: 'selectedIndex',
				type: 'number',
				description: 'Index of the selected page. This will make this pagination controlled.',
			},
		],
	},
	{
		name: 'Popper',
		package: '@atlaskit/popper',
		description: 'A component for positioning elements relative to other elements.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for positioning overlays and tooltips',
			'Consider positioning constraints',
			'Handle responsive positioning',
			'Use appropriate z-index management',
		],
		contentGuidelines: [
			'Ensure positioned content is accessible',
			'Use appropriate positioning strategies',
			'Consider content visibility and readability',
		],
		accessibilityGuidelines: [
			'Ensure proper positioning and visibility',
			'Consider screen reader accessibility',
			'Use appropriate ARIA attributes',
			'Handle focus management',
		],
		keywords: ['popper', 'positioning', 'tooltip', 'popup', 'overlay'],
		category: 'utility',
		examples: [
			'import { Manager, Popper, Reference } from \'@atlaskit/popper\';\nexport default (): React.JSX.Element => (\n\t<Manager>\n\t\t<Reference>\n\t\t\t{({ ref }) => (\n\t\t\t\t<button ref={ref} type="button">\n\t\t\t\t\tReference element\n\t\t\t\t</button>\n\t\t\t)}\n\t\t</Reference>\n\t\t<Popper placement="right">\n\t\t\t{({ ref, style }) => (\n\t\t\t\t<div ref={ref} style={style} >\n\t\t\t\t\t↔ This text is a popper placed to the right\n\t\t\t\t</div>\n\t\t\t)}\n\t\t</Popper>\n\t</Manager>\n);',
		],
		props: [
			{
				name: 'children',
				type: '(childrenProps: PopperChildrenProps) => React.ReactNode',
				description: 'Returns the element to be positioned.',
				defaultValue: 'defaultChildrenFn',
			},
			{
				name: 'modifiers',
				type: 'readonly Modifier<CustomModifiers, object>[]',
				description: 'Additional modifiers and modifier overwrites.',
			},
			{
				name: 'offset',
				type: '[number, number]',
				description:
					'Distance the popup should be offset from the reference in the format of [along, away] (units in px).\nDefaults to [0, 8] - which means the popup will be 8px away from the edge of the reference specified\nby the `placement` prop.',
				defaultValue: 'defaultOffset',
			},
			{
				name: 'placement',
				type: 'AutoPlacement | BasePlacement | VariationPlacement',
				description: 'Which side of the Reference to show on.',
				defaultValue: '"bottom-start"',
			},
			{
				name: 'referenceElement',
				type: 'HTMLElement | VirtualElement',
				description: 'Replacement reference element to position popper relative to.',
				defaultValue: 'undefined',
			},
			{
				name: 'shouldFitViewport',
				type: 'boolean',
				description:
					'Determines if the popper will have a `max-width` and `max-height` set to\nconstrain it to the viewport.',
				defaultValue: 'false',
			},
			{
				name: 'strategy',
				type: '"fixed" | "absolute"',
				description: "Placement strategy used. Can be 'fixed' or 'absolute'",
				defaultValue: '"fixed"',
			},
		],
	},
	{
		name: 'Popup',
		package: '@atlaskit/popup',
		description: 'A component for displaying popup content relative to a trigger element.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for contextual content that appears on demand',
			'Position appropriately relative to trigger',
			'Consider dismissal behavior',
			'Use appropriate content sizing',
		],
		contentGuidelines: [
			'Keep popup content focused and relevant',
			'Use clear, concise content',
			'Provide appropriate actions when needed',
			'Consider content hierarchy',
		],
		accessibilityGuidelines: [
			'Provide appropriate focus management',
			'Use clear trigger labels',
			'Ensure keyboard navigation support',
			'Provide escape key dismissal',
		],
		keywords: ['popup', 'overlay', 'floating', 'content', 'trigger'],
		category: 'overlay',
		examples: [
			"import React, { useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport Popup from '@atlaskit/popup';\nexport default (): React.JSX.Element => {\n\tconst [isOpen, setIsOpen] = useState(false);\n\treturn (\n\t\t<Popup\n\t\t\tcontent={() => <div>Basic popup content</div>}\n\t\t\tisOpen={isOpen}\n\t\t\tonClose={() => setIsOpen(false)}\n\t\t\tplacement=\"bottom-start\"\n\t\t\ttrigger={(triggerProps) => (\n\t\t\t\t<Button {...triggerProps} onClick={() => setIsOpen(!isOpen)}>\n\t\t\t\t\tToggle Popup\n\t\t\t\t</Button>\n\t\t\t)}\n\t\t\tshouldRenderToParent\n\t\t/>\n\t);\n};",
		],
		props: [
			{
				name: 'appearance',
				type: '"default" | "UNSAFE_modal-below-sm"',
				description:
					'The "default" appearance is used for standard popups.\nThe "UNSAFE_modal-below-sm" appearance makes the popup appear as a modal when the viewport is smaller than "sm".',
			},
			{
				name: 'autoFocus',
				type: 'boolean',
				description:
					'This controls whether the popup takes focus when opening.\nThis changes the `popupComponent` component tabIndex to `null`.\nThe default is `true`.',
			},
			{
				name: 'boundary',
				type: '"clippingParents" | HTMLElement',
				description:
					'The boundary element that the popup will check for overflow.\nThe default is `"clippingParents"` which are parent scroll containers,\nbut can be set to any element.',
			},
			{
				name: 'content',
				type: '(props: ContentProps) => ReactNode',
				description: 'Render props for content that is displayed inside the popup.',
				isRequired: true,
			},
			{
				name: 'fallbackPlacements',
				type: 'Placement[]',
				description:
					"This is a list of backup placements for the popup to try.\nWhen the preferred placement doesn't have enough space,\nthe modifier will test the ones provided in the list, and use the first suitable one.\nIf no fallback placements are suitable, it reverts back to the original placement.",
			},
			{
				name: 'id',
				type: 'string',
				description: 'ID that is assigned to the popup container element.',
			},
			{
				name: 'isOpen',
				type: 'boolean',
				description:
					'Use this to either show or hide the popup.\nWhen set to `false` the popup will not render anything to the DOM.',
				isRequired: true,
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Refers to an `aria-label` attribute. Sets an accessible name for the popup to announce it to users of assistive technology.\nUsage of either this, or the `titleId` attribute is strongly recommended.',
			},
			{
				name: 'modifiers',
				type: 'Partial<Partial<Modifier<string, object>>>[]',
				description:
					'Additional modifiers and modifier overwrites.\nfor more details - https://popper.js.org/docs/v1/#modifiers',
			},
			{
				name: 'offset',
				type: '[number, number]',
				description:
					'The distance the popup should be offset from the reference in the format of [along, away] (units in px).\nThe default is `[0, 8]`, which means the popup will be `8px` away from the edge of the reference specified\nby the `placement` prop.',
			},
			{
				name: 'onClose',
				type: '(event: Event | MouseEvent<Element, globalThis.MouseEvent> | KeyboardEvent<Element>, currentLevel?: any) => void',
				description:
					"Handler that is called when the popup wants to close itself.\nThis can happen when:\n- the user clicks away from the popup\n- the user presses the escape key\n- the popup is closed programatically. In this case, the `event` argument will be `null`.\n\nYou'll want to use this to set open state accordingly, and then pump it back into the `isOpen` prop.",
			},
			{
				name: 'placement',
				type: 'AutoPlacement | BasePlacement | VariationPlacement',
				description:
					'Placement of where the popup should be displayed relative to the trigger element.\nThe default is `"auto"`.',
			},
			{
				name: 'popupComponent',
				type: 'ComponentType<PopupComponentProps> | ForwardRefExoticComponent<PopupComponentProps & RefAttributes<HTMLDivElement>>',
				description:
					'The element that is shown when `isOpen` prop is `true`.\nThe result of the `content` prop will be placed as children here.\nThe default is an element with an elevation of `e200` with _no padding_.',
			},
			{
				name: 'role',
				type: 'string',
				description:
					'Use this to set the accessibility role for the popup.\nWe strongly recommend using only `menu` or `dialog`.\nMust be used along with `label` or `titleId`.',
			},
			{
				name: 'rootBoundary',
				type: '"viewport" | "document"',
				description:
					'The root boundary that the popup will check for overflow.\nThe default is `"viewport"` but it can be set to `"document"`.',
			},
			{
				name: 'shouldDisableFocusLock',
				type: 'boolean',
				description:
					'This makes the popup close on Tab key press. It will only work when `shouldRenderToParent` is `true`.\nThe default is `false`.',
			},
			{
				name: 'shouldFitContainer',
				type: 'boolean',
				description:
					"This fits the popup width to its parent's width.\nWhen set to `true`, the trigger and popup elements will be wrapped in a `div` with `position: relative`.\nThe popup will be rendered as a sibling to the trigger element, and will be full width.\nThe default is `false`.\n\nThis fits the popup width to its parent's width.\nWhen set to `true`, the trigger and popup elements will be wrapped in a `div` with `position: relative`.\nThe popup will be rendered as a sibling to the trigger element, and will be full width.\nThe default is `false`.",
			},
			{
				name: 'shouldFitViewport',
				type: 'boolean',
				description:
					'Determines if the popup will have a `max-width` and `max-height` set to\nconstrain it to the viewport.',
			},
			{
				name: 'shouldFlip',
				type: 'boolean',
				description:
					"Allows the popup to be placed on the opposite side of its trigger if it doesn't fit in the viewport.\nThe default is `true`.",
			},
			{
				name: 'shouldRenderToParent',
				type: 'boolean',
				description:
					'The root element where the popup should be rendered.\nDefaults to `false`.\nThe root element where the popup should be rendered.\nDefaults to `false`.',
			},
			{
				name: 'shouldReturnFocus',
				type: 'boolean',
				description:
					'This determines whether the popup trigger will be focused when the popup content closes.\nThe default is `true`.',
			},
			{
				name: 'shouldUseCaptureOnOutsideClick',
				type: 'boolean',
				description:
					'This controls if the event which handles clicks outside the popup is be bound with\n `capture: true`.',
			},
			{
				name: 'strategy',
				type: '"absolute" | "fixed"',
				description:
					'This controls the positioning strategy to use. Can vary between `absolute` and `fixed`.\nThe default is `fixed`.\nThis controls the positioning strategy to use. Can vary between `absolute` and `fixed`.\nThe default is `fixed`.',
			},
			{
				name: 'titleId',
				type: 'string',
				description:
					'Id referenced by the popup `aria-labelledby` attribute.\nUsage of either this, or the `label` attribute is strongly recommended.',
			},
			{
				name: 'trigger',
				type: '(props: TriggerProps) => ReactNode',
				description:
					'Render props used to anchor the popup to your content.\nMake this an interactive element,\nsuch as an `@atlaskit/button` component.',
				isRequired: true,
			},
			{
				name: 'xcss',
				type: 'false | (XCSSValue<"paddingBlockEnd" | "paddingBlockStart" | "paddingInlineEnd" | "paddingInlineStart" | "width" | "padding" | "paddingBlock" | "paddingInline", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
				description: 'Bounded style overrides.',
			},
			{
				name: 'zIndex',
				type: 'number',
				description:
					'Z-index that the popup should be displayed in.\nThis is passed to the portal component.\nThe default is 400.',
			},
		],
	},
	{
		name: 'Portal',
		package: '@atlaskit/portal',
		description: 'A component for rendering content outside the normal DOM hierarchy.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for rendering content outside normal DOM',
			'Consider z-index and positioning',
			'Handle focus management appropriately',
			'Use for modals and overlays',
		],
		contentGuidelines: [
			'Ensure portaled content is accessible',
			'Consider content context and purpose',
			'Use appropriate portal placement',
		],
		accessibilityGuidelines: [
			'Ensure proper focus management',
			'Consider screen reader accessibility',
			'Use appropriate ARIA attributes',
			'Handle keyboard navigation',
		],
		keywords: ['portal', 'render', 'dom', 'mount', 'teleport'],
		category: 'utility',
		examples: [
			"import Portal from '@atlaskit/portal';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<Portal>\n\t\t\t<div>This content is rendered in a portal</div>\n\t\t</Portal>\n\t\t<Portal zIndex={1000}>\n\t\t\t<div>This content has a custom z-index</div>\n\t\t</Portal>\n\t</>\n);\nexport default Examples;",
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				isRequired: true,
			},
			{
				name: 'isClosed',
				type: 'boolean',
				description: 'Whether the portal is closed.',
				defaultValue: 'false',
			},
			{
				name: 'mountStrategy',
				type: '"effect" | "layoutEffect"',
				description:
					'Specify the mount strategy: useEffect or useLayoutEffect.\nNote: UseLayoutEffect can lead to performance issues and is discouraged.',
				defaultValue: '"effect"',
			},
			{
				name: 'zIndex',
				type: 'string | number',
				defaultValue: '0',
			},
		],
	},
	{
		name: 'Anchor',
		package: '@atlaskit/primitives',
		description: 'A primitive Anchor component for navigation links with compiled styling support.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for navigation links to other pages or sections',
			'Leverage compiled styling for performance',
			'Use appropriate link styling and states',
			'Consider link behavior and target attributes',
		],
		contentGuidelines: [
			'Use clear, descriptive link text',
			'Maintain consistent link styling',
			'Consider link context and destination',
		],
		accessibilityGuidelines: [
			'Provide clear link text that describes the destination',
			'Use appropriate ARIA attributes for links',
			'Ensure keyboard navigation support',
			'Provide clear visual indicators for link state',
			'Use descriptive link text for screen readers',
		],
		keywords: ['anchor', 'link', 'navigation', 'href', 'url', 'primitive', 'compiled'],
		category: 'primitive',
		examples: [
			'import { Anchor } from \'@atlaskit/primitives/compiled\';\nconst _default_1: React.JSX.Element[] = [\n\t<Anchor href="https://atlassian.design">Atlassian Design System</Anchor>,\n\t<Anchor href="/docs" target="_blank">\n\t\tOpen docs\n\t</Anchor>,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'Elements to be rendered inside the Anchor.',
			},
			{
				name: 'href',
				type: 'string | RouterLinkConfig',
				description:
					'Standard links can be provided as a string, which should be mapped to the\nunderlying router link component.\n\nAlternatively, you can provide an object for advanced link configurations\nby supplying the expected object type to the generic.\n\n@example\n```\nconst MyRouterLink = forwardRef(\n(\n  {\n    href,\n    children,\n    ...rest\n  }: RouterLinkComponentProps<{\n    href: string;\n    replace: boolean;\n  }>,\n  ref: Ref<HTMLAnchorElement>,\n) => { ...\n```',
				isRequired: true,
			},
			{
				name: 'newWindowLabel',
				type: 'string',
				description:
					'Override the default text to signify that a link opens in a new window.\nThis is appended to the `aria-label` attribute when the `target` prop is set to `_blank`.',
			},
			{
				name: 'onClick',
				type: '(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
				description:
					"Handler called on click. The second argument provides an Atlaskit UI analytics event that can be fired to a listening channel. See the ['analytics-next' package](https://atlaskit.atlassian.com/packages/analytics/analytics-next) documentation for more information.",
			},
			{
				name: 'xcss',
				type: 'false | (XCSSValue<"clipPath" | "filter" | "marker" | "mask" | "translate" | "content" | "color" | "grid" | "flex" | "fill" | "stroke" | "all" | "bottom" | "left" | "right" | "top" | ... 485 more ... | "glyphOrientationVertical", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
			},
		],
	},
	{
		name: 'Bleed',
		package: '@atlaskit/primitives',
		description:
			'A primitive Bleed component for extending content beyond container boundaries with compiled styling support.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for extending content beyond container margins',
			'Leverage compiled styling for performance',
			'Use appropriate bleed directions and amounts',
			'Consider responsive behavior and container constraints',
		],
		contentGuidelines: [
			'Use for appropriate layout bleeding',
			'Maintain consistent bleeding patterns',
			'Consider content hierarchy and visual flow',
		],
		keywords: ['bleed', 'layout', 'margin', 'spacing', 'edge', 'primitive', 'compiled'],
		category: 'primitive',
		examples: [
			'import { Bleed, Box } from \'@atlaskit/primitives/compiled\';\nconst _default_1: React.JSX.Element[] = [\n\t<Box padding="space.200" backgroundColor="color.background.neutral.subtle">\n\t\t<Bleed inline="space.100">\n\t\t\t<Box backgroundColor="color.background.brand.bold" padding="space.100">\n\t\t\t\tBleed content\n\t\t\t</Box>\n\t\t</Bleed>\n\t</Box>,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'all',
				type: '"space.025" | "space.050" | "space.100" | "space.150" | "space.200"',
				description: 'Bleed along both axis.',
			},
			{
				name: 'block',
				type: '"space.025" | "space.050" | "space.100" | "space.150" | "space.200"',
				description: 'Bleed along the block axis',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Elements to be rendered inside the Flex.',
				isRequired: true,
			},
			{
				name: 'inline',
				type: '"space.025" | "space.050" | "space.100" | "space.150" | "space.200"',
				description: 'Bleed along the inline axis.',
			},
			{
				name: 'role',
				type: 'string',
				description: 'Accessible role.',
			},
			{
				name: 'xcss',
				type: 'false | (XCSSValue<"all" | "flex" | "grid" | "fill" | "stroke" | "bottom" | "left" | "right" | "top" | "clip" | "overlay" | "accentColor" | "alignContent" | "alignItems" | "alignSelf" | ... 486 more ... | "glyphOrientationVertical", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
			},
		],
	},
	{
		name: 'Box',
		package: '@atlaskit/primitives',
		description:
			'A primitive Box component for layout and container purposes with compiled styling support.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for basic layout and container needs',
			'Leverage compiled styling for performance',
			'Use appropriate spacing and layout props',
			'Consider semantic HTML when possible',
		],
		contentGuidelines: [
			'Use for appropriate layout purposes',
			'Maintain consistent spacing and layout patterns',
			'Consider accessibility and semantic structure',
		],
		keywords: ['box', 'container', 'div', 'layout', 'primitive', 'compiled'],
		category: 'primitive',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { cssMap, jsx } from '@atlaskit/css';\nimport { Box } from '@atlaskit/primitives/compiled';\nimport { token } from '@atlaskit/tokens';\nconst styles = cssMap({\n\tbox: {\n\t\tpaddingTop: token('space.200'),\n\t\tpaddingRight: token('space.200'),\n\t\tpaddingBottom: token('space.200'),\n\t\tpaddingLeft: token('space.200'),\n\t\tbackgroundColor: token('color.background.neutral.subtle'),\n\t},\n});\nconst _default_1: JSX.Element[] = [\n\t<Box padding=\"space.200\" backgroundColor=\"color.background.neutral.subtle\">\n\t\tBasic box\n\t</Box>,\n\t<Box xcss={styles.box}>Styled box</Box>,\n];\nexport default _default_1;",
		],
		props: [
			{
				name: 'as',
				type: '"object" | "style" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | "base" | "bdi" | "bdo" | "big" | "blockquote" | "body" | "br" | "canvas" | "caption" | "center" | ... 98 more ... | "set"',
				description:
					"The DOM element to render as the Box.\n- This cannot be any SVG-related element such as `'svg'`, `'animate', `'circle'`, and many more\n- This cannot be a `'a'` (use the `Anchor` primitive instead)\n- This cannot be a `'button'` (use the `Anchor` primitive instead)",
				defaultValue: "'div'",
			},
			{
				name: 'backgroundColor',
				type: '"utility.elevation.surface.current" | "elevation.surface" | "elevation.surface.overlay" | "elevation.surface.raised" | "elevation.surface.sunken" | "color.background.accent.lime.subtlest" | ... 205 more ... | "elevation.surface.raised.pressed"',
				description: 'Token representing background color with a built-in fallback value.',
			},
			{
				name: 'xcss',
				type: 'false | (XCSSValue<"clipPath" | "filter" | "marker" | "mask" | "height" | "width" | "translate" | "content" | "color" | "border" | "alignmentBaseline" | "baselineShift" | "clip" | ... 487 more ... | "viewTimeline", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
				description:
					"Apply a subset of permitted styles powered by Atlassian Design System design tokens.\nIt's preferred you do not use `background` in `xcss` or `cssMap()` and instead use `props.backgroundColor` for surface awareness.",
			},
		],
	},
	{
		name: 'Flex',
		package: '@atlaskit/primitives',
		description: 'A primitive Flex component for flexbox layout with compiled styling support.',
		status: 'open-beta',
		usageGuidelines: [
			'Use for flexbox layout needs',
			'Leverage compiled styling for performance',
			'Use appropriate flex properties and alignment',
			'Consider responsive behavior',
		],
		contentGuidelines: [
			'Use for appropriate flex layout',
			'Maintain consistent flex patterns',
			'Consider content alignment and distribution',
		],
		keywords: ['flex', 'layout', 'flexbox', 'alignment', 'primitive', 'compiled'],
		category: 'primitive',
		examples: [
			'import { Box, Flex } from \'@atlaskit/primitives/compiled\';\nconst _default_1: React.JSX.Element[] = [\n\t<Flex gap="space.100" alignItems="center">\n\t\t<Box backgroundColor="color.background.accent.blue.subtle" padding="space.100">\n\t\t\tItem 1\n\t\t</Box>\n\t\t<Box backgroundColor="color.background.accent.green.subtle" padding="space.100">\n\t\t\tItem 2\n\t\t</Box>\n\t</Flex>,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'alignItems',
				type: '"center" | "start" | "stretch" | "end" | "baseline"',
				description: 'Used to align children along the cross axis.',
			},
			{
				name: 'as',
				type: '"div" | "dl" | "li" | "ol" | "span" | "ul"',
				description: 'The DOM element to render as the Flex. Defaults to `div`.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Elements to be rendered inside the Flex.',
				isRequired: true,
			},
			{
				name: 'columnGap',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
				description: 'Represents the space between each child.',
			},
			{
				name: 'direction',
				type: '"column" | "row"',
				description: 'Represents the flex direction property of CSS flexbox.',
			},
			{
				name: 'gap',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
				description: 'Represents the space between each child.',
			},
			{
				name: 'justifyContent',
				type: '"center" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | "end"',
				description: 'Used to align children along the main axis.',
			},
			{
				name: 'role',
				type: 'string',
				description: 'Accessible role.',
			},
			{
				name: 'rowGap',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
				description: 'Represents the space between each child.',
			},
			{
				name: 'wrap',
				type: '"wrap" | "nowrap"',
				description: 'Represents the flex wrap property of CSS flexbox.',
			},
			{
				name: 'xcss',
				type: 'false | (XCSSValue<"clipPath" | "filter" | "marker" | "mask" | "justifyContent" | "alignItems" | "columnGap" | "gap" | "rowGap" | "direction" | "flex" | "grid" | "fill" | "stroke" | ... 487 more ... | "glyphOrientationVertical", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
			},
		],
	},
	{
		name: 'Focusable',
		package: '@atlaskit/primitives',
		description:
			'A primitive Focusable component for keyboard navigation and focus management with compiled styling support.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for elements that need keyboard focus',
			'Leverage compiled styling for performance',
			'Use appropriate focus management',
			'Consider keyboard navigation patterns',
		],
		contentGuidelines: [
			'Use for appropriate focusable content',
			'Maintain consistent focus patterns',
			'Consider keyboard navigation flow',
		],
		accessibilityGuidelines: [
			'Provide clear focus indicators',
			'Use appropriate tab order and navigation',
			'Ensure keyboard accessibility',
			'Provide clear visual feedback for focus state',
			'Use appropriate ARIA attributes',
		],
		keywords: [
			'focusable',
			'focus',
			'keyboard',
			'navigation',
			'accessibility',
			'primitive',
			'compiled',
		],
		category: 'primitive',
		examples: [
			'import { Box, Focusable } from \'@atlaskit/primitives/compiled\';\nconst _default_1: React.JSX.Element[] = [\n\t<Focusable>\n\t\t<Box padding="space.200" backgroundColor="color.background.neutral.subtle">\n\t\t\tFocusable content\n\t\t</Box>\n\t</Focusable>,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'as',
				type: '"symbol" | "object" | "style" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | "base" | "bdi" | "bdo" | "big" | "blockquote" | "body" | "br" | "canvas" | "caption" | ... 156 more ... | "view"',
				description: 'The DOM element to render as the Focusable element.',
				defaultValue: "'button'",
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
			},
			{
				name: 'isInset',
				type: 'boolean',
				description:
					'Controls whether the focus ring should be applied around or within the composed element.',
			},
			{
				name: 'xcss',
				type: 'false | (XCSSValue<"clipPath" | "filter" | "marker" | "mask" | "color" | "height" | "width" | "alignmentBaseline" | "baselineShift" | "clip" | "clipRule" | "colorInterpolation" | ... 489 more ... | "viewTimeline", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
			},
		],
	},
	{
		name: 'Grid',
		package: '@atlaskit/primitives',
		description: 'A primitive Grid component for CSS Grid layout with compiled styling support.',
		status: 'open-beta',
		usageGuidelines: [
			'Use for CSS Grid layout needs',
			'Leverage compiled styling for performance',
			'Use appropriate grid properties and alignment',
			'Consider responsive behavior',
		],
		contentGuidelines: [
			'Use for appropriate grid layout',
			'Maintain consistent grid patterns',
			'Consider content alignment and distribution',
		],
		keywords: ['grid', 'layout', 'css-grid', 'alignment', 'primitive', 'compiled'],
		category: 'primitive',
		examples: [
			'import { cssMap } from \'@atlaskit/css\';\nimport { Box, Grid } from \'@atlaskit/primitives/compiled\';\nconst styles = cssMap({\n\tgrid: {\n\t\tgridTemplateColumns: \'1fr 1fr\',\n\t},\n});\nconst _default_1: React.JSX.Element[] = [\n\t<Grid gap="space.200" xcss={styles.grid}>\n\t\t<Box backgroundColor="color.background.accent.blue.subtle" padding="space.200">\n\t\t\tGrid item 1\n\t\t</Box>\n\t\t<Box backgroundColor="color.background.accent.green.subtle" padding="space.200">\n\t\t\tGrid item 2\n\t\t</Box>\n\t</Grid>,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'alignContent',
				type: '"center" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | "end"',
				description: 'Used to align the grid along the block axis.',
			},
			{
				name: 'alignItems',
				type: '"center" | "start" | "stretch" | "end" | "baseline"',
				description: 'Used to align children along the block axis.',
			},
			{
				name: 'as',
				type: '"div" | "ol" | "span" | "ul"',
				description: 'The DOM element to render as the Flex. Defaults to `div`.',
			},
			{
				name: 'autoFlow',
				type: '"column" | "row" | "dense" | "row dense" | "column dense"',
				description:
					'Specifies how auto-placed items get flowed into the grid. CSS `grid-auto-flow`.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'Elements to be rendered inside the grid. Required as a grid without children should not be a grid.',
				isRequired: true,
			},
			{
				name: 'columnGap',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
				description: 'Represents the space between each column.',
			},
			{
				name: 'gap',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
				description: 'Represents the space between each child across both axes.',
			},
			{
				name: 'id',
				type: 'string',
				description: 'HTML id attrubute.',
			},
			{
				name: 'justifyContent',
				type: '"center" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | "end"',
				description: 'Used to align children along the inline axis.',
			},
			{
				name: 'role',
				type: 'string',
				description: 'Accessible role.',
			},
			{
				name: 'rowGap',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
				description: 'Represents the space between each row.',
			},
			{
				name: 'xcss',
				type: 'false | (XCSSValue<"clipPath" | "filter" | "marker" | "mask" | "justifyContent" | "justifyItems" | "alignItems" | "alignContent" | "columnGap" | "gap" | "rowGap" | "flex" | "grid" | ... 488 more ... | "glyphOrientationVertical", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
			},
		],
	},
	{
		name: 'Inline',
		package: '@atlaskit/primitives',
		description: 'A primitive Inline component for horizontal layout with consistent spacing.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for horizontal layout needs',
			'Leverage compiled styling for performance',
			'Use appropriate spacing and alignment props',
			'Consider wrapping behavior',
		],
		contentGuidelines: [
			'Use for appropriate horizontal grouping',
			'Maintain consistent spacing patterns',
			'Consider content flow and readability',
		],
		keywords: ['inline', 'layout', 'horizontal', 'spacing', 'primitive', 'compiled'],
		category: 'primitive',
		examples: [
			'import AddIcon from \'@atlaskit/icon/core/add\';\nimport { Inline, Text } from \'@atlaskit/primitives/compiled\';\nconst _default_1: React.JSX.Element[] = [\n\t<Inline space="space.100">\n\t\t<AddIcon label="Add item" />\n\t\t<Text>Add item</Text>\n\t</Inline>,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'alignBlock',
				type: '"center" | "start" | "end" | "baseline" | "stretch"',
				description: 'Used to align children along the block axis (typically vertical).',
			},
			{
				name: 'alignInline',
				type: '"center" | "start" | "end" | "stretch"',
				description: 'Used to align children along the inline axis (typically horizontal).',
			},
			{
				name: 'as',
				type: '"div" | "dl" | "li" | "ol" | "span" | "ul"',
				description: 'The DOM element to render as the Inline. Defaults to `div`.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Elements to be rendered inside the Inline.',
				isRequired: true,
			},
			{
				name: 'grow',
				type: '"hug" | "fill"',
				description: 'Used to set whether the container should grow to fill the available space.',
			},
			{
				name: 'role',
				type: 'string',
				description: 'Accessible role.',
			},
			{
				name: 'rowSpace',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
				description:
					'Represents the space between rows when content wraps.\nUsed to override the `space` value in between rows.',
			},
			{
				name: 'separator',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'Renders a separator string between each child. Avoid using `separator="•"` when `as="ul" | "ol" | "dl"` to preserve proper list semantics.',
			},
			{
				name: 'shouldWrap',
				type: 'boolean',
				description:
					'Used to set whether children are forced onto one line or will wrap onto multiple lines.',
			},
			{
				name: 'space',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
				description: 'Represents the space between each child.',
			},
			{
				name: 'spread',
				type: 'string',
				description: 'Used to distribute the children along the main axis.',
			},
			{
				name: 'xcss',
				type: 'false | (XCSSValue<"clipPath" | "filter" | "marker" | "mask" | "fill" | "gap" | "rowGap" | "flex" | "grid" | "stroke" | "all" | "bottom" | "left" | "right" | "top" | "clip" | "overlay" | ... 484 more ... | "glyphOrientationVertical", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
			},
		],
	},
	{
		name: 'MetricText',
		package: '@atlaskit/primitives',
		description: 'A primitive Text component for typography with compiled styling support.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for text content with consistent typography',
			'Leverage compiled styling for performance',
			'Use appropriate font size and weight props',
			'Consider semantic HTML elements',
		],
		contentGuidelines: [
			'Use for appropriate text content',
			'Maintain consistent typography patterns',
			'Consider readability and hierarchy',
		],
		keywords: ['text', 'typography', 'font', 'primitive', 'compiled'],
		category: 'primitive',
		examples: [
			'import { MetricText } from \'@atlaskit/primitives/compiled\';\nconst _default_1: React.JSX.Element[] = [\n\t<MetricText size="small">42</MetricText>,\n\t<MetricText size="large">1,234</MetricText>,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'align',
				type: '"center" | "end" | "start"',
				description: 'Text alignment.',
			},
			{
				name: 'as',
				type: '"div" | "span"',
				description: 'HTML tag to be rendered. Defaults to `span`.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Elements rendered within the Text element.',
				isRequired: true,
			},
			{
				name: 'id',
				type: 'string',
				description:
					'The [HTML `id` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).',
			},
			{
				name: 'role',
				type: 'string',
				description: 'Accessible role.',
			},
			{
				name: 'size',
				type: '"small" | "medium" | "large"',
				description: 'Text size.',
				isRequired: true,
			},
		],
	},
	{
		name: 'Pressable',
		package: '@atlaskit/primitives',
		description:
			'A primitive Pressable component for handling touch and click interactions with compiled styling support.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for interactive elements that need press feedback',
			'Leverage compiled styling for performance',
			'Use appropriate press states and feedback',
			'Consider touch target accessibility',
		],
		contentGuidelines: [
			'Use for appropriate interactive content',
			'Maintain consistent press patterns',
			'Consider user interaction expectations',
		],
		accessibilityGuidelines: [
			'Provide clear visual feedback for press states',
			'Ensure appropriate touch target sizes',
			'Use appropriate ARIA attributes for interactive elements',
			'Provide keyboard navigation support',
		],
		keywords: ['pressable', 'interaction', 'touch', 'click', 'primitive', 'compiled'],
		category: 'primitive',
		examples: [
			"import { Pressable } from '@atlaskit/primitives/compiled';\nconst _default_1: React.JSX.Element[] = [\n\t<Pressable onClick={() => alert('Pressed!')}>Custom button</Pressable>,\n];\nexport default _default_1;",
		],
		props: [
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Whether the button is disabled.',
			},
			{
				name: 'onClick',
				type: '(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
				description:
					"Handler called on click. The second argument provides an Atlaskit UI analytics event that can be fired to a listening channel. See the ['analytics-next' package](https://atlaskit.atlassian.com/packages/analytics/analytics-next) documentation for more information.",
			},
			{
				name: 'xcss',
				type: 'false | (XCSSValue<"clipPath" | "filter" | "marker" | "mask" | "translate" | "content" | "color" | "grid" | "flex" | "fill" | "stroke" | "all" | "bottom" | "left" | "right" | "top" | ... 485 more ... | "glyphOrientationVertical", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
			},
		],
	},
	{
		name: 'Stack',
		package: '@atlaskit/primitives',
		description:
			'A primitive Stack component for vertical and horizontal layout with consistent spacing.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for consistent vertical or horizontal layouts',
			'Leverage compiled styling for performance',
			'Use appropriate spacing and alignment props',
			'Consider responsive behavior',
		],
		contentGuidelines: [
			'Use for appropriate layout grouping',
			'Maintain consistent spacing patterns',
			'Consider content hierarchy and flow',
		],
		keywords: ['stack', 'layout', 'vertical', 'horizontal', 'spacing', 'primitive', 'compiled'],
		category: 'primitive',
		examples: [
			'import Heading from \'@atlaskit/heading\';\nimport { Stack, Text } from \'@atlaskit/primitives/compiled\';\nconst _default_1: React.JSX.Element[] = [\n\t<Stack space="space.100">\n\t\t<Heading size="medium">User name</Heading>\n\t\t<Text>Description</Text>\n\t</Stack>,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'alignBlock',
				type: '"center" | "start" | "end" | "stretch"',
				description: 'Used to align children along the block axis (typically vertical).',
			},
			{
				name: 'alignInline',
				type: '"center" | "start" | "end" | "stretch"',
				description: 'Used to align children along the inline axis (typically horizontal).',
			},
			{
				name: 'as',
				type: '"div" | "dl" | "ol" | "span" | "ul"',
				description: 'The DOM element to render as the Stack. Defaults to `div`.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Elements to be rendered inside the Stack.',
				isRequired: true,
			},
			{
				name: 'grow',
				type: '"hug" | "fill"',
				description: 'Used to set whether the container should grow to fill the available space.',
			},
			{
				name: 'role',
				type: 'string',
				description: 'Accessible role.',
			},
			{
				name: 'space',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
				description: 'Represents the space between each child.',
			},
			{
				name: 'spread',
				type: 'string',
				description: 'Used to distribute the children along the main axis.',
			},
			{
				name: 'xcss',
				type: 'false | (XCSSValue<"clipPath" | "filter" | "marker" | "mask" | "fill" | "gap" | "flex" | "grid" | "stroke" | "all" | "bottom" | "left" | "right" | "top" | "clip" | "overlay" | "accentColor" | ... 484 more ... | "glyphOrientationVertical", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
			},
		],
	},
	{
		name: 'Text',
		package: '@atlaskit/primitives',
		description: 'A primitive Text component for typography with compiled styling support.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for text content with consistent typography',
			'Leverage compiled styling for performance',
			'Use appropriate font size and weight props',
			'Consider semantic HTML elements',
		],
		contentGuidelines: [
			'Use for appropriate text content',
			'Maintain consistent typography patterns',
			'Consider readability and hierarchy',
		],
		keywords: ['text', 'typography', 'font', 'primitive', 'compiled'],
		category: 'primitive',
		examples: [
			'import { Text } from \'@atlaskit/primitives/compiled\';\nconst _default_1: React.JSX.Element[] = [\n\t<Text>Default text</Text>,\n\t<Text size="large" weight="bold">\n\t\tLarge bold text\n\t</Text>,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'align',
				type: '"center" | "end" | "start"',
				description: 'Text alignment.',
			},
			{
				name: 'as',
				type: '"em" | "p" | "span" | "strong"',
				description: 'HTML tag to be rendered. Defaults to `span`.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Elements rendered within the Text element.',
				isRequired: true,
			},
			{
				name: 'color',
				type: '"inherit" | TextColor',
				description:
					'Token representing text color with a built-in fallback value.\nWill apply inverse text color automatically if placed within a Box with bold background color.\nDefaults to `color.text` if not nested in other Text components.',
			},
			{
				name: 'id',
				type: 'string',
				description:
					'The [HTML `id` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).',
			},
			{
				name: 'maxLines',
				type: 'number',
				description:
					'The number of lines to limit the provided text to. Text will be truncated with an ellipsis.\n\nWhen `maxLines={1}`, `wordBreak` defaults to `break-all` to match the behaviour of `text-overflow: ellipsis`.',
			},
			{
				name: 'role',
				type: 'string',
				description: 'Accessible role.',
			},
			{
				name: 'size',
				type: '"small" | "large" | "medium"',
				description: 'Text size.',
			},
			{
				name: 'weight',
				type: '"medium" | "bold" | "regular" | "semibold"',
				description:
					'The [HTML `font-weight` attribute](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight).',
			},
			{
				name: 'xcss',
				type: 'false | (XCSSValue<"fontVariantNumeric" | "overflowWrap" | "textDecorationLine", DesignTokenStyles, ""> & {} & XCSSPseudo<"fontVariantNumeric" | "overflowWrap" | "textDecorationLine", never, never, DesignTokenStyles> & XCSSMediaQuery<...> & { ...; } & { ...; })',
				description: 'Bounded style overrides.',
			},
		],
	},
	{
		name: 'ProgressBar',
		package: '@atlaskit/progress-bar',
		description:
			'A progress bar communicates the status of a system process, showing completion percentage or indeterminate progress.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for showing progress of known duration',
			'Provide clear progress indicators',
			'Use indeterminate state for unknown duration',
			'Position progress bars prominently when active',
			'Consider providing percentage or time estimates',
		],
		contentGuidelines: [
			'Use clear, descriptive progress messages',
			'Provide meaningful context for progress',
			'Consider showing estimated time remaining',
			'Use consistent progress terminology',
		],
		accessibilityGuidelines: [
			'Provide appropriate ARIA labels for progress bars',
			'Announce progress changes to screen readers',
			'Use appropriate color contrast for visibility',
			'Provide alternative text for progress status',
		],
		keywords: ['progress', 'bar', 'loading', 'status', 'completion', 'indeterminate'],
		category: 'loading',
		examples: [
			'import ProgressBar from \'@atlaskit/progress-bar\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<ProgressBar value={0.5} />\n\t\t<ProgressBar value={0.8} appearance="success" />\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'appearance',
				type: '"default" | "success" | "inverse"',
				description: 'The visual style of the progress bar.',
				defaultValue: '"default"',
			},
			{
				name: 'ariaLabel',
				type: 'string',
				description:
					"This is the descriptive label that's associated with the progress bar.\nAlways include useful information on the current state of the progress bar so that people who use assistive technology can understand what the current state of the progress bar is.",
			},
			{
				name: 'isIndeterminate',
				type: 'boolean',
				description: 'Shows the progress bar in an indeterminate state when `true`.',
				defaultValue: 'false',
			},
			{
				name: 'value',
				type: 'number',
				description: 'Sets the value of the progress bar, between `0` and `1` inclusive.',
				defaultValue: '0',
			},
		],
	},
	{
		name: 'SuccessProgressBar',
		package: '@atlaskit/progress-bar',
		description: 'A progress bar variant that indicates successful completion of a process.',
		status: 'general-availability',
		usageGuidelines: [
			'Use to indicate successful completion',
			'Show briefly before transitioning to next state',
			'Use appropriate success styling',
			'Consider providing success message',
		],
		contentGuidelines: [
			'Use clear success messaging',
			'Indicate what was completed successfully',
			'Provide next steps if applicable',
		],
		keywords: ['progress', 'bar', 'success', 'complete', 'finished'],
		category: 'loading',
		examples: [
			"import { SuccessProgressBar } from '@atlaskit/progress-bar';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<SuccessProgressBar value={1.0} />\n\t\t<SuccessProgressBar value={0.9} />\n\t</>\n);\nexport default Examples;",
		],
		props: [
			{
				name: 'ariaLabel',
				type: 'string',
				description:
					"This is the descriptive label that's associated with the progress bar.\nAlways include useful information on the current state of the progress bar so that people who use assistive technology can understand what the current state of the progress bar is.",
			},
			{
				name: 'isIndeterminate',
				type: 'boolean',
				description: 'Shows the progress bar in an indeterminate state when `true`.',
				defaultValue: 'false',
			},
			{
				name: 'value',
				type: 'number',
				description: 'Sets the value of the progress bar, between `0` and `1` inclusive.',
				defaultValue: '0',
			},
		],
	},
	{
		name: 'TransparentProgressBar',
		package: '@atlaskit/progress-bar',
		description: 'A progress bar variant with transparent background for overlay contexts.',
		status: 'general-availability',
		usageGuidelines: [
			'Use in overlay or modal contexts',
			'Ensure sufficient contrast with background',
			'Use for subtle progress indication',
			'Consider backdrop visibility',
		],
		contentGuidelines: [
			'Ensure progress is visible against background',
			'Use appropriate contrast for readability',
			'Keep progress indication clear',
		],
		keywords: ['progress', 'bar', 'transparent', 'overlay', 'subtle'],
		category: 'loading',
		examples: [
			"import { TransparentProgressBar } from '@atlaskit/progress-bar';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<TransparentProgressBar value={0.6} />\n\t\t<TransparentProgressBar value={0.3} />\n\t</>\n);\nexport default Examples;",
		],
		props: [
			{
				name: 'ariaLabel',
				type: 'string',
				description:
					"This is the descriptive label that's associated with the progress bar.\nAlways include useful information on the current state of the progress bar so that people who use assistive technology can understand what the current state of the progress bar is.",
			},
			{
				name: 'isIndeterminate',
				type: 'boolean',
				description: 'Shows the progress bar in an indeterminate state when `true`.',
				defaultValue: 'false',
			},
			{
				name: 'value',
				type: 'number',
				description: 'Sets the value of the progress bar, between `0` and `1` inclusive.',
				defaultValue: '0',
			},
		],
	},
	{
		name: 'ProgressIndicator',
		package: '@atlaskit/progress-indicator',
		description: 'A component for displaying progress through steps or completion status.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for step-by-step processes',
			'Provide clear progress indicators',
			'Handle progress updates appropriately',
			'Consider progress completion states',
		],
		contentGuidelines: [
			'Use clear, descriptive step labels',
			'Provide meaningful progress descriptions',
			'Use appropriate progress terminology',
			'Keep progress information concise',
		],
		accessibilityGuidelines: [
			'Ensure progress is announced by screen readers',
			'Use appropriate progress indicators',
			'Provide clear progress context',
			'Consider progress timing and updates',
		],
		keywords: ['progress', 'indicator', 'steps', 'completion', 'status'],
		category: 'feedback',
		examples: [
			"import { ProgressIndicator } from '@atlaskit/progress-indicator';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<ProgressIndicator selectedIndex={1} values={['Step 1', 'Step 2', 'Step 3']} />\n\t\t<ProgressIndicator selectedIndex={2} values={['Start', 'In Progress', 'Complete']} />\n\t</>\n);\nexport default Examples;",
		],
		props: [
			{
				name: 'appearance',
				type: '"default" | "help" | "inverted" | "primary"',
				description: 'Sets the color of the indicators.',
				defaultValue: '"default"',
			},
			{
				name: 'ariaControls',
				type: 'string',
				description:
					'If interaction is enabled, use `ariaControls` to tell assistive technology what elements are controlled by the progress indicator.',
				defaultValue: '"panel"',
			},
			{
				name: 'ariaLabel',
				type: 'string',
				description:
					'Describes what the indicator represents to assistive technology. The selected index number will be appended to the label.',
				defaultValue: '"tab"',
			},
			{
				name: 'onSelect',
				type: '(eventData: { event: React.MouseEvent<HTMLButtonElement, MouseEvent>; index: number; }, analyticsEvent: UIAnalyticsEvent) => void',
				description: 'Function called when an indicator is selected.',
			},
			{
				name: 'selectedIndex',
				type: 'number',
				description: 'Which indicator is currently selected.',
				isRequired: true,
			},
			{
				name: 'size',
				type: '"default" | "large"',
				description: 'Sets the width and height of each indicator.',
				defaultValue: '"default"',
			},
			{
				name: 'spacing',
				type: '"comfortable" | "cozy" | "compact"',
				description: 'Specifies how much of a gutter there is between indicators.',
			},
			{
				name: 'values',
				type: 'any[]',
				description: 'An array of values mapped over to create the indicators.',
				isRequired: true,
			},
		],
	},
	{
		name: 'ProgressTracker',
		package: '@atlaskit/progress-tracker',
		description: 'A component for tracking progress through multi-step processes.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for multi-step workflows',
			'Provide clear progress tracking',
			'Handle progress updates appropriately',
			'Consider progress completion states',
		],
		contentGuidelines: [
			'Use clear, descriptive step labels',
			'Provide meaningful progress descriptions',
			'Use appropriate progress terminology',
			'Keep progress information concise',
		],
		accessibilityGuidelines: [
			'Ensure progress is announced by screen readers',
			'Use appropriate progress indicators',
			'Provide clear progress context',
			'Consider progress timing and updates',
		],
		keywords: ['progress', 'tracker', 'steps', 'completion', 'workflow'],
		category: 'feedback',
		examples: [
			"import { ProgressTracker } from '@atlaskit/progress-tracker';\nconst Example = (): React.JSX.Element => (\n\t<ProgressTracker\n\t\titems={[\n\t\t\t{ id: 'step1', label: 'Step 1', status: 'visited', percentageComplete: 100 },\n\t\t\t{ id: 'step2', label: 'Step 2', status: 'current', percentageComplete: 40 },\n\t\t\t{ id: 'step3', label: 'Step 3', status: 'disabled', percentageComplete: 0 },\n\t\t\t{ id: 'step4', label: 'Step 4', status: 'unvisited', percentageComplete: 0 },\n\t\t]}\n\t/>\n);\nexport default Example;",
		],
		props: [
			{
				name: 'animated',
				type: 'boolean',
				description: 'Turns off transition animations if set to false.',
				defaultValue: 'true',
			},
			{
				name: 'items',
				type: 'Stage[]',
				description: 'Ordered list of stage data.',
				defaultValue: '[]',
				isRequired: true,
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Use this to provide an aria-label for the overall progress tracker, so that people who use assistive technology get an overview of the tracker\'s purpose. For example, "Sign up progress".',
				defaultValue: '"Progress"',
			},
			{
				name: 'spacing',
				type: '"cozy" | "comfortable" | "compact"',
				description: 'Sets the amount of spacing between the steps.',
				defaultValue: '"cozy"',
			},
		],
	},
	{
		name: 'Radio',
		package: '@atlaskit/radio',
		description:
			'A radio button component for single selection from a set of mutually exclusive choices. Use for custom radio button presentations like options in tables or when you need fine control over individual radio buttons.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for custom radio button presentations (e.g., options in tables)',
			'Use when you need fine control over individual radio buttons',
			'List options in logical order (most likely to least likely)',
			'Make one option the default (safest, most secure option)',
			"Add 'None' option if unselected state is needed",
			"Add 'Other' option if not all options can be listed",
		],
		contentGuidelines: [
			'Use clear, descriptive labels that provide context',
			'Keep labels concise but informative',
			'Use sentence case for labels',
			'Avoid overlapping or skipping numeric choices',
		],
		accessibilityGuidelines: [
			'Include error messages for required or invalid radio fields',
			'Never preselect high-risk options for payment, privacy, or security',
			"Don't use disabled radio buttons if they need to remain in tab order",
			'Use validation instead of disabled state for better accessibility',
		],
		keywords: ['radio', 'button', 'input', 'form', 'selection', 'choice', 'option'],
		category: 'form',
		examples: [
			'import { Radio } from \'@atlaskit/radio\';\nexport default (): React.JSX.Element => (\n\t<Radio value="option1" label="Option 1" name="choices" onChange={() => console.log(\'Changed!\')} />\n);',
		],
		props: [
			{
				name: 'ariaLabel',
				type: 'string',
				description: 'The `aria-label` attribute associated with the radio element.',
			},
			{
				name: 'isChecked',
				type: 'boolean',
				description: 'Set the field as checked.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					'Makes a `Radio` field unselectable when true. Overridden by `isDisabled` prop of `RadioGroup`.',
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description: 'Marks this as an invalid field.',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'Marks this as a required field.',
			},
			{
				name: 'label',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'The label value for the input rendered to the DOM.',
			},
			{
				name: 'labelId',
				type: 'string',
				description:
					'This sets the `aria-labelledby` attribute. It sets an accessible name for\nthe radio, for people who use assistive technology. Use of a visible label\nis highly recommended for greater accessibility support.',
			},
			{
				name: 'onChange',
				type: '(e: ChangeEvent<HTMLInputElement>, analyticsEvent: UIAnalyticsEvent) => void',
				description:
					'`onChange` event handler, passed into the props of each `Radio` Component instantiated within `RadioGroup`.',
			},
			{
				name: 'value',
				type: 'string',
				description: 'Field value.',
			},
		],
	},
	{
		name: 'RadioGroup',
		package: '@atlaskit/radio',
		description:
			'A radio group component that presents a list of options where only one choice can be selected. Use for most radio button scenarios where you want a simple list of mutually exclusive options.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for most radio button scenarios with simple option lists',
			'List options in logical order (most likely to least likely)',
			'Make one option the default (safest, most secure option)',
			"Add 'None' option if unselected state is needed",
			"Add 'Other' option if not all options can be listed",
			'Use select component for longer lists of options',
		],
		contentGuidelines: [
			'Use clear, descriptive labels that provide context',
			'Keep labels concise but informative',
			'Use sentence case for labels',
			'Avoid overlapping or skipping numeric choices',
		],
		accessibilityGuidelines: [
			'Include error messages for required or invalid radio fields',
			'Never preselect high-risk options for payment, privacy, or security',
			"Don't use disabled radio buttons if they need to remain in tab order",
			'Use validation instead of disabled state for better accessibility',
			'Ensure proper keyboard navigation with arrow keys',
		],
		keywords: ['radio', 'group', 'form', 'selection', 'choice', 'options', 'list'],
		category: 'form',
		examples: [
			"import { RadioGroup } from '@atlaskit/radio';\n// Radio group with options\nconst options = [\n\t{ name: 'color', value: 'red', label: 'Red' },\n\t{ name: 'color', value: 'blue', label: 'Blue' },\n];\nexport default (): React.JSX.Element => {\n\tconst [value, setValue] = React.useState('red');\n\treturn (\n\t\t<RadioGroup options={options} value={value} onChange={(e) => setValue(e.currentTarget.value)} />\n\t);\n};",
		],
		props: [
			{
				name: 'defaultValue',
				type: 'string',
				description: 'Sets the initial selected value on the `RadioGroup`.',
			},
			{
				name: 'id',
				type: 'string',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					'Sets the disabled state of all `Radio` elements in the group. Overrides the `isDisabled` setting of all child `Radio` items.',
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description: 'Sets the invalid state of all `Radio` elements in the group.',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'Sets the required state of all `Radio` elements in the group.',
			},
			{
				name: 'labelId',
				type: 'string',
				description:
					'This sets the `aria-labelledby` attribute. It sets an accessible name for\nthe radio, for people who use assistive technology. Use of a visible label\nis highly recommended for greater accessibility support.',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Sets the `name` prop on each of the `Radio` elements in the group.',
			},
			{
				name: 'onChange',
				type: '(e: React.ChangeEvent<HTMLInputElement>, analyticsEvent: UIAnalyticsEvent) => void',
				description: 'Function that gets after each change event.',
			},
			{
				name: 'onInvalid',
				type: '(event: React.SyntheticEvent<any, Event>) => void',
				description: 'Function that gets fired after each invalid event.',
			},
			{
				name: 'options',
				type: 'OptionPropType[]',
				description:
					'An array of objects, each object is mapped onto a `Radio` element within the group. Name must be unique to the group.',
				isRequired: true,
			},
			{
				name: 'value',
				type: 'string',
				description: 'Once set, controls the selected value on the `RadioGroup`.',
			},
		],
	},
	{
		name: 'Range',
		package: '@atlaskit/range',
		description: 'A component for selecting a value from a range of values.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for selecting numeric values within a range',
			'Provide clear min/max boundaries',
			'Use appropriate step increments',
			'Consider showing current value',
		],
		contentGuidelines: [
			'Use clear range labels',
			'Provide meaningful min/max labels',
			'Show current value when helpful',
			'Use consistent range terminology',
		],
		accessibilityGuidelines: [
			'Provide clear labels for range inputs',
			'Use appropriate ARIA attributes',
			'Ensure keyboard navigation support',
			'Provide value announcements for screen readers',
		],
		keywords: ['range', 'slider', 'input', 'form', 'value', 'selection'],
		category: 'form',
		examples: [
			"import Range from '@atlaskit/range';\nconst Example = (): React.JSX.Element => (\n\t<Range\n\t\tvalue={25}\n\t\tmin={0}\n\t\tmax={50}\n\t\tstep={5}\n\t\tonChange={(value) => console.log('Stepped value:', value)}\n\t/>\n);\nexport default Example;",
		],
		props: [
			{
				name: 'defaultValue',
				type: 'number',
				description: 'Sets the default value if range is not set.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Sets whether the field range is disabled.',
			},
			{
				name: 'max',
				type: 'number',
				description: 'Sets the maximum value of the range.',
			},
			{
				name: 'min',
				type: 'number',
				description: 'Sets the minimum value of the range.',
			},
			{
				name: 'onChange',
				type: '(value: number) => void',
				description: 'Hook to be invoked on change of the range.',
			},
			{
				name: 'step',
				type: 'number',
				description: 'Sets the step value for the range.',
			},
			{
				name: 'value',
				type: 'number',
				description: 'Sets the value of the range.',
			},
		],
	},
	{
		name: 'SectionMessage',
		package: '@atlaskit/section-message',
		description: 'A component for section-level messages.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for section-level important info that persists until action or resolution',
			'Use when: destructive consequences, action needed to proceed, connectivity or auth issues',
			'Anatomy: icon+color, title (optional), description, actions (optional)',
			'Use Banner for site-wide; Flag after an event; Inline message for smaller context',
		],
		contentGuidelines: [
			'Title: state the issue or reason',
			'Description: clear, concise, empathetic; use active verbs',
			'Avoid blame—use "we\'re having trouble" not "you\'re having issues"',
			'Provide clear next steps when needed',
		],
		accessibilityGuidelines: [
			'Do not rely on color alone for severity',
			'Avoid dead ends—always indicate how to proceed',
			'Use descriptive link text that describes the destination',
			'Ensure section message content is announced by screen readers',
			'Use appropriate color contrast for text readability',
			'Provide clear, actionable messaging',
			'Consider keyboard navigation for interactive section messages',
		],
		keywords: ['section', 'message', 'alert', 'notification', 'contextual', 'information'],
		category: 'feedback',
		examples: [
			'import { Text } from \'@atlaskit/primitives/compiled\';\nimport SectionMessage, { SectionMessageAction } from \'@atlaskit/section-message\';\nconst _default_1: React.JSX.Element[] = [\n\t<SectionMessage appearance="information" title="Information">\n\t\t<Text>This is an informational message to help users understand something important.</Text>\n\t</SectionMessage>,\n\t<SectionMessage appearance="warning" title="Warning">\n\t\t<Text>Please review your settings before proceeding with this action.</Text>\n\t</SectionMessage>,\n\t<SectionMessage\n\t\tappearance="success"\n\t\ttitle="Success"\n\t\tactions={[\n\t\t\t<SectionMessageAction href="#">View Details</SectionMessageAction>,\n\t\t\t<SectionMessageAction href="#">Share Results</SectionMessageAction>,\n\t\t]}\n\t>\n\t\t<Text>Your changes have been saved successfully!</Text>\n\t</SectionMessage>,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'actions',
				type: 'ReactElement<any, string | JSXElementConstructor<any>> | ReactElement<SectionMessageActionProps, string | JSXElementConstructor<...>>[]',
				description:
					'Actions for the user to take after reading the section message. Accepts a ReactElement\nor an array of one or more SectionMessageAction React elements, which are applied as link buttons.\nMiddle dots are automatically added between multiple link buttons, so no elements\nshould be present between multiple actions.\n\nIn general, avoid using more than two actions.',
			},
			{
				name: 'appearance',
				type: '"information" | "warning" | "error" | "success" | "discovery"',
				description: 'The appearance styling to use for the section message.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'The main content of the section message. This accepts a react node, although\nwe recommend that this should be a paragraph.',
				isRequired: true,
			},
			{
				name: 'icon',
				type: '"symbol" | "object" | "title" | "a" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | "base" | "bdi" | "bdo" | "big" | "blockquote" | "body" | "br" | "button" | ... 159 more ... | ComponentType<...>',
				description:
					'An Icon component to be rendered instead of the default icon for the component.\nThis should only be an `@atlaskit/icon` icon. You can check out [this example](/packages/design-system/section-message/example/custom-icon)\nto see how to provide this icon.',
			},
			{
				name: 'isDismissible',
				type: 'boolean',
				description:
					'Displays a dismiss button, that allows the user to dismiss the message.\nIt will be removed from the DOM immediately and will not be re-rendered.\nIt does not handle persistence of the dismissed state across page reloads or remounts.',
			},
			{
				name: 'onDismiss',
				type: '() => void',
				description: 'A callback function that is called when the user dismisses the message.',
			},
			{
				name: 'title',
				type: 'string',
				description: 'The heading of the section message.',
			},
		],
	},
	{
		name: 'AsyncSelect',
		package: '@atlaskit/select',
		description:
			'A select component that loads options asynchronously. Use when options are fetched from an API or loaded on demand.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for options loaded from API or async data',
			'Provide clear loading states while fetching',
			'Cache options when users search repeatedly',
		],
		keywords: ['select', 'async', 'dropdown', 'form', 'api'],
		category: 'form',
		examples: [
			"import { Label } from '@atlaskit/form';\nimport Select, { type OptionsType } from '@atlaskit/select';\nimport { cities } from '../common/data';\nconst filterCities = (inputValue: string) =>\n\tcities.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));\nconst promiseOptions = (inputValue: string) =>\n\tnew Promise<OptionsType>((resolve) => {\n\t\tsetTimeout(() => {\n\t\t\tresolve(filterCities(inputValue));\n\t\t}, 1000);\n\t});\nconst WithPromises = () => {\n\treturn (\n\t\t<>\n\t\t\t<Label htmlFor=\"async-select-example\">What city do you live in?</Label>\n\t\t\t<Select\n\t\t\t\tinputId=\"async-select-example\"\n\t\t\t\tcacheOptions\n\t\t\t\tdefaultOptions\n\t\t\t\tloadOptions={promiseOptions}\n\t\t\t/>\n\t\t</>\n\t);\n};\nexport default (): React.JSX.Element => <WithPromises />;",
		],
		props: [
			{
				name: 'allowCreateWhileLoading',
				type: 'any',
				description:
					'Allow options to be created while the `isLoading` prop is true. Useful to\nprevent the "create new ..." option being displayed while async results are\nstill being loaded.',
			},
			{
				name: 'appearance',
				type: '"default" | "subtle" | "none"',
			},
			{
				name: 'autoFocus',
				type: 'boolean',
				description:
					'Focus the control when it is mounted. There are very few cases that this should be used, and using incorrectly may violate accessibility guidelines.',
			},
			{
				name: 'blurInputOnSelect',
				type: 'boolean',
				description:
					'Remove focus from the input when the user selects an option (handy for dismissing the keyboard on touch devices)',
			},
			{
				name: 'cacheOptions',
				type: 'any',
				description:
					'If cacheOptions is truthy, then the loaded data will be cached. The cache\nwill remain until `cacheOptions` changes value.',
			},
			{
				name: 'classNamePrefix',
				type: 'string',
				description:
					'If provided, all inner components will be given a prefixed className attribute.\n\nThis is useful when styling via CSS classes instead of the Styles API approach.',
			},
			{
				name: 'classNames',
				type: '{ clearIndicator?: (props: ClearIndicatorProps<Option, IsMulti, GroupBase<Option>>) => string; container?: (props: ContainerProps<Option, IsMulti, GroupBase<...>>) => string; ... 18 more ...; valueContainer?: (props: ValueContainerProps<...>) => string; }',
				description: 'Provide classNames based on state for each inner component',
			},
			{
				name: 'clearControlLabel',
				type: 'string',
				description: 'Set the `aria-label` for the clear icon button.',
			},
			{
				name: 'closeMenuOnSelect',
				type: 'boolean',
				description: 'Close the select menu when the user selects an option',
			},
			{
				name: 'components',
				type: '{ Option?: React.ComponentType<OptionProps<Option, IsMulti, GroupBase<Option>>>; Group?: React.ComponentType<GroupProps<Option, IsMulti, GroupBase<...>>>; ... 19 more ...; ValueContainer?: React.ComponentType<...>; }',
				description:
					'This complex object includes all the compositional components that are used\nin `react-select`. If you wish to overwrite a component, pass in an object\nwith the appropriate namespace. If you wish to restyle a component, we recommend\nusing this prop with the `xcss` prop.',
			},
			{
				name: 'createOptionPosition',
				type: 'any',
				description:
					"Sets the position of the createOption element in your options list. Defaults to 'last'",
			},
			{
				name: 'defaultInputValue',
				type: 'string',
			},
			{
				name: 'defaultMenuIsOpen',
				type: 'boolean',
			},
			{
				name: 'defaultOptions',
				type: 'any',
				description:
					"The default set of options to show before the user starts searching. When\nset to `true`, the results for loadOptions('') will be autoloaded.",
			},
			{
				name: 'defaultValue',
				type: 'Option | MultiValue<Option>',
			},
			{
				name: 'descriptionId',
				type: 'string',
				description:
					"This sets the aria-describedby attribute. It sets an accessible description for the select, for people who use assistive technology. Use '<HelperMessage>' from '@atlaskit/form' is preferred.",
			},
			{
				name: 'filterOption',
				type: '(option: FilterOptionOption<Option>, inputValue: string) => boolean',
				description: 'Custom method to filter whether an option should be displayed in the menu',
			},
			{
				name: 'form',
				type: 'string',
				description: 'Sets the form attribute on the input',
			},
			{
				name: 'formatCreateLabel',
				type: 'any',
				description:
					'Gets the label for the "create new ..." option in the menu. Is given the\ncurrent input value.',
			},
			{
				name: 'formatGroupLabel',
				type: '(group: GroupBase<Option>) => React.ReactNode',
				description:
					'Formats group labels in the menu as React components\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
			},
			{
				name: 'formatOptionLabel',
				type: '((data: Option, formatOptionLabelMeta: FormatOptionLabelMeta<Option>) => React.ReactNode) | ((data: Option, formatOptionLabelMeta: FormatOptionLabelMeta<Option>) => React.ReactNode)',
				description: 'Formats option labels in the menu and control as React components',
			},
			{
				name: 'getNewOptionData',
				type: 'any',
				description:
					'Returns the data for the new option when it is created. Used to display the\nvalue, and is passed to `onChange`.',
			},
			{
				name: 'getOptionLabel',
				type: '(option: Option) => string',
				description:
					'Resolves option data to a string to be displayed as the label by components\n\nNote: Failure to resolve to a string type can interfere with filtering and\nscreen reader support.',
			},
			{
				name: 'getOptionValue',
				type: '(option: Option) => string',
				description:
					'Resolves option data to a string to compare options and specify value attributes',
			},
			{
				name: 'hideSelectedOptions',
				type: 'boolean',
				description: 'Hide the selected option from the menu',
			},
			{
				name: 'id',
				type: 'string',
				description: 'The id to set on the SelectContainer component.',
			},
			{
				name: 'inputId',
				type: 'string',
				description: 'The id of the search input',
			},
			{
				name: 'inputValue',
				type: 'string',
				description: 'The value of the search input',
			},
			{
				name: 'instanceId',
				type: 'string | number',
				description: 'Define an id prefix for the select components e.g. {your-id}-value',
			},
			{
				name: 'isClearable',
				type: 'boolean',
				description: 'Is the select value clearable',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Is the select disabled',
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description: 'Is the select invalid',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description:
					'Is the select in a state of loading (async)\nIs the select in a state of loading (async)\nWill cause the select to be displayed in the loading state, even if the\nAsync select is not currently waiting for loadOptions to resolve',
			},
			{
				name: 'isMulti',
				type: 'boolean',
				description: 'Support multiple selected options',
			},
			{
				name: 'isOptionDisabled',
				type: '(option: Option, selectValue: Options<Option>) => boolean',
				description:
					'Override the built-in logic to detect whether an option is disabled\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
			},
			{
				name: 'isOptionSelected',
				type: '(option: Option, selectValue: Options<Option>) => boolean',
				description: 'Override the built-in logic to detect whether an option is selected',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'This prop indicates if the component is required.',
			},
			{
				name: 'isSearchable',
				type: 'boolean',
				description: 'Whether to enable search functionality',
			},
			{
				name: 'isValidNewOption',
				type: 'any',
				description:
					'Determines whether the "create new ..." option should be displayed based on\nthe current input value, select value and options array.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'This sets the aria-label attribute. It sets an accessible name for the select, for people who use assistive technology. Use of a visible label is highly recommended for greater accessibility support.',
			},
			{
				name: 'labelId',
				type: 'string',
				description:
					'This sets the aria-labelledby attribute. It sets an accessible name for the select, for people who use assistive technology. Use of a visible label is highly recommended for greater accessibility support.',
			},
			{
				name: 'loadingMessage',
				type: '(obj: { inputValue: string; }) => React.ReactNode',
				description: 'Async: Text to display when loading options',
			},
			{
				name: 'loadOptions',
				type: 'any',
				description:
					'Function that returns a promise, which is the set of options to be used\nonce the promise resolves.',
			},
			{
				name: 'maxMenuHeight',
				type: 'number',
				description: 'Maximum height of the menu before scrolling',
			},
			{
				name: 'menuIsOpen',
				type: 'boolean',
				description: 'Whether the menu is open',
			},
			{
				name: 'menuPlacement',
				type: '"auto" | "bottom" | "top"',
				description:
					"Default placement of the menu in relation to the control. 'auto' will flip\nwhen there isn't enough space below the control.",
			},
			{
				name: 'menuPortalTarget',
				type: 'HTMLElement',
				description:
					'Whether the menu should use a portal, and where it should attach\n\nAn example can be found in the [Portaling](https://react-select.com/advanced#portaling) documentation',
			},
			{
				name: 'menuPosition',
				type: '"absolute" | "fixed"',
				description:
					'The CSS position value of the menu, when "fixed" extra layout management is required',
			},
			{
				name: 'menuShouldScrollIntoView',
				type: 'boolean',
				description: 'Whether the menu should be scrolled into view when it opens',
			},
			{
				name: 'minMenuHeight',
				type: 'number',
				description: 'Minimum height of the menu before flipping',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Name of the HTML Input (optional - without this, no input will be rendered)',
			},
			{
				name: 'noOptionsMessage',
				type: '((obj: { inputValue: string; }) => React.ReactNode) | ((obj: { inputValue: string; }) => React.ReactNode)',
				description: 'Text to display when there are no options',
			},
			{
				name: 'onBlur',
				type: '(event: React.FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Handle blur events on the control',
			},
			{
				name: 'onChange',
				type: '(newValue: OnChangeValue<Option, IsMulti>, actionMeta: ActionMeta<Option>) => void',
				description: 'Handle change events on the select',
			},
			{
				name: 'onClickPreventDefault',
				type: 'boolean',
			},
			{
				name: 'onCreateOption',
				type: 'any',
				description:
					'If provided, this will be called with the input value when a new option is\ncreated, and `onChange` will **not** be called. Use this when you need more\ncontrol over what happens when new options are created.',
			},
			{
				name: 'onFocus',
				type: '(event: React.FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Handle focus events on the control',
			},
			{
				name: 'onInputChange',
				type: '(newValue: string, actionMeta: InputActionMeta) => void',
				description: 'Handle change events on the input',
			},
			{
				name: 'onKeyDown',
				type: '(event: React.KeyboardEvent<HTMLDivElement>) => void',
				description: 'Handle key down events on the select',
			},
			{
				name: 'onMenuClose',
				type: '() => void',
				description: 'Handle the menu closing',
			},
			{
				name: 'onMenuOpen',
				type: '() => void',
				description: 'Handle the menu opening',
			},
			{
				name: 'onMenuScrollToBottom',
				type: '(event: WheelEvent | TouchEvent) => void',
				description: 'Fired when the user scrolls to the bottom of the menu',
			},
			{
				name: 'onMenuScrollToTop',
				type: '(event: WheelEvent | TouchEvent) => void',
				description: 'Fired when the user scrolls to the top of the menu',
			},
			{
				name: 'options',
				type: 'readonly (Option | GroupBase<Option>)[]',
				description: 'Array of options that populate the select menu',
			},
			{
				name: 'pageSize',
				type: 'number',
				description: 'Number of options to jump in menu when page{up|down} keys are used',
			},
			{
				name: 'placeholder',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Placeholder for the select value',
			},
			{
				name: 'shouldPreventEscapePropagation',
				type: 'boolean',
				description: 'Prevents "Escape" keydown event propagation',
			},
			{
				name: 'spacing',
				type: '"compact" | "default"',
				description:
					'This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5',
			},
			{
				name: 'tabIndex',
				type: 'number',
				description:
					"Sets the tabIndex attribute on the input for focus. Since focus is already managed, the only acceptable value to be used is '-1' in rare cases when removing this field from the document tab order is required.",
			},
			{
				name: 'value',
				type: 'Option | MultiValue<Option>',
				description: 'The value of the select; reflected by the selected option',
			},
		],
	},
	{
		name: 'CheckboxSelect',
		package: '@atlaskit/select',
		description:
			'A multi-select with checkbox indicators for each option. Use when multiple selections need explicit visual confirmation.',
		status: 'general-availability',
		usageGuidelines: ['Use for multi-select when checkbox affordance improves clarity'],
		keywords: ['select', 'checkbox', 'multi', 'dropdown', 'form'],
		category: 'form',
		examples: [
			'import { Label } from \'@atlaskit/form\';\nimport { CheckboxSelect } from \'@atlaskit/select\';\nimport { cities } from \'../common/data\';\nconst SelectCheckboxExample = (): React.JSX.Element => (\n\t<>\n\t\t<Label htmlFor="checkbox-select-example">What cities have you lived in?</Label>\n\t\t<CheckboxSelect\n\t\t\tinputId="checkbox-select-example"\n\t\t\ttestId="select"\n\t\t\toptions={[\n\t\t\t\t...cities,\n\t\t\t\t{\n\t\t\t\t\tlabel:\n\t\t\t\t\t\t"Super long name that no one will ever read because it\'s way too long to be a realistic option but it will highlight the flexbox grow and shrink styles",\n\t\t\t\t\tvalue: \'test\',\n\t\t\t\t},\n\t\t\t]}\n\t\t\tplaceholder=""\n\t\t/>\n\t</>\n);\nexport default SelectCheckboxExample;',
		],
		props: [
			{
				name: 'appearance',
				type: '"default" | "subtle" | "none"',
			},
			{
				name: 'autoFocus',
				type: 'boolean',
				description:
					'Focus the control when it is mounted. There are very few cases that this should be used, and using incorrectly may violate accessibility guidelines.',
			},
			{
				name: 'blurInputOnSelect',
				type: 'boolean',
				description:
					'Remove focus from the input when the user selects an option (handy for dismissing the keyboard on touch devices)',
			},
			{
				name: 'classNamePrefix',
				type: 'string',
				description:
					'If provided, all inner components will be given a prefixed className attribute.\n\nThis is useful when styling via CSS classes instead of the Styles API approach.',
			},
			{
				name: 'classNames',
				type: '{ clearIndicator?: (props: ClearIndicatorProps<OptionT, true, GroupBase<OptionT>>) => string; container?: (props: ContainerProps<OptionT, true, GroupBase<...>>) => string; ... 18 more ...; valueContainer?: (props: ValueContainerProps<...>) => string; }',
				description: 'Provide classNames based on state for each inner component',
			},
			{
				name: 'clearControlLabel',
				type: 'string',
				description: 'Set the `aria-label` for the clear icon button.',
			},
			{
				name: 'closeMenuOnSelect',
				type: 'boolean',
				description: 'Close the select menu when the user selects an option',
			},
			{
				name: 'components',
				type: '{ Option?: React.ComponentType<OptionProps<OptionT, true, GroupBase<OptionT>>>; Group?: React.ComponentType<GroupProps<OptionT, true, GroupBase<OptionT>>>; ... 19 more ...; ValueContainer?: React.ComponentType<...>; }',
				description:
					'This complex object includes all the compositional components that are used\nin `react-select`. If you wish to overwrite a component, pass in an object\nwith the appropriate namespace. If you wish to restyle a component, we recommend\nusing this prop with the `xcss` prop.',
			},
			{
				name: 'defaultInputValue',
				type: 'string',
			},
			{
				name: 'defaultMenuIsOpen',
				type: 'boolean',
			},
			{
				name: 'defaultValue',
				type: 'OptionT | MultiValue<OptionT>',
			},
			{
				name: 'descriptionId',
				type: 'string',
				description:
					"This sets the aria-describedby attribute. It sets an accessible description for the select, for people who use assistive technology. Use '<HelperMessage>' from '@atlaskit/form' is preferred.",
			},
			{
				name: 'filterOption',
				type: '(option: FilterOptionOption<OptionT>, inputValue: string) => boolean',
				description: 'Custom method to filter whether an option should be displayed in the menu',
			},
			{
				name: 'form',
				type: 'string',
				description: 'Sets the form attribute on the input',
			},
			{
				name: 'formatGroupLabel',
				type: '(group: GroupBase<OptionT>) => React.ReactNode',
				description:
					'Formats group labels in the menu as React components\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
			},
			{
				name: 'formatOptionLabel',
				type: '(data: OptionT, formatOptionLabelMeta: FormatOptionLabelMeta<OptionT>) => React.ReactNode',
			},
			{
				name: 'getOptionLabel',
				type: '(option: OptionT) => string',
				description:
					'Resolves option data to a string to be displayed as the label by components\n\nNote: Failure to resolve to a string type can interfere with filtering and\nscreen reader support.',
			},
			{
				name: 'getOptionValue',
				type: '(option: OptionT) => string',
				description:
					'Resolves option data to a string to compare options and specify value attributes',
			},
			{
				name: 'hideSelectedOptions',
				type: 'boolean',
				description: 'Hide the selected option from the menu',
			},
			{
				name: 'id',
				type: 'string',
				description: 'The id to set on the SelectContainer component.',
			},
			{
				name: 'inputId',
				type: 'string',
				description: 'The id of the search input',
			},
			{
				name: 'inputValue',
				type: 'string',
				description: 'The value of the search input',
			},
			{
				name: 'instanceId',
				type: 'string | number',
				description: 'Define an id prefix for the select components e.g. {your-id}-value',
			},
			{
				name: 'isClearable',
				type: 'boolean',
				description: 'Is the select value clearable',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Is the select disabled',
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description: 'Is the select invalid',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description: 'Is the select in a state of loading (async)',
			},
			{
				name: 'isMulti',
				type: 'boolean',
				description: 'Support multiple selected options',
			},
			{
				name: 'isOptionDisabled',
				type: '(option: OptionT, selectValue: Options<OptionT>) => boolean',
				description:
					'Override the built-in logic to detect whether an option is disabled\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
			},
			{
				name: 'isOptionSelected',
				type: '(option: OptionT, selectValue: Options<OptionT>) => boolean',
				description: 'Override the built-in logic to detect whether an option is selected',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'This prop indicates if the component is required.',
			},
			{
				name: 'isSearchable',
				type: 'boolean',
				description: 'Whether to enable search functionality',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'This sets the aria-label attribute. It sets an accessible name for the select, for people who use assistive technology. Use of a visible label is highly recommended for greater accessibility support.',
			},
			{
				name: 'labelId',
				type: 'string',
				description:
					'This sets the aria-labelledby attribute. It sets an accessible name for the select, for people who use assistive technology. Use of a visible label is highly recommended for greater accessibility support.',
			},
			{
				name: 'loadingMessage',
				type: '(obj: { inputValue: string; }) => React.ReactNode',
				description: 'Async: Text to display when loading options',
			},
			{
				name: 'maxMenuHeight',
				type: 'number',
				description: 'Maximum height of the menu before scrolling',
			},
			{
				name: 'menuIsOpen',
				type: 'boolean',
				description: 'Whether the menu is open',
			},
			{
				name: 'menuPlacement',
				type: '"auto" | "bottom" | "top"',
				description:
					"Default placement of the menu in relation to the control. 'auto' will flip\nwhen there isn't enough space below the control.",
			},
			{
				name: 'menuPortalTarget',
				type: 'HTMLElement',
				description:
					'Whether the menu should use a portal, and where it should attach\n\nAn example can be found in the [Portaling](https://react-select.com/advanced#portaling) documentation',
			},
			{
				name: 'menuPosition',
				type: '"absolute" | "fixed"',
				description:
					'The CSS position value of the menu, when "fixed" extra layout management is required',
			},
			{
				name: 'menuShouldScrollIntoView',
				type: 'boolean',
				description: 'Whether the menu should be scrolled into view when it opens',
			},
			{
				name: 'minMenuHeight',
				type: 'number',
				description: 'Minimum height of the menu before flipping',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Name of the HTML Input (optional - without this, no input will be rendered)',
			},
			{
				name: 'noOptionsMessage',
				type: '(obj: { inputValue: string; }) => React.ReactNode',
			},
			{
				name: 'onBlur',
				type: '(event: React.FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Handle blur events on the control',
			},
			{
				name: 'onChange',
				type: '(newValue: MultiValue<OptionT>, actionMeta: ActionMeta<OptionT>) => void',
				description: 'Handle change events on the select',
			},
			{
				name: 'onClickPreventDefault',
				type: 'boolean',
			},
			{
				name: 'onFocus',
				type: '(event: React.FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Handle focus events on the control',
			},
			{
				name: 'onInputChange',
				type: '(newValue: string, actionMeta: InputActionMeta) => void',
				description: 'Handle change events on the input',
			},
			{
				name: 'onKeyDown',
				type: '(event: React.KeyboardEvent<HTMLDivElement>) => void',
				description: 'Handle key down events on the select',
			},
			{
				name: 'onMenuClose',
				type: '() => void',
				description: 'Handle the menu closing',
			},
			{
				name: 'onMenuOpen',
				type: '() => void',
				description: 'Handle the menu opening',
			},
			{
				name: 'onMenuScrollToBottom',
				type: '(event: WheelEvent | TouchEvent) => void',
				description: 'Fired when the user scrolls to the bottom of the menu',
			},
			{
				name: 'onMenuScrollToTop',
				type: '(event: WheelEvent | TouchEvent) => void',
				description: 'Fired when the user scrolls to the top of the menu',
			},
			{
				name: 'options',
				type: 'readonly (OptionT | GroupBase<OptionT>)[]',
				description: 'Array of options that populate the select menu',
			},
			{
				name: 'pageSize',
				type: 'number',
				description: 'Number of options to jump in menu when page{up|down} keys are used',
			},
			{
				name: 'placeholder',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Placeholder for the select value',
			},
			{
				name: 'shouldPreventEscapePropagation',
				type: 'boolean',
				description: 'Prevents "Escape" keydown event propagation',
			},
			{
				name: 'spacing',
				type: '"compact" | "default"',
				description:
					'This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5',
			},
			{
				name: 'tabIndex',
				type: 'number',
				description:
					"Sets the tabIndex attribute on the input for focus. Since focus is already managed, the only acceptable value to be used is '-1' in rare cases when removing this field from the document tab order is required.",
			},
			{
				name: 'value',
				type: 'OptionT | MultiValue<OptionT>',
				description: 'The value of the select; reflected by the selected option',
			},
		],
	},
	{
		name: 'CountrySelect',
		package: '@atlaskit/select',
		description: 'A select pre-configured for country selection with country data.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for country selection in forms',
			'Provides built-in country options and search',
		],
		keywords: ['select', 'country', 'dropdown', 'form', 'localization'],
		category: 'form',
		examples: [
			'import { Label } from \'@atlaskit/form\';\nimport { CountrySelect } from \'@atlaskit/select\';\nconst CountrySelectExample = (): React.JSX.Element => (\n\t<>\n\t\t<Label htmlFor="country-select-example">What country do you live in?</Label>\n\t\t<CountrySelect inputId="country-select-example" placeholder="" />\n\t</>\n);\nexport default CountrySelectExample;',
		],
		props: [
			{
				name: 'appearance',
				type: '"default" | "subtle" | "none"',
			},
			{
				name: 'autoFocus',
				type: 'boolean',
				description:
					'Focus the control when it is mounted. There are very few cases that this should be used, and using incorrectly may violate accessibility guidelines.',
			},
			{
				name: 'blurInputOnSelect',
				type: 'boolean',
				description:
					'Remove focus from the input when the user selects an option (handy for dismissing the keyboard on touch devices)',
			},
			{
				name: 'classNamePrefix',
				type: 'string',
				description:
					'If provided, all inner components will be given a prefixed className attribute.\n\nThis is useful when styling via CSS classes instead of the Styles API approach.',
			},
			{
				name: 'classNames',
				type: '{ clearIndicator?: (props: ClearIndicatorProps<Country, false, GroupBase<Country>>) => string; container?: (props: ContainerProps<Country, false, GroupBase<...>>) => string; ... 18 more ...; valueContainer?: (props: ValueContainerProps<...>) => string; }',
				description: 'Provide classNames based on state for each inner component',
			},
			{
				name: 'clearControlLabel',
				type: 'string',
				description: 'Set the `aria-label` for the clear icon button.',
			},
			{
				name: 'closeMenuOnSelect',
				type: 'boolean',
				description: 'Close the select menu when the user selects an option',
			},
			{
				name: 'components',
				type: '{ Option?: React.ComponentType<OptionProps<Country, false, GroupBase<Country>>>; Group?: React.ComponentType<GroupProps<Country, false, GroupBase<Country>>>; ... 19 more ...; ValueContainer?: React.ComponentType<...>; }',
				description:
					'This complex object includes all the compositional components that are used\nin `react-select`. If you wish to overwrite a component, pass in an object\nwith the appropriate namespace. If you wish to restyle a component, we recommend\nusing this prop with the `xcss` prop.',
			},
			{
				name: 'defaultInputValue',
				type: 'string',
			},
			{
				name: 'defaultMenuIsOpen',
				type: 'boolean',
			},
			{
				name: 'defaultValue',
				type: 'Country | MultiValue<Country>',
			},
			{
				name: 'descriptionId',
				type: 'string',
				description:
					"This sets the aria-describedby attribute. It sets an accessible description for the select, for people who use assistive technology. Use '<HelperMessage>' from '@atlaskit/form' is preferred.",
			},
			{
				name: 'filterOption',
				type: '(option: FilterOptionOption<Country>, inputValue: string) => boolean',
				description: 'Custom method to filter whether an option should be displayed in the menu',
			},
			{
				name: 'form',
				type: 'string',
				description: 'Sets the form attribute on the input',
			},
			{
				name: 'formatGroupLabel',
				type: '(group: GroupBase<Country>) => React.ReactNode',
				description:
					'Formats group labels in the menu as React components\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
			},
			{
				name: 'formatOptionLabel',
				type: '(data: Country, formatOptionLabelMeta: FormatOptionLabelMeta<Country>) => React.ReactNode',
			},
			{
				name: 'getOptionLabel',
				type: '(option: Country) => string',
				description:
					'Resolves option data to a string to be displayed as the label by components\n\nNote: Failure to resolve to a string type can interfere with filtering and\nscreen reader support.',
			},
			{
				name: 'getOptionValue',
				type: '(option: Country) => string',
				description:
					'Resolves option data to a string to compare options and specify value attributes',
			},
			{
				name: 'hideSelectedOptions',
				type: 'boolean',
				description: 'Hide the selected option from the menu',
			},
			{
				name: 'id',
				type: 'string',
				description: 'The id to set on the SelectContainer component.',
			},
			{
				name: 'inputId',
				type: 'string',
				description: 'The id of the search input',
			},
			{
				name: 'inputValue',
				type: 'string',
				description: 'The value of the search input',
			},
			{
				name: 'instanceId',
				type: 'string | number',
				description: 'Define an id prefix for the select components e.g. {your-id}-value',
			},
			{
				name: 'isClearable',
				type: 'boolean',
				description: 'Is the select value clearable',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Is the select disabled',
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description: 'Is the select invalid',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description: 'Is the select in a state of loading (async)',
			},
			{
				name: 'isMulti',
				type: 'boolean',
				description: 'Support multiple selected options',
			},
			{
				name: 'isOptionDisabled',
				type: '(option: Country, selectValue: Options<Country>) => boolean',
				description:
					'Override the built-in logic to detect whether an option is disabled\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
			},
			{
				name: 'isOptionSelected',
				type: '(option: Country, selectValue: Options<Country>) => boolean',
				description: 'Override the built-in logic to detect whether an option is selected',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'This prop indicates if the component is required.',
			},
			{
				name: 'isSearchable',
				type: 'boolean',
				description: 'Whether to enable search functionality',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'This sets the aria-label attribute. It sets an accessible name for the select, for people who use assistive technology. Use of a visible label is highly recommended for greater accessibility support.',
			},
			{
				name: 'labelId',
				type: 'string',
				description:
					'This sets the aria-labelledby attribute. It sets an accessible name for the select, for people who use assistive technology. Use of a visible label is highly recommended for greater accessibility support.',
			},
			{
				name: 'loadingMessage',
				type: '(obj: { inputValue: string; }) => React.ReactNode',
				description: 'Async: Text to display when loading options',
			},
			{
				name: 'maxMenuHeight',
				type: 'number',
				description: 'Maximum height of the menu before scrolling',
			},
			{
				name: 'menuIsOpen',
				type: 'boolean',
				description: 'Whether the menu is open',
			},
			{
				name: 'menuPlacement',
				type: '"auto" | "bottom" | "top"',
				description:
					"Default placement of the menu in relation to the control. 'auto' will flip\nwhen there isn't enough space below the control.",
			},
			{
				name: 'menuPortalTarget',
				type: 'HTMLElement',
				description:
					'Whether the menu should use a portal, and where it should attach\n\nAn example can be found in the [Portaling](https://react-select.com/advanced#portaling) documentation',
			},
			{
				name: 'menuPosition',
				type: '"absolute" | "fixed"',
				description:
					'The CSS position value of the menu, when "fixed" extra layout management is required',
			},
			{
				name: 'menuShouldScrollIntoView',
				type: 'boolean',
				description: 'Whether the menu should be scrolled into view when it opens',
			},
			{
				name: 'minMenuHeight',
				type: 'number',
				description: 'Minimum height of the menu before flipping',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Name of the HTML Input (optional - without this, no input will be rendered)',
			},
			{
				name: 'noOptionsMessage',
				type: '(obj: { inputValue: string; }) => React.ReactNode',
			},
			{
				name: 'onBlur',
				type: '(event: React.FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Handle blur events on the control',
			},
			{
				name: 'onChange',
				type: '(newValue: Country, actionMeta: ActionMeta<Country>) => void',
				description: 'Handle change events on the select',
			},
			{
				name: 'onClickPreventDefault',
				type: 'boolean',
			},
			{
				name: 'onFocus',
				type: '(event: React.FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Handle focus events on the control',
			},
			{
				name: 'onInputChange',
				type: '(newValue: string, actionMeta: InputActionMeta) => void',
				description: 'Handle change events on the input',
			},
			{
				name: 'onKeyDown',
				type: '(event: React.KeyboardEvent<HTMLDivElement>) => void',
				description: 'Handle key down events on the select',
			},
			{
				name: 'onMenuClose',
				type: '() => void',
				description: 'Handle the menu closing',
			},
			{
				name: 'onMenuOpen',
				type: '() => void',
				description: 'Handle the menu opening',
			},
			{
				name: 'onMenuScrollToBottom',
				type: '(event: WheelEvent | TouchEvent) => void',
				description: 'Fired when the user scrolls to the bottom of the menu',
			},
			{
				name: 'onMenuScrollToTop',
				type: '(event: WheelEvent | TouchEvent) => void',
				description: 'Fired when the user scrolls to the top of the menu',
			},
			{
				name: 'options',
				type: 'readonly (Country | GroupBase<Country>)[]',
				description: 'Array of options that populate the select menu',
			},
			{
				name: 'pageSize',
				type: 'number',
				description: 'Number of options to jump in menu when page{up|down} keys are used',
			},
			{
				name: 'placeholder',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Placeholder for the select value',
			},
			{
				name: 'shouldPreventEscapePropagation',
				type: 'boolean',
				description: 'Prevents "Escape" keydown event propagation',
			},
			{
				name: 'spacing',
				type: '"compact" | "default"',
				description:
					'This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5',
			},
			{
				name: 'tabIndex',
				type: 'number',
				description:
					"Sets the tabIndex attribute on the input for focus. Since focus is already managed, the only acceptable value to be used is '-1' in rare cases when removing this field from the document tab order is required.",
			},
			{
				name: 'value',
				type: 'Country | MultiValue<Country>',
				description: 'The value of the select; reflected by the selected option',
			},
		],
	},
	{
		name: 'CreatableSelect',
		package: '@atlaskit/select',
		description:
			'A select that allows users to create new options. Use when users can add custom values not in the predefined list.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when users need to add custom options',
			'Validate new values before creation',
		],
		keywords: ['select', 'creatable', 'dropdown', 'form', 'custom'],
		category: 'form',
		examples: [
			"import React, { Component } from 'react';\nimport { Label } from '@atlaskit/form';\nimport { CreatableSelect, type OptionType, type ValueType } from '@atlaskit/select';\nconst defaultOptions = [\n\t{ label: 'Adelaide', value: 'adelaide' },\n\t{ label: 'Brisbane', value: 'brisbane' },\n\t{ label: 'Canberra', value: 'canberra' },\n\t{ label: 'Darwin', value: 'darwin' },\n\t{ label: 'Hobart', value: 'hobart' },\n\t{ label: 'Melbourne', value: 'melbourne' },\n\t{ label: 'Perth', value: 'perth' },\n\t{ label: 'Sydney', value: 'sydney' },\n];\nconst createOption = (label: string) => ({\n\tlabel,\n\tvalue: label.toLowerCase().replace(/\\W/g, ''),\n});\ninterface State {\n\tisLoading: boolean;\n\toptions: Array<{ label: string; value: string }>;\n\tvalue?: ValueType<OptionType>;\n}\nclass CreatableAdvanced extends Component<{}, State> {\n\tstate: State = {\n\t\tisLoading: false,\n\t\toptions: defaultOptions,\n\t\tvalue: undefined,\n\t};\n\thandleChange = (newValue: any, actionMeta: any) => {\n\t\tconsole.group('Value Changed');\n\t\tconsole.log(newValue);\n\t\tconsole.log(`action: ${actionMeta.action}`);\n\t\tconsole.groupEnd();\n\t\tthis.setState({ value: newValue });\n\t};\n\thandleCreate = (inputValue: any) => {\n\t\t// We do not assume how users would like to add newly created options to the existing options list.\n\t\t// Instead we pass users through the new value in the onCreate prop\n\t\tthis.setState({ isLoading: true });\n\t\tconsole.group('Option created');\n\t\tconsole.log('Wait a moment...');\n\t\tconst { options } = this.state;\n\t\tconst newOption = createOption(inputValue);\n\t\tconsole.log(newOption);\n\t\tconsole.groupEnd();\n\t\tthis.setState({\n\t\t\tisLoading: false,\n\t\t\toptions: [...options, newOption],\n\t\t\tvalue: newOption,\n\t\t});\n\t};\n\trender() {\n\t\tconst { isLoading, options, value } = this.state;\n\t\treturn (\n\t\t\t<>\n\t\t\t\t<Label htmlFor=\"createable-select-example\">What city do you live in?</Label>\n\t\t\t\t<CreatableSelect\n\t\t\t\t\tinputId=\"createable-select-example\"\n\t\t\t\t\tisClearable\n\t\t\t\t\tclearControlLabel=\"Clear city\"\n\t\t\t\t\tisDisabled={isLoading}\n\t\t\t\t\tisLoading={isLoading}\n\t\t\t\t\tonChange={this.handleChange}\n\t\t\t\t\tonCreateOption={this.handleCreate}\n\t\t\t\t\toptions={options}\n\t\t\t\t\tvalue={value}\n\t\t\t\t/>\n\t\t\t</>\n\t\t);\n\t}\n}\nexport default (): React.JSX.Element => <CreatableAdvanced />;",
		],
		props: [
			{
				name: 'allowCreateWhileLoading',
				type: 'any',
				description:
					'Allow options to be created while the `isLoading` prop is true. Useful to\nprevent the "create new ..." option being displayed while async results are\nstill being loaded.',
			},
			{
				name: 'appearance',
				type: '"default" | "subtle" | "none"',
			},
			{
				name: 'autoFocus',
				type: 'boolean',
				description:
					'Focus the control when it is mounted. There are very few cases that this should be used, and using incorrectly may violate accessibility guidelines.',
			},
			{
				name: 'blurInputOnSelect',
				type: 'boolean',
				description:
					'Remove focus from the input when the user selects an option (handy for dismissing the keyboard on touch devices)',
			},
			{
				name: 'cacheOptions',
				type: 'any',
				description:
					'If cacheOptions is truthy, then the loaded data will be cached. The cache\nwill remain until `cacheOptions` changes value.',
			},
			{
				name: 'classNamePrefix',
				type: 'string',
				description:
					'If provided, all inner components will be given a prefixed className attribute.\n\nThis is useful when styling via CSS classes instead of the Styles API approach.',
			},
			{
				name: 'classNames',
				type: '{ clearIndicator?: (props: ClearIndicatorProps<Option, IsMulti, GroupBase<Option>>) => string; container?: (props: ContainerProps<Option, IsMulti, GroupBase<...>>) => string; ... 18 more ...; valueContainer?: (props: ValueContainerProps<...>) => string; }',
				description: 'Provide classNames based on state for each inner component',
			},
			{
				name: 'clearControlLabel',
				type: 'string',
				description: 'Set the `aria-label` for the clear icon button.',
			},
			{
				name: 'closeMenuOnSelect',
				type: 'boolean',
				description: 'Close the select menu when the user selects an option',
			},
			{
				name: 'components',
				type: '{ Option?: React.ComponentType<OptionProps<Option, IsMulti, GroupBase<Option>>>; Group?: React.ComponentType<GroupProps<Option, IsMulti, GroupBase<...>>>; ... 19 more ...; ValueContainer?: React.ComponentType<...>; }',
				description:
					'This complex object includes all the compositional components that are used\nin `react-select`. If you wish to overwrite a component, pass in an object\nwith the appropriate namespace. If you wish to restyle a component, we recommend\nusing this prop with the `xcss` prop.',
			},
			{
				name: 'createOptionPosition',
				type: 'any',
				description:
					"Sets the position of the createOption element in your options list. Defaults to 'last'",
			},
			{
				name: 'defaultInputValue',
				type: 'string',
			},
			{
				name: 'defaultMenuIsOpen',
				type: 'boolean',
			},
			{
				name: 'defaultOptions',
				type: 'any',
				description:
					"The default set of options to show before the user starts searching. When\nset to `true`, the results for loadOptions('') will be autoloaded.",
			},
			{
				name: 'defaultValue',
				type: 'Option | MultiValue<Option>',
			},
			{
				name: 'descriptionId',
				type: 'string',
				description:
					"This sets the aria-describedby attribute. It sets an accessible description for the select, for people who use assistive technology. Use '<HelperMessage>' from '@atlaskit/form' is preferred.",
			},
			{
				name: 'filterOption',
				type: '(option: FilterOptionOption<Option>, inputValue: string) => boolean',
				description: 'Custom method to filter whether an option should be displayed in the menu',
			},
			{
				name: 'form',
				type: 'string',
				description: 'Sets the form attribute on the input',
			},
			{
				name: 'formatCreateLabel',
				type: 'any',
				description:
					'Gets the label for the "create new ..." option in the menu. Is given the\ncurrent input value.',
			},
			{
				name: 'formatGroupLabel',
				type: '(group: GroupBase<Option>) => React.ReactNode',
				description:
					'Formats group labels in the menu as React components\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
			},
			{
				name: 'formatOptionLabel',
				type: '((data: Option, formatOptionLabelMeta: FormatOptionLabelMeta<Option>) => React.ReactNode) | ((data: Option, formatOptionLabelMeta: FormatOptionLabelMeta<Option>) => React.ReactNode)',
				description: 'Formats option labels in the menu and control as React components',
			},
			{
				name: 'getNewOptionData',
				type: 'any',
				description:
					'Returns the data for the new option when it is created. Used to display the\nvalue, and is passed to `onChange`.',
			},
			{
				name: 'getOptionLabel',
				type: '(option: Option) => string',
				description:
					'Resolves option data to a string to be displayed as the label by components\n\nNote: Failure to resolve to a string type can interfere with filtering and\nscreen reader support.',
			},
			{
				name: 'getOptionValue',
				type: '(option: Option) => string',
				description:
					'Resolves option data to a string to compare options and specify value attributes',
			},
			{
				name: 'hideSelectedOptions',
				type: 'boolean',
				description: 'Hide the selected option from the menu',
			},
			{
				name: 'id',
				type: 'string',
				description: 'The id to set on the SelectContainer component.',
			},
			{
				name: 'inputId',
				type: 'string',
				description: 'The id of the search input',
			},
			{
				name: 'inputValue',
				type: 'string',
				description: 'The value of the search input',
			},
			{
				name: 'instanceId',
				type: 'string | number',
				description: 'Define an id prefix for the select components e.g. {your-id}-value',
			},
			{
				name: 'isClearable',
				type: 'boolean',
				description: 'Is the select value clearable',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Is the select disabled',
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description: 'Is the select invalid',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description:
					'Is the select in a state of loading (async)\nIs the select in a state of loading (async)\nWill cause the select to be displayed in the loading state, even if the\nAsync select is not currently waiting for loadOptions to resolve',
			},
			{
				name: 'isMulti',
				type: 'boolean',
				description: 'Support multiple selected options',
			},
			{
				name: 'isOptionDisabled',
				type: '(option: Option, selectValue: Options<Option>) => boolean',
				description:
					'Override the built-in logic to detect whether an option is disabled\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
			},
			{
				name: 'isOptionSelected',
				type: '(option: Option, selectValue: Options<Option>) => boolean',
				description: 'Override the built-in logic to detect whether an option is selected',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'This prop indicates if the component is required.',
			},
			{
				name: 'isSearchable',
				type: 'boolean',
				description: 'Whether to enable search functionality',
			},
			{
				name: 'isValidNewOption',
				type: 'any',
				description:
					'Determines whether the "create new ..." option should be displayed based on\nthe current input value, select value and options array.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'This sets the aria-label attribute. It sets an accessible name for the select, for people who use assistive technology. Use of a visible label is highly recommended for greater accessibility support.',
			},
			{
				name: 'labelId',
				type: 'string',
				description:
					'This sets the aria-labelledby attribute. It sets an accessible name for the select, for people who use assistive technology. Use of a visible label is highly recommended for greater accessibility support.',
			},
			{
				name: 'loadingMessage',
				type: '(obj: { inputValue: string; }) => React.ReactNode',
				description: 'Async: Text to display when loading options',
			},
			{
				name: 'loadOptions',
				type: 'any',
				description:
					'Function that returns a promise, which is the set of options to be used\nonce the promise resolves.',
			},
			{
				name: 'maxMenuHeight',
				type: 'number',
				description: 'Maximum height of the menu before scrolling',
			},
			{
				name: 'menuIsOpen',
				type: 'boolean',
				description: 'Whether the menu is open',
			},
			{
				name: 'menuPlacement',
				type: '"auto" | "bottom" | "top"',
				description:
					"Default placement of the menu in relation to the control. 'auto' will flip\nwhen there isn't enough space below the control.",
			},
			{
				name: 'menuPortalTarget',
				type: 'HTMLElement',
				description:
					'Whether the menu should use a portal, and where it should attach\n\nAn example can be found in the [Portaling](https://react-select.com/advanced#portaling) documentation',
			},
			{
				name: 'menuPosition',
				type: '"absolute" | "fixed"',
				description:
					'The CSS position value of the menu, when "fixed" extra layout management is required',
			},
			{
				name: 'menuShouldScrollIntoView',
				type: 'boolean',
				description: 'Whether the menu should be scrolled into view when it opens',
			},
			{
				name: 'minMenuHeight',
				type: 'number',
				description: 'Minimum height of the menu before flipping',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Name of the HTML Input (optional - without this, no input will be rendered)',
			},
			{
				name: 'noOptionsMessage',
				type: '((obj: { inputValue: string; }) => React.ReactNode) | ((obj: { inputValue: string; }) => React.ReactNode)',
				description: 'Text to display when there are no options',
			},
			{
				name: 'onBlur',
				type: '(event: React.FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Handle blur events on the control',
			},
			{
				name: 'onChange',
				type: '(newValue: OnChangeValue<Option, IsMulti>, actionMeta: ActionMeta<Option>) => void',
				description: 'Handle change events on the select',
			},
			{
				name: 'onClickPreventDefault',
				type: 'boolean',
			},
			{
				name: 'onCreateOption',
				type: 'any',
				description:
					'If provided, this will be called with the input value when a new option is\ncreated, and `onChange` will **not** be called. Use this when you need more\ncontrol over what happens when new options are created.',
			},
			{
				name: 'onFocus',
				type: '(event: React.FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Handle focus events on the control',
			},
			{
				name: 'onInputChange',
				type: '(newValue: string, actionMeta: InputActionMeta) => void',
				description: 'Handle change events on the input',
			},
			{
				name: 'onKeyDown',
				type: '(event: React.KeyboardEvent<HTMLDivElement>) => void',
				description: 'Handle key down events on the select',
			},
			{
				name: 'onMenuClose',
				type: '() => void',
				description: 'Handle the menu closing',
			},
			{
				name: 'onMenuOpen',
				type: '() => void',
				description: 'Handle the menu opening',
			},
			{
				name: 'onMenuScrollToBottom',
				type: '(event: WheelEvent | TouchEvent) => void',
				description: 'Fired when the user scrolls to the bottom of the menu',
			},
			{
				name: 'onMenuScrollToTop',
				type: '(event: WheelEvent | TouchEvent) => void',
				description: 'Fired when the user scrolls to the top of the menu',
			},
			{
				name: 'options',
				type: 'readonly (Option | GroupBase<Option>)[]',
				description: 'Array of options that populate the select menu',
			},
			{
				name: 'pageSize',
				type: 'number',
				description: 'Number of options to jump in menu when page{up|down} keys are used',
			},
			{
				name: 'placeholder',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Placeholder for the select value',
			},
			{
				name: 'shouldPreventEscapePropagation',
				type: 'boolean',
				description: 'Prevents "Escape" keydown event propagation',
			},
			{
				name: 'spacing',
				type: '"compact" | "default"',
				description:
					'This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5',
			},
			{
				name: 'tabIndex',
				type: 'number',
				description:
					"Sets the tabIndex attribute on the input for focus. Since focus is already managed, the only acceptable value to be used is '-1' in rare cases when removing this field from the document tab order is required.",
			},
			{
				name: 'value',
				type: 'Option | MultiValue<Option>',
				description: 'The value of the select; reflected by the selected option',
			},
		],
	},
	{
		name: 'PopupSelect',
		package: '@atlaskit/select',
		description:
			'A select that opens in a popup overlay. Use when the select needs to render in a portal or overlay context.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when select must render in overlay/portal',
			'Consider z-index and layering with modals',
			'Ensure proper focus management',
		],
		keywords: ['select', 'popup', 'dropdown', 'overlay', 'portal'],
		category: 'form',
		examples: [
			"import Button from '@atlaskit/button/new';\nimport ChevronDownIcon from '@atlaskit/icon/core/chevron-down';\nimport { PopupSelect } from '@atlaskit/select';\nconst options = [\n\t{ label: 'accessibility', value: 'accessibility' },\n\t{ label: 'analytics', value: 'analytics' },\n\t{ label: 'ktlo', value: 'ktlo' },\n\t{ label: 'testing', value: 'testing' },\n\t{ label: 'regression', value: 'regression' },\n\t{ label: 'layering', value: 'layering' },\n\t{ label: 'innovation', value: 'innovation' },\n\t{ label: 'new-feature', value: 'new' },\n\t{ label: 'existing', value: 'existing' },\n\t{ label: 'wont-do', value: 'wont-do' },\n];\nconst PopupSelectExample = (): React.JSX.Element => {\n\treturn (\n\t\t<PopupSelect\n\t\t\tplaceholder=\"\"\n\t\t\toptions={options}\n\t\t\ttarget={({ isOpen, ...triggerProps }) => (\n\t\t\t\t<Button {...triggerProps} iconAfter={ChevronDownIcon}>\n\t\t\t\t\tLabel\n\t\t\t\t</Button>\n\t\t\t)}\n\t\t/>\n\t);\n};\nexport default PopupSelectExample;",
		],
		props: [
			{
				name: 'appearance',
				type: '"default" | "subtle" | "none"',
			},
			{
				name: 'autoFocus',
				type: 'boolean',
				description:
					'Focus the control when it is mounted. There are very few cases that this should be used, and using incorrectly may violate accessibility guidelines.',
			},
			{
				name: 'blurInputOnSelect',
				type: 'boolean',
				description:
					'Remove focus from the input when the user selects an option (handy for dismissing the keyboard on touch devices)',
			},
			{
				name: 'classNamePrefix',
				type: 'string',
				description:
					'If provided, all inner components will be given a prefixed className attribute.\n\nThis is useful when styling via CSS classes instead of the Styles API approach.',
			},
			{
				name: 'classNames',
				type: '{ clearIndicator?: (props: ClearIndicatorProps<Option, IsMulti, GroupBase<Option>>) => string; container?: (props: ContainerProps<Option, IsMulti, GroupBase<...>>) => string; ... 18 more ...; valueContainer?: (props: ValueContainerProps<...>) => string; }',
				description: 'Provide classNames based on state for each inner component',
			},
			{
				name: 'clearControlLabel',
				type: 'string',
				description: 'Set the `aria-label` for the clear icon button.',
			},
			{
				name: 'closeMenuOnSelect',
				type: 'boolean',
				description: 'Defines whether the menu should close when selected. The default is `true`.',
			},
			{
				name: 'components',
				type: '{ Option?: ComponentType<OptionProps<Option, IsMulti, GroupBase<Option>>>; Group?: ComponentType<GroupProps<Option, IsMulti, GroupBase<...>>>; ... 19 more ...; ValueContainer?: ComponentType<...>; }',
				description:
					'This complex object includes all the compositional components that are used\nin `react-select`. If you wish to overwrite a component, pass in an object\nwith the appropriate namespace. If you wish to restyle a component, we recommend\nusing this prop with the `xcss` prop.',
			},
			{
				name: 'defaultInputValue',
				type: 'string',
			},
			{
				name: 'defaultIsOpen',
				type: 'boolean',
			},
			{
				name: 'defaultMenuIsOpen',
				type: 'boolean',
			},
			{
				name: 'defaultValue',
				type: 'Option | MultiValue<Option>',
			},
			{
				name: 'descriptionId',
				type: 'string',
				description:
					"This sets the aria-describedby attribute. It sets an accessible description for the select, for people who use assistive technology. Use '<HelperMessage>' from '@atlaskit/form' is preferred.",
			},
			{
				name: 'filterOption',
				type: '(option: FilterOptionOption<Option>, inputValue: string) => boolean',
				description: 'Custom method to filter whether an option should be displayed in the menu',
			},
			{
				name: 'footer',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'The footer content shown at the bottom of the popup, underneath the select options.',
			},
			{
				name: 'form',
				type: 'string',
				description: 'Sets the form attribute on the input',
			},
			{
				name: 'formatGroupLabel',
				type: '(group: GroupBase<Option>) => ReactNode',
				description:
					'Formats group labels in the menu as React components\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
			},
			{
				name: 'formatOptionLabel',
				type: '(data: Option, formatOptionLabelMeta: FormatOptionLabelMeta<Option>) => ReactNode',
				description: 'Formats option labels in the menu and control as React components',
			},
			{
				name: 'getOptionLabel',
				type: '(option: Option) => string',
				description:
					'Resolves option data to a string to be displayed as the label by components\n\nNote: Failure to resolve to a string type can interfere with filtering and\nscreen reader support.',
			},
			{
				name: 'getOptionValue',
				type: '(option: Option) => string',
				description:
					'Resolves option data to a string to compare options and specify value attributes',
			},
			{
				name: 'hideSelectedOptions',
				type: 'boolean',
				description: 'Hide the selected option from the menu',
			},
			{
				name: 'id',
				type: 'string',
				description: 'The id to set on the SelectContainer component.',
			},
			{
				name: 'inputId',
				type: 'string',
				description: 'The id of the search input',
			},
			{
				name: 'inputValue',
				type: 'string',
				description: 'The value of the search input',
			},
			{
				name: 'instanceId',
				type: 'string | number',
				description: 'Define an id prefix for the select components e.g. {your-id}-value',
			},
			{
				name: 'isClearable',
				type: 'boolean',
				description: 'Is the select value clearable',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Is the select disabled',
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description: 'This prop indicates if the component is in an error state.',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description: 'Is the select in a state of loading (async)',
			},
			{
				name: 'isMulti',
				type: 'boolean',
				description: 'Support multiple selected options',
			},
			{
				name: 'isOpen',
				type: 'boolean',
			},
			{
				name: 'isOptionDisabled',
				type: '(option: Option, selectValue: Options<Option>) => boolean',
				description:
					'Override the built-in logic to detect whether an option is disabled\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
			},
			{
				name: 'isOptionSelected',
				type: '(option: Option, selectValue: Options<Option>) => boolean',
				description: 'Override the built-in logic to detect whether an option is selected',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'This prop indicates if the component is required.',
			},
			{
				name: 'isSearchable',
				type: 'boolean',
				description:
					'If `false`, renders a select with no search field. If `true`, renders a search field in the select when the\nnumber of options exceeds the `searchThreshold`. The default is `true`.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'This gives an accessible name to the input for people who use assistive technology.',
			},
			{
				name: 'labelId',
				type: 'string',
				description:
					'This sets the aria-labelledby attribute. It sets an accessible name for the select, for people who use assistive technology. Use of a visible label is highly recommended for greater accessibility support.',
			},
			{
				name: 'loadingMessage',
				type: '(obj: { inputValue: string; }) => ReactNode',
				description: 'Async: Text to display when loading options',
			},
			{
				name: 'maxMenuHeight',
				type: 'number',
				description: 'Maximum height of the menu before scrolling',
			},
			{
				name: 'maxMenuWidth',
				type: 'string | number',
				description:
					'The maximum width for the popup menu. Can be a number, representing the width in pixels,\nor a string containing a CSS length datatype.',
			},
			{
				name: 'menuIsOpen',
				type: 'boolean',
				description: 'Whether the menu is open',
			},
			{
				name: 'menuPlacement',
				type: '"auto" | "top" | "bottom"',
				description:
					"Default placement of the menu in relation to the control. 'auto' will flip\nwhen there isn't enough space below the control.",
			},
			{
				name: 'menuPortalTarget',
				type: 'HTMLElement',
				description:
					'Whether the menu should use a portal, and where it should attach\n\nAn example can be found in the [Portaling](https://react-select.com/advanced#portaling) documentation',
			},
			{
				name: 'menuPosition',
				type: '"absolute" | "fixed"',
				description:
					'The CSS position value of the menu, when "fixed" extra layout management is required',
			},
			{
				name: 'menuShouldScrollIntoView',
				type: 'boolean',
				description: 'Whether the menu should be scrolled into view when it opens',
			},
			{
				name: 'minMenuHeight',
				type: 'number',
				description: 'Minimum height of the menu before flipping',
			},
			{
				name: 'minMenuWidth',
				type: 'string | number',
				description:
					'The maximum width for the popup menu. Can be a number, representing the width in pixels,\nor a string containing a CSS length datatype.',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Name of the HTML Input (optional - without this, no input will be rendered)',
			},
			{
				name: 'noOptionsMessage',
				type: '(obj: { inputValue: string; }) => ReactNode',
				description: 'Text to display when there are no options',
			},
			{
				name: 'onBlur',
				type: '(event: FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Handle blur events on the control',
			},
			{
				name: 'onChange',
				type: '(newValue: OnChangeValue<Option, IsMulti>, actionMeta: ActionMeta<Option>) => void',
				description: 'Handle change events on the select',
			},
			{
				name: 'onFocus',
				type: '(event: FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Handle focus events on the control',
			},
			{
				name: 'onInputChange',
				type: '(newValue: string, actionMeta: InputActionMeta) => void',
				description: 'Handle change events on the input',
			},
			{
				name: 'onKeyDown',
				type: '(event: KeyboardEvent<HTMLDivElement>) => void',
				description: 'Handle key down events on the select',
			},
			{
				name: 'onMenuClose',
				type: '() => void',
				description: 'Handle the menu closing',
			},
			{
				name: 'onMenuOpen',
				type: '() => void',
				description: 'Handle the menu opening',
			},
			{
				name: 'onMenuScrollToBottom',
				type: '(event: globalThis.WheelEvent | globalThis.TouchEvent) => void',
				description: 'Fired when the user scrolls to the bottom of the menu',
			},
			{
				name: 'onMenuScrollToTop',
				type: '(event: globalThis.WheelEvent | globalThis.TouchEvent) => void',
				description: 'Fired when the user scrolls to the top of the menu',
			},
			{
				name: 'options',
				type: 'readonly (Option | GroupBase<Option>)[]',
				description: 'Array of options that populate the select menu',
			},
			{
				name: 'pageSize',
				type: 'number',
				description: 'Number of options to jump in menu when page{up|down} keys are used',
			},
			{
				name: 'placeholder',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Placeholder for the select value',
			},
			{
				name: 'popperProps',
				type: '{ innerRef?: Ref<any>; modifiers?: readonly Modifier<Modifiers, object>[]; placement?: Placement; strategy?: PositioningStrategy; referenceElement?: HTMLElement | VirtualElement; onFirstUpdate?: (state: Partial<...>) => void; }',
				description:
					'The props passed down to React Popper.\n\nUse these to override the default positioning strategy, behaviour and placement used by this library.\nFor more information, see the Popper Props section below, or [React Popper documentation](https://popper.js.org/react-popper/v2/render-props).',
			},
			{
				name: 'searchThreshold',
				type: 'number',
				description:
					'The maximum number of options the select can contain without rendering the search field. The default is `5`.',
			},
			{
				name: 'shouldCloseMenuOnTab',
				type: 'boolean',
				description:
					'Defines whether the menu should be closed by pressing the Tab key. The default is `true`.',
			},
			{
				name: 'shouldKeepInputOnSelect',
				type: 'boolean',
				description:
					'If `true`, the input value will be kept when an option is selected. The default is `false`.',
			},
			{
				name: 'shouldPreventEscapePropagation',
				type: 'boolean',
				description: 'Prevents "Escape" keydown event propagation',
			},
			{
				name: 'spacing',
				type: '"default" | "compact"',
				description: 'Use this to set whether the component uses compact or standard spacing.',
			},
			{
				name: 'tabIndex',
				type: 'number',
				description:
					"Sets the tabIndex attribute on the input for focus. Since focus is already managed, the only acceptable value to be used is '-1' in rare cases when removing this field from the document tab order is required.",
			},
			{
				name: 'target',
				type: '(options: PopupSelectTriggerProps & { isOpen: boolean; }) => ReactNode',
				description:
					'Render props used to anchor the popup to your content.\n\nMake this an interactive element, such as an @atlaskit/button component.\n\nThe provided render props in `options` are detailed below:\n- `isOpen`: The current state of the popup.\n\t\tUse this to change the appearance of your target based on the state of your component\n- `ref`: Pass this ref to the element the Popup should be attached to\n- `onKeyDown`: Pass this keydown handler to the element to allow keyboard users to access the element.\n- `aria-haspopup`, `aria-expanded`, `aria-controls`: Spread these onto a target element to\n\t\tensure your experience is accessible',
			},
			{
				name: 'value',
				type: 'Option | MultiValue<Option>',
				description: 'The value of the select; reflected by the selected option',
			},
		],
	},
	{
		name: 'RadioSelect',
		package: '@atlaskit/select',
		description:
			'A single-select with radio indicators for each option. Use when radio-style selection affordance is needed.',
		status: 'general-availability',
		usageGuidelines: ['Use for single-select when radio affordance improves clarity'],
		keywords: ['select', 'radio', 'single', 'dropdown', 'form'],
		category: 'form',
		examples: [
			'import { Label } from \'@atlaskit/form\';\nimport { RadioSelect } from \'@atlaskit/select\';\nimport { cities } from \'../common/data\';\nconst SelectRadioExample = (): React.JSX.Element => (\n\t<>\n\t\t<Label htmlFor="radio-select-example">What city do you live in?</Label>\n\t\t<RadioSelect\n\t\t\tinputId="radio-select-example"\n\t\t\ttestId="react-select"\n\t\t\toptions={[\n\t\t\t\t...cities,\n\t\t\t\t{\n\t\t\t\t\tlabel: "Super long name that no one will ever read because it\'s way too long",\n\t\t\t\t\tvalue: \'test\',\n\t\t\t\t},\n\t\t\t]}\n\t\t\tplaceholder=""\n\t\t/>\n\t</>\n);\nexport default SelectRadioExample;',
		],
		props: [
			{
				name: 'appearance',
				type: '"default" | "subtle" | "none"',
			},
			{
				name: 'autoFocus',
				type: 'boolean',
				description:
					'Focus the control when it is mounted. There are very few cases that this should be used, and using incorrectly may violate accessibility guidelines.',
			},
			{
				name: 'blurInputOnSelect',
				type: 'boolean',
				description:
					'Remove focus from the input when the user selects an option (handy for dismissing the keyboard on touch devices)',
			},
			{
				name: 'classNamePrefix',
				type: 'string',
				description:
					'If provided, all inner components will be given a prefixed className attribute.\n\nThis is useful when styling via CSS classes instead of the Styles API approach.',
			},
			{
				name: 'classNames',
				type: '{ clearIndicator?: (props: ClearIndicatorProps<OptionType, false, GroupBase<OptionType>>) => string; container?: (props: ContainerProps<...>) => string; ... 18 more ...; valueContainer?: (props: ValueContainerProps<...>) => string; }',
				description: 'Provide classNames based on state for each inner component',
			},
			{
				name: 'clearControlLabel',
				type: 'string',
				description: 'Set the `aria-label` for the clear icon button.',
			},
			{
				name: 'closeMenuOnSelect',
				type: 'boolean',
				description: 'Close the select menu when the user selects an option',
			},
			{
				name: 'components',
				type: '{ Option?: ComponentType<OptionProps<OptionType, false, GroupBase<OptionType>>>; Group?: ComponentType<GroupProps<OptionType, false, GroupBase<...>>>; ... 19 more ...; ValueContainer?: ComponentType<...>; }',
				description:
					'This complex object includes all the compositional components that are used\nin `react-select`. If you wish to overwrite a component, pass in an object\nwith the appropriate namespace. If you wish to restyle a component, we recommend\nusing this prop with the `xcss` prop.',
			},
			{
				name: 'defaultInputValue',
				type: 'string',
			},
			{
				name: 'defaultMenuIsOpen',
				type: 'boolean',
			},
			{
				name: 'defaultValue',
				type: 'OptionType | MultiValue<OptionType>',
			},
			{
				name: 'descriptionId',
				type: 'string',
				description:
					"This sets the aria-describedby attribute. It sets an accessible description for the select, for people who use assistive technology. Use '<HelperMessage>' from '@atlaskit/form' is preferred.",
			},
			{
				name: 'filterOption',
				type: '(option: FilterOptionOption<OptionType>, inputValue: string) => boolean',
				description: 'Custom method to filter whether an option should be displayed in the menu',
			},
			{
				name: 'form',
				type: 'string',
				description: 'Sets the form attribute on the input',
			},
			{
				name: 'formatGroupLabel',
				type: '(group: GroupBase<OptionType>) => ReactNode',
				description:
					'Formats group labels in the menu as React components\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
			},
			{
				name: 'formatOptionLabel',
				type: '(data: OptionType, formatOptionLabelMeta: FormatOptionLabelMeta<OptionType>) => ReactNode',
			},
			{
				name: 'getOptionLabel',
				type: '(option: OptionType) => string',
				description:
					'Resolves option data to a string to be displayed as the label by components\n\nNote: Failure to resolve to a string type can interfere with filtering and\nscreen reader support.',
			},
			{
				name: 'getOptionValue',
				type: '(option: OptionType) => string',
				description:
					'Resolves option data to a string to compare options and specify value attributes',
			},
			{
				name: 'hideSelectedOptions',
				type: 'boolean',
				description: 'Hide the selected option from the menu',
			},
			{
				name: 'id',
				type: 'string',
				description: 'The id to set on the SelectContainer component.',
			},
			{
				name: 'inputId',
				type: 'string',
				description: 'The id of the search input',
			},
			{
				name: 'inputValue',
				type: 'string',
				description: 'The value of the search input',
			},
			{
				name: 'instanceId',
				type: 'string | number',
				description: 'Define an id prefix for the select components e.g. {your-id}-value',
			},
			{
				name: 'isClearable',
				type: 'boolean',
				description: 'Is the select value clearable',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Is the select disabled',
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description: 'Is the select invalid',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description: 'Is the select in a state of loading (async)',
			},
			{
				name: 'isMulti',
				type: 'boolean',
				description: 'Support multiple selected options',
			},
			{
				name: 'isOptionDisabled',
				type: '(option: OptionType, selectValue: Options<OptionType>) => boolean',
				description:
					'Override the built-in logic to detect whether an option is disabled\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
			},
			{
				name: 'isOptionSelected',
				type: '(option: OptionType, selectValue: Options<OptionType>) => boolean',
				description: 'Override the built-in logic to detect whether an option is selected',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'This prop indicates if the component is required.',
			},
			{
				name: 'isSearchable',
				type: 'boolean',
				description: 'Whether to enable search functionality',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'This sets the aria-label attribute. It sets an accessible name for the select, for people who use assistive technology. Use of a visible label is highly recommended for greater accessibility support.',
			},
			{
				name: 'labelId',
				type: 'string',
				description:
					'This sets the aria-labelledby attribute. It sets an accessible name for the select, for people who use assistive technology. Use of a visible label is highly recommended for greater accessibility support.',
			},
			{
				name: 'loadingMessage',
				type: '(obj: { inputValue: string; }) => ReactNode',
				description: 'Async: Text to display when loading options',
			},
			{
				name: 'maxMenuHeight',
				type: 'number',
				description: 'Maximum height of the menu before scrolling',
			},
			{
				name: 'menuIsOpen',
				type: 'boolean',
				description: 'Whether the menu is open',
			},
			{
				name: 'menuPlacement',
				type: '"auto" | "bottom" | "top"',
				description:
					"Default placement of the menu in relation to the control. 'auto' will flip\nwhen there isn't enough space below the control.",
			},
			{
				name: 'menuPortalTarget',
				type: 'HTMLElement',
				description:
					'Whether the menu should use a portal, and where it should attach\n\nAn example can be found in the [Portaling](https://react-select.com/advanced#portaling) documentation',
			},
			{
				name: 'menuPosition',
				type: '"absolute" | "fixed"',
				description:
					'The CSS position value of the menu, when "fixed" extra layout management is required',
			},
			{
				name: 'menuShouldScrollIntoView',
				type: 'boolean',
				description: 'Whether the menu should be scrolled into view when it opens',
			},
			{
				name: 'minMenuHeight',
				type: 'number',
				description: 'Minimum height of the menu before flipping',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Name of the HTML Input (optional - without this, no input will be rendered)',
			},
			{
				name: 'noOptionsMessage',
				type: '(obj: { inputValue: string; }) => ReactNode',
			},
			{
				name: 'onBlur',
				type: '(event: FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Handle blur events on the control',
			},
			{
				name: 'onChange',
				type: '(newValue: OptionType, actionMeta: ActionMeta<OptionType>) => void',
				description: 'Handle change events on the select',
			},
			{
				name: 'onClickPreventDefault',
				type: 'boolean',
			},
			{
				name: 'onFocus',
				type: '(event: FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Handle focus events on the control',
			},
			{
				name: 'onInputChange',
				type: '(newValue: string, actionMeta: InputActionMeta) => void',
				description: 'Handle change events on the input',
			},
			{
				name: 'onKeyDown',
				type: '(event: KeyboardEvent<HTMLDivElement>) => void',
				description: 'Handle key down events on the select',
			},
			{
				name: 'onMenuClose',
				type: '() => void',
				description: 'Handle the menu closing',
			},
			{
				name: 'onMenuOpen',
				type: '() => void',
				description: 'Handle the menu opening',
			},
			{
				name: 'onMenuScrollToBottom',
				type: '(event: globalThis.WheelEvent | globalThis.TouchEvent) => void',
				description: 'Fired when the user scrolls to the bottom of the menu',
			},
			{
				name: 'onMenuScrollToTop',
				type: '(event: globalThis.WheelEvent | globalThis.TouchEvent) => void',
				description: 'Fired when the user scrolls to the top of the menu',
			},
			{
				name: 'options',
				type: 'readonly (OptionType | GroupBase<OptionType>)[]',
				description: 'Array of options that populate the select menu',
			},
			{
				name: 'pageSize',
				type: 'number',
				description: 'Number of options to jump in menu when page{up|down} keys are used',
			},
			{
				name: 'placeholder',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Placeholder for the select value',
			},
			{
				name: 'shouldPreventEscapePropagation',
				type: 'boolean',
				description: 'Prevents "Escape" keydown event propagation',
			},
			{
				name: 'spacing',
				type: '"compact" | "default"',
				description:
					'This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5',
			},
			{
				name: 'tabIndex',
				type: 'number',
				description:
					"Sets the tabIndex attribute on the input for focus. Since focus is already managed, the only acceptable value to be used is '-1' in rare cases when removing this field from the document tab order is required.",
			},
			{
				name: 'value',
				type: 'OptionType | MultiValue<OptionType>',
				description: 'The value of the select; reflected by the selected option',
			},
		],
	},
	{
		name: 'Select',
		package: '@atlaskit/select',
		description:
			'Select allows users to make a single selection or multiple selections from a list of options.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for choosing one or more from a list; common in forms and inline edit',
			'Use a visible label for the field—do not use placeholder as the only label (placeholder disappears and is not accessible)',
			'Use logical order (e.g. most selected first, numeric)',
			'Do not overwhelm with too many options',
			'Enable search for long option lists',
			'Consider loading states for async data',
			'Avoid alphabetical ordering (not localizable); use logical order for translatable option lists',
		],
		contentGuidelines: [
			'Write clear, descriptive option labels',
			'Use consistent terminology across options',
			'Keep option text concise but meaningful',
			'Group related options only when all items are groupable; use well-known categories or for disambiguation (e.g. Portland ME vs OR); no group of one',
		],
		accessibilityGuidelines: [
			'Use labels and helper text for the field—do not use placeholder as label (disappears on focus, not accessible)',
			'Clear control is removed from tab order; keyboard users clear selection via Delete',
			'Provide clear labels for all selects',
			'Ensure keyboard navigation with arrow keys',
			'Support screen reader announcements',
		],
		keywords: ['select', 'dropdown', 'form', 'input', 'options', 'choice', 'picker'],
		category: 'form',
		examples: [
			"import { Label } from '@atlaskit/form';\nimport Select from '@atlaskit/select';\nexport default function SelectAppearanceDefault(): React.JSX.Element {\n\treturn (\n\t\t<>\n\t\t\t<Label htmlFor=\"default-appearance-example\">Favorite fruit</Label>\n\t\t\t<Select\n\t\t\t\tinputId=\"default-appearance-example\"\n\t\t\t\tappearance=\"default\"\n\t\t\t\toptions={[\n\t\t\t\t\t{ label: 'Apple', value: 'a' },\n\t\t\t\t\t{ label: 'Banana', value: 'b' },\n\t\t\t\t]}\n\t\t\t/>\n\t\t</>\n\t);\n}",
		],
		props: [
			{
				name: 'allowCreateWhileLoading',
				type: 'any',
				description:
					'Allow options to be created while the `isLoading` prop is true. Useful to\nprevent the "create new ..." option being displayed while async results are\nstill being loaded.',
			},
			{
				name: 'appearance',
				type: '"default" | "subtle" | "none"',
			},
			{
				name: 'autoFocus',
				type: 'boolean',
				description:
					'Focus the control when it is mounted. There are very few cases that this should be used, and using incorrectly may violate accessibility guidelines.',
			},
			{
				name: 'blurInputOnSelect',
				type: 'boolean',
				description:
					'Remove focus from the input when the user selects an option (handy for dismissing the keyboard on touch devices)',
			},
			{
				name: 'cacheOptions',
				type: 'any',
				description:
					'If cacheOptions is truthy, then the loaded data will be cached. The cache\nwill remain until `cacheOptions` changes value.',
			},
			{
				name: 'classNamePrefix',
				type: 'string',
				description:
					'If provided, all inner components will be given a prefixed className attribute.\n\nThis is useful when styling via CSS classes instead of the Styles API approach.',
			},
			{
				name: 'classNames',
				type: '{ clearIndicator?: (props: ClearIndicatorProps<Option, IsMulti, GroupBase<Option>>) => string; container?: (props: ContainerProps<Option, IsMulti, GroupBase<...>>) => string; ... 18 more ...; valueContainer?: (props: ValueContainerProps<...>) => string; }',
				description: 'Provide classNames based on state for each inner component',
			},
			{
				name: 'clearControlLabel',
				type: 'string',
				description: 'Set the `aria-label` for the clear icon button.',
			},
			{
				name: 'closeMenuOnSelect',
				type: 'boolean',
				description: 'Close the select menu when the user selects an option',
			},
			{
				name: 'components',
				type: '{ Option?: React.ComponentType<OptionProps<Option, IsMulti, GroupBase<Option>>>; Group?: React.ComponentType<GroupProps<Option, IsMulti, GroupBase<...>>>; ... 19 more ...; ValueContainer?: React.ComponentType<...>; }',
				description:
					'This complex object includes all the compositional components that are used\nin `react-select`. If you wish to overwrite a component, pass in an object\nwith the appropriate namespace. If you wish to restyle a component, we recommend\nusing this prop with the `xcss` prop.',
			},
			{
				name: 'createOptionPosition',
				type: 'any',
				description:
					"Sets the position of the createOption element in your options list. Defaults to 'last'",
			},
			{
				name: 'defaultInputValue',
				type: 'string',
			},
			{
				name: 'defaultMenuIsOpen',
				type: 'boolean',
			},
			{
				name: 'defaultOptions',
				type: 'any',
				description:
					"The default set of options to show before the user starts searching. When\nset to `true`, the results for loadOptions('') will be autoloaded.",
			},
			{
				name: 'defaultValue',
				type: 'Option | MultiValue<Option>',
			},
			{
				name: 'descriptionId',
				type: 'string',
				description:
					"This sets the aria-describedby attribute. It sets an accessible description for the select, for people who use assistive technology. Use '<HelperMessage>' from '@atlaskit/form' is preferred.",
			},
			{
				name: 'filterOption',
				type: '(option: FilterOptionOption<Option>, inputValue: string) => boolean',
				description: 'Custom method to filter whether an option should be displayed in the menu',
			},
			{
				name: 'form',
				type: 'string',
				description: 'Sets the form attribute on the input',
			},
			{
				name: 'formatCreateLabel',
				type: 'any',
				description:
					'Gets the label for the "create new ..." option in the menu. Is given the\ncurrent input value.',
			},
			{
				name: 'formatGroupLabel',
				type: '(group: GroupBase<Option>) => React.ReactNode',
				description:
					'Formats group labels in the menu as React components\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
			},
			{
				name: 'formatOptionLabel',
				type: '((data: Option, formatOptionLabelMeta: FormatOptionLabelMeta<Option>) => React.ReactNode) | ((data: Option, formatOptionLabelMeta: FormatOptionLabelMeta<Option>) => React.ReactNode)',
				description: 'Formats option labels in the menu and control as React components',
			},
			{
				name: 'getNewOptionData',
				type: 'any',
				description:
					'Returns the data for the new option when it is created. Used to display the\nvalue, and is passed to `onChange`.',
			},
			{
				name: 'getOptionLabel',
				type: '(option: Option) => string',
				description:
					'Resolves option data to a string to be displayed as the label by components\n\nNote: Failure to resolve to a string type can interfere with filtering and\nscreen reader support.',
			},
			{
				name: 'getOptionValue',
				type: '(option: Option) => string',
				description:
					'Resolves option data to a string to compare options and specify value attributes',
			},
			{
				name: 'hideSelectedOptions',
				type: 'boolean',
				description: 'Hide the selected option from the menu',
			},
			{
				name: 'id',
				type: 'string',
				description: 'The id to set on the SelectContainer component.',
			},
			{
				name: 'inputId',
				type: 'string',
				description: 'The id of the search input',
			},
			{
				name: 'inputValue',
				type: 'string',
				description: 'The value of the search input',
			},
			{
				name: 'instanceId',
				type: 'string | number',
				description: 'Define an id prefix for the select components e.g. {your-id}-value',
			},
			{
				name: 'isClearable',
				type: 'boolean',
				description: 'Is the select value clearable',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Is the select disabled',
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description: 'Is the select invalid',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description:
					'Is the select in a state of loading (async)\nIs the select in a state of loading (async)\nWill cause the select to be displayed in the loading state, even if the\nAsync select is not currently waiting for loadOptions to resolve',
			},
			{
				name: 'isMulti',
				type: 'boolean',
				description: 'Support multiple selected options',
			},
			{
				name: 'isOptionDisabled',
				type: '(option: Option, selectValue: Options<Option>) => boolean',
				description:
					'Override the built-in logic to detect whether an option is disabled\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
			},
			{
				name: 'isOptionSelected',
				type: '(option: Option, selectValue: Options<Option>) => boolean',
				description: 'Override the built-in logic to detect whether an option is selected',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'This prop indicates if the component is required.',
			},
			{
				name: 'isSearchable',
				type: 'boolean',
				description: 'Whether to enable search functionality',
			},
			{
				name: 'isValidNewOption',
				type: 'any',
				description:
					'Determines whether the "create new ..." option should be displayed based on\nthe current input value, select value and options array.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'This sets the aria-label attribute. It sets an accessible name for the select, for people who use assistive technology. Use of a visible label is highly recommended for greater accessibility support.',
			},
			{
				name: 'labelId',
				type: 'string',
				description:
					'This sets the aria-labelledby attribute. It sets an accessible name for the select, for people who use assistive technology. Use of a visible label is highly recommended for greater accessibility support.',
			},
			{
				name: 'loadingMessage',
				type: '(obj: { inputValue: string; }) => React.ReactNode',
				description: 'Async: Text to display when loading options',
			},
			{
				name: 'loadOptions',
				type: 'any',
				description:
					'Function that returns a promise, which is the set of options to be used\nonce the promise resolves.',
			},
			{
				name: 'maxMenuHeight',
				type: 'number',
				description: 'Maximum height of the menu before scrolling',
			},
			{
				name: 'menuIsOpen',
				type: 'boolean',
				description: 'Whether the menu is open',
			},
			{
				name: 'menuPlacement',
				type: '"auto" | "bottom" | "top"',
				description:
					"Default placement of the menu in relation to the control. 'auto' will flip\nwhen there isn't enough space below the control.",
			},
			{
				name: 'menuPortalTarget',
				type: 'HTMLElement',
				description:
					'Whether the menu should use a portal, and where it should attach\n\nAn example can be found in the [Portaling](https://react-select.com/advanced#portaling) documentation',
			},
			{
				name: 'menuPosition',
				type: '"absolute" | "fixed"',
				description:
					'The CSS position value of the menu, when "fixed" extra layout management is required',
			},
			{
				name: 'menuShouldScrollIntoView',
				type: 'boolean',
				description: 'Whether the menu should be scrolled into view when it opens',
			},
			{
				name: 'minMenuHeight',
				type: 'number',
				description: 'Minimum height of the menu before flipping',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Name of the HTML Input (optional - without this, no input will be rendered)',
			},
			{
				name: 'noOptionsMessage',
				type: '((obj: { inputValue: string; }) => React.ReactNode) | ((obj: { inputValue: string; }) => React.ReactNode)',
				description: 'Text to display when there are no options',
			},
			{
				name: 'onBlur',
				type: '(event: React.FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Handle blur events on the control',
			},
			{
				name: 'onChange',
				type: '(newValue: OnChangeValue<Option, IsMulti>, actionMeta: ActionMeta<Option>) => void',
				description: 'Handle change events on the select',
			},
			{
				name: 'onClickPreventDefault',
				type: 'boolean',
			},
			{
				name: 'onCreateOption',
				type: 'any',
				description:
					'If provided, this will be called with the input value when a new option is\ncreated, and `onChange` will **not** be called. Use this when you need more\ncontrol over what happens when new options are created.',
			},
			{
				name: 'onFocus',
				type: '(event: React.FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Handle focus events on the control',
			},
			{
				name: 'onInputChange',
				type: '(newValue: string, actionMeta: InputActionMeta) => void',
				description: 'Handle change events on the input',
			},
			{
				name: 'onKeyDown',
				type: '(event: React.KeyboardEvent<HTMLDivElement>) => void',
				description: 'Handle key down events on the select',
			},
			{
				name: 'onMenuClose',
				type: '() => void',
				description: 'Handle the menu closing',
			},
			{
				name: 'onMenuOpen',
				type: '() => void',
				description: 'Handle the menu opening',
			},
			{
				name: 'onMenuScrollToBottom',
				type: '(event: WheelEvent | TouchEvent) => void',
				description: 'Fired when the user scrolls to the bottom of the menu',
			},
			{
				name: 'onMenuScrollToTop',
				type: '(event: WheelEvent | TouchEvent) => void',
				description: 'Fired when the user scrolls to the top of the menu',
			},
			{
				name: 'options',
				type: 'readonly (Option | GroupBase<Option>)[]',
				description: 'Array of options that populate the select menu',
			},
			{
				name: 'pageSize',
				type: 'number',
				description: 'Number of options to jump in menu when page{up|down} keys are used',
			},
			{
				name: 'placeholder',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Placeholder for the select value',
			},
			{
				name: 'shouldPreventEscapePropagation',
				type: 'boolean',
				description: 'Prevents "Escape" keydown event propagation',
			},
			{
				name: 'spacing',
				type: '"compact" | "default"',
				description:
					'This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5',
			},
			{
				name: 'tabIndex',
				type: 'number',
				description:
					"Sets the tabIndex attribute on the input for focus. Since focus is already managed, the only acceptable value to be used is '-1' in rare cases when removing this field from the document tab order is required.",
			},
			{
				name: 'value',
				type: 'Option | MultiValue<Option>',
				description: 'The value of the select; reflected by the selected option',
			},
		],
	},
	{
		name: 'Skeleton',
		package: '@atlaskit/skeleton',
		description: 'A skeleton acts as a placeholder for content, usually while the content loads.',
		status: 'early-access',
		usageGuidelines: [
			'Use to indicate content is loading',
			'Match skeleton structure to actual content layout',
			'Use appropriate animation and timing',
			'Replace with actual content when ready',
			'Consider different skeleton patterns for different content types',
		],
		contentGuidelines: [
			'Use skeleton patterns that represent actual content structure',
			'Maintain consistent skeleton styling',
			'Consider content hierarchy in skeleton design',
			'Use appropriate animation timing',
		],
		accessibilityGuidelines: [
			'Provide appropriate loading announcements',
			'Use skeleton patterns that match actual content structure',
			'Ensure skeleton content is not announced as actual content',
			'Consider screen reader experience during loading states',
		],
		keywords: ['skeleton', 'placeholder', 'loading', 'content', 'shimmer', 'animation'],
		category: 'loading',
		examples: [
			'import Skeleton from \'@atlaskit/skeleton\';\nconst _default_1: React.JSX.Element[] = [<Skeleton width="200px" height="100px" isShimmering />];\nexport default _default_1;',
		],
		props: [
			{
				name: 'borderRadius',
				type: 'string | number',
				description: "Controls the border radius, or rounding of the skeleton's corners.",
				defaultValue: '"var(--ds-radius-small)"',
			},
			{
				name: 'color',
				type: 'string',
				description:
					'Overrides the default color of skeleton, and overrides the default shimmering start color if ShimmeringEndColor also provided.',
			},
			{
				name: 'groupName',
				type: 'string',
				description:
					'Applied as a data-attribute. Use this to target groups of skeletons with the same name (e.g. for applying custom styles)\n```\ngroupName="my-skeleton" -> <div data-my-skeleton>\n```',
			},
			{
				name: 'height',
				type: 'string | number',
				isRequired: true,
			},
			{
				name: 'isShimmering',
				type: 'boolean',
				description: 'Enables the shimmering animation.',
				defaultValue: 'false',
			},
			{
				name: 'ShimmeringEndColor',
				type: 'string',
				description: 'Overrides the default shimmering ending color of skeleton.',
			},
			{
				name: 'width',
				type: 'string | number',
				isRequired: true,
			},
		],
	},
	{
		name: 'Spinner',
		package: '@atlaskit/spinner',
		description: 'A loading spinner component.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for loading states of unknown duration',
			'Consider delay before showing spinner',
			'Use appropriate size for context',
			'Provide loading context when possible',
		],
		contentGuidelines: [
			'Use consistent spinner sizing',
			'Consider spinner placement and context',
			'Provide loading feedback when appropriate',
		],
		accessibilityGuidelines: [
			'Provide appropriate loading announcements',
			'Use appropriate timing for spinner display',
			'Ensure spinner is announced to screen readers',
			'Consider alternative loading indicators',
		],
		keywords: ['spinner', 'loading', 'progress', 'wait', 'activity'],
		category: 'feedback',
		examples: [
			'import Spinner from \'@atlaskit/spinner\';\nconst _default_1: React.JSX.Element[] = [\n\t<Spinner size="small" />,\n\t<Spinner size="medium" />,\n\t<Spinner size="large" />,\n];\nexport default _default_1;',
		],
		props: [
			{
				name: 'appearance',
				type: '"inherit" | "invert"',
				description:
					'You can use this to invert the current theme.\nThis is useful when you are displaying a spinner on a background that is not the same background color scheme as the main content.',
			},
			{
				name: 'delay',
				type: 'number',
				description:
					'Delay the intro animation of `Spinner`.\nThis is not to be used to avoid quick flickering of `Spinner`.\n`Spinner` will automatically fade in and takes ~200ms to become partially visible.\nThis prop can be helpful for **long delays** such as `500-1000ms` for when you want to not\nshow a `Spinner` until some longer period of time has elapsed.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Describes what the spinner is doing for assistive technologies. For example, "loading", "submitting", or "processing".',
			},
			{
				name: 'size',
				type: 'number | PresetSize',
				description:
					'Size of the spinner. The available sizes are `xsmall`, `small`, `medium`, `large`, and `xlarge`. For most use cases, we recommend `medium`.',
			},
		],
	},
	{
		name: 'Tabs',
		package: '@atlaskit/tabs',
		description:
			'Tabs are used to organize content by grouping similar information on the same page.',
		status: 'general-availability',
		usageGuidelines: [
			'Use to organize related content on the same page without navigating away',
			'Use for concise content or content users access regularly',
			'Limit the number of tabs to avoid overcrowding',
			'Keep tab labels concise and descriptive',
			'Use consistent tab ordering and grouping',
			'Consider responsive behavior for many tabs',
		],
		contentGuidelines: [
			'Write clear, descriptive tab labels',
			'Group related content logically',
			'Use consistent naming conventions',
			'Ensure tab content is relevant and complete',
		],
		accessibilityGuidelines: [
			'Ensure proper keyboard navigation between tabs',
			'Use appropriate ARIA attributes for tab panels',
			'Provide clear focus indicators',
			'Announce tab changes to screen readers',
			'Ensure tab content is accessible',
		],
		keywords: ['tabs', 'navigation', 'content', 'organization', 'grouping'],
		category: 'navigation',
		examples: [
			'import Tabs, { Tab, TabList, TabPanel } from \'@atlaskit/tabs\';\nconst Example = (): React.JSX.Element => (\n\t<Tabs id="tabs">\n\t\t<TabList>\n\t\t\t<Tab>Tab 1</Tab>\n\t\t\t<Tab>Tab 2</Tab>\n\t\t</TabList>\n\t\t<TabPanel>Content for Tab 1</TabPanel>\n\t\t<TabPanel>Content for Tab 2</TabPanel>\n\t</Tabs>\n);\nexport default Example;',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description:
					"The children of Tabs. The first child should be a `TabList` filled with `Tab`'s.\nSubsequent children should be `TabPanel`'s. There should be a `Tab` for each `TabPanel`.\nIf you want to customize `Tab` or `TabPanel`, refer to the examples in the documentation.",
				isRequired: true,
			},
			{
				name: 'defaultSelected',
				type: 'number',
				description:
					'The index of the tab that will be selected by default when the component mounts.\nIf not set the first tab will be displayed by default.',
			},
			{
				name: 'id',
				type: 'string',
				description:
					'A unique ID that will be used to generate IDs for tabs and tab panels.\nThis is required for accessibility purposes.',
				isRequired: true,
			},
			{
				name: 'onChange',
				type: '(index: number, analyticsEvent: UIAnalyticsEvent) => void',
				description:
					'A callback function which will be fired when a changed. It will be passed\nthe index of the selected tab and a `UIAnalyticsEvent`.',
			},
			{
				name: 'selected',
				type: 'number',
				description:
					"The selected tab's index. If this prop is set the component behaves as a\ncontrolled component. It will be up to you to listen to `onChange`.",
			},
			{
				name: 'shouldUnmountTabPanelOnChange',
				type: 'boolean',
				description:
					"Tabs by default leaves `TabPanel`'s mounted on the page after they have been selected.\nIf you would like to unmount a `TabPanel` when it is not selected, set this prop to\nbe true.",
			},
		],
	},
	{
		name: 'AvatarTag',
		package: '@atlaskit/tag',
		description:
			'An avatar tag represents individuals, agents, teams, projects or spaces for tagging, quick recognition and navigation.',
		status: 'open-beta',
		usageGuidelines: [
			'Use for people (user), agents (agent), or teams/projects/spaces (other)',
			'Use isVerified for verified teams only',
			'Use in moderation—avatar tags add cognitive noise',
			"Don't use for general object categories—use Tag instead",
			"Don't use within user-generated text (e.g. editor)",
			'Use TagGroup to control layout',
		],
		contentGuidelines: [
			'Truncate names with ellipsis if they exceed max width',
			'Provide tooltip on hover for truncated text',
			'Use clear, descriptive names',
		],
		accessibilityGuidelines: [
			'Provide meaningful names for avatar representation',
			'Ensure avatar shapes communicate type (round=user, hexagon=agent, square=other)',
		],
		keywords: ['tag', 'avatar', 'user', 'agent', 'team', 'project', 'space'],
		category: 'data-display',
		examples: [
			'import Avatar from \'@atlaskit/avatar\';\nimport { AvatarTag } from \'@atlaskit/tag\';\nconst avatarUrl = \'https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg\';\nexport default (): React.JSX.Element => (\n\t<AvatarTag\n\t\ttype="user"\n\t\ttext="Brian Lin"\n\t\tavatar={(props: any) => <Avatar {...props} src={avatarUrl} name="Brian Lin" />}\n\t/>\n);',
		],
		props: [
			{
				name: 'avatar',
				type: 'ComponentType<AvatarPropTypes> | ComponentType<TeamAvatarProps>',
				description:
					'The avatar component to render. AvatarTag will provide controlled props (size, appearance, borderColor).\nAccepts Avatar or any compatible component.\n@example avatar={Avatar}\n@example avatar={(props) => <Avatar {...props} src="user.png" />}\nThe avatar component to render. AvatarTag will provide controlled props (size, appearance, borderColor).\nAccepts Avatar, TeamAvatar, or any compatible component.\n@example avatar={TeamAvatar}\n@example avatar={(props) => <TeamAvatar {...props} name="Team" />}\nThe avatar component to render. AvatarTag will provide controlled props (size, appearance, borderColor).\nAccepts Avatar or any compatible component.\n@example avatar={Avatar}\n@example avatar={(props) => <Avatar {...props} src="agent.png" />}',
				isRequired: true,
			},
			{
				name: 'href',
				type: 'string',
				description:
					'URI or path. If provided, the tag will be a link.\nURI or path. If provided, the tag will be a link.\nURI or path. If provided, the tag will be a link.',
			},
			{
				name: 'isRemovable',
				type: 'boolean',
				description:
					'Flag to indicate if a tag is removable. Defaults to true.\nFlag to indicate if a tag is removable. Defaults to true.\nFlag to indicate if a tag is removable. Defaults to true.',
			},
			{
				name: 'isVerified',
				type: 'boolean',
				description:
					'isVerified is not allowed for user tags.\nWhether this entity is verified. Shows a blue verified icon after the text.\nisVerified is not allowed for agent tags.',
			},
			{
				name: 'linkComponent',
				type: 'ComponentClass<any, any> | FunctionComponent<any>',
				description:
					'A link component to be used instead of our standard link. The styling of\nour link item will be applied to the link that is passed in.\nA link component to be used instead of our standard link. The styling of\nour link item will be applied to the link that is passed in.\nA link component to be used instead of our standard link. The styling of\nour link item will be applied to the link that is passed in.',
			},
			{
				name: 'maxWidth',
				type: 'string | number',
				description:
					"Maximum width of the tag. When exceeded, the text will be truncated with ellipsis.\nAccepts any valid CSS max-width value (e.g., '200px', '15rem', '100%').\nMaximum width of the tag. When exceeded, the text will be truncated with ellipsis.\nAccepts any valid CSS max-width value (e.g., '200px', '15rem', '100%').\nMaximum width of the tag. When exceeded, the text will be truncated with ellipsis.\nAccepts any valid CSS max-width value (e.g., '200px', '15rem', '100%').",
			},
			{
				name: 'onAfterRemoveAction',
				type: '(text: string) => void',
				description:
					'Handler to be called after tag is removed.\nHandler to be called after tag is removed.\nHandler to be called after tag is removed.',
			},
			{
				name: 'onBeforeRemoveAction',
				type: '() => boolean',
				description:
					'Handler to be called before the tag is removed. If it does not return a\ntruthy value, the tag will not be removed.\nHandler to be called before the tag is removed. If it does not return a\ntruthy value, the tag will not be removed.\nHandler to be called before the tag is removed. If it does not return a\ntruthy value, the tag will not be removed.',
			},
			{
				name: 'onClick',
				type: '(e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
				description:
					'Handler called when the tag is clicked. Only fires for link tags (when href is provided).\nThe second argument provides an Atlaskit UI analytics event.\nHandler called when the tag is clicked. Only fires for link tags (when href is provided).\nThe second argument provides an Atlaskit UI analytics event.\nHandler called when the tag is clicked. Only fires for link tags (when href is provided).\nThe second argument provides an Atlaskit UI analytics event.',
			},
			{
				name: 'removeButtonLabel',
				type: 'string',
				description:
					'Text rendered as the aria-label for remove button.\nText rendered as the aria-label for remove button.\nText rendered as the aria-label for remove button.',
			},
			{
				name: 'text',
				type: 'string',
				description:
					"Text to be displayed in the tag (usually a person's name or entity name).\nText to be displayed in the tag (usually a person's name or entity name).\nText to be displayed in the tag (usually a person's name or entity name).",
				isRequired: true,
			},
			{
				name: 'type',
				type: '"user" | "other" | "agent"',
				description:
					"The type of avatar tag. 'user' uses circular avatars for individuals.\nThe type of avatar tag. 'other' uses square avatars for teams/projects/spaces.\nThe type of avatar tag. 'agent' uses hexagonal avatars for AI agents.",
				isRequired: true,
			},
		],
	},
	{
		name: 'RemovableTag',
		package: '@atlaskit/tag',
		description: 'A tag labels UI objects for quick recognition and navigation.',
		status: 'open-beta',
		usageGuidelines: [
			'Use to categorize or label content with removal capability',
			'Use for object-related content; for people/teams/projects use AvatarTag',
			"Don't use for status—use lozenge instead",
			'Use TagGroup to control layout of multiple tags',
			"Don't use tags within user-generated text",
		],
		contentGuidelines: [
			'Use clear, descriptive tag labels',
			'Keep tag text concise; max 200px causes truncation',
			'Use color intentionally to organize related content',
			'For people, teams, spaces, or projects use avatar tag',
		],
		keywords: ['tag', 'removable', 'label', 'category', 'close'],
		category: 'data-display',
		examples: [
			'import Tag from \'@atlaskit/tag\';\nexport default (): React.JSX.Element => <Tag text="Design" isRemovable={false} />;',
		],
		props: [
			{
				name: 'appearance',
				type: '"default" | "rounded"',
				description: 'Set whether tags are rounded.',
			},
			{
				name: 'color',
				type: '"standard" | "green" | "lime" | "blue" | "red" | "purple" | "magenta" | "grey" | "gray" | "teal" | "orange" | "yellow" | "limeLight" | "orangeLight" | "magentaLight" | "greenLight" | ... 5 more ... | "yellowLight"',
				description: 'The color theme to apply. This sets both the background and text color.',
			},
			{
				name: 'elemBefore',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'The component to be rendered before the tag.',
			},
			{
				name: 'href',
				type: 'string',
				description: 'URI or path. If provided, the tag will be a link.',
			},
			{
				name: 'isRemovable',
				type: 'boolean',
				description: 'Flag to indicate if a tag is removable.',
			},
			{
				name: 'linkComponent',
				type: 'ComponentClass<any, any> | FunctionComponent<any>',
			},
			{
				name: 'maxWidth',
				type: 'string | number',
				description:
					"Maximum width of the tag text. When exceeded, text will be truncated with ellipsis.\nAccepts any valid CSS max-width value (e.g., '200px', '15rem', '100%').",
			},
			{
				name: 'migration_fallback',
				type: 'string',
				description:
					"@internal\n**Temporary / Internal only for migration.**\n\nWhen set to `'lozenge'` and the feature flag `platform-dst-lozenge-tag-badge-visual-uplifts`\nis OFF, renders as a Lozenge component instead of Tag. This enables safe, staged migration\nfrom Lozenge to Tag for large consumers.\n\nThis prop will be removed via codemod after migration is complete.",
			},
			{
				name: 'onAfterRemoveAction',
				type: '(text: string) => void',
				description:
					"Handler to be called after tag is removed. Called with the string 'Post\nRemoval Hook'.",
			},
			{
				name: 'onBeforeRemoveAction',
				type: '() => boolean',
				description:
					'Handler to be called before the tag is removed. If it does not return a\ntruthy value, the tag will not be removed.',
			},
			{
				name: 'removeButtonLabel',
				type: 'string',
				description: 'Text rendered as the aria-label for remove button.',
			},
			{
				name: 'swatchBefore',
				type: 'boolean | TagSwatchBeforeTokenName',
				description:
					"@internal\n**Temporary / Internal only for migration.**\n\nEXPERIMENTAL - Leading color swatch (12×12px), rendered before `elemBefore`.\n- `true`: uses `color.background.accent.<color>.subtle` for swatch color\n- Pass a design token (e.g. `token('color.background.accent.red.subtle')`)",
			},
			{
				name: 'text',
				type: 'string',
				description: 'Text to be displayed in the tag.',
				isRequired: true,
			},
		],
	},
	{
		name: 'SimpleTag',
		package: '@atlaskit/tag',
		description: 'A tag is a compact label used to classify, organize, and categorize information.',
		status: 'open-beta',
		usageGuidelines: [
			'Use for non-interactive categorization and labelling',
			'Use for object-related content; for people/teams use AvatarTag',
			"Don't use for status—use lozenge instead",
			'Use TagGroup to control layout of multiple tags',
		],
		contentGuidelines: [
			'Use clear, descriptive tag labels',
			'Keep tag text concise',
			'Use color intentionally',
		],
		keywords: ['tag', 'simple', 'label', 'category', 'non-interactive'],
		category: 'data-display',
		examples: [
			'import { Box } from \'@atlaskit/primitives/compiled\';\nimport { SimpleTag as Tag } from \'@atlaskit/tag\';\nexport default (): React.JSX.Element => (\n\t<Box id="simpleTags" role="group" aria-label="Simple tag examples">\n\t\t<Tag text="standard Tag" color="standard" />\n\t\t<Tag text="blue Tag" color="blue" />\n\t\t<Tag text="green Tag" color="green" />\n\t\t<Tag text="teal Tag" color="teal" />\n\t\t<Tag text="purple Tag" color="purple" />\n\t\t<Tag text="red Tag" color="red" />\n\t\t<Tag text="yellow Tag" color="yellow" />\n\t\t<Tag text="orange Tag" color="orange" />\n\t\t<Tag text="magenta Tag" color="magenta" />\n\t\t<Tag text="lime Tag" color="lime" />\n\t\t<Tag text="grey Tag" color="grey" />\n\t\t<Tag text="greenLight Tag" color="greenLight" />\n\t\t<Tag text="tealLight Tag" color="tealLight" />\n\t\t<Tag text="blueLight Tag" color="blueLight" />\n\t\t<Tag text="purpleLight Tag" color="purpleLight" />\n\t\t<Tag text="redLight Tag" color="redLight" />\n\t\t<Tag text="yellowLight Tag" color="yellowLight" />\n\t\t<Tag text="orangeLight Tag" color="orangeLight" />\n\t\t<Tag text="magentaLight Tag" color="magentaLight" />\n\t\t<Tag text="limeLight Tag" color="limeLight" />\n\t\t<Tag text="greyLight Tag" color="greyLight" />\n\t</Box>\n);',
		],
		props: [
			{
				name: 'appearance',
				type: '"default" | "rounded"',
				description: 'Set whether tags are rounded.',
			},
			{
				name: 'color',
				type: '"standard" | "green" | "lime" | "blue" | "red" | "purple" | "magenta" | "grey" | "gray" | "teal" | "orange" | "yellow" | "limeLight" | "orangeLight" | "magentaLight" | "greenLight" | ... 5 more ... | "yellowLight"',
				description: 'The color theme to apply. This sets both the background and text color.',
			},
			{
				name: 'elemBefore',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'The component to be rendered before the tag.',
			},
			{
				name: 'href',
				type: 'string',
				description: 'URI or path. If provided, the tag will be a link.',
			},
			{
				name: 'linkComponent',
				type: 'ComponentClass<any, any> | FunctionComponent<any>',
			},
			{
				name: 'maxWidth',
				type: 'string | number',
				description:
					"Maximum width of the tag text. When exceeded, text will be truncated with ellipsis.\nAccepts any valid CSS max-width value (e.g., '200px', '15rem', '100%').",
			},
			{
				name: 'migration_fallback',
				type: 'string',
				description:
					"@internal\n**Temporary / Internal only for migration.**\n\nWhen set to `'lozenge'` and the feature flag `platform-dst-lozenge-tag-badge-visual-uplifts`\nis OFF, renders as a Lozenge component instead of Tag. This enables safe, staged migration\nfrom Lozenge to Tag for large consumers.\n\nThis prop will be removed via codemod after migration is complete.",
			},
			{
				name: 'swatchBefore',
				type: 'boolean | TagSwatchBeforeTokenName',
				description:
					"@internal\n**Temporary / Internal only for migration.**\n\nEXPERIMENTAL - Leading color swatch (12×12px), rendered before `elemBefore`.\n- `true`: uses `color.background.accent.<color>.subtle` for swatch color\n- Pass a design token (e.g. `token('color.background.accent.red.subtle')`)",
			},
			{
				name: 'text',
				type: 'string',
				description: 'Text to be displayed in the tag.',
				isRequired: true,
			},
		],
	},
	{
		name: 'Tag',
		package: '@atlaskit/tag',
		description: 'A tag is a compact label used to classify, organize, and categorize information.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for object-related content; for people, teams, projects, spaces use AvatarTag',
			"Don't use for status or state—use lozenge instead",
			'Use TagGroup to control layout of multiple tags',
			"Don't use tags within user-generated text (e.g. editor)",
			'Tags can be non-interactive, links, or removable (isRemovable)',
		],
		contentGuidelines: [
			'Use clear, descriptive tag labels',
			'Keep tag text concise; max 200px causes truncation',
			'Use color intentionally to organize related content',
			'For people, teams, spaces, or projects use avatar tag',
		],
		accessibilityGuidelines: [
			'Provide appropriate labels for tags',
			'Ensure sufficient color contrast for text readability',
			'Use clear, descriptive tag text',
			'Consider keyboard navigation for interactive tags',
			'Provide alternative text for tag removal actions',
		],
		keywords: ['tag', 'label', 'category', 'filter', 'chip', 'badge'],
		category: 'data-display',
		examples: [
			'import Tag from \'@atlaskit/tag\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<Tag text="Basic tag" />\n\t\t<Tag text="Bug" color="red" />\n\t\t<Tag text="Removable tag" removeButtonLabel="Remove" />\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'appearance',
				type: '"default" | "rounded"',
				description: 'Set whether tags are rounded.',
			},
			{
				name: 'color',
				type: '"standard" | "green" | "lime" | "blue" | "red" | "purple" | "magenta" | "grey" | "gray" | "teal" | "orange" | "yellow" | "limeLight" | "orangeLight" | "magentaLight" | "greenLight" | ... 5 more ... | "yellowLight"',
				description: 'The color theme to apply. This sets both the background and text color.',
			},
			{
				name: 'elemBefore',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'The component to be rendered before the tag.',
			},
			{
				name: 'href',
				type: 'string',
				description: 'URI or path. If provided, the tag will be a link.',
			},
			{
				name: 'isRemovable',
				type: 'boolean',
				description: 'Flag to indicate if a tag is removable.',
			},
			{
				name: 'linkComponent',
				type: 'ComponentClass<any, any> | FunctionComponent<any>',
			},
			{
				name: 'maxWidth',
				type: 'string | number',
				description:
					"Maximum width of the tag text. When exceeded, text will be truncated with ellipsis.\nAccepts any valid CSS max-width value (e.g., '200px', '15rem', '100%').",
			},
			{
				name: 'migration_fallback',
				type: 'string',
				description:
					"@internal\n**Temporary / Internal only for migration.**\n\nWhen set to `'lozenge'` and the feature flag `platform-dst-lozenge-tag-badge-visual-uplifts`\nis OFF, renders as a Lozenge component instead of Tag. This enables safe, staged migration\nfrom Lozenge to Tag for large consumers.\n\nThis prop will be removed via codemod after migration is complete.",
			},
			{
				name: 'onAfterRemoveAction',
				type: '(text: string) => void',
				description:
					"Handler to be called after tag is removed. Called with the string 'Post\nRemoval Hook'.",
			},
			{
				name: 'onBeforeRemoveAction',
				type: '() => boolean',
				description:
					'Handler to be called before the tag is removed. If it does not return a\ntruthy value, the tag will not be removed.',
			},
			{
				name: 'removeButtonLabel',
				type: 'string',
				description: 'Text rendered as the aria-label for remove button.',
			},
			{
				name: 'swatchBefore',
				type: 'boolean | TagSwatchBeforeTokenName',
				description:
					"@internal\n**Temporary / Internal only for migration.**\n\nEXPERIMENTAL - Leading color swatch (12×12px), rendered before `elemBefore`.\n- `true`: uses `color.background.accent.<color>.subtle` for swatch color\n- Pass a design token (e.g. `token('color.background.accent.red.subtle')`)",
			},
			{
				name: 'text',
				type: 'string',
				description: 'Text to be displayed in the tag.',
				isRequired: true,
			},
		],
	},
	{
		name: 'TagGroup',
		package: '@atlaskit/tag-group',
		description: 'A component for managing multiple tags.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for grouping related tags',
			'Consider tag alignment and spacing',
			'Use for categorizing content',
			'Provide clear tag relationships',
		],
		contentGuidelines: [
			'Use consistent tag naming',
			'Keep tag text concise',
			'Use meaningful tag categories',
			'Consider tag hierarchy',
		],
		accessibilityGuidelines: [
			'Provide clear tag labels',
			'Ensure proper keyboard navigation',
			'Use appropriate grouping semantics',
			'Consider screen reader announcements',
		],
		keywords: ['tag', 'group', 'multiple', 'labels', 'chips'],
		category: 'data-display',
		examples: [
			'import Tag from \'@atlaskit/tag\';\nimport TagGroup from \'@atlaskit/tag-group\';\nconst Example = (): React.JSX.Element => (\n\t<TagGroup label="Tags for work item">\n\t\t<Tag text="Priority: High" color="red" />\n\t\t<Tag text="Status: Active" color="green" />\n\t\t<Tag text="Type: Bug" color="blue" />\n\t</TagGroup>\n);\nexport default Example;',
		],
		props: [
			{
				name: 'alignment',
				type: '"start" | "end"',
				description:
					'Sets whether the tags should be aligned to the start or the end of the component.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Tags to render within the tag group.',
				isRequired: true,
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Refers to an `aria-label` attribute. Sets an accessible name for the tags group wrapper to announce it to users of assistive technology.\nUsage of either this, or the `titleId` attribute is strongly recommended.',
			},
			{
				name: 'titleId',
				type: 'string',
				description:
					"ID referenced by the tag group wrapper's `aria-labelledby` attribute. This ID should be assigned to the group-button title element.\nUsage of either this, or the `label` attribute is strongly recommended.",
			},
		],
	},
	{
		name: 'Textarea',
		package: '@atlaskit/textarea',
		description: 'A textarea is a multiline text input control for longer text content.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for long-form, multi-line text in forms',
			'Expandable height; label and optional helper text',
			'Do not use placeholder for critical info—use label or helper text',
			'Use TextField for short, single-line input',
		],
		contentGuidelines: [
			'Label as noun string (e.g. "Description" not "Modal title + Description")',
			'Use helper text to clarify; do not put critical info in placeholder',
			'Provide appropriate error messages',
			'Consider content length and formatting',
		],
		accessibilityGuidelines: [
			'Ensure label is associated with the textarea',
			'Do not use placeholder for critical info—use label or helper (search exception only with icon + accessible label)',
			'Provide clear labels for all textareas',
			'Provide keyboard navigation support',
			'Indicate required fields clearly',
			'Use appropriate error states and messaging',
		],
		keywords: ['textarea', 'input', 'form', 'text', 'multiline', 'input', 'field'],
		category: 'forms-and-input',
		examples: [
			'import Textarea from \'@atlaskit/textarea\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<Textarea placeholder="Enter your text..." />\n\t\t<Textarea placeholder="Required field" isRequired resize="auto" name="comments" />\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'appearance',
				type: '"standard" | "subtle" | "none"',
				description:
					"Controls the appearance of the field.\nSubtle shows styling on hover.\nNone prevents all field styling. Take care when using the none appearance as this doesn't include accessible interactions.",
			},
			{
				name: 'defaultValue',
				type: 'string',
				description: 'The default value of the text area.',
			},
			{
				name: 'isCompact',
				type: 'boolean',
				description: 'Sets whether the field should expand to fill available horizontal space.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					'Sets the field as uneditable, with a changed hover state, and prevents it from showing in the focus order.\nWherever possible, prefer using validation and error messaging over disabled fields for a more accessible experience.',
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description: 'Sets styling to indicate that the input is invalid.',
			},
			{
				name: 'isMonospaced',
				type: 'boolean',
				description: 'Sets the content text value to monospace.',
			},
			{
				name: 'isReadOnly',
				type: 'boolean',
				description: 'If true, prevents the value of the input from being edited.',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'Sets whether the field is required for form that the field is part of.',
			},
			{
				name: 'maxHeight',
				type: 'string',
				description: 'The maximum height of the text area.',
			},
			{
				name: 'minimumRows',
				type: 'number',
				description: 'The minimum number of rows of text to display.',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Name of the input form control.',
			},
			{
				name: 'onBlur',
				type: '(event: FocusEvent<HTMLTextAreaElement, Element>) => void',
				description: 'Handler to be called when the input is blurred.',
			},
			{
				name: 'onChange',
				type: '(event: ChangeEvent<HTMLTextAreaElement>) => void',
				description: 'Handler to be called when the input changes.',
			},
			{
				name: 'onFocus',
				type: '(event: FocusEvent<HTMLTextAreaElement, Element>) => void',
				description: 'Handler to be called when the input is focused.',
			},
			{
				name: 'placeholder',
				type: 'string',
				description:
					"The placeholder text within the text area. Don't use placeholder text to provide instructions as it disappears on data entry.",
			},
			{
				name: 'resize',
				type: '"none" | "auto" | "vertical" | "horizontal" | "smart"',
				description:
					'Enables resizing of the text area. The default setting is `smart`.\nAuto enables resizing in both directions.\nHorizontal enables resizing only along the X axis.\nVertical enables resizing only along the Y axis.\nSmart vertically grows and shrinks the text area automatically to wrap your input text.\nNone explicitly disallows resizing of the text area.',
			},
			{
				name: 'spellCheck',
				type: 'boolean',
				description: 'Enables native spell check on the `textarea` element.',
			},
			{
				name: 'theme',
				type: 'any',
				description:
					'The theme function `TextArea` consumes to derive theming constants for use in styling its components',
			},
			{
				name: 'value',
				type: 'string',
				description: 'The value of the text area.',
			},
		],
	},
	{
		name: 'TextField',
		package: '@atlaskit/textfield',
		description: 'A single-line text input component.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for single-line text in forms, modals, search, cards',
			'Label is required (above input); helper text optional',
			'Do not use placeholder for critical info—use label or helper text (search exception: search icon + accessible label)',
			'Consider character limits and validation',
		],
		contentGuidelines: [
			'Write clear, short labels',
			'Use helper text for examples/formatting; keep helper visible after input',
			'Provide appropriate error messages',
			'Consider content length and formatting',
		],
		accessibilityGuidelines: [
			'Use visible label or proper association; do not use placeholder for critical info—use label or helper (search is exception with icon + accessible label)',
			'Do not nest interactive elements (causes focus issues)',
			'Custom validation: validate onBlur; use error container with aria-live="polite" and aria-relevant/aria-atomic for dynamic announcements',
			'Provide clear labels for all textfields',
			'Provide keyboard navigation support',
			'Indicate required fields clearly',
			'Use appropriate error states and messaging',
		],
		keywords: ['textfield', 'input', 'form', 'text', 'field', 'single-line'],
		category: 'form',
		examples: [
			'import TextField from \'@atlaskit/textfield\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<TextField label="Name" placeholder="Enter your name" />\n\t\t<TextField label="Email" type="email" placeholder="Enter your email address" isRequired />\n\t\t<TextField label="Password" type="password" placeholder="Enter your password" isRequired />\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'appearance',
				type: '"subtle" | "standard" | "none"',
				description:
					"Controls the appearance of the field.\nSubtle shows styling on hover.\nNone prevents all field styling. Take care when using the none appearance as this doesn't include accessible interactions.",
			},
			{
				name: 'elemAfterInput',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Element after input in text field.',
			},
			{
				name: 'elemBeforeInput',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Element before input in text field.',
			},
			{
				name: 'isCompact',
				type: 'boolean',
				description: 'Applies compact styling, making the field smaller.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					"Sets the field as to appear disabled,\npeople will not be able to interact with the text field and it won't appear in the focus order.\nWherever possible, prefer using validation and error messaging over disabled fields for a more accessible experience.",
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description:
					'Changes the text field to have a border indicating that its value is invalid.',
			},
			{
				name: 'isMonospaced',
				type: 'boolean',
				description: 'Sets content text value to appear monospaced.',
			},
			{
				name: 'isReadOnly',
				type: 'boolean',
				description: 'If true, prevents the value of the input from being edited.',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'Set required for form that the field is part of.',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Name of the input element.',
			},
			{
				name: 'onChange',
				type: '(event: FormEvent<HTMLInputElement>) => void',
				description: 'Handler called when the inputs value changes.',
			},
			{
				name: 'onMouseDown',
				type: '(event: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void',
				description: 'Handler called when the mouse down event is triggered on the input element.',
			},
			{
				name: 'placeholder',
				type: 'string',
				description: 'Placeholder text to display in the text field whenever it is empty.',
			},
			{
				name: 'width',
				type: 'string | number',
				description: 'Sets maximum width of input.',
			},
		],
	},
	{
		name: 'Toggle',
		package: '@atlaskit/toggle',
		description: 'A toggle is used to view or switch between enabled or disabled states.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for binary on/off states',
			"Provide clear labels that describe the toggle's function",
			'Use appropriate default states',
			'Consider immediate vs. delayed state changes',
			'Use consistent toggle behavior across the interface',
		],
		contentGuidelines: [
			'Write clear, descriptive labels',
			'Use action-oriented language when appropriate',
			'Ensure labels clearly indicate what the toggle controls',
			'Use consistent terminology across toggles',
		],
		accessibilityGuidelines: [
			'Provide clear labels for all toggles',
			'Use appropriate ARIA attributes for toggle state',
			'Ensure keyboard navigation support',
			'Provide clear visual feedback for state changes',
			"Use descriptive labels that explain the toggle's purpose",
		],
		keywords: ['toggle', 'switch', 'on-off', 'enabled', 'disabled', 'state'],
		category: 'forms-and-input',
		examples: [
			'import Toggle from \'@atlaskit/toggle\';\nconst Examples = (): React.JSX.Element => (\n\t<>\n\t\t<Toggle label="Basic toggle" />\n\t\t<Toggle label="Checked toggle" isChecked />\n\t</>\n);\nexport default Examples;',
		],
		props: [
			{
				name: 'defaultChecked',
				type: 'boolean',
				description:
					'Sets whether the toggle is initially checked or not.\nAfter the initial interaction, whether the component is checked or not is\ncontrolled by the component.',
			},
			{
				name: 'descriptionId',
				type: 'string',
				description:
					"Use this when you need to provide an extended description about how the toggle works using aria-describedby.\n\nIt's important to use this prop if the meaning of the toggle with the only a label would be unclear to people who use assistive technology.",
			},
			{
				name: 'id',
				type: 'string',
				description:
					'Use a pairing label with your toggle using `id` and `htmlFor` props to set the relationship.\nFor more information see [labels on MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label).',
			},
			{
				name: 'isChecked',
				type: 'boolean',
				description:
					'If defined, it takes precedence over defaultChecked, and the toggle acts\nas a controlled component.\n\nYou can provide a onChange function to be notified of checked value changes',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					'Sets if the toggle is disabled or not. This prevents any interaction.\nDisabled toggles will not appear in the tab order for assistive technology.',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description:
					"If defined, it displays a spinner within the toggle.\nThis prop is useful when the toggle's state is being fetched or updated asynchronously.",
			},
			{
				name: 'label',
				type: 'string',
				description:
					"Text value which will be associated with toggle input using aria-labelledby attribute.\n\nUse only when you can't use a visible label for the toggle.",
			},
			{
				name: 'name',
				type: 'string',
				description: 'Descriptive name for the value property, to be submitted in a form.',
			},
			{
				name: 'onBlur',
				type: '(event: FocusEvent<HTMLInputElement, Element>, analyticsEvent: UIAnalyticsEvent) => void',
				description: 'Handler to be called when toggle is unfocused.',
			},
			{
				name: 'onChange',
				type: '(event: ChangeEvent<HTMLInputElement>, analyticsEvent: UIAnalyticsEvent) => void',
				description: "Handler to be called when native 'change' event happens internally.",
			},
			{
				name: 'onFocus',
				type: '(event: FocusEvent<HTMLInputElement, Element>, analyticsEvent: UIAnalyticsEvent) => void',
				description: 'Handler to be called when toggle is focused.',
			},
			{
				name: 'size',
				type: '"regular" | "large"',
				description: 'Toggle size.',
			},
			{
				name: 'value',
				type: 'string',
				description: 'Value to be submitted in a form.',
			},
		],
	},
	{
		name: 'Tooltip',
		package: '@atlaskit/tooltip',
		description:
			'A tooltip is a floating, non-actionable label used to explain a user interface element or feature.',
		status: 'general-availability',
		usageGuidelines: [
			'Use only on interactive elements (must be focusable for keyboard and screen readers)',
			'Opens on hover or focus; content is text only',
			'Use with icon buttons for labels; for useful but non-essential info (e.g. shortcuts); for truncated text when truncation is unavoidable',
			'Never use on disabled elements (see Button a11y)',
			'Do not put critical info in tooltip—use labels, helper text, or inline message',
			'No interactive or visual content inside (no links/buttons/icons)—use Popup or Modal',
			'Use Inline message for richer/longer content; Popup/Modal for interactive content',
		],
		contentGuidelines: [
			'Keep concise; do not repeat the visible label',
			'Use helpful, non-essential information only',
			'Icon button and link icon button have their own content guidelines',
		],
		accessibilityGuidelines: [
			'Use only on interactive elements (keyboard focusable; screen reader can reach them)',
			'Never use tooltips on disabled elements',
			'Do not put critical information in tooltips—use visible labels, helper text, or inline message',
			'No links, buttons, or icons inside tooltip—use Popup or Modal for interactive content',
			'Keyboard shortcuts shown in tooltip are not exposed to assistive tech—provide an alternative (e.g. panel, dialog)',
			'Ensure tooltip content is announced by screen readers',
			'Provide keyboard access (hover + focus trigger)',
		],
		keywords: ['tooltip', 'hint', 'help', 'floating', 'label', 'explanation'],
		category: 'overlays-and-layering',
		examples: [
			'import Button from \'@atlaskit/button/new\';\nimport Tooltip from \'@atlaskit/tooltip\';\nexport default function DefaultTooltipExample(): React.JSX.Element {\n\treturn (\n\t\t<Tooltip content="This is a tooltip" testId="default-tooltip">\n\t\t\t{(tooltipProps) => <Button {...tooltipProps}>Hover over me</Button>}\n\t\t</Tooltip>\n\t);\n}',
		],
		props: [
			{
				name: 'canAppear',
				type: '() => boolean',
				description:
					'Whether or not the tooltip can be displayed. Once a tooltip\nis scheduled to be displayed, or is already displayed, it will\ncontinue to be shown.\n\n@description\n\n`canAppear()` is called in response to user events, and\nnot during the rendering of components.',
			},
			{
				name: 'children',
				type: 'React.ReactNode | ((props: TriggerProps) => React.ReactNode)',
				description:
					'Elements to be wrapped by the tooltip.\nIt can be either a:\n1. `ReactNode`\n2. Function which returns a `ReactNode`',
				isRequired: true,
			},
			{
				name: 'component',
				type: 'React.ComponentType<TooltipPrimitiveProps> | React.ForwardRefExoticComponent<Omit<TooltipPrimitiveProps, "ref"> & React.RefAttributes<HTMLDivElement>>',
				description:
					'Extend `TooltipPrimitive` to create your own tooltip and pass it as component.',
			},
			{
				name: 'content',
				type: 'React.ReactNode | (({ update }: { update?: () => void; }) => React.ReactNode)',
				description:
					'The content of the tooltip. It can be either a:\n1. `ReactNode`\n2. Function which returns a `ReactNode`\nThe benefit of the second approach is that it allows you to consume the `update` render prop.\nThis `update` function can be called to manually recalculate the position of the tooltip.\n\nThis content will be rendered into two places:\n1. Into the tooltip\n2. Into a hidden element for screen readers (unless `isScreenReaderAnnouncementDisabled` is set to `true`)',
				isRequired: true,
			},
			{
				name: 'delay',
				type: 'number',
				description:
					'Time in milliseconds to wait before showing and hiding the tooltip. Defaults to 300.',
				defaultValue: '300',
			},
			{
				name: 'hideTooltipOnClick',
				type: 'boolean',
				description:
					'Hide the tooltip when the click event is triggered. Use this when the tooltip should be hidden if `onClick` react synthetic event\nis triggered, which happens after `onMouseDown` event.',
				defaultValue: 'false',
			},
			{
				name: 'hideTooltipOnMouseDown',
				type: 'boolean',
				description:
					'Hide the tooltip when the mousedown event is triggered. This should be\nused when tooltip should be hidden if `onMouseDown` react synthetic event\nis triggered, which happens before `onClick` event.',
				defaultValue: 'false',
			},
			{
				name: 'ignoreTooltipPointerEvents',
				type: 'boolean',
				description:
					'Adds `pointer-events: none` to the tooltip itself. Setting this to true will also prevent the tooltip from persisting when hovered.',
				defaultValue: 'false',
			},
			{
				name: 'isScreenReaderAnnouncementDisabled',
				type: 'boolean',
				description:
					'By default tooltip content will be duplicated into a hidden element so\nit can be read out by a screen reader. Sometimes this is not ideal as\nit can result in the same content be announced twice. For those situations,\nyou can leverage this prop to disable the duplicate hidden text.',
				defaultValue: 'false',
			},
			{
				name: 'mousePosition',
				type: 'AutoPlacement | BasePlacement | VariationPlacement',
				description:
					'Where the tooltip should appear relative to the mouse pointer.\nOnly use this when the `position` prop is set to `"mouse"`, `"mouse-y"`, or `"mouse-x"`.\nWhen interacting with the target element using a keyboard, it will use this position against the target element instead.',
				defaultValue: '"bottom"',
			},
			{
				name: 'onHide',
				type: '(analyticsEvent: UIAnalyticsEvent) => void',
				description:
					"Function to be called when the tooltip will be hidden. It's called after the\ndelay, when the tooltip begins to animate out.",
				defaultValue: 'noop',
			},
			{
				name: 'onShow',
				type: '(analyticsEvent: UIAnalyticsEvent) => void',
				description:
					"Function to be called when the tooltip will be shown. It's called when the\ntooltip begins to animate in.",
				defaultValue: 'noop',
			},
			{
				name: 'position',
				type: 'Placement | "mouse" | "mouse-y" | "mouse-x"',
				description:
					'Where the tooltip should appear relative to its target.\nIf set to `"mouse"`, the tooltip will display next to the mouse pointer instead.\nIf set to `"mouse-y"`, the tooltip will use the mouse Y coordinate but the target X coordinate.\nIf set to `"mouse-x"`, the tooltip will use the mouse X coordinate but the target Y coordinate.\nMake sure to utilize the `mousePosition` if you want to customize where the tooltip will show in relation to the mouse.',
				defaultValue: '"bottom"',
			},
			{
				name: 'shortcut',
				type: 'string[]',
				description:
					'Display a keyboard shortcut in the tooltip.\n\nKeys will be displayed as individual keyboard key segments after the tooltip content.',
			},
			{
				name: 'strategy',
				type: '"fixed" | "absolute"',
				description: 'Use this to define the strategy of popper.',
				defaultValue: '"fixed"',
			},
			{
				name: 'tag',
				type: 'keyof JSX.IntrinsicElements | React.ComponentType<React.AllHTMLAttributes<HTMLElement> & { ref: React.Ref<HTMLElement>; }> | React.ForwardRefExoticComponent<...>',
				description:
					'Replace the wrapping element. This accepts the name of a html tag which will\nbe used to wrap the element.\nIf you provide a component, it needs to support a ref prop which is used by popper for positioning.',
			},
		],
	},
	{
		name: 'VisuallyHidden',
		package: '@atlaskit/visually-hidden',
		description:
			'Content hidden from sight but available to screen readers. Use when meaning is clear visually but not to assistive technology.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when meaning is clear visually but not to assistive technology',
			'Avoid clutter—verbose screen-reader-only text can be more harmful than helpful',
			'Use the role prop for semantic meaning when needed',
		],
		contentGuidelines: [
			'Use clear, descriptive hidden content',
			'Ensure content adds value for screen readers',
			'Keep content concise but meaningful',
		],
		accessibilityGuidelines: [
			'Use for screen reader only content when visual context is insufficient for AT',
			'Use role prop for semantic meaning when appropriate',
			'Balance clarity with brevity—avoid overwhelming screen reader users',
			'Prefer over aria-label in some cases when screen readers need to translate or announce full phrasing',
		],
		keywords: ['hidden', 'accessibility', 'screen-reader', 'aria', 'utility'],
		category: 'utility',
		examples: [
			"import VisuallyHidden from '@atlaskit/visually-hidden';\nexport default (): React.JSX.Element => {\n\treturn (\n\t\t<div  style={{ border: '1px solid black' }}>\n\t\t\tThere is text hidden between the brackets [<VisuallyHidden>Can't see me!</VisuallyHidden>]\n\t\t</div>\n\t);\n};",
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'The element or elements that should be hidden.',
				isRequired: true,
			},
			{
				name: 'id',
				type: 'string',
				description:
					'An id may be appropriate for this component if used in conjunction with `aria-describedby`\non a paired element.',
			},
			{
				name: 'role',
				type: 'string',
				description: 'An ARIA role attribute to aid screen readers.',
			},
		],
	},
];

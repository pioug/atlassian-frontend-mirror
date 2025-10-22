/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates TypeScript components data for AI tooling from offerings.json files
 *
 * @codegen <<SignedSource::1792e8b918fbdc85769f6ddf38970c58>>
 * @codegenCommand yarn workspace @af/ads-ai-tooling codegen:prototyping
 */
import type { Component } from './types';

export const components: Component[] = [
	{
		name: 'Avatar',
		package: '@atlaskit/avatar',
		keywords: ['avatar', 'user', 'profile', 'image', 'presence', 'status', 'representation'],
		category: 'images',
		description:
			'A component for displaying user avatars with support for images, initials, and status indicators. An avatar is a visual representation of a user or entity. It can display user images, initials, presence indicators, and status indicators. Avatars help users quickly identify people and entities in your application. They provide visual context and make interfaces more personal and engaging.',
		status: 'general-availability',
		examples: [
			'import Avatar from \'@atlaskit/avatar\';\nexport default [\n\t<Avatar src="https://example.com/avatar.jpg" name="John Doe" />,\n\t<Avatar name="Jane Smith" appearance="hexagon" size="large" status="locked" />,\n\t<Avatar name="Bob Wilson" appearance="square" size="small" presence="online" status="approved" />,\n];',
		],
		usageGuidelines: [
			'Use consistent sizing within the same context',
			'Place avatars in logical groupings (e.g., team members)',
			'Use presence indicators sparingly for real-time status only',
			'Use status indicators for approval/permission states',
			'Provide fallback initials when images fail to load',
			'Use avatars to represent users, teams, projects, or any other entity that needs visual identification',
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
		props: [
			{
				name: 'appearance',
				description:
					"Indicates the shape of the avatar. Most avatars are circular, but square avatars\ncan be used for 'container' objects.",
				type: '"circle" | "square" | "hexagon"',
			},
			{
				name: 'as',
				description:
					'Replace the wrapping element. This accepts the name of a html tag which will\nbe used to wrap the element.',
				type: 'keyof global.JSX.IntrinsicElements | ComponentType<AllHTMLAttributes<HTMLElement>>',
			},
			{
				name: 'borderColor',
				description:
					'Used to override the default border color around the avatar body.\nAccepts any color argument that the border-color CSS property accepts.',
				type: 'string',
			},
			{
				name: 'children',
				description: 'Supply a custom avatar component instead of the default.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'href',
				description: 'Provides a url for avatars being used as a link.',
				type: 'string',
			},
			{
				name: 'imgLoading',
				description: 'Defines the loading behaviour of the avatar image. Default value is eager.',
				type: '"lazy" | "eager"',
			},
			{
				name: 'isDecorative',
				description: 'whether disable aria-labelledby for avatar img',
				type: 'boolean',
			},
			{
				name: 'isDisabled',
				description: 'Change the style to indicate the avatar is disabled.',
				type: 'boolean',
			},
			{
				name: 'label',
				description:
					'Used to provide custom content to screen readers.\nStatus or presence is not added to the label by default if it passed as nodes.\nIf status or presence is passed as a string, the default content format is "John Smith (online)".',
				type: 'string',
			},
			{
				name: 'name',
				description: 'Provides alt text for the avatar image.',
				type: 'string',
			},
			{
				name: 'onClick',
				description: 'Handler to be called on click.',
				type: '(event: MouseEvent<Element, globalThis.MouseEvent>, analyticsEvent?: UIAnalyticsEvent) => void',
			},
			{
				name: 'presence',
				description:
					"Indicates a user's online status by showing a small icon on the avatar.\nRefer to presence values on the presence component.\nAlternatively accepts any React element. For best results, it is recommended to\nuse square content with height and width of 100%.",
				type: 'Presence | Omit<ReactNode, string> | (string & {})',
			},
			{
				name: 'size',
				description:
					"Defines the size of the avatar. Default value is `medium`.\n\nThis can also be controlled by the `size` property of the\n`AvatarContext` export from this package. If no prop is given when the\n`size` is set via this context, the context's value will be used.",
				type: '"small" | "xsmall" | "medium" | "large" | "xlarge" | "xxlarge"',
			},
			{
				name: 'src',
				description: 'A url to load an image from (this can also be a base64 encoded image).',
				type: 'string',
			},
			{
				name: 'stackIndex',
				description: 'The index of where this avatar is in the group `stack`.',
				type: 'number',
			},
			{
				name: 'status',
				description:
					'Indicates contextual information by showing a small icon on the avatar.\nRefer to status values on the Status component.',
				type: 'Omit<ReactNode, string> | (string & {}) | Status',
			},
			{
				name: 'tabIndex',
				description: 'Assign specific tabIndex order to the underlying node.',
				type: 'number',
			},
			{
				name: 'target',
				description: 'Pass target down to the anchor, if href is provided.',
				type: '"_blank" | "_self" | "_top" | "_parent"',
			},
		],
	},
	{
		name: 'AvatarGroup',
		package: '@atlaskit/avatar-group',
		keywords: ['avatar', 'group', 'multiple', 'users', 'team', 'overlap'],
		category: 'data-display',
		description:
			'A component for displaying multiple avatars in a group with overlap and overflow handling.',
		status: 'general-availability',
		examples: [
			"import AvatarGroup from '@atlaskit/avatar-group';\nexport default [\n\t<AvatarGroup\n\t\tappearance=\"stack\"\n\t\tsize=\"large\"\n\t\tonAvatarClick={console.log}\n\t\tdata={[\n\t\t\t{ key: 'uid1', name: 'Bob Smith' },\n\t\t\t{ key: 'uid2', name: 'Design System Team', appearance: 'square' },\n\t\t\t{ key: 'uid3', name: 'Review Agent', appearance: 'hexagon' },\n\t\t\t{ key: 'uid4', name: 'Carol Davis' },\n\t\t]}\n\t\tmaxCount={3}\n\t/>,\n];",
		],
		accessibilityGuidelines: [
			'Provide clear labels for avatar groups',
			'Use appropriate overflow handling',
			'Ensure keyboard navigation support',
			'Provide clear user identification',
		],
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
		props: [
			{
				name: 'appearance',
				description:
					'Indicates the layout of the avatar group.\nAvatars will either be overlapped in a stack, or\nlaid out in an even grid formation.\nDefaults to "stack".',
				type: '"grid" | "stack"',
			},
			{
				name: 'avatar',
				description: 'Component used to render each avatar.',
				type: 'React.ForwardRefExoticComponent<AvatarPropTypes & React.RefAttributes<HTMLElement>> | React.ElementType<AvatarProps>',
			},
			{
				name: 'borderColor',
				description:
					'Typically the background color that the avatar is presented on.\nAccepts any color argument that the CSS border-color property accepts.',
				type: 'string',
			},
			{
				name: 'boundariesElement',
				description: 'Element the overflow popup should be attached to.\nDefaults to "viewport".',
				type: '"viewport" | "window" | "scrollParent"',
			},
			{
				name: 'data',
				description:
					"An array of avatar prop data, that are spread onto each `avatar` component.\n\nFor further usage information on AvatarPropTypes, the supported props for `avatar`, refer to [Avatar's prop documentation](https://atlassian.design/components/avatar/code).",
				type: '(AvatarPropTypes & { name: string; key?: string | number; })[]',
			},
			{
				name: 'isTooltipDisabled',
				description: 'Disables tooltips.',
				type: 'boolean',
			},
			{
				name: 'label',
				description:
					'Text to be used as aria-label for the list of avatars.\nScreen reader announcement with default label, which is `avatar group`, is `list, avatar group, X items`.\n\nThe label should describe the `AvatarGroup`\'s entities, for instance:\n- `label="team members"`, screen reader announcement would be `list team members, X items`\n- `label="reviewers"` screen reader announcement would be `list reviewers, X items`\n\nWhen there are several AvatarGroups on the page you should use a unique label to let users distinguish different lists.',
				type: 'string',
			},
			{
				name: 'maxCount',
				description:
					'The maximum number of avatars allowed in the list.\nDefaults to 5 when displayed as a stack,\nand 11 when displayed as a grid.',
				type: 'number',
			},
			{
				name: 'moreIndicatorLabel',
				description:
					'Text to be used as aria-label for the more indicator.\nIf provided, this will be used exactly as-is for the aria-label.\nIf not provided, but an `aria-label` is provided via `showMoreButtonProps`, that will be used instead.\nIf neither is provided, the aria-label will default to "N more people" where N is the number of people that are not visible (e.g. "5 more people").',
				type: 'string',
			},
			{
				name: 'onAvatarClick',
				description:
					'Handle the click event on the avatar item.\nNote that if an onClick prop is provided as part of avatar data, it will take precedence over onAvatarClick.',
				type: '(event: React.MouseEvent<Element, MouseEvent>, analyticsEvent: AnalyticsEvent, index: number) => void',
			},
			{
				name: 'onMoreClick',
				description:
					'Take control of the click event on the more indicator.\nThis will cancel the default dropdown behavior.',
				type: '(event: React.MouseEvent<Element, MouseEvent>) => void',
			},
			{
				name: 'overrides',
				description: 'Custom overrides for the composed components.',
				type: 'AvatarGroupOverrides',
			},
			{
				name: 'shouldPopupRenderToParent',
				description: "Determines whether the 'show more' popup has `shouldRenderToParent` applied.",
				type: 'boolean',
			},
			{
				name: 'showMoreButtonProps',
				description:
					'Provide additional props to the MoreButton.\nExample use cases: altering tab order by providing tabIndex;\nadding onClick behaviour without losing the default dropdown',
				type: '{ defaultChecked?: boolean; defaultValue?: string | number | readonly string[]; suppressContentEditableWarning?: boolean; suppressHydrationWarning?: boolean; accessKey?: string; autoFocus?: boolean; ... 258 more ...; onTransitionEndCapture?: React.TransitionEventHandler<...>; }',
			},
			{
				name: 'size',
				description:
					'Defines the size of the avatar.\nDefaults to "medium".\n\nNote: The "xsmall" size that exists on Avatar is not supported here because elements such as the more indicator cannot be displayed in an accessible manner at that size.',
				type: '"small" | "medium" | "large" | "xlarge" | "xxlarge"',
			},
			{
				name: 'tooltipPosition',
				description:
					'Where the tooltip should appear relative to its target.\nDefaults to tooltip position "bottom".',
				type: '"top" | "bottom"',
			},
		],
	},
	{
		name: 'Badge',
		package: '@atlaskit/badge',
		keywords: ['badge', 'indicator', 'numeric', 'tally', 'score', 'count', 'status'],
		category: 'status-indicators',
		description:
			'A badge is a visual indicator for numeric values such as tallies and scores, providing quick visual feedback.',
		status: 'general-availability',
		examples: [
			'import Badge from \'@atlaskit/badge\';\nexport default [\n\t<Badge appearance="primary">5</Badge>,\n\t<Badge appearance="important" max={99}>\n\t\t150\n\t</Badge>,\n];',
		],
		accessibilityGuidelines: [
			'Ensure badge content is announced by screen readers',
			'Use appropriate color contrast for text readability',
			'Provide meaningful context for numeric values',
			'Consider alternative text for non-numeric badges',
		],
		usageGuidelines: [
			'Use for displaying counts, scores, or status indicators',
			'Keep badge content concise and meaningful',
			'Use appropriate appearance variants for different contexts',
			'Position badges near relevant content',
			'Consider maximum value display limits',
		],
		contentGuidelines: [
			'Use clear, concise numeric or text values',
			'Ensure values are meaningful to users',
			'Consider localization for number formatting',
			'Use consistent formatting across similar badges',
		],
		props: [
			{
				name: 'appearance',
				description: 'Affects the visual style of the badge.',
				type: '"added" | "default" | "important" | "primary" | "primaryInverted" | "removed"',
			},
			{
				name: 'children',
				description:
					'The value displayed within the badge. A `ReactNode` can be provided for\ncustom-formatted numbers, however, badge should only be used in cases where you want to represent\na number.\nUse a [lozenge](/packages/design-system/lozenge) for non-numeric information.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'max',
				description:
					'The maximum value to display. Defaults to `99`. If the value is 100, and max is 50, "50+" will be displayed.\nThis value should be greater than 0. If set to `false` the original value will be displayed regardless of\nwhether it is larger than the default maximum value.',
				type: 'number | false',
			},
		],
	},
	{
		name: 'Banner',
		package: '@atlaskit/banner',
		keywords: ['banner', 'message', 'notification', 'alert', 'prominent', 'top', 'screen'],
		category: 'messaging',
		description:
			'A banner displays a prominent message at the top of the screen to communicate important information to users.',
		status: 'general-availability',
		examples: [
			'import Banner from \'@atlaskit/banner\';\nimport WarningIcon from \'@atlaskit/icon/glyph/warning\';\nimport Box from \'@atlaskit/primitives/box\';\nexport default () => (\n\t<Box>\n\t\t<Banner\n\t\t\ticon={<WarningIcon label="Warning" secondaryColor="inherit" size="medium" />}\n\t\t\ttestId="basicTestId"\n\t\t>\n\t\t\tYour license is about to expire. Please renew your license within the next week.\n\t\t</Banner>\n\t</Box>\n);',
		],
		accessibilityGuidelines: [
			'Ensure banner content is announced by screen readers',
			'Use appropriate color contrast for text readability',
			'Provide clear, actionable messaging',
			'Consider keyboard navigation for interactive banners',
		],
		usageGuidelines: [
			'Use for important messages that need immediate attention',
			'Place at the top of the screen for maximum visibility',
			'Keep messaging concise and actionable',
			'Use appropriate appearance variants for different message types',
			'Consider dismissibility for non-critical messages',
		],
		contentGuidelines: [
			'Write clear, concise messages',
			'Use action-oriented language when appropriate',
			'Ensure messages are relevant to the current context',
			'Provide clear next steps when needed',
		],
		props: [
			{
				name: 'appearance',
				description: 'Visual style to be used for the banner',
				type: '"warning" | "error" | "announcement"',
			},
			{
				name: 'children',
				description:
					'Content to be shown next to the icon. Typically text content but can contain links.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'icon',
				description:
					'Icon to be shown left of the main content. Typically an Atlaskit [@atlaskit/icon](packages/design-system/icon)',
				type: 'ReactElement<any, string | JSXElementConstructor<any>>',
			},
		],
	},
	{
		name: 'Blanket',
		package: '@atlaskit/blanket',
		keywords: ['blanket', 'overlay', 'backdrop', 'modal', 'layer'],
		category: 'overlay',
		description:
			'A component for creating overlay backgrounds behind modals and other layered content.',
		status: 'general-availability',
		examples: [
			"import Blanket from '@atlaskit/blanket';\nexport default [\n\t<Blanket />,\n\t<Blanket isTinted onBlanketClicked={() => console.log('Blanket clicked')} />,\n];",
		],
		accessibilityGuidelines: [
			"Ensure blanket doesn't interfere with focus management",
			'Provide appropriate click handling for dismissal',
			'Consider screen reader experience with overlays',
		],
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
		props: [
			{
				name: 'children',
				description: 'The children to be rendered within the blanket.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'isTinted',
				description: 'Sets whether the blanket has a tinted background color.',
				type: 'boolean',
			},
			{
				name: 'onBlanketClicked',
				description: 'Handler function to be called when the blanket is clicked.',
				type: '(event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'shouldAllowClickThrough',
				description:
					'Whether mouse events can pass through the blanket. If `true`, `onBlanketClicked` will not be called.',
				type: 'boolean',
			},
		],
	},
	{
		name: 'Breadcrumbs',
		package: '@atlaskit/breadcrumbs',
		keywords: ['breadcrumbs', 'navigation', 'hierarchy', 'path', 'location'],
		category: 'navigation',
		description: 'A navigation component showing the current page hierarchy.',
		status: 'general-availability',
		examples: [
			'import Breadcrumbs, { BreadcrumbsItem } from \'@atlaskit/breadcrumbs\';\nexport default [\n\t<Breadcrumbs maxItems={3}>\n\t\t<BreadcrumbsItem href="/" text="Home" />\n\t\t<BreadcrumbsItem href="/category" text="Category" />\n\t\t<BreadcrumbsItem href="/category/products" text="Products" />\n\t\t<BreadcrumbsItem text="Current Page" />\n\t</Breadcrumbs>,\n];',
		],
		accessibilityGuidelines: [
			'Provide clear navigation labels',
			'Use appropriate ARIA landmarks',
			'Ensure keyboard navigation support',
			'Provide clear path context',
		],
		usageGuidelines: [
			'Use to show page hierarchy',
			'Keep breadcrumb labels concise',
			'Consider truncation for long paths',
			'Use appropriate separators',
		],
		contentGuidelines: [
			'Use clear, descriptive page labels',
			'Keep labels concise but meaningful',
			'Use consistent naming conventions',
			'Consider user understanding of hierarchy',
		],
		props: [
			{
				name: 'children',
				description: 'The items to be included inside the Breadcrumbs wrapper.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'defaultExpanded',
				description: '',
				type: 'boolean',
			},
			{
				name: 'ellipsisLabel',
				description: 'Text to be used as an accessible label for the ellipsis button.',
				type: 'string',
			},
			{
				name: 'isExpanded',
				description:
					'Override collapsing of the nav when there are more than the maximum number of items.',
				type: 'boolean',
			},
			{
				name: 'itemsAfterCollapse',
				description: 'If max items is exceeded, the number of items to show after the ellipsis.',
				type: 'number',
			},
			{
				name: 'itemsBeforeCollapse',
				description: 'If max items is exceeded, the number of items to show before the ellipsis.',
				type: 'number',
			},
			{
				name: 'label',
				description: 'Text to be used as label of navigation region that wraps the breadcrumbs.',
				type: 'string',
			},
			{
				name: 'maxItems',
				description:
					'Set the maximum number of breadcrumbs to display. When there are more\nthan the maximum number, only the first and last will be shown, with an\nellipsis in between.',
				type: 'number',
			},
			{
				name: 'onExpand',
				description:
					'A function to be called when you are in the collapsed view and click the ellipsis.',
				type: '(event: MouseEvent<Element, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
			},
		],
	},
	{
		name: 'Button',
		package: '@atlaskit/button/new',
		keywords: ['button', 'action', 'click', 'submit', 'form', 'interactive', 'cta'],
		category: 'form',
		description:
			'A versatile button component with multiple appearances and states for triggering actions. A button triggers an event or action. They let users know what will happen next. Note the root entrypoint of `@atlaskit/button` is deprecated and being replaced with `@atlaskit/button/new`.',
		status: 'general-availability',
		examples: [
			'import Button from \'@atlaskit/button/new\';\nexport default function ButtonDisabledExample() {\n\treturn (\n\t\t<Button appearance="primary" isDisabled>\n\t\t\tDisabled button\n\t\t</Button>\n\t);\n}',
			'import Button from \'@atlaskit/button/new\';\nexport default function ButtonDangerExample() {\n\treturn <Button appearance="danger">Danger button</Button>;\n}',
			"import Button from '@atlaskit/button/new';\nimport StarIcon from '@atlaskit/icon/core/star-starred';\nexport default function ButtonIconAfterExample() {\n\treturn (\n\t\t<Button iconAfter={StarIcon} appearance=\"primary\">\n\t\t\tIcon after\n\t\t</Button>\n\t);\n}",
		],
		accessibilityGuidelines: [
			'Always provide meaningful labels for screen readers',
			'Provide loading state announcements for async actions',
		],
		usageGuidelines: [
			'Use primary buttons for the main action on a page',
			'Limit to one primary button per section',
			'Use subtle buttons for secondary actions',
			'Use danger buttons sparingly for destructive actions',
			'Group related buttons together with ButtonGroup',
		],
		contentGuidelines: [
			'Use action verbs that describe the interaction',
			'Keep text concise (1-3 words ideal)',
			'Avoid generic terms like "Submit" or "Click here"',
			'Use sentence case',
			'Use buttons for actions, links for navigation',
			'Only include one primary call to action (CTA) per area',
			"Start with the verb and specify what's being acted on",
			"Don't use punctuation in button labels",
		],
		props: [
			{
				name: 'appearance',
				description: 'The button style variation.',
				type: '"default" | "danger" | "primary" | "subtle" | "warning" | "discovery"',
			},
			{
				name: 'autoFocus',
				description: 'Set the button to autofocus on mount.',
				type: 'boolean',
			},
			{
				name: 'children',
				description: 'Text content to be rendered in the button.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'iconAfter',
				description: "Places an icon within the button, after the button's text.",
				type: 'ComponentClass<Omit<IconProps, "size"> | Omit<NewIconProps, "spacing" | "size">, any> | FunctionComponent<Omit<IconProps, "size"> | Omit<...>>',
			},
			{
				name: 'iconBefore',
				description: "Places an icon within the button, before the button's text.",
				type: 'ComponentClass<Omit<IconProps, "size"> | Omit<NewIconProps, "spacing" | "size">, any> | FunctionComponent<Omit<IconProps, "size"> | Omit<...>>',
			},
			{
				name: 'isDisabled',
				description: 'Disable the button to prevent user interaction.',
				type: 'boolean',
			},
			{
				name: 'isLoading',
				description: 'Conditionally show a spinner over the top of a button',
				type: 'boolean',
			},
			{
				name: 'isSelected',
				description: 'Indicates that the button is selected.',
				type: 'boolean',
			},
			{
				name: 'onBlur',
				description: 'Handler called on blur.',
				type: '(event: FocusEvent<HTMLButtonElement, Element>) => void',
			},
			{
				name: 'onClick',
				description:
					'Handler called on click. You can use the second argument to fire Atlaskit analytics events on custom channels. They could then be routed to GASv3 analytics. See the pressable or anchor primitive code examples for information on [firing Atlaskit analytics events](https://atlassian.design/components/primitives/pressable/examples#atlaskit-analytics) or [routing these to GASv3 analytics](https://atlassian.design/components/primitives/pressable/examples#gasv3-analytics).',
				type: '(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'onFocus',
				description: 'Handler called on focus.',
				type: '(event: FocusEvent<HTMLButtonElement, Element>) => void',
			},
			{
				name: 'shouldFitContainer',
				description: 'Option to fit button width to its parent width.',
				type: 'boolean',
			},
			{
				name: 'spacing',
				description: 'Controls the amount of padding in the button.',
				type: '"compact" | "default"',
			},
		],
	},
	{
		name: 'IconButton',
		package: '@atlaskit/button/new',
		keywords: ['button', 'icon', 'action', 'click', 'interactive', 'toolbar'],
		category: 'form',
		description:
			'A button that displays only an icon with an optional tooltip. Perfect for toolbar actions, compact interfaces, and when space is limited.',
		status: 'general-availability',
		examples: [
			'import { IconButton } from \'@atlaskit/button/new\';\nimport AddIcon from \'@atlaskit/icon/core/add\';\nimport DeleteIcon from \'@atlaskit/icon/core/delete\';\nimport InfoIcon from \'@atlaskit/icon/core/status-information\';\nexport default [\n\t<IconButton icon={AddIcon} label="Add new item" appearance="primary" />,\n\t<IconButton icon={InfoIcon} label="Show information" appearance="subtle" spacing="compact" />,\n\t<IconButton icon={DeleteIcon} label="Delete permanently" appearance="discovery" shape="circle" />,\n];',
		],
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
		props: [
			{
				name: 'appearance',
				description: 'The button style variation.\nThe button style variation.',
				type: '"default" | "primary" | "discovery" | "subtle"',
			},
			{
				name: 'autoFocus',
				description: 'Set the button to autofocus on mount.',
				type: 'boolean',
			},
			{
				name: 'icon',
				description: 'Places an icon within the button.',
				type: 'ComponentClass<Omit<IconProps, "size"> | Omit<NewIconProps, "spacing" | "size">, any> | FunctionComponent<Omit<IconProps, "size"> | Omit<...>>',
			},
			{
				name: 'isDisabled',
				description: 'Disable the button to prevent user interaction.',
				type: 'boolean',
			},
			{
				name: 'isLoading',
				description: 'Conditionally show a spinner over the top of a button',
				type: 'boolean',
			},
			{
				name: 'isSelected',
				description: 'Indicates that the button is selected.',
				type: 'boolean',
			},
			{
				name: 'isTooltipDisabled',
				description:
					'Prevents a tooltip with the label text from showing. Use sparingly, as most icon-only buttons benefit from a tooltip or some other text clarifying the action.',
				type: 'boolean',
			},
			{
				name: 'label',
				description: 'Provide an accessible label, often used by screen readers.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'onBlur',
				description: 'Handler called on blur.',
				type: '(event: FocusEvent<HTMLButtonElement, Element>) => void',
			},
			{
				name: 'onClick',
				description:
					'Handler called on click. You can use the second argument to fire Atlaskit analytics events on custom channels. They could then be routed to GASv3 analytics. See the pressable or anchor primitive code examples for information on [firing Atlaskit analytics events](https://atlassian.design/components/primitives/pressable/examples#atlaskit-analytics) or [routing these to GASv3 analytics](https://atlassian.design/components/primitives/pressable/examples#gasv3-analytics).',
				type: '(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'onFocus',
				description: 'Handler called on focus.',
				type: '(event: FocusEvent<HTMLButtonElement, Element>) => void',
			},
			{
				name: 'shape',
				description: 'Set the shape of the icon, defaults to square with rounded corners.',
				type: '"default" | "circle"',
			},
			{
				name: 'spacing',
				description: 'Controls the amount of padding in the button.',
				type: '"default" | "compact"',
			},
			{
				name: 'tooltip',
				description: 'Props passed down to the Tooltip component.',
				type: '{ testId?: string; analyticsContext?: Record<string, any>; content?: ReactNode | (({ update }: { update?: () => void; }) => ReactNode); component?: ComponentType<TooltipPrimitiveProps> | ForwardRefExoticComponent<...>; ... 13 more ...; shortcut?: string[]; }',
			},
		],
	},
	{
		name: 'SplitButton',
		package: '@atlaskit/button/new',
		keywords: ['button', 'split', 'dropdown', 'menu', 'action', 'options'],
		category: 'form',
		description:
			'A button that splits into a primary action and a dropdown menu. The main button performs the primary action, while the dropdown arrow reveals additional related actions.',
		status: 'general-availability',
		examples: [
			"import Button, { IconButton, SplitButton } from '@atlaskit/button/new';\nimport DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';\nimport ChevronDownIcon from '@atlaskit/icon/core/chevron-down';\nexport default (\n\t<SplitButton spacing=\"compact\">\n\t\t<Button>Link work item</Button>\n\t\t<DropdownMenu\n\t\t\tshouldRenderToParent\n\t\t\ttrigger={({ triggerRef, ...triggerProps }) => (\n\t\t\t\t<IconButton\n\t\t\t\t\tref={triggerRef}\n\t\t\t\t\t{...triggerProps}\n\t\t\t\t\ticon={ChevronDownIcon}\n\t\t\t\t\tlabel=\"More link work item options\"\n\t\t\t\t/>\n\t\t\t)}\n\t\t>\n\t\t\t<DropdownItemGroup>\n\t\t\t\t<DropdownItem>Create new link</DropdownItem>\n\t\t\t\t<DropdownItem>Link existing item</DropdownItem>\n\t\t\t</DropdownItemGroup>\n\t\t</DropdownMenu>\n\t</SplitButton>\n);",
		],
		accessibilityGuidelines: ['Provide descriptive labels for the IconButton trigger'],
		usageGuidelines: [
			'Always must have exactly two children: `Button` and `DropdownMenu` that are related to each other',
			'Use `shouldRenderToParent` on `DropdownMenu` for proper positioning',
			'Make the primary action the most common or important action',
			'Limit dropdown items to avoid overwhelming users',
		],
		contentGuidelines: [
			'Use clear, action-oriented text for the primary button',
			'Keep dropdown item labels concise and descriptive',
			'Use consistent terminology across related actions',
		],
		props: [
			{
				name: 'appearance',
				description:
					'The style variation for child buttons. Will override any appearance set on a child button.',
				type: '"default" | "primary"',
			},
			{
				name: 'children',
				description:
					'Only two children are allowed.\nFirst child is the primary action, second child is the secondary action.\nThe assumption is that for both children trees there is a button reading the context.',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
			},
			{
				name: 'isDisabled',
				description: 'Whether all child buttons should be disabled.',
				type: 'boolean',
			},
			{
				name: 'spacing',
				description: 'Controls the amount of padding in the child buttons.',
				type: '"default" | "compact"',
			},
		],
	},
	{
		name: 'LinkButton',
		package: '@atlaskit/button/new',
		keywords: ['button', 'link', 'navigation', 'href', 'anchor'],
		category: 'form',
		description:
			'A button that renders as an anchor tag for navigation. Combines the visual appearance of a button with the semantic behavior of a link.',
		status: 'general-availability',
		examples: [
			'import { LinkButton } from \'@atlaskit/button/new\';\nexport default [\n\t<LinkButton href="https://atlassian.com" target="_blank" appearance="subtle">\n\t\tExternal Link\n\t</LinkButton>,\n\t// With a Router (requires `<AppProvider routerLinkComponent={Link} />` setup at the root)\n\t<LinkButton href={{ to: \'/about\', replace: true }}>About Page</LinkButton>,\n];',
		],
		usageGuidelines: [
			'Use for navigation actions that change the URL',
			'Use for external links and internal navigation',
			"Consider using regular buttons for actions that don't navigate",
			'Provide clear visual indication of link behavior',
			'Use consistent styling with other buttons when appropriate',
			'Use for navigation actions that should look like buttons but behave like links',
			'Perfect for external links, internal navigation, or any action that changes the URL',
		],
		contentGuidelines: [
			'Use clear, descriptive text that indicates the destination',
			'Be specific about where the link will take the user',
			'Use action-oriented language when appropriate',
			"Avoid generic terms like 'Click here' or 'Learn more'",
		],
		props: [
			{
				name: 'appearance',
				description: 'The button style variation.',
				type: '"default" | "danger" | "primary" | "subtle" | "warning" | "discovery"',
			},
			{
				name: 'autoFocus',
				description: 'Set the button to autofocus on mount.',
				type: 'boolean',
			},
			{
				name: 'children',
				description: 'Text content to be rendered in the button.',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'href',
				description:
					'Provides a URL for link buttons. When using an AppProvider with a configured router link component, a `RouterLinkConfig` object type can be provided for advanced usage. See the [Link Button routing example](/components/button/examples#routing) for more details.',
				type: 'string | RouterLinkConfig',
			},
			{
				name: 'iconAfter',
				description: "Places an icon within the button, after the button's text.",
				type: 'React.ComponentClass<Omit<IconProps, "size"> | Omit<NewIconProps, "size" | "spacing">, any> | React.FunctionComponent<Omit<IconProps, "size"> | Omit<...>>',
			},
			{
				name: 'iconBefore',
				description: "Places an icon within the button, before the button's text.",
				type: 'React.ComponentClass<Omit<IconProps, "size"> | Omit<NewIconProps, "size" | "spacing">, any> | React.FunctionComponent<Omit<IconProps, "size"> | Omit<...>>',
			},
			{
				name: 'isDisabled',
				description: 'Disable the button to prevent user interaction.',
				type: 'boolean',
			},
			{
				name: 'isSelected',
				description: 'Indicates that the button is selected.',
				type: 'boolean',
			},
			{
				name: 'onBlur',
				description: 'Handler called on blur.',
				type: '(event: React.FocusEvent<HTMLAnchorElement, Element>) => void',
			},
			{
				name: 'onClick',
				description:
					'Handler called on click. You can use the second argument to fire Atlaskit analytics events on custom channels. They could then be routed to GASv3 analytics. See the pressable or anchor primitive code examples for information on [firing Atlaskit analytics events](https://atlassian.design/components/primitives/pressable/examples#atlaskit-analytics) or [routing these to GASv3 analytics](https://atlassian.design/components/primitives/pressable/examples#gasv3-analytics).',
				type: '(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'onFocus',
				description: 'Handler called on focus.',
				type: '(event: React.FocusEvent<HTMLAnchorElement, Element>) => void',
			},
			{
				name: 'shouldFitContainer',
				description: 'Option to fit button width to its parent width.',
				type: 'boolean',
			},
			{
				name: 'spacing',
				description: 'Controls the amount of padding in the button.',
				type: '"compact" | "default"',
			},
		],
	},
	{
		name: 'ButtonGroup',
		package: '@atlaskit/button/button-group',
		keywords: ['button', 'group', 'container', 'layout', 'spacing'],
		category: 'form',
		description:
			'A component for grouping related buttons together with consistent spacing and alignment.',
		status: 'general-availability',
		examples: [
			'import { ButtonGroup } from \'@atlaskit/button\';\nimport Button from \'@atlaskit/button/new\';\nexport default [\n\t<ButtonGroup titleId="heading-options">\n\t\t<Button appearance="primary">Save</Button>\n\t\t<Button appearance="danger">Delete</Button>\n\t\t<Button appearance="subtle">Cancel</Button>\n\t</ButtonGroup>,\n];',
		],
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
		props: [
			{
				name: 'children',
				description: 'The buttons to render inside the button group.',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'label',
				description:
					'Refers to an `aria-label` attribute. Sets an accessible name for the button group wrapper to announce it to users of assistive technology.\nUsage of either this, or the `titleId` attribute is strongly recommended.',
				type: 'string',
			},
			{
				name: 'titleId',
				description:
					"ID referenced by the button group wrapper's `aria-labelledby` attribute. This ID should be assigned to the group-button title element.\nUsage of either this, or the `label` attribute is strongly recommended.",
				type: 'string',
			},
		],
	},
	{
		name: 'Button (Legacy)',
		package: '@atlaskit/button',
		keywords: ['button', 'legacy', 'deprecated', 'action', 'click', 'submit', 'form'],
		category: 'form',
		description:
			'Legacy button component (deprecated). Use Button from @atlaskit/button/new instead.',
		status: 'intent-to-deprecate',
		examples: [
			"import Button from '@atlaskit/button';\nexport default () => <Button>Button</Button>;",
		],
		accessibilityGuidelines: [
			'Always provide meaningful labels for screen readers',
			'Provide loading state announcements for async actions',
		],
		usageGuidelines: [
			'Use the new Button component from @atlaskit/button/new instead',
			'Migrate existing usage to the new Button API',
			'Consider this component deprecated',
		],
		contentGuidelines: [
			'Use action verbs that describe the interaction',
			'Keep text concise (1-3 words ideal)',
			"Avoid generic terms like 'Submit' or 'Click here'",
		],
		props: [
			{
				name: 'appearance',
				description: 'The base styling to apply to the button.',
				type: '"link" | "default" | "danger" | "primary" | "subtle" | "subtle-link" | "warning"',
			},
			{
				name: 'autoFocus',
				description: 'Set the button to autofocus on mount.',
				type: 'boolean',
			},
			{
				name: 'children',
				description: 'Text content to be rendered in the button.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'component',
				description: '',
				type: 'ComponentType<AllHTMLAttributes<HTMLElement>> | ElementType<any>',
			},
			{
				name: 'href',
				description: "Provides a URL that's used when the button is a link styled as a button.",
				type: 'string',
			},
			{
				name: 'iconAfter',
				description: "Places an icon within the button, after the button's text.",
				type: 'string | number | ReactElement<any, string | JSXElementConstructor<any>>',
			},
			{
				name: 'iconBefore',
				description: "Places an icon within the button, before the button's text.",
				type: 'string | number | ReactElement<any, string | JSXElementConstructor<any>>',
			},
			{
				name: 'isDisabled',
				description: 'Set if the button is disabled.',
				type: 'boolean',
			},
			{
				name: 'isSelected',
				description: 'Change the style to indicate the button is selected.',
				type: 'boolean',
			},
			{
				name: 'onBlur',
				description: 'Handler called on blur.',
				type: '(event: FocusEvent<HTMLElement, Element>) => void',
			},
			{
				name: 'onClick',
				description:
					'Handler called on click. The second argument can be used to track analytics data. See the tutorial in the analytics-next package for details.',
				type: '(e: MouseEvent<HTMLElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'onFocus',
				description: 'Handler called on focus.',
				type: '(event: FocusEvent<HTMLElement, Element>) => void',
			},
			{
				name: 'overlay',
				description:
					"Used to 'overlay' something over a button. This is commonly used to display a loading spinner.",
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'shouldFitContainer',
				description: 'Option to fit button width to its parent width.',
				type: 'boolean',
			},
			{
				name: 'spacing',
				description: 'Set the amount of padding in the button.',
				type: '"default" | "compact" | "none"',
			},
			{
				name: 'target',
				description:
					'Pass target down to the button. If a href is provided, this will be a semantic link styled as a button.',
				type: '"_self" | "_blank" | "_parent" | "_top" | (string & {})',
			},
			{
				name: 'type',
				description: 'Pass type down to the button.',
				type: '"submit" | "reset" | "button"',
			},
		],
	},
	{
		name: 'Calendar',
		package: '@atlaskit/calendar',
		keywords: ['calendar', 'date', 'picker', 'selection', 'month', 'year', 'beta'],
		category: 'form',
		description:
			"A calendar component for date selection and display. This component is in Beta phase, meaning it's stable at version 1.0+ but may receive improvements based on customer feedback.",
		status: 'general-availability',
		examples: [
			"import Calendar from '@atlaskit/calendar';\nexport default [\n\t<Calendar\n\t\tselected={['2024-03-15']}\n\t\tonChange={(dates) => console.log('Selected dates:', dates)}\n\t/>,\n\t<Calendar\n\t\tselected={['2024-03-20', '2024-03-21', '2024-03-22']}\n\t\tonChange={(dates) => console.log('Multiple dates:', dates)}\n\t\tdefaultMonth={3}\n\t\tdefaultYear={2024}\n\t/>,\n\t<Calendar\n\t\tselected={[]}\n\t\tdisabled={['2024-03-10', '2024-03-11']}\n\t\tminDate=\"2024-03-01\"\n\t\tmaxDate=\"2024-03-31\"\n\t\tonChange={(dates) => console.log('Constrained dates:', dates)}\n\t/>,\n];",
		],
		accessibilityGuidelines: [
			'Provide clear date selection feedback',
			'Ensure keyboard navigation between dates',
			'Use appropriate ARIA labels for dates',
			'Support screen reader announcements for date changes',
		],
		usageGuidelines: [
			'Use for date selection interfaces',
			'Consider date range limitations',
			'Provide clear visual feedback for selected dates',
			'Handle disabled dates appropriately',
		],
		contentGuidelines: [
			'Use clear date formatting',
			'Provide helpful date labels',
			'Consider localization for date display',
			'Use consistent date terminology',
		],
		props: [
			{
				name: 'day',
				description:
					'The number of the day currently focused. Places border around the date. Enter `0` to highlight no date.',
				type: 'number',
			},
			{
				name: 'defaultDay',
				description: 'Sets the default value for `day`.',
				type: 'number',
			},
			{
				name: 'defaultMonth',
				description: 'Sets the default value for `month`.',
				type: 'number',
			},
			{
				name: 'defaultPreviouslySelected',
				description: 'Sets the default value for `previouslySelected`.',
				type: 'string[]',
			},
			{
				name: 'defaultSelected',
				description: 'Sets the default value for `selected`.',
				type: 'string[]',
			},
			{
				name: 'defaultYear',
				description: 'Sets the default value for `year`.',
				type: 'number',
			},
			{
				name: 'disabled',
				description:
					"Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates provided are greyed out and not selectable.",
				type: 'string[]',
			},
			{
				name: 'disabledDateFilter',
				description:
					"A filter function that takes a date string in the format 'YYYY-MM-DD' and returns true if that date should be disabled.",
				type: '(date: string) => boolean',
			},
			{
				name: 'locale',
				description:
					'BCP 47 language tag (e.g. `ja-JP`) that ensures dates are in the official format for the locale.',
				type: 'string',
			},
			{
				name: 'maxDate',
				description:
					'The latest enabled date. All dates in the future after this date will be disabled.',
				type: 'string',
			},
			{
				name: 'minDate',
				description:
					'The earliest enabled date. All dates in the past before this date will be disabled.',
				type: 'string',
			},
			{
				name: 'month',
				description: 'The number of the month (from 1 to 12) which the calendar should be on.',
				type: 'number',
			},
			{
				name: 'nextMonthLabel',
				description:
					'The aria-label attribute associated with the next month arrow, to describe it to assistive technology.',
				type: 'string',
			},
			{
				name: 'onBlur',
				description: 'Function which is called when the calendar is no longer focused.',
				type: '(event: FocusEvent<Element, Element>) => void',
			},
			{
				name: 'onChange',
				description:
					"Called when the calendar is navigated. This can be triggered by the keyboard, or by clicking the navigational buttons.\nThe 'interface' property indicates the the direction the calendar was navigated whereas the 'iso' property is a string of the format YYYY-MM-DD.",
				type: '(event: ChangeEvent, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'onFocus',
				description:
					'Called when the calendar receives focus. This could be called from a mouse event on the container, or by tabbing into it.',
				type: '(event: FocusEvent<Element, Element>) => void',
			},
			{
				name: 'onSelect',
				description:
					"Function called when a day is clicked on. Calls with an object that has\na day, month and year property as numbers, representing the date just clicked.\nIt also has an 'iso' property, which is a string of the selected date in the\nformat YYYY-MM-DD.",
				type: '(event: SelectEvent, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'previouslySelected',
				description:
					"Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates\nprovided are given a background color.",
				type: 'string[]',
			},
			{
				name: 'previousMonthLabel',
				description:
					'The aria-label attribute associated with the previous month arrow, to describe it to assistive technology.',
				type: 'string',
			},
			{
				name: 'selected',
				description:
					"Takes an array of dates as string in the format 'YYYY-MM-DD'. All dates\nprovided are given a background color.",
				type: 'string[]',
			},
			{
				name: 'shouldSetFocusOnCurrentDay',
				description:
					'This allows the calendar to automatically set the focus to the current day.\nThe default is false.',
				type: 'boolean',
			},
			{
				name: 'tabIndex',
				description:
					'Indicates if the calendar can be focused by keyboard or only\nprogrammatically. Defaults to "0".',
				type: '0 | -1',
			},
			{
				name: 'today',
				description: "Value of current day, as a string in the format 'YYYY-MM-DD'.",
				type: 'string',
			},
			{
				name: 'weekStartDay',
				description:
					'Start day of the week for the calendar. The mapping between numbers and days of the week is as follows:\n- `0` Sunday (default value)\n- `1` Monday\n- `2` Tuesday\n- `3` Wednesday\n- `4` Thursday\n- `5` Friday\n- `6` Saturday',
				type: '0 | 1 | 2 | 3 | 4 | 5 | 6',
			},
			{
				name: 'year',
				description: 'Year to display the calendar for.',
				type: 'number',
			},
		],
	},
	{
		name: 'Checkbox',
		package: '@atlaskit/checkbox',
		keywords: ['checkbox', 'input', 'form', 'selection', 'choice', 'option', 'multiple'],
		category: 'forms-and-input',
		description:
			'A checkbox is an input control that allows a user to select one or more options from a number of choices.',
		status: 'general-availability',
		examples: [
			'import Checkbox from \'@atlaskit/checkbox\';\nexport default [\n\t<Checkbox label="Basic checkbox" />,\n\t<Checkbox label="Checked checkbox" isChecked />,\n];',
		],
		accessibilityGuidelines: [
			'Ensure proper labeling for all checkboxes',
			'Use clear, descriptive labels that explain the choice',
			'Provide keyboard navigation support',
			'Indicate required fields clearly',
			'Use appropriate error states and messaging',
		],
		usageGuidelines: [
			'Use for multiple choice selections',
			'Group related checkboxes logically',
			'Provide clear labels for each option',
			'Use indeterminate state for partial selections',
			'Consider default states carefully',
		],
		contentGuidelines: [
			'Write clear, descriptive labels',
			'Use consistent language across related options',
			'Avoid negative phrasing when possible',
			'Group related options together',
		],
		props: [
			{
				name: 'defaultChecked',
				description: 'Sets whether the checkbox begins as checked or unchecked.',
				type: 'boolean',
			},
			{
				name: 'id',
				description: 'The ID assigned to the input.',
				type: 'string',
			},
			{
				name: 'isChecked',
				description: 'Sets whether the checkbox is checked or unchecked.',
				type: 'boolean',
			},
			{
				name: 'isDisabled',
				description:
					'Sets whether the checkbox is disabled. Don’t use a disabled checkbox if it needs to remain in the tab order for assistive technologies.',
				type: 'boolean',
			},
			{
				name: 'isIndeterminate',
				description:
					'Sets whether the checkbox is indeterminate. This only affects the\nstyle and does not modify the isChecked property.',
				type: 'boolean',
			},
			{
				name: 'isInvalid',
				description: 'Marks the field as invalid. Changes style of unchecked component.',
				type: 'boolean',
			},
			{
				name: 'isRequired',
				description: 'Marks the field as required & changes the label style.',
				type: 'boolean',
			},
			{
				name: 'label',
				description:
					'The label to be displayed to the right of the checkbox. The label is part\nof the clickable element to select the checkbox.',
				type: 'string | number | ReactElement<any, string | JSXElementConstructor<any>>',
			},
			{
				name: 'name',
				description: 'The name of the submitted field in a checkbox.',
				type: 'string',
			},
			{
				name: 'onChange',
				description:
					'Function that is called whenever the state of the checkbox changes. It will\nbe called with an object containing the react synthetic event. Use `currentTarget` to get value, name and checked.',
				type: '(e: ChangeEvent<HTMLInputElement>, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'value',
				description:
					'The value to be used in the checkbox input. This is the value that will be returned on form submission.',
				type: 'string | number',
			},
			{
				name: 'xcss',
				description:
					'Bounded style API. Defining allowed styles through this prop will be supported for future component\niterations. Any styles that are not allowed by this API will result in type and land blocking violations.',
				type: 'false | (XCSSValue<"alignItems", DesignTokenStyles, ""> & {} & XCSSPseudo<"alignItems", never, never, DesignTokenStyles> & XCSSMediaQuery<...> & { ...; } & { ...; })',
			},
		],
	},
	{
		name: 'Code',
		package: '@atlaskit/code',
		keywords: ['code', 'snippet', 'inline', 'syntax', 'programming'],
		category: 'data-display',
		description: 'A component for displaying code snippets.',
		status: 'general-availability',
		examples: [
			"import { Code } from '@atlaskit/code';\nexport default [<Code>{`<Code />`}</Code>];",
		],
		accessibilityGuidelines: [
			'Ensure code content is announced properly by screen readers',
			'Use appropriate contrast for code readability',
			'Consider code context and meaning',
		],
		usageGuidelines: [
			'Use for inline code snippets',
			'Consider syntax highlighting needs',
			'Use appropriate font styling',
			'Consider code block vs inline code',
		],
		contentGuidelines: [
			'Use clear, readable code examples',
			'Consider code formatting and indentation',
			'Use meaningful variable names in examples',
			'Keep code snippets concise',
		],
		props: [
			{
				name: 'children',
				description: 'Content to be rendered in the inline code block.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'codeBidiWarningLabel',
				description:
					'Label for the bidi warning tooltip.\n\nDefaults to `Bidirectional characters change the order that text is rendered.\nThis could be used to obscure malicious code.`',
				type: 'string',
			},
			{
				name: 'hasBidiWarnings',
				description:
					'When set to `false`, disables code decorating with bidi warnings. Defaults to `true`.',
				type: 'boolean',
			},
			{
				name: 'isBidiWarningTooltipEnabled',
				description:
					'Sets whether to render tooltip with the warning or not. Intended to be\ndisabled when used in a mobile view, such as in the editor via mobile\nbridge, where the tooltip could end up being cut off or otherwise not work\nas expected. Defaults to `true`.',
				type: 'boolean',
			},
		],
	},
	{
		name: 'CodeBlock',
		package: '@atlaskit/code',
		keywords: ['code', 'block', 'syntax', 'highlighting', 'multiline'],
		category: 'data-display',
		description: 'A component for displaying multi-line code blocks with syntax highlighting.',
		status: 'general-availability',
		examples: [
			'import { CodeBlock } from \'@atlaskit/code\';\nconst exampleCodeBlock = `export default ({ name }: { name: string }) => <div>Hello {name}</div>;`;\nexport default [<CodeBlock highlight="15" language="tsx" text={exampleCodeBlock} />];',
		],
		accessibilityGuidelines: [
			'Ensure code blocks are announced properly by screen readers',
			'Use appropriate contrast for code readability',
			'Consider code context and meaning',
			'Provide proper language identification',
		],
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
		props: [
			{
				name: 'codeBidiWarningLabel',
				description: 'Label for the bidi warning tooltip.',
				type: 'string',
			},
			{
				name: 'firstLineNumber',
				description: 'Sets the number of the first line, if showLineNumbers is set to true.',
				type: 'number',
			},
			{
				name: 'hasBidiWarnings',
				description: 'When set to `false`, disables code decorating with bidi warnings.',
				type: 'boolean',
			},
			{
				name: 'highlight',
				description:
					'Comma delimited lines to highlight.\n\nExample uses:\n- To highlight one line `highlight="3"`\n- To highlight a group of lines `highlight="1-5"`\n- To highlight multiple groups `highlight="1-5,7,10,15-20"`',
				type: 'string',
			},
			{
				name: 'highlightedEndText',
				description: 'Screen reader text for the end of a highlighted line.',
				type: 'string',
			},
			{
				name: 'highlightedStartText',
				description: 'Screen reader text for the start of a highlighted line.',
				type: 'string',
			},
			{
				name: 'isBidiWarningTooltipEnabled',
				description:
					'Sets whether to render tooltip with the warning or not.\nIntended to be disabled when used in a mobile view, such as in the editor via mobile bridge,\nwhere the tooltip could end up being cut off or otherwise not work as expected.',
				type: 'boolean',
			},
			{
				name: 'label',
				description:
					"Text used to describe that the content of the code block is scrollable.\nSet only if the code block is scrollable. Defaults to 'Scrollable content'.",
				type: 'string',
			},
			{
				name: 'language',
				description:
					'Language reference designed to be populated from `SUPPORTED_LANGUAGES` in\n`design-system/code`. Run against language grammars from PrismJS (full list\navailable at [PrismJS documentation](https://prismjs.com/#supported-languages)).\n\nWhen set to "text" will not perform highlighting. If unsupported language\nprovided - code will be treated as "text" with no highlighting.',
				type: '"text" | "PHP" | "php" | "php3" | "php4" | "php5" | "Java" | "java" | "CSharp" | "csharp" | "c#" | "Python" | "python" | "py" | "JavaScript" | "javascript" | "js" | "Html" | "html" | ... 234 more ... | "markdown"',
			},
			{
				name: 'shouldShowLineNumbers',
				description: 'Sets whether to display code line numbers or not.',
				type: 'boolean',
			},
			{
				name: 'shouldWrapLongLines',
				description:
					'Sets whether long lines will create a horizontally scrolling container.\nWhen set to `true`, these lines will visually wrap instead.',
				type: 'boolean',
			},
			{
				name: 'text',
				description: 'The code to be formatted.',
				type: 'string',
			},
		],
	},
	{
		name: 'Comment',
		package: '@atlaskit/comment',
		keywords: ['comment', 'discussion', 'thread', 'conversation', 'chat'],
		category: 'data-display',
		description: 'A component for displaying comments and discussions.',
		status: 'general-availability',
		examples: [
			'import Comment from \'@atlaskit/comment\';\nexport default [\n\t<Comment\n\t\tauthor="Bob Johnson"\n\t\ttime="30 minutes ago"\n\t\tcontent="Another comment in the thread"\n\t\tavatar="https://picsum.photos/32/32"\n\t/>,\n];',
		],
		accessibilityGuidelines: [
			'Ensure proper comment structure',
			'Provide clear comment attribution',
			'Use appropriate heading hierarchy',
			'Consider screen reader navigation',
		],
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
		props: [
			{
				name: 'actions',
				description:
					'A list of `CommentAction` items rendered as a row of buttons below the content.',
				type: 'ReactNode[]',
			},
			{
				name: 'afterContent',
				description: "Content that is rendered after the comment's content.",
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'author',
				description: 'A `CommentAuthor` element containing the name of the author.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'avatar',
				description: "The element to display as the avatar. It's best to use `@atlaskit/avatar`.",
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'children',
				description: 'Provide nested comments as children.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'content',
				description: 'The main content for the comment.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'edited',
				description:
					'A `CommentEdited` element which displays next to the time. Indicates whether the comment has been edited.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'errorActions',
				description:
					'A list of `CommentAction` items rendered with a warning icon instead of the actions.',
				type: 'ReactNode[]',
			},
			{
				name: 'errorIconLabel',
				description: 'Text to show in the error icon label.',
				type: 'string',
			},
			{
				name: 'headingLevel',
				description:
					'Use this to set the semantic heading level of the comment. The default comment heading has an `h3` tag. Make sure that headings are in the correct order and don’t skip levels.',
				type: '"1" | "2" | "3" | "4" | "5" | "6"',
			},
			{
				name: 'highlighted',
				description: 'Sets whether this comment should be highlighted.',
				type: 'boolean',
			},
			{
				name: 'id',
				description: 'An ID to be applied to the comment.',
				type: 'string',
			},
			{
				name: 'isError',
				description:
					'Indicates whether the component is in an error state. Hides actions and time.',
				type: 'boolean',
			},
			{
				name: 'isSaving',
				description:
					'Enables "optimistic saving" mode which removes actions and displays text from the `savingText` prop.',
				type: 'boolean',
			},
			{
				name: 'restrictedTo',
				description:
					'Text for the "restricted to" label. This will display in the top items, before the main content.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'savingText',
				description: 'Text to show when in "optimistic saving" mode.',
				type: 'string',
			},
			{
				name: 'shouldHeaderWrap',
				description: 'Controls if the comment header should wrap.',
				type: 'boolean',
			},
			{
				name: 'shouldRenderNestedCommentsInline',
				description:
					'Controls if nested comments are rendered at the same depth as the parent comment.',
				type: 'boolean',
			},
			{
				name: 'time',
				description: 'A `CommentTime` element containing the time to display.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'type',
				description:
					'The type of comment. This will be rendered in a lozenge at the top of the comment, before the main content.',
				type: 'string',
			},
		],
	},
	{
		name: 'DatePicker',
		package: '@atlaskit/datetime-picker',
		keywords: ['date', 'picker', 'calendar', 'selection', 'form'],
		category: 'form',
		description: 'A component for selecting date values with calendar support.',
		status: 'general-availability',
		examples: [
			'import { DatePicker } from \'@atlaskit/datetime-picker\';\nexport default [\n\t<DatePicker\n\t\tclearControlLabel="Clear select date"\n\t\tonChange={() => {}}\n\t\tshouldShowCalendarButton\n\t\topenCalendarLabel="open calendar"\n\t/>,\n];',
		],
		accessibilityGuidelines: [
			'Ensure proper keyboard navigation',
			'Use appropriate date formats',
			'Provide clear date labels',
			'Consider screen reader announcements',
		],
		usageGuidelines: [
			'Use for date selection only',
			'Provide clear date formats',
			'Handle date validation appropriately',
			'Consider calendar button visibility',
		],
		contentGuidelines: [
			'Use clear, descriptive labels',
			'Provide helpful placeholder text',
			'Use appropriate date formats',
			'Keep labels concise but descriptive',
		],
		props: [
			{
				name: 'aria-describedby',
				description: 'Used to associate accessible descriptions to the date picker.',
				type: 'string',
			},
			{
				name: 'autoFocus',
				description: 'Set the picker to autofocus on mount.',
				type: 'boolean',
			},
			{
				name: 'clearControlLabel',
				description:
					'Set the `aria-label` for the clear button.\nAdd the word "Clear" at the beginning of the clearControlLabel.\nFor instance, for a field to set an appointment, use "Clear appointment date and time".',
				type: 'string',
			},
			{
				name: 'dateFormat',
				description:
					"Format the date with a string that is accepted by [date-fns's format\nfunction](https://date-fns.org/v1.29.0/docs/format). **This does not affect\nhow the input is parsed.** This must be done using the `parseInputValue`\nprop.\n\nNote that though we are using `date-fns` version 2, we use [the tokens from\n`date-fns` version 1](https://date-fns.org/v1.30.1/docs/format) under the\nhood.",
				type: 'string',
			},
			{
				name: 'defaultValue',
				description: 'The default for `value`.',
				type: 'string',
			},
			{
				name: 'disabled',
				description:
					'An array of ISO dates that should be disabled on the calendar. This does not affect what users can type into the picker.',
				type: 'string[]',
			},
			{
				name: 'disabledDateFilter',
				description:
					'A filter function for disabling dates on the calendar. This does not affect what users can type into the picker.\n\nThe function is called with a date string in the format `YYYY-MM-DD` and should return `true` if the date should be disabled.',
				type: '(date: string) => boolean',
			},
			{
				name: 'formatDisplayLabel',
				description:
					"A function for formatting the date displayed in the input. By default composes together [`date-fns`'s parse method](https://date-fns.org/v1.29.0/docs/parse) and [`date-fns`'s format method](https://date-fns.org/v1.29.0/docs/format) to return a correctly formatted date string.\n\nNote that this does not affect how the input is parsed. This must be done using the `parseInputValue` prop.",
				type: '(value: string, dateFormat: string) => string',
			},
			{
				name: 'id',
				description: 'Set the id of the field.\nAssociates a `<label></label>` with the field.',
				type: 'string',
			},
			{
				name: 'inputLabel',
				description:
					'The name of the input, used when `shouldShowCalendarButton` is true. See `shouldShowCalendarButton` description for more details.',
				type: 'string',
			},
			{
				name: 'inputLabelId',
				description:
					'The ID of the label for the input, used when `shouldShowCalendarButton` is\ntrue. See `shouldShowCalendarButton` description for more details.',
				type: 'string',
			},
			{
				name: 'isDisabled',
				description: 'Set if the picker is disabled.',
				type: 'boolean',
			},
			{
				name: 'isInvalid',
				description: 'Set if the picker has an invalid value.',
				type: 'boolean',
			},
			{
				name: 'isOpen',
				description: 'Set if the picker is open.',
				type: 'boolean',
			},
			{
				name: 'isRequired',
				description: 'Set the field as required.',
				type: 'boolean',
			},
			{
				name: 'label',
				description:
					'Accessible name for the Date Picker Select, rendered as `aria-label`. This will override any other method of providing a label.',
				type: 'string',
			},
			{
				name: 'locale',
				description:
					'Locale used to format the date and calendar. See [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).',
				type: 'string',
			},
			{
				name: 'maxDate',
				description:
					'The latest enabled date. Dates after this are disabled on the calendar. This does not affect what users can type into the picker.',
				type: 'string',
			},
			{
				name: 'menuInnerWrapper',
				description:
					'This overrides the inner wrapper the Calendar.\n@private Please use this with extreme caution, this API may be changed in the future.',
				type: 'ComponentClass<{ children: ReactNode; }, any> | FunctionComponent<{ children: ReactNode; }>',
			},
			{
				name: 'minDate',
				description:
					'The earliest enabled date. Dates before this are disabled on the calendar. This does not affect what users can type into the picker.',
				type: 'string',
			},
			{
				name: 'name',
				description: 'The name of the field.',
				type: 'string',
			},
			{
				name: 'nextMonthLabel',
				description: 'The aria-label attribute associated with the next-month arrow.',
				type: 'string',
			},
			{
				name: 'onBlur',
				description: 'Called when the field is blurred.',
				type: '(event: FocusEvent<HTMLInputElement, Element>) => void',
			},
			{
				name: 'onChange',
				description:
					'Called when the value changes. The only argument is an ISO time or empty string.',
				type: '(value: string) => void',
			},
			{
				name: 'onFocus',
				description: 'Called when the field is focused.',
				type: '(event: FocusEvent<HTMLInputElement, Element>) => void',
			},
			{
				name: 'openCalendarLabel',
				description:
					'The label associated with the button to open the calendar, rendered via the\n`shouldShowCalendarButton` prop. If a `label` prop is provided, this\ncalendar button label will be prefixed by the value of `label`. If no\n`label` prop is provided, this prefix should be manually added. For\nexample,\n\n```tsx\n<label id="label" htmlFor="datepicker">Desired Appointment Date</label>\n<DatePicker\n\tid="datepicker"\n\tshouldShowCalendarButton\n\tinputLabel="Desired Appointment Date"\n\topenCalendarLabel="open calendar"\n/>\n```',
				type: 'string',
			},
			{
				name: 'parseInputValue',
				description:
					'A function for parsing input characters and transforming them into a Date object.\nBy default parses the date string based off the locale. Note that this does\nnot affect how the resulting value is displayed in the input. Use the\n`dateFormat` or `formatDisplayLabel` prop to handle how the value is\ndisplayed.',
				type: '(date: string, dateFormat: string) => Date',
			},
			{
				name: 'placeholder',
				description: 'Placeholder text displayed in input.',
				type: 'string',
			},
			{
				name: 'previousMonthLabel',
				description: 'The aria-label attribute associated with the previous-month arrow.',
				type: 'string',
			},
			{
				name: 'selectProps',
				description: '',
				type: 'Omit<SelectProps<OptionType, false>, "aria-describedby" | "placeholder" | "aria-label" | "inputId"> & { \'aria-describedby\'?: never; \'aria-label\'?: never; inputId?: never; placeholder?: never; }',
			},
			{
				name: 'shouldShowCalendarButton',
				description:
					'Provides a functional calendar button that opens the calendar picker that\nlives on the right side of the date picker.\n\nThe accessible name for this button is caculated using either the `label`,\n`inputLabel`, or `inputLabelId` props, along with the `openCalendarLabel`\nprop.',
				type: 'boolean',
			},
			{
				name: 'spacing',
				description:
					'The spacing for the select control.\n\nCompact is `gridSize() * 4`, default is `gridSize * 5`.',
				type: '"default" | "compact"',
			},
			{
				name: 'value',
				description: 'The ISO time used as the input value.',
				type: 'string',
			},
			{
				name: 'weekStartDay',
				description:
					'Start day of the week for the calendar.\n- `0` sunday (default value)\n- `1` monday\n- `2` tuesday\n- `3` wednesday\n- `4` thursday\n- `5` friday\n- `6` saturday',
				type: '0 | 1 | 2 | 3 | 4 | 5 | 6',
			},
		],
	},
	{
		name: 'TimePicker',
		package: '@atlaskit/datetime-picker',
		keywords: ['time', 'picker', 'clock', 'selection', 'form'],
		category: 'form',
		description: 'A component for selecting time values with clock interface.',
		status: 'general-availability',
		examples: [
			'import { TimePicker } from \'@atlaskit/datetime-picker\';\nexport default [\n\t<TimePicker\n\t\tclearControlLabel="Clear select time (editable)"\n\t\tdefaultValue="14:30"\n\t\tonChange={() => {}}\n\t\ttimeFormat="HH:mm:ss A"\n\t\ttimeIsEditable\n\t\tselectProps={{\n\t\t\tclassNamePrefix: \'timepicker-select\',\n\t\t}}\n\t/>,\n];',
		],
		accessibilityGuidelines: [
			'Ensure proper keyboard navigation',
			'Use appropriate time formats',
			'Provide clear time labels',
			'Consider screen reader announcements',
		],
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
		],
		props: [
			{
				name: 'aria-describedby',
				description: 'Used to associate accessible descriptions to the time picker.',
				type: 'string',
			},
			{
				name: 'autoFocus',
				description: 'Set the picker to autofocus on mount.',
				type: 'boolean',
			},
			{
				name: 'clearControlLabel',
				description:
					'Set the `aria-label` for the clear button.\nAdd the word "Clear" at the beginning of the clearControlLabel.\nFor instance, for a field to set an appointment, use "Clear appointment date and time".',
				type: 'string',
			},
			{
				name: 'defaultValue',
				description: 'The default for `value`.',
				type: 'string',
			},
			{
				name: 'formatDisplayLabel',
				description:
					'A function for formatting the displayed time value in the input. By default\nparses with an internal time parser, and formats using the [date-fns format\nfunction]((https://date-fns.org/v1.29.0/docs/format)).\n\nNote that this does not affect how the input is parsed. This must be done\nusing the `parseInputValue` prop.',
				type: '(time: string, timeFormat: string) => string',
			},
			{
				name: 'hideIcon',
				description: 'Hides icon for dropdown indicator.',
				type: 'boolean',
			},
			{
				name: 'id',
				description: 'Set the id of the field.\nAssociates a `<label></label>` with the field.',
				type: 'string',
			},
			{
				name: 'isDisabled',
				description: 'Set if the field is disabled.',
				type: 'boolean',
			},
			{
				name: 'isInvalid',
				description: 'Set if the picker has an invalid value.',
				type: 'boolean',
			},
			{
				name: 'isOpen',
				description: 'Set if the dropdown is open. Will be `false` if not provided.',
				type: 'boolean',
			},
			{
				name: 'isRequired',
				description: 'Set the field as required.',
				type: 'boolean',
			},
			{
				name: 'label',
				description:
					'Accessible name for the Time Picker Select, rendered as `aria-label`. This will override any other method of providing a label.',
				type: 'string',
			},
			{
				name: 'locale',
				description:
					'Locale used to format the time. See [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).',
				type: 'string',
			},
			{
				name: 'name',
				description: 'The name of the field.',
				type: 'string',
			},
			{
				name: 'onBlur',
				description: 'Called when the field is blurred.',
				type: '(event: FocusEvent<HTMLElement, Element>) => void',
			},
			{
				name: 'onChange',
				description:
					'Called when the value changes. The only argument is an ISO time or empty string.',
				type: '(value: string) => void',
			},
			{
				name: 'onFocus',
				description: 'Called when the field is focused.',
				type: '(event: FocusEvent<HTMLElement, Element>) => void',
			},
			{
				name: 'parseInputValue',
				description:
					'A function for parsing input characters and transforming them into either a\nstring or a Date object. By default parses the string based off the locale.\nNote that this does not affect how the resulting value is displayed in the\ninput. To handle this, use either the `timeFormat` or `formatDisplayLabel`\nprop.',
				type: '(time: string, timeFormat: string) => string | Date',
			},
			{
				name: 'placeholder',
				description: 'Placeholder text displayed in input.',
				type: 'string',
			},
			{
				name: 'selectProps',
				description: '',
				type: 'Omit<SelectProps<OptionType, false>, "aria-describedby" | "placeholder" | "aria-label" | "inputId"> & { \'aria-describedby\'?: never; \'aria-label\'?: never; inputId?: never; placeholder?: never; }',
			},
			{
				name: 'spacing',
				description:
					'The spacing for the select control.\n\nCompact is `gridSize() * 4`, default is `gridSize * 5`.',
				type: '"default" | "compact"',
			},
			{
				name: 'timeFormat',
				description:
					"Format the time with a string that is accepted by [date-fns's format\nfunction](https://date-fns.org/v1.29.0/docs/format). **This does not affect\nhow the input is parsed.** This must be done using the `parseInputValue`\nprop.\n\nNote that though we are using `date-fns` version 2, we use [the tokens from\n`date-fns` version 1](https://date-fns.org/v1.30.1/docs/format) under the\nhood.",
				type: 'string',
			},
			{
				name: 'timeIsEditable',
				description: 'Set if users can edit the input, allowing them to add custom times.',
				type: 'boolean',
			},
			{
				name: 'times',
				description: 'The times shown in the dropdown.',
				type: 'string[]',
			},
			{
				name: 'value',
				description: 'The ISO time that should be used as the input value.',
				type: 'string',
			},
		],
	},
	{
		name: 'DateTimePicker',
		package: '@atlaskit/datetime-picker',
		keywords: ['datetime', 'picker', 'date', 'time', 'calendar'],
		category: 'form',
		description: 'A component for selecting both date and time values.',
		status: 'general-availability',
		examples: [
			"import { DateTimePicker } from '@atlaskit/datetime-picker';\nexport default [\n\t<DateTimePicker\n\t\tclearControlLabel=\"Clear date / time picker (editable times)\"\n\t\tdefaultValue=\"2018-01-02T14:30+10:00\"\n\t\tonChange={() => {}}\n\t\ttimePickerProps={{\n\t\t\ttimeIsEditable: true,\n\t\t\tlabel: 'Time picker (editable)',\n\t\t}}\n\t\tdatePickerProps={{\n\t\t\tlabel: 'Date picker (editable times)',\n\t\t\tshouldShowCalendarButton: true,\n\t\t\topenCalendarLabel: 'open calendar',\n\t\t}}\n\t/>,\n];",
		],
		accessibilityGuidelines: [
			'Ensure proper keyboard navigation',
			'Use appropriate date/time formats',
			'Provide clear date/time labels',
			'Consider screen reader announcements',
		],
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
		],
		props: [
			{
				name: 'aria-describedby',
				description:
					'Used to associate accessible descriptions to both the date and time\npicker. If you want to associate individual accessible descriptions, this\nshould be done through the `aria-describedby` props on the\n`datePickerProps` and `timePickerProps`.\nUsed to associate accessible descriptions to both the date and time\npicker. If you want to associate individual accessible descriptions, this\nshould be done through the `aria-describedby` props on the\n`datePickerProps` and `timePickerProps`.',
				type: 'string',
			},
			{
				name: 'autoFocus',
				description: 'Set the picker to autofocus on mount.\nSet the picker to autofocus on mount.',
				type: 'boolean',
			},
			{
				name: 'clearControlLabel',
				description:
					'Set the `aria-label` for the clear button.\nAdd the word "Clear" at the beginning of the clearControlLabel.\nFor instance, for a field to set an appointment, use "Clear appointment date and time".\nSet the `aria-label` for the clear button.\nAdd the word "Clear" at the beginning of the clearControlLabel.\nFor instance, for a field to set an appointment, use "Clear appointment date and time".',
				type: 'string',
			},
			{
				name: 'datePickerProps',
				description: 'Props applied to the `DatePicker`.\nProps applied to the `DatePicker`.',
				type: 'DatePickerBaseProps',
			},
			{
				name: 'defaultValue',
				description: 'The default for `value`.\nThe default for `value`.',
				type: 'string',
			},
			{
				name: 'id',
				description: 'Set the id of the field.\nSet the id of the field.',
				type: 'string',
			},
			{
				name: 'isDisabled',
				description: 'Set if the field is disabled.\nSet if the field is disabled.',
				type: 'boolean',
			},
			{
				name: 'isInvalid',
				description:
					'Set if the picker has an invalid value.\nSet if the picker has an invalid value.',
				type: 'boolean',
			},
			{
				name: 'isRequired',
				description: 'Set the field as required.\nSet the field as required.',
				type: 'boolean',
			},
			{
				name: 'locale',
				description:
					'Locale used for formatting dates and times. See [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).\nLocale used for formatting dates and times. See [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).',
				type: 'string',
			},
			{
				name: 'name',
				description: 'The name of the field.\nThe name of the field.',
				type: 'string',
			},
			{
				name: 'onBlur',
				description: 'Called when the field is blurred.\nCalled when the field is blurred.',
				type: '(event: FocusEvent<HTMLInputElement, Element>) => void',
			},
			{
				name: 'onChange',
				description:
					'Called when the value changes and the date / time is a complete value, or empty. The only value is an ISO string or empty string.\nCalled when the value changes and the date / time is a complete value, or empty. The only value is an ISO string or empty string.',
				type: '(value: string) => void',
			},
			{
				name: 'onFocus',
				description: 'Called when the field is focused.\nCalled when the field is focused.',
				type: '(event: FocusEvent<HTMLInputElement, Element>) => void',
			},
			{
				name: 'parseValue',
				description:
					'Function used to parse datetime values into their date, time and timezone sub-values. *\nFunction used to parse datetime values into their date, time and timezone sub-values. *',
				type: '(dateTimeValue: string, date: string, time: string, timezone: string) => { dateValue: string; timeValue: string; zoneValue: string; }',
			},
			{
				name: 'spacing',
				description:
					'The spacing for the select control.\n\nCompact is `gridSize() * 4`, default is `gridSize() * 5`.\nThe spacing for the select control.\n\nCompact is `gridSize() * 4`, default is `gridSize() * 5`.',
				type: '"default" | "compact"',
			},
			{
				name: 'timePickerProps',
				description: 'Props applied to the `TimePicker`.\nProps applied to the `TimePicker`.',
				type: 'TimePickerBaseProps',
			},
			{
				name: 'value',
				description:
					'The ISO time that should be used as the input value.\nThe ISO time that should be used as the input value.',
				type: 'string',
			},
		],
	},
	{
		name: 'Drawer',
		package: '@atlaskit/drawer',
		keywords: ['drawer', 'panel', 'slide', 'overlay', 'navigation', 'sidebar'],
		category: 'overlays-and-layering',
		description:
			'A drawer is a panel that slides in from the left side of the screen for navigation or additional content.',
		status: 'intent-to-deprecate',
		examples: [
			"import React, { useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport Drawer, { DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';\nimport Heading from '@atlaskit/heading';\nimport { Text } from '@atlaskit/primitives/compiled';\nexport default [\n\t() => {\n\t\tconst [isOpen, setIsOpen] = useState(false);\n\t\treturn (\n\t\t\t<>\n\t\t\t\t<Button onClick={() => setIsOpen(true)}>Open Drawer</Button>\n\t\t\t\t<Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} label=\"Basic drawer\">\n\t\t\t\t\t<DrawerSidebar>\n\t\t\t\t\t\t<DrawerCloseButton />\n\t\t\t\t\t</DrawerSidebar>\n\t\t\t\t\t<DrawerContent>\n\t\t\t\t\t\t<Heading size=\"large\">Drawer Content</Heading>\n\t\t\t\t\t\t<Text>This is the main content area of the drawer.</Text>\n\t\t\t\t\t</DrawerContent>\n\t\t\t\t</Drawer>\n\t\t\t</>\n\t\t);\n\t},\n];",
		],
		accessibilityGuidelines: [
			'Ensure proper focus management when drawer opens/closes',
			'Provide keyboard navigation support',
			'Use appropriate ARIA attributes for drawer state',
			'Ensure content is accessible when drawer is open',
			'Provide clear close mechanisms',
		],
		usageGuidelines: [
			'Use for navigation or secondary content',
			'Provide clear open/close mechanisms',
			'Consider screen size and drawer width',
			'Use appropriate backdrop behavior',
			'Consider alternative patterns like Modal for better UX',
		],
		contentGuidelines: [
			'Organize content logically within the drawer',
			'Use clear navigation labels',
			'Provide appropriate close actions',
			'Consider content hierarchy and grouping',
		],
		props: [
			{
				name: 'autoFocusFirstElem',
				description:
					'Controls whether to focus the first tabbable element inside the focus lock. Set to `true` by default.',
				type: 'boolean',
			},
			{
				name: 'children',
				description: 'The content of the drawer.',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'enterFrom',
				description: 'Sets the direction the draw enters from. The default is "left".',
				type: '"top" | "right" | "bottom" | "left"',
			},
			{
				name: 'isFocusLockEnabled',
				description:
					'Enable this to keep focus inside the component until it’s closed. This is strongly recommended, as it prevents people who use assistive technology from accidentally navigating out of the drawer using the tab key.',
				type: 'boolean',
			},
			{
				name: 'isOpen',
				description: 'Controls if the drawer is open or closed.',
				type: 'boolean',
			},
			{
				name: 'label',
				description:
					'This is an `aria-label` attribute. It sets an accessible name for the drawer wrapper, for people who use assistive technology.\nUsage of either this, or the `titleId` attribute is strongly recommended.',
				type: 'string',
			},
			{
				name: 'onClose',
				description: 'Callback function called when the drawer is closed.',
				type: '(event: React.SyntheticEvent<HTMLElement, Event>, analyticsEvent?: any) => void',
			},
			{
				name: 'onCloseComplete',
				description:
					'A callback function that will be called when the drawer has finished its close transition.',
				type: '(node: HTMLElement) => void',
			},
			{
				name: 'onKeyDown',
				description:
					'Callback function called while the drawer is displayed and `keydown` event is triggered.',
				type: '(event: React.SyntheticEvent<Element, Event>) => void',
			},
			{
				name: 'onOpenComplete',
				description:
					'A callback function that will be called when the drawer has finished its opening transition.',
				type: '(node: HTMLElement) => void',
			},
			{
				name: 'shouldReturnFocus',
				description:
					'ReturnFocus controls what happens when the user exits focus lock mode.\nIf true, focus returns to the trigger element . If false, focus remains where it was when the FocusLock was deactivated.\nIf ref is passed, focus returns to that specific ref element.',
				type: 'boolean | React.RefObject<HTMLElement>',
			},
			{
				name: 'titleId',
				description:
					"This is an ID referenced by the drawer wrapper's `aria-labelledby` attribute. This ID should be assigned to the drawer `title` element.\nUsage of either this, or the `label` attribute is strongly recommended.",
				type: 'string',
			},
			{
				name: 'width',
				description: 'Sets the width of the drawer.',
				type: '"extended" | "full" | "medium" | "narrow" | "wide"',
			},
			{
				name: 'zIndex',
				description:
					'Z-index that the popup should be displayed in.\nThis is passed to the portal component.\nDefaults to `unset`.',
				type: 'number | "unset"',
			},
		],
	},
	{
		name: 'DrawerContent',
		package: '@atlaskit/drawer',
		keywords: ['drawer', 'content', 'panel', 'body'],
		category: 'overlays-and-layering',
		description: 'The main content area of a drawer panel.',
		status: 'intent-to-deprecate',
		examples: [
			"import { DrawerContent } from '@atlaskit/drawer';\nimport Heading from '@atlaskit/heading';\nimport { Text } from '@atlaskit/primitives/compiled';\nexport default [\n\t<DrawerContent>\n\t\t<Heading size=\"large\">Content Title</Heading>\n\t\t<Text>This is the main content area of the drawer.</Text>\n\t</DrawerContent>,\n\t<DrawerContent>\n\t\t<Heading size=\"medium\">Settings</Heading>\n\t\t<Text>Configure your preferences here.</Text>\n\t</DrawerContent>,\n];",
		],
		usageGuidelines: [
			'Use as the main content container within a drawer',
			'Place primary content and actions here',
			'Ensure proper scrolling behavior for long content',
		],
		contentGuidelines: [
			'Organize content logically',
			'Use appropriate spacing and layout',
			'Consider content hierarchy',
		],
		props: [
			{
				name: 'children',
				description: 'The content of the drawer.',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'scrollContentLabel',
				description:
					'When the content is scrollable, this is the accessible name for the the drawer region. The default is "Scrollable content".',
				type: 'string',
			},
			{
				name: 'xcss',
				description: '',
				type: 'false | (XCSSValue<"backgroundColor" | "marginTop" | "paddingBottom" | "paddingLeft" | "paddingRight" | "paddingTop" | "padding", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
			},
		],
	},
	{
		name: 'DrawerSidebar',
		package: '@atlaskit/drawer',
		keywords: ['drawer', 'sidebar', 'navigation', 'panel'],
		category: 'overlays-and-layering',
		description: 'A sidebar component within a drawer for navigation or secondary content.',
		status: 'intent-to-deprecate',
		examples: [
			"import { DrawerCloseButton, DrawerSidebar } from '@atlaskit/drawer';\nexport default [\n\t<DrawerSidebar>\n\t\t<DrawerCloseButton />\n\t</DrawerSidebar>,\n];",
		],
		usageGuidelines: [
			'Use for navigation or secondary content in a drawer',
			'Keep sidebar content focused and organized',
			'Consider responsive behavior',
		],
		contentGuidelines: [
			'Use clear navigation labels',
			'Organize content hierarchically',
			'Keep sidebar content concise',
		],
		props: [
			{
				name: 'children',
				description: 'The content of the sidebar.',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'xcss',
				description: '',
				type: 'false | (XCSSValue<"backgroundColor" | "paddingBottom" | "paddingLeft" | "paddingRight" | "paddingTop" | "width" | "padding", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
			},
		],
	},
	{
		name: 'DrawerCloseButton',
		package: '@atlaskit/drawer',
		keywords: ['drawer', 'close', 'button', 'action'],
		category: 'overlays-and-layering',
		description: 'A close button specifically designed for drawer components.',
		status: 'intent-to-deprecate',
		examples: [
			"import { DrawerCloseButton } from '@atlaskit/drawer';\nexport default [<DrawerCloseButton />];",
		],
		usageGuidelines: [
			'Use to provide clear close functionality for drawers',
			'Position prominently for easy access',
			'Ensure keyboard accessibility',
		],
		contentGuidelines: [
			'Use clear close icon or text',
			'Ensure button is easily discoverable',
			'Provide appropriate hover/focus states',
		],
		props: [
			{
				name: 'icon',
				description:
					"Use this to render an icon for the drawer close/back control, if it's available.",
				type: 'React.ComponentClass<any, any> | React.FunctionComponent<any>',
			},
			{
				name: 'label',
				description:
					'This is the accessible name for the close/back control of the drawer. The default is "Close drawer".',
				type: 'string',
			},
		],
	},
	{
		name: 'DropdownMenu',
		package: '@atlaskit/dropdown-menu',
		keywords: ['dropdown', 'menu', 'actions', 'options', 'popup', 'contextual'],
		category: 'navigation',
		description: 'A dropdown menu component for displaying contextual actions and options.',
		status: 'general-availability',
		examples: [
			'import { IconButton } from \'@atlaskit/button/new\';\nimport DropdownMenu, { DropdownItem, DropdownItemGroup } from \'@atlaskit/dropdown-menu\';\nimport MoreIcon from \'@atlaskit/icon/core/show-more-horizontal\';\nexport default [\n\t<DropdownMenu\n\t\tshouldRenderToParent\n\t\ttrigger={({ triggerRef, ...props }) => (\n\t\t\t<IconButton ref={triggerRef} {...props} icon={MoreIcon} label="More" />\n\t\t)}\n\t>\n\t\t<DropdownItemGroup>\n\t\t\t<DropdownItem href="/dashboard">Dashboard</DropdownItem>\n\t\t\t<DropdownItem>Create</DropdownItem>\n\t\t\t<DropdownItem>Delete</DropdownItem>\n\t\t</DropdownItemGroup>\n\t</DropdownMenu>,\n\t<DropdownMenu shouldRenderToParent trigger="Actions">\n\t\t<DropdownItemGroup>\n\t\t\t<DropdownItem>Export</DropdownItem>\n\t\t\t<DropdownItem>Share</DropdownItem>\n\t\t</DropdownItemGroup>\n\t</DropdownMenu>,\n];',
		],
		accessibilityGuidelines: [
			'Provide clear labels for dropdown triggers',
			'Ensure keyboard navigation with arrow keys',
			'Use appropriate ARIA attributes',
			'Provide clear menu item descriptions',
			'Support escape key to close menu',
		],
		usageGuidelines: [
			'Use for contextual actions and options',
			'Group related menu items together',
			'Use clear, descriptive menu item labels',
			'Consider menu positioning and overflow',
			'Use appropriate trigger elements',
		],
		contentGuidelines: [
			'Use clear, action-oriented menu item labels',
			'Keep menu item text concise',
			'Group related actions logically',
			'Use consistent terminology across menu items',
		],
		props: [
			{
				name: 'appearance',
				description:
					"Controls the appearance of the menu.\nThe default menu will scroll after its height exceeds the pre-defined amount.\nThe tall menu won't scroll until the height exceeds the height of the viewport.",
				type: '"default" | "tall"',
			},
			{
				name: 'autoFocus',
				description:
					'Controls if the first menu item receives focus when menu is opened. Note that the menu has a focus lock\nwhich traps the focus within the menu. The first item gets focus automatically\nif the menu is triggered using the keyboard.',
				type: 'boolean',
			},
			{
				name: 'children',
				description:
					'Content that will be rendered inside the layer element. Should typically be\n`DropdownItemGroup` or `DropdownItem`, or the checkbox and radio variants of those.',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'defaultOpen',
				description:
					'Controls the initial open state of the dropdown. If provided, the component is considered to be controlled\nwhich means that the user is responsible for managing the open and close state of the menu.\nUsing `defaultOpen` may cause accessiblity issues because it will automatically shift focus to the first menu item; which can be disorienting.\nOnly use this if action on the menu is required to proceed.',
				type: 'boolean',
			},
			{
				name: 'isLoading',
				description: 'If true, a spinner is rendered instead of the items.',
				type: 'boolean',
			},
			{
				name: 'isOpen',
				description: 'Controls the open state of the dropdown.',
				type: 'boolean',
			},
			{
				name: 'label',
				description: 'Provide an accessible label via `aria-label` for assistive technology.',
				type: 'string',
			},
			{
				name: 'menuLabel',
				description: 'Provide an accessible label for the menu element for assistive technology.',
				type: 'string',
			},
			{
				name: 'onOpenChange',
				description:
					'Called when the menu should be open/closed. Receives an object with `isOpen` state.\n\nIf the dropdown was closed programatically, the `event` parameter will be `null`.',
				type: '(args: OnOpenChangeArgs) => void',
			},
			{
				name: 'placement',
				description: 'Position of the menu.',
				type: '"auto-start" | "auto" | "auto-end" | "top-start" | "top" | "top-end" | "right-start" | "right" | "right-end" | "bottom-end" | "bottom" | "bottom-start" | "left-end" | "left" | "left-start"',
			},
			{
				name: 'returnFocusRef',
				description:
					'If ref is passed, focus returns to that specific ref element after dropdown dismissed.',
				type: 'React.RefObject<HTMLElement>',
			},
			{
				name: 'shouldFitContainer',
				description:
					"This fits the dropdown menu width to its parent's width.\nWhen set to `true`, the trigger and dropdown menu elements will be wrapped in a `div` with `position: relative`.\nThe dropdown menu will be rendered as a sibling to the trigger element, and will be full width.\nThe default is `false`.\n\nThis fits the dropdown menu width to its parent's width.\nWhen set to `true`, the trigger and dropdown menu elements will be wrapped in a `div` with `position: relative`.\nThe dropdown menu will be rendered as a sibling to the trigger element, and will be full width.\nThe default is `false`.",
				type: 'boolean',
			},
			{
				name: 'shouldFlip',
				description:
					'Allows the dropdown menu to be placed on the opposite side of its trigger if it does not\nfit in the viewport.',
				type: 'boolean',
			},
			{
				name: 'shouldRenderToParent',
				description:
					'Controls whether the popup is rendered inline within its parent component or in a portal at the document root.\n`true` renders the dropdown menu in the DOM node closest to the trigger; focus is not trapped inside the element.\n`false` renders the dropdown menu in React.Portal and focus is trapped inside the element.\nDefaults to `false`.\nControls whether the popup is rendered inline within its parent component or in a portal at the document root.\n`true` renders the dropdown menu in the DOM node closest to the trigger; focus is not trapped inside the element.\n`false` renders the dropdown menu in React.Portal and focus is trapped inside the element.\nDefaults to `false`.',
				type: 'boolean',
			},
			{
				name: 'spacing',
				description: 'Controls the spacing density of the menu.',
				type: '"compact" | "cozy"',
			},
			{
				name: 'statusLabel',
				description: 'Text to be used as status for assistive technologies. Defaults to "Loading".',
				type: 'string',
			},
			{
				name: 'strategy',
				description:
					'This controls the positioning strategy to use. Can vary between `absolute` and `fixed`.\nThe default is `fixed`.\nThis controls the positioning strategy to use. Can vary between `absolute` and `fixed`.\nThe default is `fixed`.',
				type: '"absolute" | "fixed"',
			},
			{
				name: 'trigger',
				description:
					'Content that triggers the dropdown menu to open and close. Use with\n`triggerType` to get a button trigger. To customize the trigger element,\nprovide a function to this prop. You can find\n[examples for custom triggers](https://atlassian.design/components/dropdown-menu/examples#custom-triggers)\nin our documentation.',
				type: 'string | ((triggerButtonProps: CustomTriggerProps<T>) => React.ReactElement<any, string | React.JSXElementConstructor<any>>)',
			},
			{
				name: 'zIndex',
				description:
					'Z-index that the popup should be displayed in.\nThis is passed to the portal component.\nDefaults to `layers.modal()` from `@atlaskit/theme` which is 510.',
				type: 'number',
			},
		],
	},
	{
		name: 'EmptyState',
		package: '@atlaskit/empty-state',
		keywords: ['empty', 'state', 'placeholder', 'no-content', 'void'],
		category: 'status',
		description: 'A component for empty states.',
		status: 'general-availability',
		examples: [
			'import EmptyState from \'@atlaskit/empty-state\';\nexport default [\n\t<EmptyState header="No items" description="Add items to get started" />,\n\t<EmptyState\n\t\theader="No search results"\n\t\tdescription="Try adjusting your search criteria or browse all items."\n\t/>,\n\t<EmptyState\n\t\theader="Welcome to your dashboard"\n\t\tdescription="Create your first project to get started with the platform."\n\t/>,\n];',
		],
		accessibilityGuidelines: [
			'Provide clear empty state messaging',
			'Use appropriate headings and structure',
			'Ensure actionable content is accessible',
			'Consider screen reader experience',
		],
		usageGuidelines: [
			'Use when nothing to display in a view',
			'Explain why the state is empty',
			'Provide clear next steps',
			'Keep tone helpful and encouraging',
			'Consider all scenarios causing the empty state',
		],
		contentGuidelines: [
			'Use inspirational, motivating tone for first-time view',
			'Provide specific next steps',
			'Avoid negative language',
			'Use clear, descriptive headers',
		],
		props: [
			{
				name: 'buttonGroupLabel',
				description:
					'Accessible name for the action buttons group of empty state. Can be used for internationalization. Default is "Button group".',
				type: 'string',
			},
			{
				name: 'description',
				description: 'The main block of text that holds additional supporting information.',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'header',
				description: 'Title that briefly describes the page to the user.',
				type: 'string',
			},
			{
				name: 'headingLevel',
				description:
					'The value used to set the heading level of the header element.\nMust be in the range of 1 to 6. Defaults to 4.',
				type: 'number',
			},
			{
				name: 'headingSize',
				description:
					'The keyword used to set the visual appearance of the header element.\nDefaults to "medium". "xsmall" can be used for empty states in smaller contexts such as popups.',
				type: '"xsmall" | "medium"',
			},
			{
				name: 'imageHeight',
				description:
					'Height of the image that is rendered in EmptyState component.\nUseful when you want image to be of exact height to stop it bouncing around when loading in.\nOnly set `height` if you want the image to resize down on smaller devices.',
				type: 'number',
			},
			{
				name: 'imageUrl',
				description:
					'The url of image that will be shown above the title, fed directly into the `src` prop of an <img> element.\nNote, this image will be constrained by the `maxWidth` and `maxHeight` props.',
				type: 'string',
			},
			{
				name: 'imageWidth',
				description:
					'Width of the image that is rendered in EmptyState component.\nUseful when you want image to be of exact width to stop it bouncing around when loading in.',
				type: 'number',
			},
			{
				name: 'isLoading',
				description:
					'Used to indicate a loading state. Will show a spinner next to the action buttons when true.',
				type: 'boolean',
			},
			{
				name: 'maxImageHeight',
				description: 'Maximum height (in pixels) of the image, default value is 160.',
				type: 'number',
			},
			{
				name: 'maxImageWidth',
				description: 'Maximum width (in pixels) of the image, default value is 160.',
				type: 'number',
			},
			{
				name: 'primaryAction',
				description:
					'Primary action button for the page, usually it will be something like "Create" (or "Retry" for error pages).',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'renderImage',
				description:
					'An alternative API to supply an image using a render prop. Only rendered if no `imageUrl` is supplied.',
				type: '(props: RenderImageProps) => React.ReactNode',
			},
			{
				name: 'secondaryAction',
				description: 'Secondary action button for the page.',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'tertiaryAction',
				description:
					'Button with link to some external resource like documentation or tutorial, it will be opened in a new tab.',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'width',
				description: 'Controls how much horizontal space the component fills. Defaults to "wide".',
				type: '"narrow" | "wide"',
			},
		],
	},
	{
		name: 'Flag',
		package: '@atlaskit/flag',
		keywords: ['flag', 'message', 'notification', 'alert', 'toast'],
		category: 'feedback',
		description: 'A component for displaying brief messages.',
		status: 'general-availability',
		examples: [
			'import Flag, { FlagGroup } from \'@atlaskit/flag\';\nimport InfoIcon from \'@atlaskit/icon/core/status-information\';\nexport default [\n\t<FlagGroup>\n\t\t<Flag\n\t\t\tid="flag-1"\n\t\t\ticon={<InfoIcon label="Info" />}\n\t\t\ttitle="Success"\n\t\t\tdescription="Your changes have been saved successfully."\n\t\t\tappearance="success"\n\t\t/>\n\t</FlagGroup>,\n\t<FlagGroup>\n\t\t<Flag\n\t\t\tid="flag-2"\n\t\t\ticon={<InfoIcon label="Warning" />}\n\t\t\ttitle="Warning"\n\t\t\tdescription="This action cannot be undone."\n\t\t\tappearance="warning"\n\t\t\tactions={[\n\t\t\t\t{\n\t\t\t\t\tcontent: \'Proceed\',\n\t\t\t\t\tonClick: () => console.log(\'Proceed clicked\'),\n\t\t\t\t},\n\t\t\t]}\n\t\t/>\n\t</FlagGroup>,\n\t<FlagGroup>\n\t\t<Flag\n\t\t\tid="flag-3"\n\t\t\ticon={<InfoIcon label="Error" />}\n\t\t\ttitle="Error"\n\t\t\tdescription="Something went wrong. Please try again."\n\t\t\tappearance="error"\n\t\t\tactions={[\n\t\t\t\t{\n\t\t\t\t\tcontent: \'Retry\',\n\t\t\t\t\tonClick: () => console.log(\'Retry clicked\'),\n\t\t\t\t},\n\t\t\t]}\n\t\t/>\n\t</FlagGroup>,\n];',
		],
		accessibilityGuidelines: [
			'Ensure flag content is announced by screen readers',
			'Use appropriate timing for auto-dismiss',
			'Provide clear action options',
			'Consider screen reader announcement conflicts',
			'Use an h2 heading level for the title',
			'Use the `headingLevel` prop to maintain proper heading hierarchy',
		],
		usageGuidelines: [
			'Use for confirmations and alerts needing minimal interaction',
			'Display event-driven messages',
			'Position at bottom left of screen',
			'Consider auto-dismiss timing',
		],
		contentGuidelines: [
			'Be clear about what went wrong for errors',
			'Provide specific steps to resolve issues',
			'Use a helpful, non-threatening tone',
			'Clearly state potential consequences for warnings',
			'Confirm outcome then get out of the way for success messages',
		],
		props: [
			{
				name: 'actions',
				description:
					"Array of clickable actions to be shown at the bottom of the flag. For flags where appearance\nis 'normal', actions will be shown as links. For all other appearance values, actions will\nshown as buttons.\nIf href is passed the action will be shown as a link with the passed href prop.",
				type: 'ActionType[]',
			},
			{
				name: 'appearance',
				description:
					"Makes the flag appearance bold. Setting this to anything other than 'normal' hides the\ndismiss button.",
				type: '"error" | "info" | "success" | "warning" | "normal"',
			},
			{
				name: 'delayAnnouncement',
				description:
					'Milliseconds to delay the screen reader announcement due to announcement conflict.',
				type: 'number',
			},
			{
				name: 'description',
				description: 'The secondary content shown below the flag title.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'headingLevel',
				description:
					'Specifies the heading level in the document structure.\nIf not specified, the default is `2`.',
				type: '1 | 2 | 3 | 4 | 5 | 6',
			},
			{
				name: 'icon',
				description:
					'The icon displayed in the top-left of the flag. Should be an instance of `@atlaskit/icon`.\nYour icon will receive the appropriate default color, which you can override by setting\nthe `color` prop on the icon to your preferred icon color.\nIf no icon is provided, a default icon will be used based on the appearance prop.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'id',
				description: 'A unique identifier used for rendering and onDismissed callbacks.',
				type: 'string | number',
			},
			{
				name: 'linkComponent',
				description:
					'A link component that is passed down to the `@atlaskit/button` used by actions,\nto allow custom routers to be used. See the\n[button with router](https://atlaskit.atlassian.com/packages/design-system/button/example/ButtonWithRouter)\nexample of what this component should look like.',
				type: 'ComponentClass<CustomThemeButtonProps, any> | FunctionComponent<CustomThemeButtonProps>',
			},
			{
				name: 'onBlur',
				description: 'Standard onBlur event, applied to Flag by AutoDismissFlag.',
				type: '(e: FocusEvent<HTMLElement, Element>, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'onDismissed',
				description:
					"Handler which will be called when a Flag's dismiss button is clicked.\nReceives the id of the dismissed Flag as a parameter.",
				type: '(id: string | number, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'onFocus',
				description: 'Standard onFocus event, applied to Flag by AutoDismissFlag.',
				type: '(e: FocusEvent<HTMLElement, Element>, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'onMouseOut',
				description: 'Standard onMouseOut event, applied to Flag by AutoDismissFlag.',
				type: '(event: MouseEvent<Element, globalThis.MouseEvent>) => void',
			},
			{
				name: 'onMouseOver',
				description: 'Standard onMouseOver event, applied to Flag by AutoDismissFlag.',
				type: '(event: MouseEvent<Element, globalThis.MouseEvent>) => void',
			},
			{
				name: 'title',
				description: 'The bold text shown at the top of the flag.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
		],
	},
	{
		name: 'Form',
		package: '@atlaskit/form',
		keywords: ['form', 'validation', 'field', 'input', 'submit', 'state'],
		category: 'form',
		description: 'A component for building forms with validation and state management.',
		status: 'general-availability',
		examples: [
			'import Button from \'@atlaskit/button/new\';\nimport { Checkbox } from \'@atlaskit/checkbox\';\nimport Form, { CheckboxField, ErrorMessage, Field, FormFooter, FormHeader } from \'@atlaskit/form\';\nimport TextField from \'@atlaskit/textfield\';\nexport default [\n\t<Form onSubmit={(data) => console.log(\'validated form\', data)}>\n\t\t<FormHeader title="Basic Form">\n\t\t\t<p>Fill out the form below</p>\n\t\t</FormHeader>\n\t\t<Field\n\t\t\tname="username"\n\t\t\tlabel="Username"\n\t\t\tisRequired\n\t\t\tvalidate={(value) => (value && value.length < 3 ? \'Too short\' : undefined)}\n\t\t>\n\t\t\t{({ fieldProps, error }) => (\n\t\t\t\t<>\n\t\t\t\t\t<TextField {...fieldProps} />\n\t\t\t\t\t{error && <ErrorMessage>Username must be at least 3 characters</ErrorMessage>}\n\t\t\t\t</>\n\t\t\t)}\n\t\t</Field>\n\t\t<CheckboxField name="terms" value="terms">\n\t\t\t{({ fieldProps }) => <Checkbox {...fieldProps} label="I accept the terms" />}\n\t\t</CheckboxField>\n\t\t<FormFooter>\n\t\t\t<Button type="submit" appearance="primary">\n\t\t\t\tCreate Account\n\t\t\t</Button>\n\t\t</FormFooter>\n\t</Form>,\n];',
		],
		accessibilityGuidelines: [
			'Provide clear labels for all form fields',
			'Use appropriate error messaging',
			'Ensure keyboard navigation between fields',
			'Mark required fields clearly',
			'Provide helpful validation feedback',
		],
		usageGuidelines: [
			'Use for complex forms with validation',
			'Provide clear field labels and instructions',
			'Use single column layout for better comprehension',
			'Mark required fields with asterisk (*)',
			'Provide specific error messages',
		],
		contentGuidelines: [
			'Use clear, concise labels',
			'Write helpful placeholder text',
			'Provide specific error messages',
			'Use consistent terminology',
			'Always include a visible label (exception: search fields)',
			'Match field length to intended content length',
		],
		props: [
			{
				name: 'autocomplete',
				description:
					"Indicates whether the value of the form's controls can be automatically completed by the browser. It is `on` by default.",
				type: '"off" | "on"',
			},
			{
				name: 'children',
				description:
					'The contents rendered inside of the form. This is a function where the props will be passed from the form. The function props you can access are `dirty`, `submitting` and `disabled`.\nYou can read more about these props in [react-final form documentation](https://final-form.org/docs/final-form/types/FormState).\n\nIf you are only spreading `formProps` onto the HTML `<form>` element and not using any of the other props (like `submitting`, etc.), `children` can be plain JSX. All of the children will be wrapped within an HTML `<form>` element that includes all necessary props, including those provided on the form component.',
				type: '(() => void) | React.ReactNode | ((args: FormChildrenArgs<FormValues>) => React.ReactNode)',
			},
			{
				name: 'formProps',
				description:
					'When `Form` renders JSX children directly and not using a function to\nspread `formProps` manually, the properties in this `formProps` prop will\nbe spread on an internally rendered  HTML `form` element.',
				type: '{ [x: string]: any; } & ExcludeReservedFormProps',
			},
			{
				name: 'id',
				description: '`id` attribute applied to the `form` element.',
				type: 'string',
			},
			{
				name: 'isDisabled',
				description:
					'Sets the form and its fields as disabled. Users cannot edit or focus on the fields.',
				type: 'boolean',
			},
			{
				name: 'label',
				description:
					'Accessible name to be applied to the form element. Maps to the `aria-label` attribute.',
				type: 'string',
			},
			{
				name: 'labelId',
				description:
					'ID of the element that has the accessible name to be applied to the form element. Maps to the `aria-labelledby` attribute.',
				type: 'string',
			},
			{
				name: 'name',
				description: '`name` attribute applied to the `form` element.',
				type: 'string',
			},
			{
				name: 'noValidate',
				description:
					'Indicates if the inputs within the form will bypass HTML5 constraint\nvalidation when submitted. This is not recommended to be used because it\ncan cause experiences to be inaccessible. It is `false` by default but will\nbe set to `true` in the future to increase accessibility, so it is **not recommended**.',
				type: 'boolean',
			},
			{
				name: 'onSubmit',
				description:
					'Event handler called when the form is submitted. Fields must be free of validation errors.',
				type: '(values: FormValues, form: FormApi<FormValues>, callback?: (errors?: Record<string, string>) => void) => void | Object | Promise<...>',
			},
			{
				name: 'xcss',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
				type: 'false | (XCSSValue<"flex" | "grid" | "fill" | "stroke" | "all" | "bottom" | "left" | "right" | "top" | "clip" | "accentColor" | "alignContent" | "alignItems" | "alignSelf" | "alignTracks" | ... 458 more ... | "vectorEffect", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
			},
		],
	},
	{
		name: 'Heading',
		package: '@atlaskit/heading',
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
		description:
			'A component for creating accessible, consistently styled headings with proper hierarchy. Headings are sized to contrast with content, increase visual hierarchy, and help readers easily understand the structure of content.',
		status: 'general-availability',
		examples: [
			'import Heading from \'@atlaskit/heading\';\nexport default [\n\t<Heading size="xxlarge">Page Title</Heading>,\n\t<Heading size="large" color="color.text.inverse">\n\t\tInverted section title\n\t</Heading>,\n];',
		],
		accessibilityGuidelines: [
			'Maintain proper heading hierarchy (h1 to h6)',
			'Use only one h1 per page for main page titles',
			'Ensure minimum 4.5:1 color contrast for text readability',
			'Use clear, descriptive heading text that describes the content below',
		],
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
		props: [
			{
				name: 'as',
				description:
					'Allows the component to be rendered as the specified DOM element, overriding a default element set by `level` prop.',
				type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span"',
			},
			{
				name: 'children',
				description: 'The text of the heading.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'color',
				description:
					'Token representing text color with a built-in fallback value.\nWill apply inverse text color automatically if placed within a Box with bold background color.\nDefaults to `color.text`.',
				type: '"color.text" | "color.text.inverse" | "color.text.warning.inverse"',
			},
			{
				name: 'id',
				description: 'Unique identifier for the heading DOM element.',
				type: 'string',
			},
			{
				name: 'size',
				description:
					'Heading size. This value is detached from the specific heading level applied to allow for more flexibility.\nUse instead of the deprecated `level` prop.',
				type: '"xxlarge" | "xlarge" | "large" | "medium" | "small" | "xsmall" | "xxsmall"',
			},
		],
	},
	{
		name: 'HeadingContextProvider',
		package: '@atlaskit/heading',
		keywords: ['heading', 'context', 'provider', 'hierarchy', 'accessibility'],
		category: 'primitive',
		description:
			'A context provider that allows you to configure the default HTML heading level for all headings within its subtree. Useful for maintaining proper heading hierarchy in complex layouts.',
		status: 'general-availability',
		examples: [
			'import Heading, { HeadingContextProvider } from \'@atlaskit/heading\';\nexport default [\n\t<HeadingContextProvider>\n\t\t<Heading size="xxlarge">h1</Heading>\n\t\t<Heading size="medium">h2</Heading>\n\t\t<Heading size="large">h3</Heading>\n\t</HeadingContextProvider>,\n];',
		],
		usageGuidelines: [
			'Wrap sections that need different heading hierarchy',
			'Use for complex layouts where heading levels need adjustment',
		],
		contentGuidelines: [
			'Ensure proper heading hierarchy is maintained',
			'Use clear, descriptive heading text',
			'Keep headings concise and meaningful',
		],
		props: [
			{
				name: 'children',
				description: 'Semantic hierarchy of content below the heading context.',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'value',
				description:
					'Optional - only apply this value if the intent is to reset the heading context outside the normal content flow, for example inside a `section`.',
				type: '0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9',
			},
		],
	},
	{
		name: 'Icon',
		package: '@atlaskit/icon',
		keywords: ['icon', 'symbol', 'command', 'device', 'directory', 'action', 'visual'],
		category: 'images-and-icons',
		description: 'An icon is a symbol representing a command, device, directory, or common action.',
		status: 'general-availability',
		examples: [
			"import AddIcon from '@atlaskit/icon/core/add';\nimport DeleteIcon from '@atlaskit/icon/core/delete';\nimport StarIcon from '@atlaskit/icon/core/star-starred';\nimport { token } from '@atlaskit/tokens';\nexport default [\n\t<AddIcon label=\"Add\" />,\n\t<StarIcon label=\"Star\" color=\"currentColor\" />,\n\t<DeleteIcon label=\"Delete\" color={token('color.icon.danger')} />,\n];",
		],
		accessibilityGuidelines: [
			'Provide appropriate alt text or labels for icons',
			'Use meaningful icon choices that convey clear meaning',
			'Ensure sufficient color contrast for icon visibility',
			'Consider icon size for touch targets',
			'Use consistent iconography across the interface',
		],
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
		props: [
			{
				name: 'children',
				description:
					"The content to be rendered inside the glyph component.\nOnly for legacy icons that used R16's implicit children prop.\nIt doesn't actually serve any purpose, but is required to resolve R18 type errors\nwithout updating all the legacy icon usages.",
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'glyph',
				description:
					'Custom icon component that returns an SVG element with set `viewBox`,\n`width`, and `height` props.',
				type: 'ComponentClass<CustomGlyphProps, any> | FunctionComponent<CustomGlyphProps>',
			},
			{
				name: 'isFacadeDisabled',
				description: 'Used to opt out of the icon facade.',
				type: 'boolean',
			},
			{
				name: 'label',
				description: 'Text used to describe what the icon is in context.',
				type: 'string',
			},
			{
				name: 'primaryColor',
				description: 'Primary color for the icon.\nInherits the current font color by default.',
				type: 'string',
			},
			{
				name: 'secondaryColor',
				description:
					'Secondary color for the icon.\nDefaults to the page background for an icon that supports two colors.',
				type: 'string',
			},
			{
				name: 'size',
				description:
					'There are three icon sizes – small (16px), medium (24px), and large (32px).\nThis pixel size refers to the canvas the icon sits on,\nnot the size of the icon shape itself.',
				type: '"small" | "medium" | "large" | "xlarge"',
			},
		],
	},
	{
		name: 'IconTile',
		package: '@atlaskit/icon',
		keywords: ['icon', 'tile', 'container', 'background', 'shape', 'appearance'],
		category: 'images-and-icons',
		description:
			'A tile component that displays an icon with customizable background, shape, and appearance.',
		status: 'release-candidate',
		examples: [
			'import { IconTile } from \'@atlaskit/icon\';\nimport AddIcon from \'@atlaskit/icon/core/add\';\nexport default [\n\t<IconTile icon={AddIcon} label="Add" appearance="redBold" />,\n\t<IconTile icon={AddIcon} label="Add" shape="circle" appearance="blue" />,\n];',
		],
		accessibilityGuidelines: [
			'Provide appropriate labels for icon tiles',
			'Ensure sufficient color contrast',
			'Use meaningful icon choices',
			'Consider touch target sizes',
		],
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
		props: [
			{
				name: 'appearance',
				description: 'The appearance of the tile',
				type: '"gray" | "blue" | "teal" | "green" | "lime" | "yellow" | "orange" | "red" | "magenta" | "purple" | "grayBold" | "blueBold" | "tealBold" | "greenBold" | "limeBold" | "yellowBold" | "orangeBold" | "redBold" | "magentaBold" | "purpleBold"',
			},
			{
				name: 'icon',
				description: 'The icon to display',
				type: 'React.ComponentType<NewUtilityIconProps> | React.ComponentType<NewCoreIconProps>',
			},
			{
				name: 'label',
				description: 'The label for the icon',
				type: 'string',
			},
			{
				name: 'size',
				description:
					'Size of the tile, in pixels. Defaults to `24`.\n\nNow supports both semantic t-shirt size names and pixel number values. Pixel number values are deprecated and will be removed in a future release, however they will both be available and backwards-compatible during a transition period.\n\nSize `16` will not have a replacement after deprecation, and should be replaced with direct icons without a tile or enlarging to the next available size `xsmall`.\n\nAll available sizes:\n- `16` (deprecated)\n- `xsmall` (new)\n- `small` or `24`\n- `medium` or `32`\n- `large` or `40`\n- `xlarge` or `48`',
				type: 'NewIconTileSize | LegacyIconTileSize',
			},
			{
				name: 'UNSAFE_circleReplacementComponent',
				description:
					'A component to render in place of circle shaped icon tiles, swapped out with a feature flag.\n\nThis prop is temporary, and will be used by ADS to safely rollout alternatives as circle shaped icon tiles are deprecated.',
				type: 'React.ReactElement<any, string | React.JSXElementConstructor<any>>',
			},
		],
	},
	{
		name: 'Image',
		package: '@atlaskit/image',
		keywords: ['image', 'picture', 'photo', 'visual', 'media'],
		category: 'data-display',
		description: 'A component for displaying images with theme support.',
		status: 'open-beta',
		examples: [
			'import Image from \'@atlaskit/image\';\nexport default [\n\t<Image src="https://picsum.photos/300/150" alt="Wide view" width={300} height={150} />,\n\t<Image src="https://picsum.photos/100/100" alt="User profile" width={100} height={100} />,\n];',
		],
		accessibilityGuidelines: [
			'Always provide meaningful alt text',
			'Ensure appropriate image sizing',
			'Consider loading states and error handling',
			'Use appropriate image formats',
		],
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
		props: [
			{
				name: 'srcDark',
				description:
					'Image URL to use for dark mode. This overrides `src` when the user\nhas selected dark mode either in the app or on their operating system.',
				type: 'string',
			},
		],
	},
	{
		name: 'InlineDialog',
		package: '@atlaskit/inline-dialog',
		keywords: ['dialog', 'inline', 'popup', 'overlay', 'tooltip'],
		category: 'overlay',
		description: 'A component for displaying content in an inline dialog.',
		status: 'general-availability',
		examples: [
			"import Button from '@atlaskit/button/new';\nimport Heading from '@atlaskit/heading';\nimport InlineDialog from '@atlaskit/inline-dialog';\nimport { Text } from '@atlaskit/primitives/compiled';\nexport default [\n\t<InlineDialog content={<div>This is an inline dialog</div>} isOpen={true}>\n\t\t<Button>Trigger</Button>\n\t</InlineDialog>,\n\t<InlineDialog\n\t\tcontent={\n\t\t\t<div>\n\t\t\t\t<Heading size=\"large\">Dialog Title</Heading>\n\t\t\t\t<Text>Dialog content goes here</Text>\n\t\t\t</div>\n\t\t}\n\t\tisOpen={false}\n\t>\n\t\t<Button>Open Dialog</Button>\n\t</InlineDialog>,\n];",
		],
		accessibilityGuidelines: [
			'Ensure proper focus management',
			'Provide clear dialog labels',
			'Use appropriate ARIA attributes',
			'Consider keyboard navigation',
		],
		usageGuidelines: [
			'Use for contextual information display',
			'Position appropriately relative to trigger',
			'Consider dialog sizing and content',
			'Handle focus and escape key behavior',
		],
		contentGuidelines: [
			'Use clear, concise dialog content',
			'Provide meaningful dialog titles',
			'Keep content focused and relevant',
			'Use appropriate dialog sizing',
		],
		props: [
			{
				name: 'children',
				description: 'The elements that the InlineDialog will be positioned relative to.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'content',
				description: 'The elements to be displayed within the InlineDialog.',
				type: 'ReactNode | (() => ReactNode)',
			},
			{
				name: 'fallbackPlacements',
				description:
					"This is a list of backup placements to try.\nWhen the preferred placement doesn't have enough space,\nthe modifier will test the ones provided in the list, and use the first suitable one.\nIf no fallback placements are suitable, it reverts back to the original placement.",
				type: 'Placement[]',
			},
			{
				name: 'isOpen',
				description: 'Sets whether to show or hide the dialog.',
				type: 'boolean',
			},
			{
				name: 'onClose',
				description:
					'Function called when the dialog is open and a click occurs anywhere outside\nthe dialog.',
				type: '(obj: { isOpen: boolean; event: Event; }) => void',
			},
			{
				name: 'onContentBlur',
				description: 'Function called when you lose focus on the object.',
				type: '() => void',
			},
			{
				name: 'onContentClick',
				description: 'Function called when user clicks on the open dialog.',
				type: '() => void',
			},
			{
				name: 'onContentFocus',
				description: 'Function called when user focuses on the open dialog.',
				type: '() => void',
			},
			{
				name: 'placement',
				description: 'Where the dialog should appear, relative to the contents of the children.',
				type: '"auto-start" | "auto" | "auto-end" | "top-start" | "top" | "top-end" | "right-start" | "right" | "right-end" | "bottom-end" | "bottom" | "bottom-start" | "left-end" | "left" | "left-start"',
			},
			{
				name: 'strategy',
				description: "Placement strategy used. Can be 'fixed' or 'absolute'. Defaults to 'fixed'.",
				type: '"fixed" | "absolute"',
			},
		],
	},
	{
		name: 'InlineEdit',
		package: '@atlaskit/inline-edit',
		keywords: ['inline', 'edit', 'editable', 'text', 'input'],
		category: 'form',
		description: 'A component for inline editing of text content.',
		status: 'general-availability',
		examples: [
			'import InlineEdit from \'@atlaskit/inline-edit\';\nexport default [\n\t<InlineEdit\n\t\tonConfirm={() => {}}\n\t\tonCancel={() => {}}\n\t\tdefaultValue="Editable text"\n\t\teditView={() => <div>Edit view</div>}\n\t\treadView={() => <div>Read view</div>}\n\t/>,\n];',
		],
		accessibilityGuidelines: [
			'Ensure proper focus management',
			'Provide clear edit state indicators',
			'Use appropriate ARIA attributes',
			'Consider keyboard navigation',
		],
		usageGuidelines: [
			'Use for inline text editing',
			'Provide clear edit state indicators',
			'Handle save and cancel actions',
			'Consider validation requirements',
		],
		contentGuidelines: [
			'Use clear, descriptive text content',
			'Provide helpful placeholder text',
			'Use appropriate validation messages',
			'Keep content concise but meaningful',
		],
		props: [
			{
				name: 'cancelButtonLabel',
				description: 'Accessibility label for the cancel action button.',
				type: 'string',
			},
			{
				name: 'confirmButtonLabel',
				description:
					'Accessibility label for the confirm action button, which saves the field value into `editValue`.',
				type: 'string',
			},
			{
				name: 'defaultValue',
				description:
					'The user input entered into the field during `editView`. This value is updated and saved by `onConfirm`.',
				type: 'any',
			},
			{
				name: 'editButtonLabel',
				description:
					'Accessibility label for button, which is used to enter `editView` from keyboard.',
				type: 'string',
			},
			{
				name: 'editLabel',
				description:
					"Append 'edit' to the end of the button label (`editButtonLabel`)which allows\nusers of assistive technologies to understand the purpose of the button",
				type: 'string',
			},
			{
				name: 'editView',
				description:
					'The component shown when user is editing (when the inline edit is not in `readView`).',
				type: '(fieldProps: ExtendedFieldProps<FieldValue>, ref: React.RefObject<any>) => React.ReactNode',
			},
			{
				name: 'hideActionButtons',
				description:
					'Sets whether the confirm and cancel action buttons are displayed in the bottom right of the field.',
				type: 'boolean',
			},
			{
				name: 'isEditing',
				description:
					'Sets whether the component shows the `readView` or the `editView`. This is used to manage the state of the input in stateless inline edit.',
				type: 'boolean',
			},
			{
				name: 'isRequired',
				description: 'Determines whether the input value can be confirmed as empty.',
				type: 'boolean',
			},
			{
				name: 'keepEditViewOpenOnBlur',
				description:
					'Sets the view when the element blurs and loses focus (this can happen when a user clicks away).\nWhen set to true, inline edit stays in `editView` when blurred.',
				type: 'boolean',
			},
			{
				name: 'label',
				description: 'Label above the input field that communicates what value should be entered.',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'onCancel',
				description:
					'Exits `editView` and switches back to `readView`. This is called when the cancel action button (x) is clicked.',
				type: '() => void',
			},
			{
				name: 'onConfirm',
				description:
					'Saves and confirms the value entered into the field. It exits `editView` and returns to `readView`.',
				type: '(value: any, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'onEdit',
				description: 'Handler called when readView is clicked.',
				type: '() => void',
			},
			{
				name: 'readView',
				description:
					'The component shown when not in `editView`. This is when the inline edit is read-only and not being edited.',
				type: '() => React.ReactNode',
			},
			{
				name: 'readViewFitContainerWidth',
				description:
					'Determines whether the `readView` has 100% width within its container, or whether it fits the content.',
				type: 'boolean',
			},
			{
				name: 'startWithEditViewOpen',
				description:
					'Determines whether it begins in `editView` or `readView`. When set to true, `isEditing` begins as true and the inline edit\nstarts in `editView`.',
				type: 'boolean',
			},
			{
				name: 'validate',
				description:
					'Displays an inline dialog with a message when the field input is invalid. This is handled by `react-final-form`.',
				type: '(value: any, formState: {}, fieldState: {}) => string | void | Promise<string | void>',
			},
		],
	},
	{
		name: 'InlineMessage',
		package: '@atlaskit/inline-message',
		keywords: ['message', 'inline', 'feedback', 'status', 'alert'],
		category: 'feedback',
		description: 'A component for displaying inline messages and feedback.',
		status: 'general-availability',
		examples: [
			'import InlineMessage from \'@atlaskit/inline-message\';\nexport default [\n\t<InlineMessage\n\t\ttitle="Success"\n\t\tsecondaryText="Your changes have been saved successfully."\n\t\tappearance="confirmation"\n\t/>,\n\t<InlineMessage\n\t\ttitle="Warning"\n\t\tsecondaryText="This action cannot be undone."\n\t\tappearance="warning"\n\t/>,\n\t<InlineMessage\n\t\ttitle="Error"\n\t\tsecondaryText="Something went wrong. Please try again."\n\t\tappearance="error"\n\t/>,\n];',
		],
		accessibilityGuidelines: [
			'Ensure message content is announced by screen readers',
			'Use appropriate message types and colors',
			'Provide clear message context',
			'Consider message timing and persistence',
		],
		usageGuidelines: [
			'Use for inline feedback and messages',
			'Choose appropriate message types',
			'Position messages near relevant content',
			'Consider message timing and dismissal',
		],
		contentGuidelines: [
			'Use clear, concise message text',
			'Provide specific, actionable feedback',
			'Use appropriate tone for message type',
			'Keep messages focused and relevant',
		],
		props: [
			{
				name: 'appearance',
				description:
					'Set the icon to be used before the title. Options are: connectivity,\nconfirmation, info, warning, and error.',
				type: '"connectivity" | "confirmation" | "info" | "warning" | "error"',
			},
			{
				name: 'children',
				description: 'The elements to be displayed by the popup.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'fallbackPlacements',
				description:
					"This is a list of backup placements for the popup to try.\nWhen the preferred placement doesn't have enough space,\nthe modifier will test the ones provided in the list, and use the first suitable one.\nIf no fallback placements are suitable, it reverts back to the original placement.",
				type: 'Placement[]',
			},
			{
				name: 'iconLabel',
				description:
					'Text to be used as the label for the button icon. You must use this to provide information for people who use assistive technology when there is no title and/or secondaryText.',
				type: 'string',
			},
			{
				name: 'placement',
				description:
					'The placement to be passed to the popup. Determines where around\nthe text the dialog is displayed.',
				type: 'AutoPlacement | BasePlacement | VariationPlacement',
			},
			{
				name: 'secondaryText',
				description: 'Text to display second.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'spacing',
				description:
					'The spacing of the underlying icon button. Options are: spacious and compact.',
				type: '"spacious" | "compact"',
			},
			{
				name: 'title',
				description: 'Text to display first, bolded for emphasis.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
		],
	},
	{
		name: 'Link',
		package: '@atlaskit/link',
		keywords: ['link', 'navigation', 'href', 'anchor', 'url'],
		category: 'navigation',
		description: 'A component for navigation links.',
		status: 'general-availability',
		examples: [
			'import Link from \'@atlaskit/link\';\nexport default [\n\t<Link href="/dashboard">Go to Dashboard</Link>,\n\t<Link href="https://atlassian.design" target="_blank">\n\t\tAtlassian Design System\n\t</Link>,\n];',
		],
		accessibilityGuidelines: [
			'Provide clear link text that describes the destination',
			'Use appropriate ARIA attributes for links',
			'Ensure keyboard navigation support',
			'Provide clear visual indicators for link state',
		],
		usageGuidelines: [
			'Use for navigation to other pages or sections',
			'Provide clear link text',
			'Consider link behavior and target attributes',
			'Use appropriate link styling',
		],
		contentGuidelines: [
			'Use clear, descriptive link text',
			'Maintain consistent link styling',
			'Consider link context and destination',
			"Avoid generic text like 'click here'",
		],
		props: [
			{
				name: 'appearance',
				description:
					'The appearance of the link. Defaults to `default`. A `subtle` appearance will render the link with a lighter color and no underline in resting state. Use `inverse` when rendering on bold backgrounds to ensure that the link is easily visible.',
				type: '"default" | "subtle" | "inverse"',
			},
			{
				name: 'children',
				description: '',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'href',
				description:
					'Standard links can be provided as a string, which should be mapped to the\nunderlying router link component.\n\nAlternatively, you can provide an object for advanced link configurations\nby supplying the expected object type to the generic.\n\n@example\n```\nconst MyRouterLink = forwardRef(\n(\n  {\n    href,\n    children,\n    ...rest\n  }: RouterLinkComponentProps<{\n    href: string;\n    replace: boolean;\n  }>,\n  ref: Ref<HTMLAnchorElement>,\n) => { ...\n```',
				type: 'string | RouterLinkConfig',
			},
			{
				name: 'newWindowLabel',
				description:
					'Override the default text to signify that a link opens in a new window.\nThis is appended to the `aria-label` attribute when the `target` prop is set to `_blank`.',
				type: 'string',
			},
			{
				name: 'onClick',
				description:
					"Handler called on click. The second argument provides an Atlaskit UI analytics event that can be fired to a listening channel. See the ['analytics-next' package](https://atlaskit.atlassian.com/packages/analytics/analytics-next) documentation for more information.",
				type: '(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
			},
		],
	},
	{
		name: 'AtlassianIcon',
		package: '@atlaskit/logo',
		keywords: ['logo', 'brand', 'atlassian', 'identity', 'header'],
		category: 'brand',
		description: 'A component for displaying the Atlassian icon.',
		status: 'general-availability',
		examples: [
			'import { AtlassianIcon } from \'@atlaskit/logo\';\nexport default [\n\t<AtlassianIcon appearance="brand" shouldUseNewLogoDesign />,\n\t<AtlassianIcon appearance="neutral" shouldUseNewLogoDesign />,\n];',
		],
		accessibilityGuidelines: [
			'Provide appropriate alt text for the icon',
			'Ensure icon visibility and contrast',
			'Consider icon sizing and placement',
			'Use appropriate icon variants',
		],
		usageGuidelines: [
			'Use for Atlassian brand representation',
			'Choose appropriate icon variants',
			'Consider icon sizing and placement',
			'Maintain brand consistency',
		],
		props: [
			{
				name: 'appearance',
				description:
					'Choice of logo appearance between 3 brand-approved color combinations that will be hooked up to design tokens and theming.',
				type: '"brand" | "neutral" | "inverse"',
			},
			{
				name: 'label',
				description:
					"Accessible text to be used for screen readers (it's optional since the default props provide a label that matches the logo).",
				type: 'string',
			},
			{
				name: 'shouldUseNewLogoDesign',
				description:
					'For logos that support it, enables the new logo design ahead of an upcoming feature flag roll-out.',
				type: 'boolean',
			},
			{
				name: 'size',
				description: 'The size of the icon.',
				type: '"xxsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge"',
			},
		],
	},
	{
		name: 'Lozenge',
		package: '@atlaskit/lozenge',
		keywords: ['lozenge', 'badge', 'label', 'status', 'indicator', 'pill'],
		category: 'status-indicators',
		description:
			'A lozenge is a small visual indicator used to show status, category, or other short text labels.',
		status: 'general-availability',
		examples: [
			'import Lozenge from \'@atlaskit/lozenge\';\nexport default [\n\t<Lozenge appearance="success">Done</Lozenge>,\n\t<Lozenge appearance="inprogress" isBold>\n\t\tIn Progress\n\t</Lozenge>,\n];',
		],
		accessibilityGuidelines: [
			'Ensure sufficient color contrast for text readability',
			'Provide appropriate labels for screen readers',
			'Use meaningful colors and appearances',
			'Consider color-blind users when choosing colors',
		],
		usageGuidelines: [
			'Use for status indicators or short labels',
			'Choose appropriate appearance variants',
			'Keep text concise and meaningful',
			'Use consistent styling across similar lozenges',
			'Consider color coding for different status types',
		],
		contentGuidelines: [
			'Use clear, concise text',
			'Ensure text is meaningful and descriptive',
			'Use consistent terminology across lozenges',
			'Consider text length and readability',
		],
		props: [
			{
				name: 'appearance',
				description: 'The appearance type.',
				type: '"default" | "inprogress" | "moved" | "new" | "removed" | "success"',
			},
			{
				name: 'children',
				description:
					'Elements to be rendered inside the lozenge. This should ideally be just a word or two.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'isBold',
				description: 'Determines whether to apply the bold style or not.',
				type: 'boolean',
			},
			{
				name: 'maxWidth',
				description: 'max-width of lozenge container. Default to 200px.',
				type: 'string | number',
			},
		],
	},
	{
		name: 'MenuGroup',
		package: '@atlaskit/menu',
		keywords: ['menu', 'group', 'navigation', 'section', 'items'],
		category: 'navigation',
		description: 'A component for displaying menus with grouped items.',
		status: 'general-availability',
		examples: [
			'import { ButtonItem, LinkItem, MenuGroup, Section } from \'@atlaskit/menu\';\nexport default [\n\t<MenuGroup spacing="cozy">\n\t\t<Section title="Navigation">\n\t\t\t<LinkItem href="/dashboard">Dashboard</LinkItem>\n\t\t\t<LinkItem href="/projects">Projects</LinkItem>\n\t\t\t<LinkItem href="/settings">Settings</LinkItem>\n\t\t</Section>\n\t</MenuGroup>,\n\t<MenuGroup spacing="compact">\n\t\t<Section title="Actions">\n\t\t\t<ButtonItem>Create New</ButtonItem>\n\t\t\t<ButtonItem>Import</ButtonItem>\n\t\t\t<ButtonItem>Export</ButtonItem>\n\t\t</Section>\n\t\t<Section title="Help">\n\t\t\t<LinkItem href="/docs">Documentation</LinkItem>\n\t\t\t<LinkItem href="/support">Support</LinkItem>\n\t\t</Section>\n\t</MenuGroup>,\n];',
		],
		accessibilityGuidelines: [
			'Provide clear menu item labels',
			'Use appropriate ARIA attributes',
			'Ensure keyboard navigation with arrow keys',
			'Provide clear section titles',
		],
		usageGuidelines: [
			'Use for organizing menu items into sections',
			'Group related menu items together',
			'Use clear section titles',
			'Consider menu density and spacing',
		],
		contentGuidelines: [
			'Use clear, descriptive menu item labels',
			'Group related items logically',
			'Use consistent terminology',
			'Keep menu structure simple',
		],
		props: [
			{
				name: 'children',
				description: 'Children of the menu group.\nThis should generally be `Section` components.',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'isLoading',
				description: 'Used this to tell assistive technologies that the menu group is loading.',
				type: 'boolean',
			},
			{
				name: 'maxHeight',
				description:
					"Use this to constrain the menu group's height to a specific value.\nThis must be set if you want to have scrollable sections.",
				type: 'string | number',
			},
			{
				name: 'maxWidth',
				description: "Use this to constrain the menu group's maximum width to a specific value.",
				type: 'string | number',
			},
			{
				name: 'menuLabel',
				description:
					'Provide an accessible label via `aria-label` for the menu element for assistive technology.',
				type: 'string',
			},
			{
				name: 'minHeight',
				description: "Use this to constrain the menu group's minimum height to a specific value.",
				type: 'string | number',
			},
			{
				name: 'minWidth',
				description: "Use this to constrain the menu group's minimum width to a specific value.",
				type: 'string | number',
			},
			{
				name: 'onClick',
				description:
					'Handler called when clicking on this element,\nor any children elements.\nUseful when needing to stop propagation of child events.',
				type: '(event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => void',
			},
			{
				name: 'role',
				description: 'Use this to override the accessibility role for the element.',
				type: 'string',
			},
			{
				name: 'spacing',
				description: 'Configure the density of the menu group content.',
				type: '"compact" | "cozy"',
			},
		],
	},
	{
		name: 'Modal',
		package: '@atlaskit/modal-dialog',
		keywords: ['modal', 'dialog', 'popup', 'overlay', 'focused', 'interaction', 'layer'],
		category: 'overlay',
		description: 'A modal dialog component for important content.',
		status: 'general-availability',
		examples: [
			'import React, { Fragment, useCallback, useState } from \'react\';\nimport Button from \'@atlaskit/button/new\';\nimport Modal, {\n\tModalBody,\n\tModalFooter,\n\tModalHeader,\n\tModalTitle,\n\tModalTransition,\n} from \'@atlaskit/modal-dialog\';\nimport { Text } from \'@atlaskit/primitives/compiled\';\nexport default function Example() {\n\tconst [isOpen, setIsOpen] = useState(false);\n\tconst openModal = useCallback(() => setIsOpen(true), []);\n\tconst closeModal = useCallback(() => setIsOpen(false), []);\n\treturn (\n\t\t<Fragment>\n\t\t\t<Button aria-haspopup="dialog" appearance="primary" onClick={openModal}>\n\t\t\t\tOpen modal\n\t\t\t</Button>\n\t\t\t<ModalTransition>\n\t\t\t\t{isOpen && (\n\t\t\t\t\t<Modal onClose={closeModal}>\n\t\t\t\t\t\t<ModalHeader hasCloseButton>\n\t\t\t\t\t\t\t<ModalTitle>Duplicate this page</ModalTitle>\n\t\t\t\t\t\t</ModalHeader>\n\t\t\t\t\t\t<ModalBody>\n\t\t\t\t\t\t\tDuplicating this page will make it a child page of{\' \'}\n\t\t\t\t\t\t\t<Text weight="bold">Search - user exploration</Text>, in the{\' \'}\n\t\t\t\t\t\t\t<Text weight="bold">Search & Smarts</Text> space.\n\t\t\t\t\t\t</ModalBody>\n\t\t\t\t\t\t<ModalFooter>\n\t\t\t\t\t\t\t<Button appearance="subtle" onClick={closeModal}>\n\t\t\t\t\t\t\t\tCancel\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t<Button appearance="primary" onClick={closeModal}>\n\t\t\t\t\t\t\t\tDuplicate\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t</ModalFooter>\n\t\t\t\t\t</Modal>\n\t\t\t\t)}\n\t\t\t</ModalTransition>\n\t\t</Fragment>\n\t);\n}',
		],
		accessibilityGuidelines: [
			'Ensure modal content is announced by screen readers',
			'Provide appropriate focus management',
			'Use clear, descriptive modal titles',
			'Ensure keyboard navigation and escape key support',
			'Maintain focus within modal when open',
		],
		usageGuidelines: [
			'Use for important content that requires user attention',
			'Keep modal content focused on a single task',
			'Provide clear action buttons',
			'Use appropriate modal sizes for content',
			'Consider mobile responsiveness',
		],
		contentGuidelines: [
			'Use clear, descriptive titles',
			'Keep content focused on a single task or message',
			'Include clear action buttons',
			'Use sentence case for all text',
			'Provide clear next steps',
		],
		props: [
			{
				name: 'autoFocus',
				description:
					'Focus is moved to the first interactive element inside the modal dialog\nwhen `true`. It is not recommended to set to `false` as this creates\naccessibility regressions. Pass an element `ref` to focus on a specific element.\n\nDefault value is `true`.',
				type: 'boolean | React.RefObject<HTMLElement>',
			},
			{
				name: 'children',
				description: 'Contents of the modal dialog.',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'focusLockAllowlist',
				description:
					'Callback function which lets you allowlist nodes so they can be interacted with outside of the focus lock.\nReturn `true` if focus lock should handle element, `false` if not.',
				type: '(element: HTMLElement) => boolean',
			},
			{
				name: 'height',
				description:
					'Height of the modal dialog.\nWhen unset the modal dialog will grow to fill the viewport and then start overflowing its contents.',
				type: 'string | number',
			},
			{
				name: 'isBlanketHidden',
				description: 'Will remove the blanket tinted background color.',
				type: 'boolean',
			},
			{
				name: 'label',
				description:
					'The label of the modal dialog that is announced to users of assistive\ntechnology. This should only be used if there is no modal title being\nassociated to your modal, either via using the modal title component or the\n`titleId` prop within the `useModal` context.',
				type: 'string',
			},
			{
				name: 'onClose',
				description: 'Callback function called when the modal dialog is requesting to be closed.',
				type: '(e: KeyboardOrMouseEvent, analyticEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'onCloseComplete',
				description: 'Callback function called when the modal dialog has finished closing.',
				type: '(element: HTMLElement) => void',
			},
			{
				name: 'onOpenComplete',
				description: 'Callback function called when the modal dialog has finished opening.',
				type: '(node: HTMLElement, isAppearing: boolean) => void',
			},
			{
				name: 'onStackChange',
				description: 'Callback function called when the modal changes position in the stack.',
				type: '(stackIndex: number) => void',
			},
			{
				name: 'shouldCloseOnEscapePress',
				description: 'Calls `onClose` when pressing escape.',
				type: 'boolean',
			},
			{
				name: 'shouldCloseOnOverlayClick',
				description: 'Calls `onClose` when clicking the blanket behind the modal dialog.',
				type: 'boolean',
			},
			{
				name: 'shouldReturnFocus',
				description:
					'ReturnFocus controls what happens when the user exits\nfocus lock mode. If true, focus returns to the element that had focus before focus lock\nwas activated. If false, focus remains where it was when the FocusLock was deactivated.\nIf ref is passed, focus returns to that specific ref element.',
				type: 'boolean | React.RefObject<HTMLElement>',
			},
			{
				name: 'shouldScrollInViewport',
				description:
					'Will set the scroll boundary to the viewport.\nIf set to false, the scroll boundary is set to the modal dialog body.',
				type: 'boolean',
			},
			{
				name: 'stackIndex',
				description:
					"The stackIndex is a reference to the position (index) of the calling dialog in a modal dialog stack.\nNew modals added to the stack receive the highest stack index of 0. As more modals are added to the stack, their index is dynamically increased according to their new position.\nDon't alter the modal stack position using `stackIndex` in implementations of third-party libraries (e.g. AUI modal), it may lead to unpredictable bugs, especially if the third party library has its own focus lock.\nAdditionally, each modal in the stack gets a vertical offset based on `stackIndex` value.",
				type: 'number',
			},
			{
				name: 'width',
				description:
					'Width of the modal dialog.\nThe recommended way to specify modal width is using named size options.',
				type: 'string | number',
			},
		],
	},
	{
		name: 'PageHeader',
		package: '@atlaskit/page-header',
		keywords: ['page', 'header', 'title', 'breadcrumbs', 'actions'],
		category: 'layout',
		description: 'A component for page headers.',
		status: 'general-availability',
		examples: [
			'import Breadcrumbs, { BreadcrumbsItem } from \'@atlaskit/breadcrumbs\';\nimport Button from \'@atlaskit/button/new\';\nimport PageHeader from \'@atlaskit/page-header\';\nexport default [\n\t<PageHeader>Page Title</PageHeader>,\n\t<PageHeader\n\t\tbreadcrumbs={\n\t\t\t<Breadcrumbs>\n\t\t\t\t<BreadcrumbsItem href="/" text="Home" />\n\t\t\t\t<BreadcrumbsItem href="/projects" text="Projects" />\n\t\t\t\t<BreadcrumbsItem text="Current Project" />\n\t\t\t</Breadcrumbs>\n\t\t}\n\t\tactions={<Button appearance="primary">Create</Button>}\n\t>\n\t\tProject Settings\n\t</PageHeader>,\n\t<PageHeader\n\t\tactions={\n\t\t\t<>\n\t\t\t\t<Button appearance="subtle">Cancel</Button>\n\t\t\t\t<Button appearance="primary">Save Changes</Button>\n\t\t\t</>\n\t\t}\n\t>\n\t\tEdit Profile\n\t</PageHeader>,\n];',
		],
		accessibilityGuidelines: [
			'Provide clear page titles',
			'Use appropriate heading hierarchy',
			'Ensure breadcrumb navigation is accessible',
			'Provide clear action labels',
		],
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
		props: [
			{
				name: 'actions',
				description: 'Contents of the action bar to be rendered next to the page title.',
				type: 'React.ReactElement<any, string | React.JSXElementConstructor<any>>',
			},
			{
				name: 'bottomBar',
				description:
					'Contents of the action bar to be rendered next to the page title. Typically a button group.',
				type: 'React.ReactElement<any, string | React.JSXElementConstructor<any>>',
			},
			{
				name: 'breadcrumbs',
				description: 'Page breadcrumbs to be rendered above the title.',
				type: 'React.ReactElement<any, string | React.JSXElementConstructor<any>>',
			},
			{
				name: 'children',
				description:
					'Contents of the bottom bar to be rendered below the page title. Typically contains a search bar and/or filters.',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'disableTitleStyles',
				description: 'Content of the page title. The text wraps by default.',
				type: 'boolean',
			},
			{
				name: 'id',
				description:
					'Used as the ID of the inner h1 tag. This is exposed so the header text can be used as label of other elements by aria-labelledby.',
				type: 'string',
			},
			{
				name: 'innerRef',
				description:
					'Returns the inner ref to the DOM element of the title. This is exposed so the focus can be set.',
				type: '(element: HTMLElement) => void',
			},
			{
				name: 'truncateTitle',
				description:
					'Prevent the title from wrapping across lines. Avoid using this wherever possible, as truncation can make page headings inaccessible.',
				type: 'boolean',
			},
		],
	},
	{
		name: 'Pagination',
		package: '@atlaskit/pagination',
		keywords: ['pagination', 'pages', 'navigation', 'paging', 'controls'],
		category: 'navigation',
		description: 'A component for pagination controls.',
		status: 'general-availability',
		examples: [
			"import Pagination from '@atlaskit/pagination';\nexport default [\n\t<Pagination\n\t\tpages={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}\n\t\tdefaultSelectedIndex={2}\n\t\tmax={7}\n\t\tonChange={(event, page) => console.log('Page selected:', page)}\n\t/>,\n\t<Pagination\n\t\tpages={['A', 'B', 'C', 'D']}\n\t\tdefaultSelectedIndex={1}\n\t\tonChange={(event, page) => console.log('Letter page:', page)}\n\t/>,\n];",
		],
		accessibilityGuidelines: [
			'Provide clear page navigation labels',
			'Use appropriate ARIA labels for pagination',
			'Ensure keyboard navigation support',
			'Announce page changes to screen readers',
		],
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
		props: [
			{
				name: 'components',
				description: 'Replace the built-in page, previous, next and/ or ellipsis component',
				type: '{ Page?: React.ElementType<any>; Previous?: React.ElementType<any>; Next?: React.ElementType<any>; }',
			},
			{
				name: 'defaultSelectedIndex',
				description: 'Index of the page to be selected by default.',
				type: 'number',
			},
			{
				name: 'getPageLabel',
				description:
					'Helper function to get text displayed on the page button. This is helpful in scenarios when page the page passed in is an object.',
				type: '(page: T, pageIndex: number) => string | number',
			},
			{
				name: 'isDisabled',
				description: 'Sets whether the Paginator is disabled',
				type: 'boolean',
			},
			{
				name: 'label',
				description:
					'The aria-label for the pagination nav wrapper.\nThe default value is "pagination".',
				type: 'string',
			},
			{
				name: 'max',
				description: 'Maximum number of pages to be displayed in the pagination.',
				type: 'number',
			},
			{
				name: 'nextLabel',
				description: 'The aria-label for the next button.\nThe default value is "next".',
				type: 'string',
			},
			{
				name: 'onChange',
				description: 'The onChange handler which is called when the page is changed.',
				type: '(event: React.SyntheticEvent<Element, Event>, page: T, analyticsEvent?: UIAnalyticsEvent) => void',
			},
			{
				name: 'pageLabel',
				description:
					'The aria-label for the individual page numbers.\nThe default value is "page".\nThe page number is automatically appended to the pageLabel.\nFor Example, pageLabel="página" will render aria-label="página 1"\nas the label for page 1.',
				type: 'string',
			},
			{
				name: 'pages',
				description: 'Array of the pages to display.',
				type: 'T[]',
			},
			{
				name: 'previousLabel',
				description: 'The aria-label for the previous button.\nThe default value is "previous".',
				type: 'string',
			},
			{
				name: 'renderEllipsis',
				description:
					'The react Node returned from the function is rendered instead of the default ellipsis node.',
				type: '(arg: { key: string; from: number; to: number; }) => React.ReactElement<any, string | React.JSXElementConstructor<any>>',
			},
			{
				name: 'selectedIndex',
				description: 'Index of the selected page. This will make this pagination controlled.',
				type: 'number',
			},
		],
	},
	{
		name: 'Popper',
		package: '@atlaskit/popper',
		keywords: ['popper', 'positioning', 'tooltip', 'popup', 'overlay'],
		category: 'utility',
		description: 'A component for positioning elements relative to other elements.',
		status: 'general-availability',
		examples: [
			'import { Manager, Popper, Reference } from \'@atlaskit/popper\';\nexport default () => (\n\t<Manager>\n\t\t<Reference>\n\t\t\t{({ ref }) => (\n\t\t\t\t<button ref={ref} type="button">\n\t\t\t\t\tReference element\n\t\t\t\t</button>\n\t\t\t)}\n\t\t</Reference>\n\t\t<Popper placement="right">\n\t\t\t{({ ref, style }) => (\n\t\t\t\t<div ref={ref} style={style} >\n\t\t\t\t\t↔ This text is a popper placed to the right\n\t\t\t\t</div>\n\t\t\t)}\n\t\t</Popper>\n\t</Manager>\n);',
		],
		accessibilityGuidelines: [
			'Ensure proper positioning and visibility',
			'Consider screen reader accessibility',
			'Use appropriate ARIA attributes',
			'Handle focus management',
		],
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
		props: [
			{
				name: 'children',
				description: 'Returns the element to be positioned.',
				type: '(childrenProps: PopperChildrenProps) => React.ReactNode',
			},
			{
				name: 'modifiers',
				description: 'Additional modifiers and modifier overwrites.',
				type: 'readonly Modifier<CustomModifiers, object>[]',
			},
			{
				name: 'offset',
				description:
					'Distance the popup should be offset from the reference in the format of [along, away] (units in px).\nDefaults to [0, 8] - which means the popup will be 8px away from the edge of the reference specified\nby the `placement` prop.',
				type: '[number, number]',
			},
			{
				name: 'placement',
				description: 'Which side of the Reference to show on.',
				type: 'AutoPlacement | BasePlacement | VariationPlacement',
			},
			{
				name: 'referenceElement',
				description: 'Replacement reference element to position popper relative to.',
				type: 'HTMLElement | VirtualElement',
			},
			{
				name: 'shouldFitViewport',
				description:
					'Determines if the popper will have a `max-width` and `max-height` set to\nconstrain it to the viewport.',
				type: 'boolean',
			},
			{
				name: 'strategy',
				description: "Placement strategy used. Can be 'fixed' or 'absolute'",
				type: '"fixed" | "absolute"',
			},
		],
	},
	{
		name: 'Popup',
		package: '@atlaskit/popup',
		keywords: ['popup', 'overlay', 'floating', 'content', 'trigger'],
		category: 'overlay',
		description: 'A component for displaying popup content relative to a trigger element.',
		status: 'general-availability',
		examples: [
			"import React, { useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport Popup from '@atlaskit/popup';\nexport default () => {\n\tconst [isOpen, setIsOpen] = useState(false);\n\treturn (\n\t\t<Popup\n\t\t\tcontent={() => <div>Basic popup content</div>}\n\t\t\tisOpen={isOpen}\n\t\t\tonClose={() => setIsOpen(false)}\n\t\t\tplacement=\"bottom-start\"\n\t\t\ttrigger={(triggerProps) => (\n\t\t\t\t<Button {...triggerProps} onClick={() => setIsOpen(!isOpen)}>\n\t\t\t\t\tToggle Popup\n\t\t\t\t</Button>\n\t\t\t)}\n\t\t\tshouldRenderToParent\n\t\t/>\n\t);\n};",
		],
		accessibilityGuidelines: [
			'Provide appropriate focus management',
			'Use clear trigger labels',
			'Ensure keyboard navigation support',
			'Provide escape key dismissal',
		],
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
		props: [
			{
				name: 'appearance',
				description:
					'The "default" appearance is used for standard popups.\nThe "UNSAFE_modal-below-sm" appearance makes the popup appear as a modal when the viewport is smaller than "sm".',
				type: '"default" | "UNSAFE_modal-below-sm"',
			},
			{
				name: 'autoFocus',
				description:
					'This controls whether the popup takes focus when opening.\nThis changes the `popupComponent` component tabIndex to `null`.\nThe default is `true`.',
				type: 'boolean',
			},
			{
				name: 'boundary',
				description:
					'The boundary element that the popup will check for overflow.\nThe default is `"clippingParents"` which are parent scroll containers,\nbut can be set to any element.',
				type: '"clippingParents" | HTMLElement',
			},
			{
				name: 'content',
				description: 'Render props for content that is displayed inside the popup.',
				type: '(props: ContentProps) => ReactNode',
			},
			{
				name: 'fallbackPlacements',
				description:
					"This is a list of backup placements for the popup to try.\nWhen the preferred placement doesn't have enough space,\nthe modifier will test the ones provided in the list, and use the first suitable one.\nIf no fallback placements are suitable, it reverts back to the original placement.",
				type: 'Placement[]',
			},
			{
				name: 'id',
				description: 'ID that is assigned to the popup container element.',
				type: 'string',
			},
			{
				name: 'isOpen',
				description:
					'Use this to either show or hide the popup.\nWhen set to `false` the popup will not render anything to the DOM.',
				type: 'boolean',
			},
			{
				name: 'label',
				description:
					'Refers to an `aria-label` attribute. Sets an accessible name for the popup to announce it to users of assistive technology.\nUsage of either this, or the `titleId` attribute is strongly recommended.',
				type: 'string',
			},
			{
				name: 'modifiers',
				description:
					'Additional modifiers and modifier overwrites.\nfor more details - https://popper.js.org/docs/v1/#modifiers',
				type: 'Partial<Partial<Modifier<string, object>>>[]',
			},
			{
				name: 'offset',
				description:
					'The distance the popup should be offset from the reference in the format of [along, away] (units in px).\nThe default is `[0, 8]`, which means the popup will be `8px` away from the edge of the reference specified\nby the `placement` prop.',
				type: '[number, number]',
			},
			{
				name: 'onClose',
				description:
					"Handler that is called when the popup wants to close itself.\nThis can happen when:\n- the user clicks away from the popup\n- the user presses the escape key\n- the popup is closed programatically. In this case, the `event` argument will be `null`.\n\nYou'll want to use this to set open state accordingly, and then pump it back into the `isOpen` prop.",
				type: '(event: Event | MouseEvent<Element, globalThis.MouseEvent> | KeyboardEvent<Element>, currentLevel?: any) => void',
			},
			{
				name: 'placement',
				description:
					'Placement of where the popup should be displayed relative to the trigger element.\nThe default is `"auto"`.',
				type: 'AutoPlacement | BasePlacement | VariationPlacement',
			},
			{
				name: 'popupComponent',
				description:
					'The element that is shown when `isOpen` prop is `true`.\nThe result of the `content` prop will be placed as children here.\nThe default is an element with an elevation of `e200` with _no padding_.',
				type: 'ComponentType<PopupComponentProps> | ForwardRefExoticComponent<Omit<PopupComponentProps, "ref"> & RefAttributes<HTMLDivElement>>',
			},
			{
				name: 'role',
				description:
					'Use this to set the accessibility role for the popup.\nWe strongly recommend using only `menu` or `dialog`.\nMust be used along with `label` or `titleId`.',
				type: 'string',
			},
			{
				name: 'rootBoundary',
				description:
					'The root boundary that the popup will check for overflow.\nThe default is `"viewport"` but it can be set to `"document"`.',
				type: '"viewport" | "document"',
			},
			{
				name: 'shouldDisableFocusLock',
				description:
					'This makes the popup close on Tab key press. It will only work when `shouldRenderToParent` is `true`.\nThe default is `false`.',
				type: 'boolean',
			},
			{
				name: 'shouldFitContainer',
				description:
					"This fits the popup width to its parent's width.\nWhen set to `true`, the trigger and popup elements will be wrapped in a `div` with `position: relative`.\nThe popup will be rendered as a sibling to the trigger element, and will be full width.\nThe default is `false`.\n\nThis fits the popup width to its parent's width.\nWhen set to `true`, the trigger and popup elements will be wrapped in a `div` with `position: relative`.\nThe popup will be rendered as a sibling to the trigger element, and will be full width.\nThe default is `false`.",
				type: 'boolean',
			},
			{
				name: 'shouldFitViewport',
				description:
					'Determines if the popup will have a `max-width` and `max-height` set to\nconstrain it to the viewport.',
				type: 'boolean',
			},
			{
				name: 'shouldFlip',
				description:
					"Allows the popup to be placed on the opposite side of its trigger if it doesn't fit in the viewport.\nThe default is `true`.",
				type: 'boolean',
			},
			{
				name: 'shouldRenderToParent',
				description:
					'The root element where the popup should be rendered.\nDefaults to `false`.\nThe root element where the popup should be rendered.\nDefaults to `false`.',
				type: 'boolean',
			},
			{
				name: 'shouldReturnFocus',
				description:
					'This determines whether the popup trigger will be focused when the popup content closes.\nThe default is `true`.',
				type: 'boolean',
			},
			{
				name: 'shouldUseCaptureOnOutsideClick',
				description:
					'This controls if the event which handles clicks outside the popup is be bound with\n `capture: true`.',
				type: 'boolean',
			},
			{
				name: 'strategy',
				description:
					'This controls the positioning strategy to use. Can vary between `absolute` and `fixed`.\nThe default is `fixed`.\nThis controls the positioning strategy to use. Can vary between `absolute` and `fixed`.\nThe default is `fixed`.',
				type: '"absolute" | "fixed"',
			},
			{
				name: 'titleId',
				description:
					'Id referenced by the popup `aria-labelledby` attribute.\nUsage of either this, or the `label` attribute is strongly recommended.',
				type: 'string',
			},
			{
				name: 'trigger',
				description:
					'Render props used to anchor the popup to your content.\nMake this an interactive element,\nsuch as an `@atlaskit/button` component.',
				type: '(props: TriggerProps) => ReactNode',
			},
			{
				name: 'xcss',
				description: 'Bounded style overrides.',
				type: 'false | (XCSSValue<"paddingBlockEnd" | "paddingBlockStart" | "paddingInlineEnd" | "paddingInlineStart" | "width" | "padding" | "paddingBlock" | "paddingInline", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
			},
			{
				name: 'zIndex',
				description:
					'Z-index that the popup should be displayed in.\nThis is passed to the portal component.\nThe default is 400.',
				type: 'number',
			},
		],
	},
	{
		name: 'Portal',
		package: '@atlaskit/portal',
		keywords: ['portal', 'render', 'dom', 'mount', 'teleport'],
		category: 'utility',
		description: 'A component for rendering content outside the normal DOM hierarchy.',
		status: 'general-availability',
		examples: [
			"import Portal from '@atlaskit/portal';\nexport default [\n\t<Portal>\n\t\t<div>This content is rendered in a portal</div>\n\t</Portal>,\n\t<Portal zIndex={1000}>\n\t\t<div>This content has a custom z-index</div>\n\t</Portal>,\n];",
		],
		accessibilityGuidelines: [
			'Ensure proper focus management',
			'Consider screen reader accessibility',
			'Use appropriate ARIA attributes',
			'Handle keyboard navigation',
		],
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
		props: [
			{
				name: 'children',
				description: '',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'mountStrategy',
				description:
					'Specify the mount strategy: useEffect or useLayoutEffect.\nNote: UseLayoutEffect can lead to performance issues and is discouraged.',
				type: '"effect" | "layoutEffect"',
			},
			{
				name: 'zIndex',
				description: '',
				type: 'string | number',
			},
		],
	},
	{
		name: 'Anchor',
		package: '@atlaskit/primitives/compiled',
		keywords: ['anchor', 'link', 'navigation', 'href', 'url', 'primitive', 'compiled'],
		category: 'primitive',
		description: 'A primitive Anchor component for navigation links with compiled styling support.',
		status: 'general-availability',
		examples: [
			'import { Anchor } from \'@atlaskit/primitives/compiled\';\nexport default [\n\t<Anchor href="https://atlassian.design">Atlassian Design System</Anchor>,\n\t<Anchor href="/docs" target="_blank">\n\t\tOpen docs\n\t</Anchor>,\n];',
		],
		accessibilityGuidelines: [
			'Provide clear link text that describes the destination',
			'Use appropriate ARIA attributes for links',
			'Ensure keyboard navigation support',
			'Provide clear visual indicators for link state',
			'Use descriptive link text for screen readers',
		],
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
		props: [
			{
				name: 'children',
				description: 'Elements to be rendered inside the Anchor.',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
			},
			{
				name: 'href',
				description:
					'Standard links can be provided as a string, which should be mapped to the\nunderlying router link component.\n\nAlternatively, you can provide an object for advanced link configurations\nby supplying the expected object type to the generic.\n\n@example\n```\nconst MyRouterLink = forwardRef(\n(\n  {\n    href,\n    children,\n    ...rest\n  }: RouterLinkComponentProps<{\n    href: string;\n    replace: boolean;\n  }>,\n  ref: Ref<HTMLAnchorElement>,\n) => { ...\n```',
				type: 'string | RouterLinkConfig',
			},
			{
				name: 'newWindowLabel',
				description:
					'Override the default text to signify that a link opens in a new window.\nThis is appended to the `aria-label` attribute when the `target` prop is set to `_blank`.',
				type: 'string',
			},
			{
				name: 'onClick',
				description:
					"Handler called on click. The second argument provides an Atlaskit UI analytics event that can be fired to a listening channel. See the ['analytics-next' package](https://atlaskit.atlassian.com/packages/analytics/analytics-next) documentation for more information.",
				type: '(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'xcss',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
				type: 'false | (XCSSValue<"clipPath" | "filter" | "marker" | "mask" | "translate" | "content" | "color" | "grid" | "flex" | "fill" | "stroke" | "all" | "bottom" | "left" | "right" | "top" | ... 457 more ... | "vectorEffect", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
			},
		],
	},
	{
		name: 'Bleed',
		package: '@atlaskit/primitives/compiled',
		keywords: ['bleed', 'layout', 'margin', 'spacing', 'edge', 'primitive', 'compiled'],
		category: 'primitive',
		description:
			'A primitive Bleed component for extending content beyond container boundaries with compiled styling support.',
		status: 'general-availability',
		examples: [
			'import { Bleed, Box } from \'@atlaskit/primitives/compiled\';\nexport default [\n\t<Box padding="space.200" backgroundColor="color.background.neutral.subtle">\n\t\t<Bleed inline="space.100">\n\t\t\t<Box backgroundColor="color.background.brand.bold" padding="space.100">\n\t\t\t\tBleed content\n\t\t\t</Box>\n\t\t</Bleed>\n\t</Box>,\n];',
		],
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
		props: [
			{
				name: 'all',
				description: 'Bleed along both axis.',
				type: '"space.025" | "space.050" | "space.100" | "space.150" | "space.200"',
			},
			{
				name: 'block',
				description: 'Bleed along the block axis',
				type: '"space.025" | "space.050" | "space.100" | "space.150" | "space.200"',
			},
			{
				name: 'children',
				description: 'Elements to be rendered inside the Flex.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'inline',
				description: 'Bleed along the inline axis.',
				type: '"space.025" | "space.050" | "space.100" | "space.150" | "space.200"',
			},
			{
				name: 'role',
				description: 'Accessible role.',
				type: 'string',
			},
			{
				name: 'xcss',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
				type: 'false | (XCSSValue<"all" | "flex" | "grid" | "fill" | "stroke" | "bottom" | "left" | "right" | "top" | "clip" | "accentColor" | "alignContent" | "alignItems" | "alignSelf" | "alignTracks" | ... 458 more ... | "vectorEffect", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
			},
		],
	},
	{
		name: 'Box',
		package: '@atlaskit/primitives/compiled',
		keywords: ['box', 'container', 'div', 'layout', 'primitive', 'compiled'],
		category: 'primitive',
		description:
			'A primitive Box component for layout and container purposes with compiled styling support.',
		status: 'general-availability',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { cssMap, jsx } from '@atlaskit/css';\nimport { Box } from '@atlaskit/primitives/compiled';\nimport { token } from '@atlaskit/tokens';\nconst styles = cssMap({\n\tbox: {\n\t\tpaddingTop: token('space.200'),\n\t\tpaddingRight: token('space.200'),\n\t\tpaddingBottom: token('space.200'),\n\t\tpaddingLeft: token('space.200'),\n\t\tbackgroundColor: token('color.background.neutral.subtle'),\n\t},\n});\nexport default [\n\t<Box padding=\"space.200\" backgroundColor=\"color.background.neutral.subtle\">\n\t\tBasic box\n\t</Box>,\n\t<Box xcss={styles.box}>Styled box</Box>,\n];",
		],
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
		props: [
			{
				name: 'as',
				description:
					"The DOM element to render as the Box.\n- This cannot be any SVG-related element such as `'svg'`, `'animate', `'circle'`, and many more\n- This cannot be a `'a'` (use the `Anchor` primitive instead)\n- This cannot be a `'button'` (use the `Anchor` primitive instead)",
				type: '"object" | "style" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | "base" | "bdi" | "bdo" | "big" | "blockquote" | "body" | "br" | "canvas" | "caption" | "center" | ... 97 more ... | "webview"',
			},
			{
				name: 'backgroundColor',
				description: 'Token representing background color with a built-in fallback value.',
				type: '"utility.elevation.surface.current" | "elevation.surface" | "elevation.surface.overlay" | "elevation.surface.raised" | "elevation.surface.sunken" | "color.background.accent.lime.subtlest" | ... 190 more ... | "elevation.surface.raised.pressed"',
			},
			{
				name: 'xcss',
				description:
					"Apply a subset of permitted styles powered by Atlassian Design System design tokens.\nIt's preferred you do not use `background` in `xcss` or `cssMap()` and instead use `props.backgroundColor` for surface awareness.",
				type: 'false | (XCSSValue<"clipPath" | "filter" | "marker" | "mask" | "height" | "width" | "translate" | "content" | "color" | "border" | "grid" | "page" | "all" | "backgroundColor" | "accentColor" | ... 457 more ... | "vectorEffect", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
			},
		],
	},
	{
		name: 'Flex',
		package: '@atlaskit/primitives/compiled',
		keywords: ['flex', 'layout', 'flexbox', 'alignment', 'primitive', 'compiled'],
		category: 'primitive',
		description: 'A primitive Flex component for flexbox layout with compiled styling support.',
		status: 'general-availability',
		examples: [
			'import { Box, Flex } from \'@atlaskit/primitives/compiled\';\nexport default [\n\t<Flex gap="space.100" alignItems="center">\n\t\t<Box backgroundColor="color.background.accent.blue.subtle" padding="space.100">\n\t\t\tItem 1\n\t\t</Box>\n\t\t<Box backgroundColor="color.background.accent.green.subtle" padding="space.100">\n\t\t\tItem 2\n\t\t</Box>\n\t</Flex>,\n];',
		],
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
		props: [
			{
				name: 'alignItems',
				description: 'Used to align children along the cross axis.',
				type: '"center" | "start" | "stretch" | "end" | "baseline"',
			},
			{
				name: 'as',
				description: 'The DOM element to render as the Flex. Defaults to `div`.',
				type: '"div" | "dl" | "li" | "ol" | "span" | "ul"',
			},
			{
				name: 'children',
				description: 'Elements to be rendered inside the Flex.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'columnGap',
				description: 'Represents the space between each child.',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
			},
			{
				name: 'direction',
				description: 'Represents the flex direction property of CSS flexbox.',
				type: '"column" | "row"',
			},
			{
				name: 'gap',
				description: 'Represents the space between each child.',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
			},
			{
				name: 'justifyContent',
				description: 'Used to align children along the main axis.',
				type: '"center" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | "end"',
			},
			{
				name: 'role',
				description: 'Accessible role.',
				type: 'string',
			},
			{
				name: 'rowGap',
				description: 'Represents the space between each child.',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
			},
			{
				name: 'wrap',
				description: 'Represents the flex wrap property of CSS flexbox.',
				type: '"wrap" | "nowrap"',
			},
			{
				name: 'xcss',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
				type: 'false | (XCSSValue<"clipPath" | "filter" | "marker" | "mask" | "alignItems" | "justifyContent" | "gap" | "columnGap" | "rowGap" | "direction" | "flex" | "grid" | "fill" | "stroke" | ... 459 more ... | "vectorEffect", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
			},
		],
	},
	{
		name: 'Focusable',
		package: '@atlaskit/primitives/compiled',
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
		description:
			'A primitive Focusable component for keyboard navigation and focus management with compiled styling support.',
		status: 'general-availability',
		examples: [
			'import { Box, Focusable } from \'@atlaskit/primitives/compiled\';\nexport default [\n\t<Focusable>\n\t\t<Box padding="space.200" backgroundColor="color.background.neutral.subtle">\n\t\t\tFocusable content\n\t\t</Box>\n\t</Focusable>,\n];',
		],
		accessibilityGuidelines: [
			'Provide clear focus indicators',
			'Use appropriate tab order and navigation',
			'Ensure keyboard accessibility',
			'Provide clear visual feedback for focus state',
			'Use appropriate ARIA attributes',
		],
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
		props: [
			{
				name: 'as',
				description: 'The DOM element to render as the Focusable element.',
				type: '"symbol" | "object" | "style" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | "base" | "bdi" | "bdo" | "big" | "blockquote" | "body" | "br" | "canvas" | "caption" | ... 155 more ... | "view"',
			},
			{
				name: 'children',
				description: '',
				type: 'string | number | boolean | ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
			},
			{
				name: 'isInset',
				description:
					'Controls whether the focus ring should be applied around or within the composed element.',
				type: 'boolean',
			},
			{
				name: 'xcss',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
				type: 'false | (XCSSValue<"clipPath" | "filter" | "marker" | "mask" | "color" | "height" | "width" | "alignmentBaseline" | "baselineShift" | "clip" | "clipRule" | "colorInterpolation" | ... 461 more ... | "viewTimeline", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
			},
		],
	},
	{
		name: 'Grid',
		package: '@atlaskit/primitives/compiled',
		keywords: ['grid', 'layout', 'css-grid', 'alignment', 'primitive', 'compiled'],
		category: 'primitive',
		description: 'A primitive Grid component for CSS Grid layout with compiled styling support.',
		status: 'general-availability',
		examples: [
			'import { cssMap } from \'@atlaskit/css\';\nimport { Box, Grid } from \'@atlaskit/primitives/compiled\';\nconst styles = cssMap({\n\tgrid: {\n\t\tgridTemplateColumns: \'1fr 1fr\',\n\t},\n});\nexport default [\n\t<Grid gap="space.200" xcss={styles.grid}>\n\t\t<Box backgroundColor="color.background.accent.blue.subtle" padding="space.200">\n\t\t\tGrid item 1\n\t\t</Box>\n\t\t<Box backgroundColor="color.background.accent.green.subtle" padding="space.200">\n\t\t\tGrid item 2\n\t\t</Box>\n\t</Grid>,\n];',
		],
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
		props: [
			{
				name: 'alignContent',
				description: 'Used to align the grid along the block axis.',
				type: '"center" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | "end"',
			},
			{
				name: 'alignItems',
				description: 'Used to align children along the block axis.',
				type: '"center" | "start" | "stretch" | "end" | "baseline"',
			},
			{
				name: 'as',
				description: 'The DOM element to render as the Flex. Defaults to `div`.',
				type: '"div" | "ol" | "span" | "ul"',
			},
			{
				name: 'autoFlow',
				description:
					'Specifies how auto-placed items get flowed into the grid. CSS `grid-auto-flow`.',
				type: '"column" | "row" | "dense" | "row dense" | "column dense"',
			},
			{
				name: 'children',
				description:
					'Elements to be rendered inside the grid. Required as a grid without children should not be a grid.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'columnGap',
				description: 'Represents the space between each column.',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
			},
			{
				name: 'gap',
				description: 'Represents the space between each child across both axes.',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
			},
			{
				name: 'id',
				description: 'HTML id attrubute.',
				type: 'string',
			},
			{
				name: 'justifyContent',
				description: 'Used to align children along the inline axis.',
				type: '"center" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | "end"',
			},
			{
				name: 'role',
				description: 'Accessible role.',
				type: 'string',
			},
			{
				name: 'rowGap',
				description: 'Represents the space between each row.',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
			},
			{
				name: 'xcss',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
				type: 'false | (XCSSValue<"clipPath" | "filter" | "marker" | "mask" | "alignItems" | "alignContent" | "justifyContent" | "gap" | "columnGap" | "rowGap" | "flex" | "grid" | "fill" | "stroke" | ... 459 more ... | "vectorEffect", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
			},
		],
	},
	{
		name: 'Inline',
		package: '@atlaskit/primitives/compiled',
		keywords: ['inline', 'layout', 'horizontal', 'spacing', 'primitive', 'compiled'],
		category: 'primitive',
		description: 'A primitive Inline component for horizontal layout with consistent spacing.',
		status: 'general-availability',
		examples: [
			'import AddIcon from \'@atlaskit/icon/core/add\';\nimport { Inline, Text } from \'@atlaskit/primitives/compiled\';\nexport default [\n\t<Inline space="space.100">\n\t\t<AddIcon label="Add item" />\n\t\t<Text>Add item</Text>\n\t</Inline>,\n];',
		],
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
		props: [
			{
				name: 'alignBlock',
				description: 'Used to align children along the block axis (typically vertical).',
				type: '"center" | "start" | "end" | "baseline" | "stretch"',
			},
			{
				name: 'alignInline',
				description: 'Used to align children along the inline axis (typically horizontal).',
				type: '"center" | "start" | "end" | "stretch"',
			},
			{
				name: 'as',
				description: 'The DOM element to render as the Inline. Defaults to `div`.',
				type: '"div" | "dl" | "li" | "ol" | "span" | "ul"',
			},
			{
				name: 'children',
				description: 'Elements to be rendered inside the Inline.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'grow',
				description: 'Used to set whether the container should grow to fill the available space.',
				type: '"hug" | "fill"',
			},
			{
				name: 'role',
				description: 'Accessible role.',
				type: 'string',
			},
			{
				name: 'rowSpace',
				description:
					'Represents the space between rows when content wraps.\nUsed to override the `space` value in between rows.',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
			},
			{
				name: 'separator',
				description:
					'Renders a separator string between each child. Avoid using `separator="•"` when `as="ul" | "ol" | "dl"` to preserve proper list semantics.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'shouldWrap',
				description:
					'Used to set whether children are forced onto one line or will wrap onto multiple lines.',
				type: 'boolean',
			},
			{
				name: 'space',
				description: 'Represents the space between each child.',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
			},
			{
				name: 'spread',
				description: 'Used to distribute the children along the main axis.',
				type: 'string',
			},
			{
				name: 'xcss',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
				type: 'false | (XCSSValue<"clipPath" | "filter" | "marker" | "mask" | "fill" | "gap" | "rowGap" | "flex" | "grid" | "stroke" | "all" | "bottom" | "left" | "right" | "top" | "clip" | "accentColor" | ... 456 more ... | "vectorEffect", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
			},
		],
	},
	{
		name: 'MetricText',
		package: '@atlaskit/primitives/compiled',
		keywords: ['text', 'typography', 'font', 'primitive', 'compiled'],
		category: 'primitive',
		description: 'A primitive Text component for typography with compiled styling support.',
		status: 'general-availability',
		examples: [
			'import { MetricText } from \'@atlaskit/primitives/compiled\';\nexport default [\n\t<MetricText size="small">42</MetricText>,\n\t<MetricText size="large">1,234</MetricText>,\n];',
		],
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
		props: [
			{
				name: 'align',
				description: 'Text alignment.',
				type: '"center" | "end" | "start"',
			},
			{
				name: 'as',
				description: 'HTML tag to be rendered. Defaults to `span`.',
				type: '"div" | "span"',
			},
			{
				name: 'children',
				description: 'Elements rendered within the Text element.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'id',
				description:
					'The [HTML `id` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).',
				type: 'string',
			},
			{
				name: 'role',
				description: 'Accessible role.',
				type: 'string',
			},
			{
				name: 'size',
				description: 'Text size.',
				type: '"small" | "medium" | "large"',
			},
		],
	},
	{
		name: 'Pressable',
		package: '@atlaskit/primitives/compiled',
		keywords: ['pressable', 'interaction', 'touch', 'click', 'primitive', 'compiled'],
		category: 'primitive',
		description:
			'A primitive Pressable component for handling touch and click interactions with compiled styling support.',
		status: 'general-availability',
		examples: [
			"import { Pressable } from '@atlaskit/primitives/compiled';\nexport default [<Pressable onClick={() => alert('Pressed!')}>Custom button</Pressable>];",
		],
		accessibilityGuidelines: [
			'Provide clear visual feedback for press states',
			'Ensure appropriate touch target sizes',
			'Use appropriate ARIA attributes for interactive elements',
			'Provide keyboard navigation support',
		],
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
		props: [
			{
				name: 'isDisabled',
				description: 'Whether the button is disabled.',
				type: 'boolean',
			},
			{
				name: 'onClick',
				description:
					"Handler called on click. The second argument provides an Atlaskit UI analytics event that can be fired to a listening channel. See the ['analytics-next' package](https://atlaskit.atlassian.com/packages/analytics/analytics-next) documentation for more information.",
				type: '(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'xcss',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
				type: 'false | (XCSSValue<"clipPath" | "filter" | "marker" | "mask" | "translate" | "content" | "color" | "grid" | "flex" | "fill" | "stroke" | "all" | "bottom" | "left" | "right" | "top" | ... 457 more ... | "vectorEffect", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
			},
		],
	},
	{
		name: 'Stack',
		package: '@atlaskit/primitives/compiled',
		keywords: ['stack', 'layout', 'vertical', 'horizontal', 'spacing', 'primitive', 'compiled'],
		category: 'primitive',
		description:
			'A primitive Stack component for vertical and horizontal layout with consistent spacing.',
		status: 'general-availability',
		examples: [
			'import Heading from \'@atlaskit/heading\';\nimport { Stack, Text } from \'@atlaskit/primitives/compiled\';\nexport default [\n\t<Stack space="space.100">\n\t\t<Heading size="medium">User name</Heading>\n\t\t<Text>Description</Text>\n\t</Stack>,\n];',
		],
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
		props: [
			{
				name: 'alignBlock',
				description: 'Used to align children along the block axis (typically vertical).',
				type: '"center" | "start" | "end" | "stretch"',
			},
			{
				name: 'alignInline',
				description: 'Used to align children along the inline axis (typically horizontal).',
				type: '"center" | "start" | "end" | "stretch"',
			},
			{
				name: 'as',
				description: 'The DOM element to render as the Stack. Defaults to `div`.',
				type: '"div" | "dl" | "ol" | "span" | "ul"',
			},
			{
				name: 'children',
				description: 'Elements to be rendered inside the Stack.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'grow',
				description: 'Used to set whether the container should grow to fill the available space.',
				type: '"hug" | "fill"',
			},
			{
				name: 'role',
				description: 'Accessible role.',
				type: 'string',
			},
			{
				name: 'space',
				description: 'Represents the space between each child.',
				type: '"space.0" | "space.025" | "space.050" | "space.075" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000"',
			},
			{
				name: 'spread',
				description: 'Used to distribute the children along the main axis.',
				type: 'string',
			},
			{
				name: 'xcss',
				description:
					'Apply a subset of permitted styles powered by Atlassian Design System design tokens.',
				type: 'false | (XCSSValue<"clipPath" | "filter" | "marker" | "mask" | "fill" | "gap" | "flex" | "grid" | "stroke" | "all" | "bottom" | "left" | "right" | "top" | "clip" | "accentColor" | "alignContent" | ... 456 more ... | "vectorEffect", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
			},
		],
	},
	{
		name: 'Text',
		package: '@atlaskit/primitives/compiled',
		keywords: ['text', 'typography', 'font', 'primitive', 'compiled'],
		category: 'primitive',
		description: 'A primitive Text component for typography with compiled styling support.',
		status: 'general-availability',
		examples: [
			'import { Text } from \'@atlaskit/primitives/compiled\';\nexport default [\n\t<Text>Default text</Text>,\n\t<Text size="large" weight="bold">\n\t\tLarge bold text\n\t</Text>,\n];',
		],
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
		props: [
			{
				name: 'align',
				description: 'Text alignment.',
				type: '"center" | "end" | "start"',
			},
			{
				name: 'as',
				description: 'HTML tag to be rendered. Defaults to `span`.',
				type: '"em" | "p" | "span" | "strong"',
			},
			{
				name: 'children',
				description: 'Elements rendered within the Text element.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'color',
				description:
					'Token representing text color with a built-in fallback value.\nWill apply inverse text color automatically if placed within a Box with bold background color.\nDefaults to `color.text` if not nested in other Text components.',
				type: '"inherit" | TextColor',
			},
			{
				name: 'id',
				description:
					'The [HTML `id` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).',
				type: 'string',
			},
			{
				name: 'maxLines',
				description:
					'The number of lines to limit the provided text to. Text will be truncated with an ellipsis.\n\nWhen `maxLines={1}`, `wordBreak` defaults to `break-all` to match the behaviour of `text-overflow: ellipsis`.',
				type: 'number',
			},
			{
				name: 'role',
				description: 'Accessible role.',
				type: 'string',
			},
			{
				name: 'size',
				description: 'Text size.',
				type: '"small" | "large" | "medium" | "UNSAFE_small"',
			},
			{
				name: 'weight',
				description:
					'The [HTML `font-weight` attribute](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight).',
				type: '"medium" | "bold" | "regular" | "semibold"',
			},
			{
				name: 'xcss',
				description: 'Bounded style overrides.',
				type: 'false | (XCSSValue<"overflowWrap" | "textDecorationLine", DesignTokenStyles, ""> & {} & XCSSPseudo<"overflowWrap" | "textDecorationLine", never, never, DesignTokenStyles> & XCSSMediaQuery<...> & { ...; } & { ...; })',
			},
		],
	},
	{
		name: 'ProgressBar',
		package: '@atlaskit/progress-bar',
		keywords: ['progress', 'bar', 'loading', 'status', 'completion', 'indeterminate'],
		category: 'loading',
		description:
			'A progress bar communicates the status of a system process, showing completion percentage or indeterminate progress.',
		status: 'general-availability',
		examples: [
			'import ProgressBar from \'@atlaskit/progress-bar\';\nexport default [<ProgressBar value={0.5} />, <ProgressBar value={0.8} appearance="success" />];',
		],
		accessibilityGuidelines: [
			'Provide appropriate ARIA labels for progress bars',
			'Announce progress changes to screen readers',
			'Use appropriate color contrast for visibility',
			'Provide alternative text for progress status',
		],
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
		props: [
			{
				name: 'appearance',
				description: 'The visual style of the progress bar.',
				type: '"default" | "success" | "inverse"',
			},
			{
				name: 'ariaLabel',
				description:
					"This is the descriptive label that's associated with the progress bar.\nAlways include useful information on the current state of the progress bar so that people who use assistive technology can understand what the current state of the progress bar is.",
				type: 'string',
			},
			{
				name: 'isIndeterminate',
				description: 'Shows the progress bar in an indeterminate state when `true`.',
				type: 'boolean',
			},
			{
				name: 'value',
				description: 'Sets the value of the progress bar, between `0` and `1` inclusive.',
				type: 'number',
			},
		],
	},
	{
		name: 'SuccessProgressBar',
		package: '@atlaskit/progress-bar',
		keywords: ['progress', 'bar', 'success', 'complete', 'finished'],
		category: 'loading',
		description: 'A progress bar variant that indicates successful completion of a process.',
		status: 'general-availability',
		examples: [
			"import { SuccessProgressBar } from '@atlaskit/progress-bar';\nexport default [<SuccessProgressBar value={1.0} />, <SuccessProgressBar value={0.9} />];",
		],
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
		props: [
			{
				name: 'ariaLabel',
				description:
					"This is the descriptive label that's associated with the progress bar.\nAlways include useful information on the current state of the progress bar so that people who use assistive technology can understand what the current state of the progress bar is.",
				type: 'string',
			},
			{
				name: 'isIndeterminate',
				description: 'Shows the progress bar in an indeterminate state when `true`.',
				type: 'boolean',
			},
			{
				name: 'value',
				description: 'Sets the value of the progress bar, between `0` and `1` inclusive.',
				type: 'number',
			},
		],
	},
	{
		name: 'TransparentProgressBar',
		package: '@atlaskit/progress-bar',
		keywords: ['progress', 'bar', 'transparent', 'overlay', 'subtle'],
		category: 'loading',
		description: 'A progress bar variant with transparent background for overlay contexts.',
		status: 'general-availability',
		examples: [
			"import { TransparentProgressBar } from '@atlaskit/progress-bar';\nexport default [<TransparentProgressBar value={0.6} />, <TransparentProgressBar value={0.3} />];",
		],
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
		props: [
			{
				name: 'ariaLabel',
				description:
					"This is the descriptive label that's associated with the progress bar.\nAlways include useful information on the current state of the progress bar so that people who use assistive technology can understand what the current state of the progress bar is.",
				type: 'string',
			},
			{
				name: 'isIndeterminate',
				description: 'Shows the progress bar in an indeterminate state when `true`.',
				type: 'boolean',
			},
			{
				name: 'value',
				description: 'Sets the value of the progress bar, between `0` and `1` inclusive.',
				type: 'number',
			},
		],
	},
	{
		name: 'ProgressIndicator',
		package: '@atlaskit/progress-indicator',
		keywords: ['progress', 'indicator', 'steps', 'completion', 'status'],
		category: 'feedback',
		description: 'A component for displaying progress through steps or completion status.',
		status: 'general-availability',
		examples: [
			"import { ProgressIndicator } from '@atlaskit/progress-indicator';\nexport default [\n\t<ProgressIndicator selectedIndex={1} values={['Step 1', 'Step 2', 'Step 3']} />,\n\t<ProgressIndicator selectedIndex={2} values={['Start', 'In Progress', 'Complete']} />,\n];",
		],
		accessibilityGuidelines: [
			'Ensure progress is announced by screen readers',
			'Use appropriate progress indicators',
			'Provide clear progress context',
			'Consider progress timing and updates',
		],
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
		props: [
			{
				name: 'appearance',
				description: 'Sets the color of the indicators.',
				type: '"default" | "help" | "inverted" | "primary"',
			},
			{
				name: 'ariaControls',
				description:
					'If interaction is enabled, use `ariaControls` to tell assistive technology what elements are controlled by the progress indicator.',
				type: 'string',
			},
			{
				name: 'ariaLabel',
				description:
					'Describes what the indicator represents to assistive technology. The selected index number will be appended to the label.',
				type: 'string',
			},
			{
				name: 'onSelect',
				description: 'Function called when an indicator is selected.',
				type: '(eventData: { event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>; index: number; }, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'selectedIndex',
				description: 'Which indicator is currently selected.',
				type: 'number',
			},
			{
				name: 'size',
				description: 'Sets the width and height of each indicator.',
				type: '"default" | "large"',
			},
			{
				name: 'spacing',
				description: 'Specifies how much of a gutter there is between indicators.',
				type: '"comfortable" | "cozy" | "compact"',
			},
			{
				name: 'values',
				description: 'An array of values mapped over to create the indicators.',
				type: 'any[]',
			},
		],
	},
	{
		name: 'ProgressTracker',
		package: '@atlaskit/progress-tracker',
		keywords: ['progress', 'tracker', 'steps', 'completion', 'workflow'],
		category: 'feedback',
		description: 'A component for tracking progress through multi-step processes.',
		status: 'general-availability',
		examples: [
			"import { ProgressTracker } from '@atlaskit/progress-tracker';\nexport default [\n\t<ProgressTracker\n\t\titems={[\n\t\t\t{ id: 'step1', label: 'Step 1', status: 'visited', percentageComplete: 100 },\n\t\t\t{ id: 'step2', label: 'Step 2', status: 'current', percentageComplete: 40 },\n\t\t\t{ id: 'step3', label: 'Step 3', status: 'disabled', percentageComplete: 0 },\n\t\t\t{ id: 'step4', label: 'Step 4', status: 'unvisited', percentageComplete: 0 },\n\t\t]}\n\t/>,\n];",
		],
		accessibilityGuidelines: [
			'Ensure progress is announced by screen readers',
			'Use appropriate progress indicators',
			'Provide clear progress context',
			'Consider progress timing and updates',
		],
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
		props: [
			{
				name: 'animated',
				description: 'Turns off transition animations if set to false.',
				type: 'boolean',
			},
			{
				name: 'items',
				description: 'Ordered list of stage data.',
				type: 'Stage[]',
			},
			{
				name: 'label',
				description:
					'Use this to provide an aria-label for the overall progress tracker, so that people who use assistive technology get an overview of the tracker\'s purpose. For example, "Sign up progress".',
				type: 'string',
			},
			{
				name: 'spacing',
				description: 'Sets the amount of spacing between the steps.',
				type: '"comfortable" | "cozy" | "compact"',
			},
		],
	},
	{
		name: 'Radio',
		package: '@atlaskit/radio',
		keywords: ['radio', 'button', 'input', 'form', 'selection', 'choice', 'option'],
		category: 'form',
		description:
			'A radio button component for single selection from a set of mutually exclusive choices. Use for custom radio button presentations like options in tables or when you need fine control over individual radio buttons.',
		status: 'general-availability',
		examples: [
			'import { Radio } from \'@atlaskit/radio\';\nexport default () => (\n\t<Radio value="option1" label="Option 1" name="choices" onChange={() => console.log(\'Changed!\')} />\n);',
		],
		accessibilityGuidelines: [
			'Include error messages for required or invalid radio fields',
			'Never preselect high-risk options for payment, privacy, or security',
			"Don't use disabled radio buttons if they need to remain in tab order",
			'Use validation instead of disabled state for better accessibility',
		],
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
			'Avoid alphabetical ordering (not localizable)',
			'Avoid overlapping or skipping numeric choices',
		],
		props: [
			{
				name: 'ariaLabel',
				description: 'The `aria-label` attribute associated with the radio element.',
				type: 'string',
			},
			{
				name: 'isChecked',
				description: 'Set the field as checked.',
				type: 'boolean',
			},
			{
				name: 'isDisabled',
				description:
					'Makes a `Radio` field unselectable when true. Overridden by `isDisabled` prop of `RadioGroup`.',
				type: 'boolean',
			},
			{
				name: 'isInvalid',
				description: 'Marks this as an invalid field.',
				type: 'boolean',
			},
			{
				name: 'isRequired',
				description: 'Marks this as a required field.',
				type: 'boolean',
			},
			{
				name: 'label',
				description: 'The label value for the input rendered to the DOM.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'labelId',
				description:
					'This sets the `aria-labelledby` attribute. It sets an accessible name for\nthe radio, for people who use assistive technology. Use of a visible label\nis highly recommended for greater accessibility support.',
				type: 'string',
			},
			{
				name: 'onChange',
				description:
					'`onChange` event handler, passed into the props of each `Radio` Component instantiated within `RadioGroup`.',
				type: '(e: ChangeEvent<HTMLInputElement>, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'value',
				description: 'Field value.',
				type: 'string',
			},
		],
	},
	{
		name: 'RadioGroup',
		package: '@atlaskit/radio',
		keywords: ['radio', 'group', 'form', 'selection', 'choice', 'options', 'list'],
		category: 'form',
		description:
			'A radio group component that presents a list of options where only one choice can be selected. Use for most radio button scenarios where you want a simple list of mutually exclusive options.',
		status: 'general-availability',
		examples: [
			"import { RadioGroup } from '@atlaskit/radio';\n// Radio group with options\nconst options = [\n\t{ name: 'color', value: 'red', label: 'Red' },\n\t{ name: 'color', value: 'blue', label: 'Blue' },\n];\nexport default () => {\n\tconst [value, setValue] = React.useState('red');\n\treturn (\n\t\t<RadioGroup options={options} value={value} onChange={(e) => setValue(e.currentTarget.value)} />\n\t);\n};",
		],
		accessibilityGuidelines: [
			'Include error messages for required or invalid radio fields',
			'Never preselect high-risk options for payment, privacy, or security',
			"Don't use disabled radio buttons if they need to remain in tab order",
			'Use validation instead of disabled state for better accessibility',
			'Ensure proper keyboard navigation with arrow keys',
		],
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
			'Avoid alphabetical ordering (not localizable)',
			'Avoid overlapping or skipping numeric choices',
		],
		props: [
			{
				name: 'defaultValue',
				description: 'Sets the initial selected value on the `RadioGroup`.',
				type: 'string',
			},
			{
				name: 'id',
				description: '',
				type: 'string',
			},
			{
				name: 'isDisabled',
				description:
					'Sets the disabled state of all `Radio` elements in the group. Overrides the `isDisabled` setting of all child `Radio` items.',
				type: 'boolean',
			},
			{
				name: 'isInvalid',
				description: 'Sets the invalid state of all `Radio` elements in the group.',
				type: 'boolean',
			},
			{
				name: 'isRequired',
				description: 'Sets the required state of all `Radio` elements in the group.',
				type: 'boolean',
			},
			{
				name: 'labelId',
				description:
					'This sets the `aria-labelledby` attribute. It sets an accessible name for\nthe radio, for people who use assistive technology. Use of a visible label\nis highly recommended for greater accessibility support.',
				type: 'string',
			},
			{
				name: 'name',
				description: 'Sets the `name` prop on each of the `Radio` elements in the group.',
				type: 'string',
			},
			{
				name: 'onChange',
				description: 'Function that gets after each change event.',
				type: '(e: React.ChangeEvent<HTMLInputElement>, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'onInvalid',
				description: 'Function that gets fired after each invalid event.',
				type: '(event: React.SyntheticEvent<any, Event>) => void',
			},
			{
				name: 'options',
				description:
					'An array of objects, each object is mapped onto a `Radio` element within the group. Name must be unique to the group.',
				type: 'OptionPropType[]',
			},
			{
				name: 'value',
				description: 'Once set, controls the selected value on the `RadioGroup`.',
				type: 'string',
			},
		],
	},
	{
		name: 'Range',
		package: '@atlaskit/range',
		keywords: ['range', 'slider', 'input', 'form', 'value', 'selection'],
		category: 'form',
		description: 'A component for selecting a value from a range of values.',
		status: 'general-availability',
		examples: [
			"import Range from '@atlaskit/range';\nexport default [\n\t<Range\n\t\tvalue={25}\n\t\tmin={0}\n\t\tmax={50}\n\t\tstep={5}\n\t\tonChange={(value) => console.log('Stepped value:', value)}\n\t/>,\n];",
		],
		accessibilityGuidelines: [
			'Provide clear labels for range inputs',
			'Use appropriate ARIA attributes',
			'Ensure keyboard navigation support',
			'Provide value announcements for screen readers',
		],
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
		props: [
			{
				name: 'defaultValue',
				description: 'Sets the default value if range is not set.',
				type: 'number',
			},
			{
				name: 'isDisabled',
				description: 'Sets whether the field range is disabled.',
				type: 'boolean',
			},
			{
				name: 'max',
				description: 'Sets the maximum value of the range.',
				type: 'number',
			},
			{
				name: 'min',
				description: 'Sets the minimum value of the range.',
				type: 'number',
			},
			{
				name: 'onChange',
				description: 'Hook to be invoked on change of the range.',
				type: '(value: number) => void',
			},
			{
				name: 'step',
				description: 'Sets the step value for the range.',
				type: 'number',
			},
			{
				name: 'value',
				description: 'Sets the value of the range.',
				type: 'number',
			},
		],
	},
	{
		name: 'SectionMessage',
		package: '@atlaskit/section-message',
		keywords: ['section', 'message', 'alert', 'notification', 'contextual', 'information'],
		category: 'feedback',
		description: 'A component for section-level messages.',
		status: 'general-availability',
		examples: [
			'import { Text } from \'@atlaskit/primitives/compiled\';\nimport SectionMessage, { SectionMessageAction } from \'@atlaskit/section-message\';\nexport default [\n\t<SectionMessage appearance="information" title="Information">\n\t\t<Text>This is an informational message to help users understand something important.</Text>\n\t</SectionMessage>,\n\t<SectionMessage appearance="warning" title="Warning">\n\t\t<Text>Please review your settings before proceeding with this action.</Text>\n\t</SectionMessage>,\n\t<SectionMessage\n\t\tappearance="success"\n\t\ttitle="Success"\n\t\tactions={[\n\t\t\t<SectionMessageAction href="#">View Details</SectionMessageAction>,\n\t\t\t<SectionMessageAction href="#">Share Results</SectionMessageAction>,\n\t\t]}\n\t>\n\t\t<Text>Your changes have been saved successfully!</Text>\n\t</SectionMessage>,\n];',
		],
		accessibilityGuidelines: [
			'Ensure section message content is announced by screen readers',
			'Use appropriate color contrast for text readability',
			'Provide clear, actionable messaging',
			'Consider keyboard navigation for interactive section messages',
		],
		usageGuidelines: [
			'Use for contextual information within sections',
			'Choose appropriate appearance variants for message type',
			'Keep messaging concise and actionable',
			'Position section messages near relevant content',
			'Consider dismissibility for non-critical messages',
		],
		contentGuidelines: [
			'Write clear, concise messages',
			'Use action-oriented language when appropriate',
			'Ensure messages are relevant to the current context',
			'Provide clear next steps when needed',
		],
		props: [
			{
				name: 'actions',
				description:
					'Actions for the user to take after reading the section message. Accepts a ReactElement\nor an array of one or more SectionMessageAction React elements, which are applied as link buttons.\nMiddle dots are automatically added between multiple link buttons, so no elements\nshould be present between multiple actions.\n\nIn general, avoid using more than two actions.',
				type: 'ReactElement<any, string | JSXElementConstructor<any>> | ReactElement<SectionMessageActionProps, string | JSXElementConstructor<...>>[]',
			},
			{
				name: 'appearance',
				description: 'The appearance styling to use for the section message.',
				type: '"information" | "warning" | "error" | "success" | "discovery"',
			},
			{
				name: 'children',
				description:
					'The main content of the section message. This accepts a react node, although\nwe recommend that this should be a paragraph.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'icon',
				description:
					'An Icon component to be rendered instead of the default icon for the component.\nThis should only be an `@atlaskit/icon` icon. You can check out [this example](/packages/design-system/section-message/example/custom-icon)\nto see how to provide this icon.',
				type: '"symbol" | "object" | "title" | "a" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | "base" | "bdi" | "bdo" | "big" | "blockquote" | "body" | "br" | "button" | ... 158 more ... | ComponentType<...>',
			},
			{
				name: 'isDismissible',
				description:
					'Displays a dismiss button, that allows the user to dismiss the message.\nIt will be removed from the DOM immediately and will not be re-rendered.\nIt does not handle persistence of the dismissed state across page reloads or remounts.',
				type: 'boolean',
			},
			{
				name: 'onDismiss',
				description: 'A callback function that is called when the user dismisses the message.',
				type: '() => void',
			},
			{
				name: 'title',
				description: 'The heading of the section message.',
				type: 'string',
			},
		],
	},
	{
		name: 'Select',
		package: '@atlaskit/select',
		keywords: ['select', 'dropdown', 'form', 'input', 'options', 'choice', 'picker'],
		category: 'form',
		description: 'A flexible select component for single and multi-selection.',
		status: 'general-availability',
		examples: [
			"import { Label } from '@atlaskit/form';\nimport Select from '@atlaskit/select';\nexport default function SelectAppearanceDefault() {\n\treturn (\n\t\t<>\n\t\t\t<Label htmlFor=\"default-appearance-example\">Favorite fruit</Label>\n\t\t\t<Select\n\t\t\t\tinputId=\"default-appearance-example\"\n\t\t\t\tappearance=\"default\"\n\t\t\t\toptions={[\n\t\t\t\t\t{ label: 'Apple', value: 'a' },\n\t\t\t\t\t{ label: 'Banana', value: 'b' },\n\t\t\t\t]}\n\t\t\t/>\n\t\t</>\n\t);\n}",
		],
		accessibilityGuidelines: [
			'Provide clear labels for all selects',
			'Use appropriate placeholder text',
			'Ensure keyboard navigation with arrow keys',
			'Provide clear option descriptions',
			'Support screen reader announcements',
		],
		usageGuidelines: [
			'Use for choosing from a list of options',
			'Use multi-select for multiple choice scenarios',
			'Enable search for long option lists',
			'Provide clear placeholder text',
			'Consider loading states for async data',
		],
		contentGuidelines: [
			'Write clear, descriptive option labels',
			'Use consistent terminology across options',
			'Keep option text concise but meaningful',
			'Group related options logically',
		],
		props: [
			{
				name: 'allowCreateWhileLoading',
				description:
					'Allow options to be created while the `isLoading` prop is true. Useful to\nprevent the "create new ..." option being displayed while async results are\nstill being loaded.',
				type: 'any',
			},
			{
				name: 'appearance',
				description: '',
				type: '"default" | "subtle" | "none"',
			},
			{
				name: 'autoFocus',
				description:
					'Focus the control when it is mounted. There are very few cases that this should be used, and using incorrectly may violate accessibility guidelines.',
				type: 'boolean',
			},
			{
				name: 'blurInputOnSelect',
				description:
					'Remove focus from the input when the user selects an option (handy for dismissing the keyboard on touch devices)',
				type: 'boolean',
			},
			{
				name: 'cacheOptions',
				description:
					'If cacheOptions is truthy, then the loaded data will be cached. The cache\nwill remain until `cacheOptions` changes value.',
				type: 'any',
			},
			{
				name: 'classNamePrefix',
				description:
					'If provided, all inner components will be given a prefixed className attribute.\n\nThis is useful when styling via CSS classes instead of the Styles API approach.',
				type: 'string',
			},
			{
				name: 'classNames',
				description: 'Provide classNames based on state for each inner component',
				type: '{ clearIndicator?: (props: ClearIndicatorProps<Option, IsMulti, GroupBase<Option>>) => string; container?: (props: ContainerProps<Option, IsMulti, GroupBase<...>>) => string; ... 18 more ...; valueContainer?: (props: ValueContainerProps<...>) => string; }',
			},
			{
				name: 'clearControlLabel',
				description: 'Set the `aria-label` for the clear icon button.',
				type: 'string',
			},
			{
				name: 'closeMenuOnSelect',
				description: 'Close the select menu when the user selects an option',
				type: 'boolean',
			},
			{
				name: 'components',
				description:
					'This complex object includes all the compositional components that are used\nin `react-select`. If you wish to overwrite a component, pass in an object\nwith the appropriate namespace. If you wish to restyle a component, we recommend\nusing this prop with the `xcss` prop.',
				type: '{ Option?: React.ComponentType<OptionProps<Option, IsMulti, GroupBase<Option>>>; Group?: React.ComponentType<GroupProps<Option, IsMulti, GroupBase<...>>>; ... 19 more ...; ValueContainer?: React.ComponentType<...>; }',
			},
			{
				name: 'createOptionPosition',
				description:
					"Sets the position of the createOption element in your options list. Defaults to 'last'",
				type: 'any',
			},
			{
				name: 'defaultInputValue',
				description: '',
				type: 'string',
			},
			{
				name: 'defaultMenuIsOpen',
				description: '',
				type: 'boolean',
			},
			{
				name: 'defaultOptions',
				description:
					"The default set of options to show before the user starts searching. When\nset to `true`, the results for loadOptions('') will be autoloaded.",
				type: 'any',
			},
			{
				name: 'defaultValue',
				description: '',
				type: 'Option | MultiValue<Option>',
			},
			{
				name: 'descriptionId',
				description:
					"This sets the aria-describedby attribute. It sets an accessible description for the select, for people who use assistive technology. Use '<HelperMessage>' from '@atlaskit/form' is preferred.",
				type: 'string',
			},
			{
				name: 'filterOption',
				description: 'Custom method to filter whether an option should be displayed in the menu',
				type: '(option: FilterOptionOption<Option>, inputValue: string) => boolean',
			},
			{
				name: 'form',
				description: 'Sets the form attribute on the input',
				type: 'string',
			},
			{
				name: 'formatCreateLabel',
				description:
					'Gets the label for the "create new ..." option in the menu. Is given the\ncurrent input value.',
				type: 'any',
			},
			{
				name: 'formatGroupLabel',
				description:
					'Formats group labels in the menu as React components\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
				type: '(group: GroupBase<Option>) => React.ReactNode',
			},
			{
				name: 'formatOptionLabel',
				description: 'Formats option labels in the menu and control as React components',
				type: '((data: Option, formatOptionLabelMeta: FormatOptionLabelMeta<Option>) => React.ReactNode) | ((data: Option, formatOptionLabelMeta: FormatOptionLabelMeta<Option>) => React.ReactNode)',
			},
			{
				name: 'getNewOptionData',
				description:
					'Returns the data for the new option when it is created. Used to display the\nvalue, and is passed to `onChange`.',
				type: 'any',
			},
			{
				name: 'getOptionLabel',
				description:
					'Resolves option data to a string to be displayed as the label by components\n\nNote: Failure to resolve to a string type can interfere with filtering and\nscreen reader support.',
				type: '(option: Option) => string',
			},
			{
				name: 'getOptionValue',
				description:
					'Resolves option data to a string to compare options and specify value attributes',
				type: '(option: Option) => string',
			},
			{
				name: 'hideSelectedOptions',
				description: 'Hide the selected option from the menu',
				type: 'boolean',
			},
			{
				name: 'id',
				description: 'The id to set on the SelectContainer component.',
				type: 'string',
			},
			{
				name: 'inputId',
				description: 'The id of the search input',
				type: 'string',
			},
			{
				name: 'inputValue',
				description: 'The value of the search input',
				type: 'string',
			},
			{
				name: 'instanceId',
				description: 'Define an id prefix for the select components e.g. {your-id}-value',
				type: 'string | number',
			},
			{
				name: 'isClearable',
				description: 'Is the select value clearable',
				type: 'boolean',
			},
			{
				name: 'isDisabled',
				description: 'Is the select disabled',
				type: 'boolean',
			},
			{
				name: 'isInvalid',
				description: 'Is the select invalid',
				type: 'boolean',
			},
			{
				name: 'isLoading',
				description:
					'Is the select in a state of loading (async)\nIs the select in a state of loading (async)\nWill cause the select to be displayed in the loading state, even if the\nAsync select is not currently waiting for loadOptions to resolve',
				type: 'boolean',
			},
			{
				name: 'isMulti',
				description: 'Support multiple selected options',
				type: 'boolean',
			},
			{
				name: 'isOptionDisabled',
				description:
					'Override the built-in logic to detect whether an option is disabled\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
				type: '(option: Option, selectValue: Options<Option>) => boolean',
			},
			{
				name: 'isOptionSelected',
				description: 'Override the built-in logic to detect whether an option is selected',
				type: '(option: Option, selectValue: Options<Option>) => boolean',
			},
			{
				name: 'isRequired',
				description: 'This prop indicates if the component is required.',
				type: 'boolean',
			},
			{
				name: 'isSearchable',
				description: 'Whether to enable search functionality',
				type: 'boolean',
			},
			{
				name: 'isValidNewOption',
				description:
					'Determines whether the "create new ..." option should be displayed based on\nthe current input value, select value and options array.',
				type: 'any',
			},
			{
				name: 'label',
				description:
					'This sets the aria-label attribute. It sets an accessible name for the select, for people who use assistive technology. Use of a visible label is highly recommended for greater accessibility support.',
				type: 'string',
			},
			{
				name: 'labelId',
				description:
					'This sets the aria-labelledby attribute. It sets an accessible name for the select, for people who use assistive technology. Use of a visible label is highly recommended for greater accessibility support.',
				type: 'string',
			},
			{
				name: 'loadingMessage',
				description: 'Async: Text to display when loading options',
				type: '(obj: { inputValue: string; }) => React.ReactNode',
			},
			{
				name: 'loadOptions',
				description:
					'Function that returns a promise, which is the set of options to be used\nonce the promise resolves.',
				type: 'any',
			},
			{
				name: 'maxMenuHeight',
				description: 'Maximum height of the menu before scrolling',
				type: 'number',
			},
			{
				name: 'menuIsOpen',
				description: 'Whether the menu is open',
				type: 'boolean',
			},
			{
				name: 'menuPlacement',
				description:
					"Default placement of the menu in relation to the control. 'auto' will flip\nwhen there isn't enough space below the control.",
				type: '"auto" | "bottom" | "top"',
			},
			{
				name: 'menuPortalTarget',
				description:
					'Whether the menu should use a portal, and where it should attach\n\nAn example can be found in the [Portaling](https://react-select.com/advanced#portaling) documentation',
				type: 'HTMLElement',
			},
			{
				name: 'menuPosition',
				description:
					'The CSS position value of the menu, when "fixed" extra layout management is required',
				type: '"absolute" | "fixed"',
			},
			{
				name: 'menuShouldScrollIntoView',
				description: 'Whether the menu should be scrolled into view when it opens',
				type: 'boolean',
			},
			{
				name: 'minMenuHeight',
				description: 'Minimum height of the menu before flipping',
				type: 'number',
			},
			{
				name: 'name',
				description: 'Name of the HTML Input (optional - without this, no input will be rendered)',
				type: 'string',
			},
			{
				name: 'noOptionsMessage',
				description: 'Text to display when there are no options',
				type: '((obj: { inputValue: string; }) => React.ReactNode) | ((obj: { inputValue: string; }) => React.ReactNode)',
			},
			{
				name: 'onBlur',
				description: 'Handle blur events on the control',
				type: '(event: React.FocusEvent<HTMLInputElement, Element>) => void',
			},
			{
				name: 'onChange',
				description: 'Handle change events on the select',
				type: '(newValue: OnChangeValue<Option, IsMulti>, actionMeta: ActionMeta<Option>) => void',
			},
			{
				name: 'onClickPreventDefault',
				description: '',
				type: 'boolean',
			},
			{
				name: 'onCreateOption',
				description:
					'If provided, this will be called with the input value when a new option is\ncreated, and `onChange` will **not** be called. Use this when you need more\ncontrol over what happens when new options are created.',
				type: 'any',
			},
			{
				name: 'onFocus',
				description: 'Handle focus events on the control',
				type: '(event: React.FocusEvent<HTMLInputElement, Element>) => void',
			},
			{
				name: 'onInputChange',
				description: 'Handle change events on the input',
				type: '(newValue: string, actionMeta: InputActionMeta) => void',
			},
			{
				name: 'onKeyDown',
				description: 'Handle key down events on the select',
				type: '(event: React.KeyboardEvent<HTMLDivElement>) => void',
			},
			{
				name: 'onMenuClose',
				description: 'Handle the menu closing',
				type: '() => void',
			},
			{
				name: 'onMenuOpen',
				description: 'Handle the menu opening',
				type: '() => void',
			},
			{
				name: 'onMenuScrollToBottom',
				description: 'Fired when the user scrolls to the bottom of the menu',
				type: '(event: WheelEvent | TouchEvent) => void',
			},
			{
				name: 'onMenuScrollToTop',
				description: 'Fired when the user scrolls to the top of the menu',
				type: '(event: WheelEvent | TouchEvent) => void',
			},
			{
				name: 'options',
				description: 'Array of options that populate the select menu',
				type: 'readonly (Option | GroupBase<Option>)[]',
			},
			{
				name: 'pageSize',
				description: 'Number of options to jump in menu when page{up|down} keys are used',
				type: 'number',
			},
			{
				name: 'placeholder',
				description: 'Placeholder for the select value',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'shouldKeepInputOnSelect',
				description:
					'If `true`, the input value will be kept when an option is selected and isMulti is `true`. The default is `false`.',
				type: 'boolean',
			},
			{
				name: 'shouldPreventEscapePropagation',
				description: 'Prevents "Escape" keydown event propagation',
				type: 'boolean',
			},
			{
				name: 'spacing',
				description:
					'This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5',
				type: '"compact" | "default"',
			},
			{
				name: 'tabIndex',
				description:
					"Sets the tabIndex attribute on the input for focus. Since focus is already managed, the only acceptable value to be used is '-1' in rare cases when removing this field from the document tab order is required.",
				type: 'number',
			},
			{
				name: 'UNSAFE_is_experimental_generic',
				description: '',
				type: 'boolean',
			},
			{
				name: 'value',
				description: 'The value of the select; reflected by the selected option',
				type: 'Option | MultiValue<Option>',
			},
		],
	},
	{
		name: 'Skeleton',
		package: '@atlaskit/skeleton',
		keywords: ['skeleton', 'placeholder', 'loading', 'content', 'shimmer', 'animation'],
		category: 'loading',
		description: 'A skeleton acts as a placeholder for content, usually while the content loads.',
		status: 'early-access',
		examples: [
			'import Skeleton from \'@atlaskit/skeleton\';\nexport default [<Skeleton width="200px" height="100px" isShimmering />];',
		],
		accessibilityGuidelines: [
			'Provide appropriate loading announcements',
			'Use skeleton patterns that match actual content structure',
			'Ensure skeleton content is not announced as actual content',
			'Consider screen reader experience during loading states',
		],
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
		props: [
			{
				name: 'borderRadius',
				description: "Controls the border radius, or rounding of the skeleton's corners.",
				type: 'string | number',
			},
			{
				name: 'color',
				description:
					'Overrides the default color of skeleton, and overrides the default shimmering start color if ShimmeringEndColor also provided.',
				type: 'string',
			},
			{
				name: 'groupName',
				description:
					'Applied as a data-attribute. Use this to target groups of skeletons with the same name (e.g. for applying custom styles)\n```\ngroupName="my-skeleton" -> <div data-my-skeleton>\n```',
				type: 'string',
			},
			{
				name: 'height',
				description: '',
				type: 'string | number',
			},
			{
				name: 'isShimmering',
				description: 'Enables the shimmering animation.',
				type: 'boolean',
			},
			{
				name: 'ShimmeringEndColor',
				description: 'Overrides the default shimmering ending color of skeleton.',
				type: 'string',
			},
			{
				name: 'width',
				description: '',
				type: 'string | number',
			},
		],
	},
	{
		name: 'Spinner',
		package: '@atlaskit/spinner',
		keywords: ['spinner', 'loading', 'progress', 'wait', 'activity'],
		category: 'feedback',
		description: 'A loading spinner component.',
		status: 'general-availability',
		examples: [
			'import Spinner from \'@atlaskit/spinner\';\nexport default [<Spinner size="small" />, <Spinner size="medium" />, <Spinner size="large" />];',
		],
		accessibilityGuidelines: [
			'Provide appropriate loading announcements',
			'Use appropriate timing for spinner display',
			'Ensure spinner is announced to screen readers',
			'Consider alternative loading indicators',
		],
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
		props: [
			{
				name: 'appearance',
				description:
					'You can use this to invert the current theme.\nThis is useful when you are displaying a spinner on a background that is not the same background color scheme as the main content.',
				type: '"inherit" | "invert"',
			},
			{
				name: 'delay',
				description:
					'Delay the intro animation of `Spinner`.\nThis is not to be used to avoid quick flickering of `Spinner`.\n`Spinner` will automatically fade in and takes ~200ms to become partially visible.\nThis prop can be helpful for **long delays** such as `500-1000ms` for when you want to not\nshow a `Spinner` until some longer period of time has elapsed.',
				type: 'number',
			},
			{
				name: 'label',
				description:
					'Describes what the spinner is doing for assistive technologies. For example, "loading", "submitting", or "processing".',
				type: 'string',
			},
			{
				name: 'size',
				description:
					'Size of the spinner. The available sizes are `xsmall`, `small`, `medium`, `large`, and `xlarge`. For most use cases, we recommend `medium`.',
				type: 'number | PresetSize',
			},
		],
	},
	{
		name: 'Tabs',
		package: '@atlaskit/tabs',
		keywords: ['tabs', 'navigation', 'content', 'organization', 'grouping'],
		category: 'navigation',
		description:
			'Tabs are used to organize content by grouping similar information on the same page.',
		status: 'general-availability',
		examples: [
			'import Tabs, { Tab, TabList, TabPanel } from \'@atlaskit/tabs\';\nexport default [\n\t<Tabs id="tabs">\n\t\t<TabList>\n\t\t\t<Tab>Tab 1</Tab>\n\t\t\t<Tab>Tab 2</Tab>\n\t\t</TabList>\n\t\t<TabPanel>Content for Tab 1</TabPanel>\n\t\t<TabPanel>Content for Tab 2</TabPanel>\n\t</Tabs>,\n];',
		],
		accessibilityGuidelines: [
			'Ensure proper keyboard navigation between tabs',
			'Use appropriate ARIA attributes for tab panels',
			'Provide clear focus indicators',
			'Announce tab changes to screen readers',
			'Ensure tab content is accessible',
		],
		usageGuidelines: [
			'Use to organize related content on the same page',
			'Keep tab labels concise and descriptive',
			'Limit the number of tabs to avoid overcrowding',
			'Use consistent tab ordering and grouping',
			'Consider responsive behavior for many tabs',
		],
		contentGuidelines: [
			'Write clear, descriptive tab labels',
			'Group related content logically',
			'Use consistent naming conventions',
			'Ensure tab content is relevant and complete',
		],
		props: [
			{
				name: 'children',
				description:
					"The children of Tabs. The first child should be a `TabList` filled with `Tab`'s.\nSubsequent children should be `TabPanel`'s. There should be a `Tab` for each `TabPanel`.\nIf you want to customize `Tab` or `TabPanel`, refer to the examples in the documentation.",
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
			},
			{
				name: 'defaultSelected',
				description:
					'The index of the tab that will be selected by default when the component mounts.\nIf not set the first tab will be displayed by default.',
				type: 'number',
			},
			{
				name: 'id',
				description:
					'A unique ID that will be used to generate IDs for tabs and tab panels.\nThis is required for accessibility purposes.',
				type: 'string',
			},
			{
				name: 'onChange',
				description:
					'A callback function which will be fired when a changed. It will be passed\nthe index of the selected tab and a `UIAnalyticsEvent`.',
				type: '(index: number, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'selected',
				description:
					"The selected tab's index. If this prop is set the component behaves as a\ncontrolled component. It will be up to you to listen to `onChange`.",
				type: 'number',
			},
			{
				name: 'shouldUnmountTabPanelOnChange',
				description:
					"Tabs by default leaves `TabPanel`'s mounted on the page after they have been selected.\nIf you would like to unmount a `TabPanel` when it is not selected, set this prop to\nbe true.",
				type: 'boolean',
			},
		],
	},
	{
		name: 'Tag',
		package: '@atlaskit/tag',
		keywords: ['tag', 'label', 'category', 'filter', 'chip', 'badge'],
		category: 'data-display',
		description: 'A tag is a compact element used to categorize, label, or organize content.',
		status: 'general-availability',
		examples: [
			'import Tag from \'@atlaskit/tag\';\nexport default [\n\t<Tag text="Basic tag" />,\n\t<Tag text="Bug" color="red" />,\n\t<Tag text="Removable tag" removeButtonLabel="Remove" />,\n];',
		],
		accessibilityGuidelines: [
			'Provide appropriate labels for tags',
			'Ensure sufficient color contrast for text readability',
			'Use clear, descriptive tag text',
			'Consider keyboard navigation for interactive tags',
			'Provide alternative text for tag removal actions',
		],
		usageGuidelines: [
			'Use to categorize or label content',
			'Keep tag text concise and meaningful',
			'Use appropriate colors and appearances',
			'Consider tag removal functionality',
			'Group related tags logically',
		],
		contentGuidelines: [
			'Use clear, descriptive tag labels',
			'Keep tag text concise',
			'Use consistent terminology across tags',
			'Consider tag hierarchy and grouping',
		],
		props: [
			{
				name: 'appearance',
				description: 'Set whether tags are rounded.',
				type: '"default" | "rounded"',
			},
			{
				name: 'color',
				description: 'The color theme to apply. This sets both the background and text color.',
				type: '"standard" | "green" | "lime" | "blue" | "red" | "purple" | "magenta" | "grey" | "teal" | "orange" | "yellow" | "limeLight" | "orangeLight" | "magentaLight" | "greenLight" | "blueLight" | ... 4 more ... | "yellowLight"',
			},
			{
				name: 'elemBefore',
				description: 'The component to be rendered before the tag.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'href',
				description: 'URI or path. If provided, the tag will be a link.',
				type: 'string',
			},
			{
				name: 'isRemovable',
				description: 'Flag to indicate if a tag is removable.',
				type: 'boolean',
			},
			{
				name: 'linkComponent',
				description: '',
				type: 'ComponentClass<any, any> | FunctionComponent<any>',
			},
			{
				name: 'onAfterRemoveAction',
				description:
					"Handler to be called after tag is removed. Called with the string 'Post\nRemoval Hook'.",
				type: '(text: string) => void',
			},
			{
				name: 'onBeforeRemoveAction',
				description:
					'Handler to be called before the tag is removed. If it does not return a\ntruthy value, the tag will not be removed.',
				type: '() => boolean',
			},
			{
				name: 'removeButtonLabel',
				description: 'Text rendered as the aria-label for remove button.',
				type: 'string',
			},
			{
				name: 'text',
				description: 'Text to be displayed in the tag.',
				type: 'string',
			},
		],
	},
	{
		name: 'TagGroup',
		package: '@atlaskit/tag-group',
		keywords: ['tag', 'group', 'multiple', 'labels', 'chips'],
		category: 'data-display',
		description: 'A component for managing multiple tags.',
		status: 'general-availability',
		examples: [
			'import Tag from \'@atlaskit/tag\';\nimport TagGroup from \'@atlaskit/tag-group\';\nexport default [\n\t<TagGroup label="Tags for work item">\n\t\t<Tag text="Priority: High" color="red" />\n\t\t<Tag text="Status: Active" color="green" />\n\t\t<Tag text="Type: Bug" color="blue" />\n\t</TagGroup>,\n];',
		],
		accessibilityGuidelines: [
			'Provide clear tag labels',
			'Ensure proper keyboard navigation',
			'Use appropriate grouping semantics',
			'Consider screen reader announcements',
		],
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
		props: [
			{
				name: 'alignment',
				description:
					'Sets whether the tags should be aligned to the start or the end of the component.',
				type: '"start" | "end"',
			},
			{
				name: 'children',
				description: 'Tags to render within the tag group.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'label',
				description:
					'Refers to an `aria-label` attribute. Sets an accessible name for the tags group wrapper to announce it to users of assistive technology.\nUsage of either this, or the `titleId` attribute is strongly recommended.',
				type: 'string',
			},
			{
				name: 'titleId',
				description:
					"ID referenced by the tag group wrapper's `aria-labelledby` attribute. This ID should be assigned to the group-button title element.\nUsage of either this, or the `label` attribute is strongly recommended.",
				type: 'string',
			},
		],
	},
	{
		name: 'Textarea',
		package: '@atlaskit/textarea',
		keywords: ['textarea', 'input', 'form', 'text', 'multiline', 'input', 'field'],
		category: 'forms-and-input',
		description: 'A textarea is a multiline text input control for longer text content.',
		status: 'general-availability',
		examples: [
			'import Textarea from \'@atlaskit/textarea\';\nexport default [\n\t<Textarea placeholder="Enter your text..." />,\n\t<Textarea placeholder="Required field" isRequired resize="auto" name="comments" />,\n];',
		],
		accessibilityGuidelines: [
			'Provide clear labels for all textareas',
			"Use appropriate placeholder text that doesn't replace labels",
			'Provide keyboard navigation support',
			'Indicate required fields clearly',
			'Use appropriate error states and messaging',
		],
		usageGuidelines: [
			'Use for longer text input needs',
			'Provide appropriate sizing for content type',
			'Use clear, descriptive labels',
			'Consider character limits and validation',
			'Use appropriate placeholder text',
		],
		contentGuidelines: [
			'Write clear, descriptive labels',
			'Use helpful placeholder text',
			'Provide appropriate error messages',
			'Consider content length and formatting',
		],
		props: [
			{
				name: 'appearance',
				description:
					"Controls the appearance of the field.\nSubtle shows styling on hover.\nNone prevents all field styling. Take care when using the none appearance as this doesn't include accessible interactions.",
				type: '"standard" | "subtle" | "none"',
			},
			{
				name: 'defaultValue',
				description: 'The default value of the text area.',
				type: 'string',
			},
			{
				name: 'isCompact',
				description: 'Sets whether the field should expand to fill available horizontal space.',
				type: 'boolean',
			},
			{
				name: 'isDisabled',
				description:
					'Sets the field as uneditable, with a changed hover state, and prevents it from showing in the focus order.\nWherever possible, prefer using validation and error messaging over disabled fields for a more accessible experience.',
				type: 'boolean',
			},
			{
				name: 'isInvalid',
				description: 'Sets styling to indicate that the input is invalid.',
				type: 'boolean',
			},
			{
				name: 'isMonospaced',
				description: 'Sets the content text value to monospace.',
				type: 'boolean',
			},
			{
				name: 'isReadOnly',
				description: 'If true, prevents the value of the input from being edited.',
				type: 'boolean',
			},
			{
				name: 'isRequired',
				description: 'Sets whether the field is required for form that the field is part of.',
				type: 'boolean',
			},
			{
				name: 'maxHeight',
				description: 'The maximum height of the text area.',
				type: 'string',
			},
			{
				name: 'minimumRows',
				description: 'The minimum number of rows of text to display.',
				type: 'number',
			},
			{
				name: 'name',
				description: 'Name of the input form control.',
				type: 'string',
			},
			{
				name: 'onBlur',
				description: 'Handler to be called when the input is blurred.',
				type: '(event: FocusEvent<HTMLTextAreaElement, Element>) => void',
			},
			{
				name: 'onChange',
				description: 'Handler to be called when the input changes.',
				type: '(event: ChangeEvent<HTMLTextAreaElement>) => void',
			},
			{
				name: 'onFocus',
				description: 'Handler to be called when the input is focused.',
				type: '(event: FocusEvent<HTMLTextAreaElement, Element>) => void',
			},
			{
				name: 'placeholder',
				description:
					"The placeholder text within the text area. Don't use placeholder text to provide instructions as it disappears on data entry.",
				type: 'string',
			},
			{
				name: 'resize',
				description:
					'Enables resizing of the text area. The default setting is `smart`.\nAuto enables resizing in both directions.\nHorizontal enables resizing only along the X axis.\nVertical enables resizing only along the Y axis.\nSmart vertically grows and shrinks the text area automatically to wrap your input text.\nNone explicitly disallows resizing of the text area.',
				type: '"none" | "auto" | "vertical" | "horizontal" | "smart"',
			},
			{
				name: 'spellCheck',
				description: 'Enables native spell check on the `textarea` element.',
				type: 'boolean',
			},
			{
				name: 'theme',
				description:
					'The theme function `TextArea` consumes to derive theming constants for use in styling its components',
				type: 'any',
			},
			{
				name: 'value',
				description: 'The value of the text area.',
				type: 'string',
			},
		],
	},
	{
		name: 'TextField',
		package: '@atlaskit/textfield',
		keywords: ['textfield', 'input', 'form', 'text', 'field', 'single-line'],
		category: 'form',
		description: 'A single-line text input component.',
		status: 'general-availability',
		examples: [
			'import TextField from \'@atlaskit/textfield\';\nexport default [\n\t<TextField label="Name" placeholder="Enter your name" />,\n\t<TextField label="Email" type="email" placeholder="Enter your email address" isRequired />,\n\t<TextField label="Password" type="password" placeholder="Enter your password" isRequired />,\n];',
		],
		accessibilityGuidelines: [
			'Provide clear labels for all textfields',
			"Use appropriate placeholder text that doesn't replace labels",
			'Provide keyboard navigation support',
			'Indicate required fields clearly',
			'Use appropriate error states and messaging',
		],
		usageGuidelines: [
			'Use for single-line text input needs',
			'Provide appropriate sizing for content type',
			'Use clear, descriptive labels',
			'Consider character limits and validation',
			'Use appropriate placeholder text',
		],
		contentGuidelines: [
			'Write clear, descriptive labels',
			'Use helpful placeholder text',
			'Provide appropriate error messages',
			'Consider content length and formatting',
		],
		props: [
			{
				name: 'appearance',
				description:
					"Controls the appearance of the field.\nSubtle shows styling on hover.\nNone prevents all field styling. Take care when using the none appearance as this doesn't include accessible interactions.",
				type: '"subtle" | "standard" | "none"',
			},
			{
				name: 'elemAfterInput',
				description: 'Element after input in text field.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'elemBeforeInput',
				description: 'Element before input in text field.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'isCompact',
				description: 'Applies compact styling, making the field smaller.',
				type: 'boolean',
			},
			{
				name: 'isDisabled',
				description:
					"Sets the field as to appear disabled,\npeople will not be able to interact with the text field and it won't appear in the focus order.\nWherever possible, prefer using validation and error messaging over disabled fields for a more accessible experience.",
				type: 'boolean',
			},
			{
				name: 'isInvalid',
				description:
					'Changes the text field to have a border indicating that its value is invalid.',
				type: 'boolean',
			},
			{
				name: 'isMonospaced',
				description: 'Sets content text value to appear monospaced.',
				type: 'boolean',
			},
			{
				name: 'isReadOnly',
				description: 'If true, prevents the value of the input from being edited.',
				type: 'boolean',
			},
			{
				name: 'isRequired',
				description: 'Set required for form that the field is part of.',
				type: 'boolean',
			},
			{
				name: 'name',
				description: 'Name of the input element.',
				type: 'string',
			},
			{
				name: 'onChange',
				description: 'Handler called when the inputs value changes.',
				type: '(event: FormEvent<HTMLInputElement>) => void',
			},
			{
				name: 'onMouseDown',
				description: 'Handler called when the mouse down event is triggered on the input element.',
				type: '(event: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void',
			},
			{
				name: 'placeholder',
				description: 'Placeholder text to display in the text field whenever it is empty.',
				type: 'string',
			},
			{
				name: 'width',
				description: 'Sets maximum width of input.',
				type: 'string | number',
			},
		],
	},
	{
		name: 'Toggle',
		package: '@atlaskit/toggle',
		keywords: ['toggle', 'switch', 'on-off', 'enabled', 'disabled', 'state'],
		category: 'forms-and-input',
		description: 'A toggle is used to view or switch between enabled or disabled states.',
		status: 'general-availability',
		examples: [
			'import Toggle from \'@atlaskit/toggle\';\nexport default [<Toggle label="Basic toggle" />, <Toggle label="Checked toggle" isChecked />];',
		],
		accessibilityGuidelines: [
			'Provide clear labels for all toggles',
			'Use appropriate ARIA attributes for toggle state',
			'Ensure keyboard navigation support',
			'Provide clear visual feedback for state changes',
			"Use descriptive labels that explain the toggle's purpose",
		],
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
		props: [
			{
				name: 'defaultChecked',
				description:
					'Sets whether the toggle is initially checked or not.\nAfter the initial interaction, whether the component is checked or not is\ncontrolled by the component.',
				type: 'boolean',
			},
			{
				name: 'descriptionId',
				description:
					"Use this when you need to provide an extended description about how the toggle works using aria-describedby.\n\nIt's important to use this prop if the meaning of the toggle with the only a label would be unclear to people who use assistive technology.",
				type: 'string',
			},
			{
				name: 'id',
				description:
					'Use a pairing label with your toggle using `id` and `htmlFor` props to set the relationship.\nFor more information see [labels on MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label).',
				type: 'string',
			},
			{
				name: 'isChecked',
				description:
					'If defined, it takes precedence over defaultChecked, and the toggle acts\nas a controlled component.\n\nYou can provide a onChange function to be notified of checked value changes',
				type: 'boolean',
			},
			{
				name: 'isDisabled',
				description:
					'Sets if the toggle is disabled or not. This prevents any interaction.\nDisabled toggles will not appear in the tab order for assistive technology.',
				type: 'boolean',
			},
			{
				name: 'isLoading',
				description:
					"If defined, it displays a spinner within the toggle.\nThis prop is useful when the toggle's state is being fetched or updated asynchronously.",
				type: 'boolean',
			},
			{
				name: 'label',
				description:
					"Text value which will be associated with toggle input using aria-labelledby attribute.\n\nUse only when you can't use a visible label for the toggle.",
				type: 'string',
			},
			{
				name: 'name',
				description: 'Descriptive name for the value property, to be submitted in a form.',
				type: 'string',
			},
			{
				name: 'onBlur',
				description: 'Handler to be called when toggle is unfocused.',
				type: '(event: FocusEvent<HTMLInputElement, Element>, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'onChange',
				description: "Handler to be called when native 'change' event happens internally.",
				type: '(event: ChangeEvent<HTMLInputElement>, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'onFocus',
				description: 'Handler to be called when toggle is focused.',
				type: '(event: FocusEvent<HTMLInputElement, Element>, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'size',
				description: 'Toggle size.',
				type: '"regular" | "large"',
			},
			{
				name: 'value',
				description: 'Value to be submitted in a form.',
				type: 'string',
			},
		],
	},
	{
		name: 'Tooltip',
		package: '@atlaskit/tooltip',
		keywords: ['tooltip', 'hint', 'help', 'floating', 'label', 'explanation'],
		category: 'overlays-and-layering',
		description:
			'A tooltip is a floating, non-actionable label used to explain a user interface element or feature.',
		status: 'general-availability',
		examples: [
			'import Button from \'@atlaskit/button/new\';\nimport Tooltip from \'@atlaskit/tooltip\';\nexport default function DefaultTooltipExample() {\n\treturn (\n\t\t<Tooltip content="This is a tooltip" testId="default-tooltip">\n\t\t\t{(tooltipProps) => <Button {...tooltipProps}>Hover over me</Button>}\n\t\t</Tooltip>\n\t);\n}',
		],
		accessibilityGuidelines: [
			'Ensure tooltip content is announced by screen readers',
			'Use appropriate hover/focus triggers',
			'Provide keyboard access to tooltip content',
			'Use clear, descriptive tooltip text',
			'Consider tooltip timing and persistence',
		],
		usageGuidelines: [
			'Use to provide additional context or explanation',
			'Keep tooltip content concise and helpful',
			'Position tooltips appropriately to avoid obstruction',
			'Use consistent tooltip behavior across the interface',
			'Consider mobile touch interactions',
		],
		contentGuidelines: [
			'Write clear, concise explanatory text',
			'Use helpful, actionable information',
			'Avoid redundant information already visible',
			'Use consistent tone and style',
		],
		props: [
			{
				name: 'canAppear',
				description:
					'Whether or not the tooltip can be displayed. Once a tooltip\nis scheduled to be displayed, or is already displayed, it will\ncontinue to be shown.\n\n@description\n\n`canAppear()` is called in response to user events, and\nnot during the rendering of components.',
				type: '() => boolean',
			},
			{
				name: 'children',
				description:
					'Elements to be wrapped by the tooltip.\nIt can be either a:\n1. `ReactNode`\n2. Function which returns a `ReactNode`',
				type: 'React.ReactNode | ((props: TriggerProps) => React.ReactNode)',
			},
			{
				name: 'component',
				description:
					'Extend `TooltipPrimitive` to create your own tooltip and pass it as component.',
				type: 'React.ComponentType<TooltipPrimitiveProps> | React.ForwardRefExoticComponent<Omit<TooltipPrimitiveProps, "ref"> & React.RefAttributes<HTMLDivElement>>',
			},
			{
				name: 'content',
				description:
					'The content of the tooltip. It can be either a:\n1. `ReactNode`\n2. Function which returns a `ReactNode`\nThe benefit of the second approach is that it allows you to consume the `update` render prop.\nThis `update` function can be called to manually recalculate the position of the tooltip.\n\nThis content will be rendered into two places:\n1. Into the tooltip\n2. Into a hidden element for screen readers (unless `isScreenReaderAnnouncementDisabled` is set to `true`)',
				type: 'React.ReactNode | (({ update }: { update?: () => void; }) => React.ReactNode)',
			},
			{
				name: 'delay',
				description:
					'Time in milliseconds to wait before showing and hiding the tooltip. Defaults to 300.',
				type: 'number',
			},
			{
				name: 'hideTooltipOnClick',
				description:
					'Hide the tooltip when the click event is triggered. Use this when the tooltip should be hidden if `onClick` react synthetic event\nis triggered, which happens after `onMouseDown` event.',
				type: 'boolean',
			},
			{
				name: 'hideTooltipOnMouseDown',
				description:
					'Hide the tooltip when the mousedown event is triggered. This should be\nused when tooltip should be hidden if `onMouseDown` react synthetic event\nis triggered, which happens before `onClick` event.',
				type: 'boolean',
			},
			{
				name: 'ignoreTooltipPointerEvents',
				description:
					'Adds `pointer-events: none` to the tooltip itself. Setting this to true will also prevent the tooltip from persisting when hovered.',
				type: 'boolean',
			},
			{
				name: 'isScreenReaderAnnouncementDisabled',
				description:
					'By default tooltip content will be duplicated into a hidden element so\nit can be read out by a screen reader. Sometimes this is not ideal as\nit can result in the same content be announced twice. For those situations,\nyou can leverage this prop to disable the duplicate hidden text.',
				type: 'boolean',
			},
			{
				name: 'mousePosition',
				description:
					'Where the tooltip should appear relative to the mouse pointer.\nOnly use this when the `position` prop is set to `"mouse"`.\nWhen interacting with the target element using a keyboard, it will use this position against the target element instead.',
				type: 'AutoPlacement | BasePlacement | VariationPlacement',
			},
			{
				name: 'onHide',
				description:
					"Function to be called when the tooltip will be hidden. It's called after the\ndelay, when the tooltip begins to animate out.",
				type: '(analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'onShow',
				description:
					"Function to be called when the tooltip will be shown. It's called when the\ntooltip begins to animate in.",
				type: '(analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'position',
				description:
					'Where the tooltip should appear relative to its target.\nIf set to `"mouse"`, the tooltip will display next to the mouse pointer instead.\nMake sure to utilize the `mousePosition` if you want to customize where the tooltip will show in relation to the mouse.',
				type: 'Placement | "mouse"',
			},
			{
				name: 'shortcut',
				description:
					'Display a keyboard shortcut in the tooltip.\n\nKeys will be displayed as individual keyboard key segments after the tooltip content.\n\nThis prop requires the `platform-dst-tooltip-shortcuts` feature flag to be enabled.',
				type: 'string[]',
			},
			{
				name: 'strategy',
				description: 'Use this to define the strategy of popper.',
				type: '"fixed" | "absolute"',
			},
			{
				name: 'tag',
				description:
					'Replace the wrapping element. This accepts the name of a html tag which will\nbe used to wrap the element.\nIf you provide a component, it needs to support a ref prop which is used by popper for positioning.',
				type: 'keyof JSX.IntrinsicElements | React.ComponentType<React.AllHTMLAttributes<HTMLElement> & { ref: React.Ref<HTMLElement>; }> | React.ForwardRefExoticComponent<...>',
			},
		],
	},
	{
		name: 'VisuallyHidden',
		package: '@atlaskit/visually-hidden',
		keywords: ['hidden', 'accessibility', 'screen-reader', 'aria', 'utility'],
		category: 'utility',
		description: 'A utility component for accessibility.',
		status: 'general-availability',
		examples: [
			"import VisuallyHidden from '@atlaskit/visually-hidden';\nexport default () => {\n\treturn (\n\t\t<div  style={{ border: '1px solid black' }}>\n\t\t\tThere is text hidden between the brackets [<VisuallyHidden>Can't see me!</VisuallyHidden>]\n\t\t</div>\n\t);\n};",
		],
		accessibilityGuidelines: [
			'Use for screen reader only content',
			'Ensure content is meaningful for assistive technology',
			'Use appropriate ARIA roles when needed',
			'Consider content context and purpose',
		],
		usageGuidelines: [
			'Use for screen reader only content',
			'Provide meaningful hidden content',
			'Use for accessibility enhancements',
			'Consider content context and purpose',
		],
		contentGuidelines: [
			'Use clear, descriptive hidden content',
			'Ensure content adds value for screen readers',
			'Use appropriate language and tone',
			'Keep content concise but meaningful',
		],
		props: [
			{
				name: 'children',
				description: 'The element or elements that should be hidden.',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'id',
				description:
					'An id may be appropriate for this component if used in conjunction with `aria-describedby`\non a paired element.',
				type: 'string',
			},
			{
				name: 'role',
				description: 'An ARIA role attribute to aid screen readers.',
				type: 'string',
			},
		],
	},
];

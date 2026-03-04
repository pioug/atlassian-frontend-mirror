import React from 'react';

import { DoDont, DoDontGrid } from '@af/design-system-docs-ui';
import { md } from '@atlaskit/docs';
import Image from '@atlaskit/image';
import Link from '@atlaskit/link';

export const UsageTab: JSX.Element = md`
## Usage

Use side nav items to create different sections, actions, and links in the
[side nav](https://atlassian.design/components/navigation-system/layout/examples#side-nav).

${(
	<Image
		src={require('./images/side-nav-anatomy-1.png')}
		alt="Diagram of the navigation system side nav"
	/>
)}

<br />

${(
	<Image
		src={require('./images/side-nav-anatomy-2.png')}
		alt="Diagram of the navigation system side nav items"
	/>
)}

<br />

<ol>
	<li>
		<strong>Menu items:</strong> The interactive elements in the side nav that help users navigate
		or perform actions.
		<ol type="a">
			<li>
				<strong>elemBefore.</strong> Optional*. Only one allowed.
			</li>
			<li>
				<strong>Label.</strong> Text that succinctly describes the menu item.
			</li>
			<li>
				<strong>Description.</strong> Optional*. Additional information on the menu item, such as
				meta data.
			</li>
			<li>
				<strong>elemAfter.</strong> Optional*. Disappears when actionsOnHover display.
			</li>
			<li>
				<strong>actions</strong> or <strong>actionsOnHover</strong>. Optional*. Icon buttons that
				trigger actions independent from the menu item.
			</li>
		</ol>
	</li>
	<li>
		<strong>Menu section:</strong> Use to group related menu items. Acts as a landmark for assistive
		technology.
	</li>
	<li>
		<strong>Menu section heading:</strong> Both a visual heading and ARIA label to name a menu
		section.
	</li>
</ol>

<br />

*Some variations exist between menu item types. View the
[menu item examples](/packages/navigation/side-nav-items?tab=examples) for details.

### Follow Atlassian's navigation patterns

The current navigation has specific menu items that are similar across apps. Make sure your side
navigation follows Atlassian patterns consistently,
[see navigation experience guidelines (Atlassians only)](https://hello.atlassian.net/wiki/spaces/navx/pages/5104144812).

### Choose side nav menu items based on action type

There are four types of side nav menu items:

1. Link menu items - navigates to another page.
2. Button menu items - triggers an action.
3. Expandable menu item - nests side nav menu items to create hierarchies.
4. Flyout menu item - opens a popup.

View the [menu item examples](/packages/navigation/side-nav-items?tab=examples) for full behavior and
guidance for each menu item.

### Use side nav items only within the side nav

Side nav menus are reserved for use directly within the
[side nav](https://atlassian.design/components/navigation-system/layout/examples#side-nav) and the
[flyout menu content](/packages/navigation/side-nav-items?tab=examples#flyout-menu-item)
(popup).

Menus anywhere else in the app, including those triggered from the top navigation, should also use
regular [menu](https://atlassian.design/components/menu) or [dropdown menu](https://atlassian.design/components/dropdown-menu).

<br />

${(
	<DoDontGrid>
		<DoDont
			type="do"
			image={{
				url: require('./images/side-nav-do-1.png'),
				alt: 'A side nav with side nav items only.',
			}}
		>
			Use side nav menus directly in the side nav or flyout menu content.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: require('./images/side-nav-dont-1.png'),
				alt: 'Side nav items incorrectly used in the top nav.',
			}}
		>
			Don't use side nav menus in other parts of the app.
		</DoDont>
	</DoDontGrid>
)}


### Use dropdown menu for menus triggered from the side nav

Use [dropdown menu](https://atlassian.design/components/dropdown-menu) for menus triggered by \`actions\` or \`actionsOnHover\`.
Ensure you follow the general usage guidance for dropdown menu and use the following variants:

- default density (cozy)
- default placement (bottom-start; adjusts accordingly when space is limited)

<br />

${(
	<DoDontGrid>
		<DoDont
			type="do"
			image={{
				url: require('./images/side-nav-do-2.png'),
				alt: 'An open dropdown menu with a list of items.',
			}}
			isFullWidth
		>
			Use dropdown menu for menus triggered by actions or actionsOnHover.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: require('./images/side-nav-dont-2.png'),
				alt: 'A dropdown menu with a list of items.',
			}}
		>
			Don't use side nav menu in dropdown menus.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: require('./images/side-nav-dont-3.png'),
				alt: 'A dropdown menu with menu item that uses compact density.',
			}}
		>
			Don't use compact density for dropdown menus.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: require('./images/side-nav-dont-4.png'),
				alt: 'A dropdown menu with menu item that does not have a selected state.',
			}}
		>
			Don't omit the selected state on the dropdown trigger when open.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: require('./images/side-nav-dont-5.png'),
				alt: 'A dropdown menu with a disabled menu item.',
			}}
		>
			Don't use disabled menu items, see{' '}
			<Link target="_blank" href="https://atlassian.design/components/menu/usage">
				menu guidance.
			</Link>
		</DoDont>
	</DoDontGrid>
)}

## Best practices

### Use the provided slots as intended

Use [\`elemBefore\`](/packages/navigation/side-nav-items?tab=examples#elembefore),
[\`elemAfter\`](/packages/navigation/side-nav-items?tab=examples#elemafter),
[\`actions\`](/packages/navigation/side-nav-items?tab=examples#actions-and-actionsonhover), and
[\`actionsOnHover\`](/packages/navigation/side-nav-items?tab=examples#actions-and-actionsonhover)
slots for configuring menu items.

${(
	<DoDontGrid>
		<DoDont
			type="do"
			image={{
				url: require('./images/side-nav-do-3.png'),
				alt: 'A menu item with "Templates" label and "TRY" text properly placed in a designated slot on the right.',
			}}
		>
			Use the slots in side nav menus as intended.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: require('./images/side-nav-dont-6.png'),
				alt: 'A menu item with "Templates" label and "TRY" text incorrectly placed within the same text area.',
			}}
		>
			Don't add custom elements where they're not intended, such as within the label.
		</DoDont>
	</DoDontGrid>
)}

### Apply icon sizes correctly

Consider the following when applying icon sizes:

- Use [default (medium 16px) icons](https://atlassian.design/components/icon/examples#default-16px) in \`elemBefore\`.
- Use [small (12px) icons](https://atlassian.design/components/icon/examples#small-12px) in \`elemAfter\` as well as \`actions\`
  and \`actionsOnHover\` icon buttons.
- Chevrons always use small (12px) icons, regardless of where they're being applied.
- All icons in side nav menu items use [spacious padding](https://atlassian.design/components/icon/examples#spacing-props).

${(
	<DoDontGrid>
		<DoDont
			type="do"
			image={{
				url: require('./images/side-nav-do-4.png'),
				alt: 'A menu item with "Projects" label, 16px rocket icon on the left, and 12px plus and ellipsis icons on the right.',
			}}
		>
			Use small (12px) icons for actions, actionOnHover, and elemAfter. Use default (medium 16px)
			icons for elemBefore.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: require('./images/side-nav-dont-7.png'),
				alt: 'A menu item with "Projects" label, rocket icon, and incorrectly sized plus and ellipsis icons on the right.',
			}}
		>
			Don't use incorrect icons sizes in menu items, which can feel unbalanced.
		</DoDont>
	</DoDontGrid>
)}

### Apply icon button correctly

Use subtle compact [icon buttons](https://atlassian.design/components/button/icon-button/examples) in side nav menu items,
such as in \`actions\` and \`actionsOnHover\`, or \`elemBefore\` in expandable menu items.

For \`actions\` and \`actionsOnHover\`, when there is more than one icon button, use 4px spacing.

${(
	<DoDontGrid>
		<DoDont
			type="do"
			image={{
				url: require('./images/side-nav-do-5.png'),
				alt: 'A menu item with "Projects" label, rocket icon, and subtle compact plus and ellipsis icon buttons with hover tooltip.',
			}}
		>
			Use subtle compact icon buttons in side nav menu items.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: require('./images/side-nav-dont-8.png'),
				alt: 'A menu item with "Projects" label, rocket icon, and default icon buttons instead of subtle compact ones.',
			}}
		>
			Don't use default icon buttons in side nav menu items.
		</DoDont>
	</DoDontGrid>
)}

### Use ContainerAvatar

${(
	<DoDontGrid>
		<DoDont
			type="do"
			image={{
				url: require('./images/side-nav-do-6.png'),
				alt: 'A menu item with "Mobile app" label and ContainerAvatar icon on the left.',
			}}
		>
			Use{' '}
			<Link href="/packages/navigation/side-nav-items?tab=code#containeravatar">
				ContainerAvatar
			</Link>{' '}
			in side nav menu items, which are designed with the correct size and spacing.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: require('./images/side-nav-dont-9.png'),
				alt: 'A menu item with "Mobile app" label and regular avatar icon instead of ContainerAvatar.',
			}}
		>
			Don't use{' '}
			<Link href="https://atlassian.design/components/avatar" target="_blank">
				regular avatar
			</Link>{' '}
			in side nav menu items.
		</DoDont>
	</DoDontGrid>
)}

## Content guidelines

### Write labels in sentence case for menu items and labels

Only capitalize the first letter of the menu item name, unless the label contains a trademarked app
or feature name that has been approved by legal.

If the menu name is user generated, display as is.

${(
	<DoDontGrid>
		<DoDont
			type="do"
			image={{
				url: require('./images/side-nav-do-7.png'),
				alt: 'A menu item with "For you" label using sentence case.',
			}}
		>
			Only capitalize the first letter of the first word of the label.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: require('./images/side-nav-dont-10.png'),
				alt: 'A menu item with "For You" label using title case.',
			}}
		>
			Don't capitalize other parts of the label unless it is a trademarked app or feature name (not
			all features are capitalized).
		</DoDont>
	</DoDontGrid>
)}

## Related

- [Layout](https://atlassian.design/components/navigation-system/layout)
- [Top nav items](https://atlassian.design/components/navigation-system/top-nav-items)
- [Navigation experience guidelines (Atlassians only)](https://hello.atlassian.net/wiki/spaces/navx/pages/5104144812)
`;

import React from 'react';

import { DoDont, DoDontGrid } from '@af/design-system-docs-ui';
import { md } from '@atlaskit/docs';
import Image from '@atlaskit/image';
import Link from '@atlaskit/link';

import sideNavItemsAnatomy1Dark from './images/sideNavItems-anatomy-1-dark.png';
import sideNavItemsAnatomy1Light from './images/sideNavItems-anatomy-1-light.png';
import sideNavItemsAnatomy2Dark from './images/sideNavItems-anatomy-2-dark.png';
import sideNavItemsAnatomy2Light from './images/sideNavItems-anatomy-2-light.png';
import sideNavItemsDo1Dark from './images/sideNavItems-do-1-dark.png';
import sideNavItemsDo1Light from './images/sideNavItems-do-1-light.png';
import sideNavItemsDo2Dark from './images/sideNavItems-do-2-dark.png';
import sideNavItemsDo2Light from './images/sideNavItems-do-2-light.png';
import sideNavItemsDo3Dark from './images/sideNavItems-do-3-dark.png';
import sideNavItemsDo3Light from './images/sideNavItems-do-3-light.png';
import sideNavItemsDo4Dark from './images/sideNavItems-do-4-dark.png';
import sideNavItemsDo4Light from './images/sideNavItems-do-4-light.png';
import sideNavItemsDo5Dark from './images/sideNavItems-do-5-dark.png';
import sideNavItemsDo5Light from './images/sideNavItems-do-5-light.png';
import sideNavItemsDo6Dark from './images/sideNavItems-do-6-dark.png';
import sideNavItemsDo6Light from './images/sideNavItems-do-6-light.png';
import sideNavItemsDo7Dark from './images/sideNavItems-do-7-dark.png';
import sideNavItemsDo7Light from './images/sideNavItems-do-7-light.png';
import sideNavItemsDo8Dark from './images/sideNavItems-do-8-dark.png';
import sideNavItemsDo8Light from './images/sideNavItems-do-8-light.png';
import sideNavItemsDont1Dark from './images/sideNavItems-dont-1-dark.png';
import sideNavItemsDont1Light from './images/sideNavItems-dont-1-light.png';
import sideNavItemsDont10Dark from './images/sideNavItems-dont-10-dark.png';
import sideNavItemsDont10Light from './images/sideNavItems-dont-10-light.png';
import sideNavItemsDont11Dark from './images/sideNavItems-dont-11-dark.png';
import sideNavItemsDont11Light from './images/sideNavItems-dont-11-light.png';
import sideNavItemsDont2Dark from './images/sideNavItems-dont-2-dark.png';
import sideNavItemsDont2Light from './images/sideNavItems-dont-2-light.png';
import sideNavItemsDont3Dark from './images/sideNavItems-dont-3-dark.png';
import sideNavItemsDont3Light from './images/sideNavItems-dont-3-light.png';
import sideNavItemsDont4Dark from './images/sideNavItems-dont-4-dark.png';
import sideNavItemsDont4Light from './images/sideNavItems-dont-4-light.png';
import sideNavItemsDont5Dark from './images/sideNavItems-dont-5-dark.png';
import sideNavItemsDont5Light from './images/sideNavItems-dont-5-light.png';
import sideNavItemsDont6Dark from './images/sideNavItems-dont-6-dark.png';
import sideNavItemsDont6Light from './images/sideNavItems-dont-6-light.png';
import sideNavItemsDont7Dark from './images/sideNavItems-dont-7-dark.png';
import sideNavItemsDont7Light from './images/sideNavItems-dont-7-light.png';
import sideNavItemsDont8Dark from './images/sideNavItems-dont-8-dark.png';
import sideNavItemsDont8Light from './images/sideNavItems-dont-8-light.png';
import sideNavItemsDont9Dark from './images/sideNavItems-dont-9-dark.png';
import sideNavItemsDont9Light from './images/sideNavItems-dont-9-light.png';

export const UsageTab: JSX.Element = md`
## Usage

Use side nav items to create different sections, actions, and links in the
[side nav](https://atlassian.design/components/navigation-system/layout/examples).

${(
	<Image
		src={sideNavItemsAnatomy1Light}
		srcDark={sideNavItemsAnatomy1Dark}
		alt="Diagram of side nav with menu items, a menu section, and a menu section heading."
	/>
)}

<br />

${(
	<Image
		src={sideNavItemsAnatomy2Light}
		srcDark={sideNavItemsAnatomy2Dark}
		alt="Diagram of the navigation system side nav items."
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
navigation follows Atlassian patterns consistently. For all the guidelines, [see navigation experience
guidelines (Atlassians only)](https://hello.atlassian.net/wiki/spaces/navx/pages/5104144812).

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
[side nav](https://atlassian.design/components/navigation-system/layout/examples) and the
[flyout menu popup](/packages/navigation/side-nav-items?tab=examples#flyout-menu-item).

Menus anywhere else in the app, including those triggered from the top navigation, should also use
regular [menu](https://atlassian.design/components/menu) or [dropdown menu](https://atlassian.design/components/dropdown-menu).

<br />

${(
	<DoDontGrid>
		<DoDont
			type="do"
			image={{
				url: sideNavItemsDo1Light,
				urlDarkMode: sideNavItemsDo1Dark,
				alt: 'A side nav with side nav items only.',
			}}
		>
			Use side nav menus directly in the side nav or flyout menu content.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: sideNavItemsDont1Light,
				urlDarkMode: sideNavItemsDont1Dark,
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
				url: sideNavItemsDo2Light,
				urlDarkMode: sideNavItemsDo2Dark,
				alt: 'An open dropdown menu with a list of items.',
			}}
			isFullWidth
		>
			Use dropdown menu for menus triggered by actions or actionsOnHover.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: sideNavItemsDont2Light,
				urlDarkMode: sideNavItemsDont2Dark,
				alt: 'A dropdown menu with a list of items.',
			}}
		>
			Don't use side nav menu in dropdown menus.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: sideNavItemsDont3Light,
				urlDarkMode: sideNavItemsDont3Dark,
				alt: 'A dropdown menu with menu item that uses compact density.',
			}}
		>
			Don't use compact density for dropdown menus.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: sideNavItemsDont4Light,
				urlDarkMode: sideNavItemsDont4Dark,
				alt: 'A dropdown menu with menu item that does not have a selected state.',
			}}
		>
			Don't omit the selected state on the dropdown trigger when open.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: sideNavItemsDont5Light,
				urlDarkMode: sideNavItemsDont5Dark,
				alt: 'A dropdown menu with a disabled menu item.',
			}}
		>
			Don't use disabled menu items, see{' '}
			<Link target="_blank" href="https://atlassian.design/components/menu/usage">
				menu guidance
			</Link>
			.
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
				url: sideNavItemsDo3Light,
				urlDarkMode: sideNavItemsDo3Dark,
				alt: 'A menu item with "Templates" label and "TRY" text properly placed in a designated slot on the right.',
			}}
		>
			Use the slots in side nav menus as intended.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: sideNavItemsDont6Light,
				urlDarkMode: sideNavItemsDont6Dark,
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
				url: sideNavItemsDo4Light,
				urlDarkMode: sideNavItemsDo4Dark,
				alt: 'A menu item with "Projects" label, 16px rocket icon on the left, and 12px plus and ellipsis icons on the right.',
			}}
		>
			Use small (12px) icons for actions, actionOnHover, and elemAfter. Use default (medium 16px)
			icons for elemBefore.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: sideNavItemsDont7Light,
				urlDarkMode: sideNavItemsDont7Dark,
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
				url: sideNavItemsDo5Light,
				urlDarkMode: sideNavItemsDo5Dark,
				alt: 'A menu item with "Projects" label, rocket icon, and subtle compact plus and ellipsis icon buttons with hover tooltip.',
			}}
		>
			Use subtle compact icon buttons in side nav menu items.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: sideNavItemsDont8Light,
				urlDarkMode: sideNavItemsDont8Dark,
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
				url: sideNavItemsDo6Light,
				urlDarkMode: sideNavItemsDo6Dark,
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
				url: sideNavItemsDont9Light,
				urlDarkMode: sideNavItemsDont9Dark,
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

## Use skeletons for loading side nav items

Use [menu item skeleton](/packages/navigation/side-nav-items?tab=examples#menu-item-skeleton) and
[menu section heading skeleton](/packages/navigation/side-nav-items?tab=examples#menu-section-heading-skeleton) as placeholders
for side nav items while content is loading.
For example, use them when expanding a side nav menu or opening a flyout menu, if the content won't be available immediately.

When designing and implementing the loading experience:

- **Align skeletons to their content**
<br />Compose skeleton components so they visually align with the nav items they represent.

- **Prefer fewer skeleton items**
<br/>When the number of items is unknown, render fewer skeleton items. It's better for the list to grow as content loads than to shrink.

- **Smoothly transition between states**
<br />Use a smooth transition from the skeleton state to the loaded content. Fade the skeleton in, then crossfade to the loaded content in place.

- **Load items together**
<br />Ensure all items appear loaded at the same time.

For loading states of other components that may appear in the side navigation, compose your own using [skeleton](https://atlassian.design/components/skeleton/examples).

${(
	<DoDontGrid>
		<DoDont
			type="do"
			image={{
				url: sideNavItemsDo8Light,
				urlDarkMode: sideNavItemsDo8Dark,
				alt: 'A side nav with loading menu items, showing a group of skeleton loaders in the content.',
			}}
		>
			Use skeleton loaders as placeholders for side nav items while content is loading
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: sideNavItemsDont11Light,
				urlDarkMode: sideNavItemsDont11Dark,
				alt: 'A side nav with loading menu items, showing a mix of skeleton loaders and loaded menu items.',
			}}
		>
			Don't load menu items individually.
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
				url: sideNavItemsDo7Light,
				urlDarkMode: sideNavItemsDo7Dark,
				alt: 'A menu item with "For you" label using sentence case.',
			}}
		>
			Only capitalize the first letter of the first word of the label.
		</DoDont>
		<DoDont
			type="dont"
			image={{
				url: sideNavItemsDont10Light,
				urlDarkMode: sideNavItemsDont10Dark,
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

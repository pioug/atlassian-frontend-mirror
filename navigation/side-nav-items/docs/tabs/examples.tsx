import React from 'react';

import { Example, md } from '@atlaskit/docs';
import Image from '@atlaskit/image';
import Link from '@atlaskit/link';
import { Text } from '@atlaskit/primitives/compiled';

import sideNavItemsExamplesDark from './images/sideNavItems-examples-dark.png';
import sideNavItemsExamplesLight from './images/sideNavItems-examples-light.png';

export const ExamplesTab: JSX.Element = md`
These components are intended to be used within
the [side nav](https://atlassian.design/components/navigation-system/layout/examples).

For other components that can be used within the side nav, see
[navigation resources (Atlassians only)](https://hello.atlassian.net/wiki/x/rBE7MAE).

## Menu items

There are four types of side nav menu items:

1. [Link menu item](/packages/navigation/side-nav-items#link-menu-item)
2. [Button menu item](/packages/navigation/side-nav-items#button-menu-item)
3. [Expandable menu item](/packages/navigation/side-nav-items#expandable-menu-item)
4. [Flyout menu item](/packages/navigation/side-nav-items#flyout-menu-item)

Within menu items, you can customize [\`elemBefore\`](/packages/navigation/side-nav-items#elembefore), [\`elemAfter\`](/packages/navigation/side-nav-items#elemafter),
[\`actions\`](/packages/navigation/side-nav-items#actions-and-actionsonhover) and [\`actionsOnHover\`](/packages/navigation/side-nav-items#actions-and-actionsonhover).

### Link menu item

A menu item that is wrapped in an anchor tag \`<a>\`. This is the most common type of menu item, as most menu items are used to send people to another location.

- You are responsible for specifying when the link menu item is selected, for example checking if the \`href\` matches the current URL.
- Use the [app provider](https://atlassian.design/components/app-provider/examples) to specify a custom router link component.
- For menu items that trigger an action, use [button menu item](/packages/navigation/side-nav-items#button-menu-item).

${(
	<Example
		packageName="@atlaskit/side-nav-items"
		Component={require('../../examples/docs/link-menu-item').LinkMenuItemExample}
		title="Link menu item"
		source={require('!!raw-loader!../../examples/docs/link-menu-item')}
	/>
)}

### Button menu item

A menu item wrapped in a button tag \`<button>\`. Use this component when you have an action that does
something other than navigating to another location.

- Set \`isSelected\` to indicate the button is selected.
- [Avoid disabling button menu items](https://atlassian.design/components/button/usage#avoid-disabling-buttons) as this can
  cause accessibility problems. When disabled, [\`actions\`](/packages/navigation/side-nav-items#actions-and-actionsonhover) and
  [\`actionsOnHover\`](/packages/navigation/side-nav-items#actions-and-actionsonhover) will not display.
- Be cautious of using [\`elemAfter\`](/packages/navigation/side-nav-items#elemafter) in menu item disabled states, as it may result in
  an unintended appearance if this component has no disabled states.

${(
	<Example
		packageName="@atlaskit/side-nav-items"
		Component={require('../../examples/docs/button-menu-item').ButtonMenuItemExample}
		title="Button menu item"
		source={require('!!raw-loader!../../examples/docs/button-menu-item')}
	/>
)}

### Expandable menu item

#### Default (button)

A menu item that expands to expose other menu items. Use this component to form nested navigation
hierarchies.

- Expandable menu item will always display something in [\`elemBefore\`](/packages/navigation/side-nav-items#elembefore). If no element
  is provided, it will display a chevron icon by default. If an element is provided, a chevron icon
  will replace the element for hover, press and focus states.
- Unlike other menu items, it does not support a \`description\`.
- When expandable menu item is open, any [\`actionsOnHover\`](/packages/navigation/side-nav-items#actions-and-actionsonhover) will
  display permanently.
- Every menu item type can be nested inside an expandable menu item.

${(
	<Example
		packageName="@atlaskit/side-nav-items"
		Component={
			require('../../examples/docs/expandable-menu-item-default-variant')
				.ExpandableMenuItemDefaultVariantExample
		}
		title="Expandable menu item (default)"
		source={require('!!raw-loader!../../examples/docs/expandable-menu-item-default-variant')}
	/>
)}

#### Link

An expandable menu item that is also a link location.

- You are responsible for specifying when the expandable link menu item is selected. For example, by checking if the \`href\` matches the current URL.
- In this variant, the [\`elemBefore\`](/packages/navigation/side-nav-items#elembefore) chevron is an icon button so the menu can be opened and closed without navigating to the link location.
- If changing the default chevron icon to another icon, don't override the color prop (it should be set to \`currentColor\`)

${(
	<Example
		packageName="@atlaskit/side-nav-items"
		Component={
			require('../../examples/docs/expandable-menu-item-link-variant')
				.ExpandableMenuItemLinkVariantExample
		}
		title="Expandable menu item (link)"
		source={require('!!raw-loader!../../examples/docs/expandable-menu-item-link-variant')}
	/>
)}

### Flyout menu item

A menu item that triggers a popup to expose side nav items. It can also contain other items, such as search bars and filters.

- The flyout menu always displays a chevron icon at the end position.
- Unlike other menu items, it does not support a \`description\`, [\`elemAfter\`](/packages/navigation/side-nav-items#elemafter),
  [\`actions\`](/packages/navigation/side-nav-items#actions-and-actionsonhover) or [\`actionsOnHover\`](/packages/navigation/side-nav-items#actions-and-actionsonhover).
- The flyout menu popup has a fixed 400px width. Height is not defined and can be set by your team.

${(
	<Example
		packageName="@atlaskit/side-nav-items"
		Component={require('../../examples/docs/flyout-menu-item').FlyoutMenuItemExample}
		title="Flyout menu item"
		source={require('!!raw-loader!../../examples/docs/flyout-menu-item')}
	/>
)}

#### Flyout menu popup slots

The flyout menu popup has 3 slot components that should be used for creating consistent layouts.
- \`FlyoutHeader\`. The top part of the flyout menu popup. Includes a header and a close button by default.
- \`FlyoutBody\`. The middle part of the flyout menu popup. It acts as a scroll container. It will grow to take up the available space.
- \`FlyoutFooter\` (optional). The bottom part of the flyout menu popup. Use to display a persistent 'view all' option.

${(
	<Image
		src={sideNavItemsExamplesLight}
		srcDark={sideNavItemsExamplesDark}
		alt="Diagram of the flyout menu popup slots: FlyoutHeader, FlyoutBody, and FlyoutFooter."
	/>
)}

#### Responsive flyout menu

At [breakpoints](https://atlassian.design/foundations/grid-beta/#breakpoints) \`xs\` and below (less than 768px), the flyout menu popup converts to a modal.

The modal height is determined by its content, and its width is based on the viewport. There is a 4px margin between the modal and the blanket (viewport edge).

${(
	<Text>
		To see an example of this, open the{' '}
		<Link target="_blank" href="/examples/navigation/side-nav-items/flyout-menu-item">
			interactive example
		</Link>{' '}
		and resize your browser.
	</Text>
)}

## Menu item customization

### elemBefore

A slot for custom elements to be added to the start position of the menu item.

- Only one element is allowed. Recommended usages are icons, [ContainerAvatar](/packages/navigation/side-nav-items#containeravatar),
  and app tiles. For [expandable link menu item](/packages/navigation/side-nav-items#expandable-menu-item), it will render an icon
  button without a tooltip.
- When no \`elemBefore\` is provided, the menu item will maintain the empty space. You can remove this
  space by passing in the \`COLLAPSE_ELEM_BEFORE\` symbol. Consider how this will impact the overall
  visual hierarchy before using.

When using icons and icon buttons, follow the
[usage guidance](/packages/navigation/side-nav-items?tab=usage) on the correct sizes.

${(
	<Example
		packageName="@atlaskit/side-nav-items"
		Component={require('../../examples/docs/elem-before').ElemBeforeExample}
		title="elemBefore"
		source={require('!!raw-loader!../../examples/docs/elem-before')}
	/>
)}

#### ContainerAvatar

A container for displaying images that are styled to look like an avatar, but with the correct
sizing for the side nav menu items.

- Use to display avatars in [elemBefore](/packages/navigation/side-nav-items#elembefore) (do not use regular avatar).
- Only use ContainerAvatar with the side nav menu items.

${(
	<Example
		packageName="@atlaskit/side-nav-items"
		Component={require('../../examples/docs/container-avatar').ContainerAvatarExample}
		title="ContainerAvatar"
		source={require('!!raw-loader!../../examples/docs/container-avatar')}
	/>
)}

### elemAfter

A slot for custom elements to be added to the end position of the menu item.

- Optional for all menu items except [flyout menu item](/packages/navigation/side-nav-items#flyout-menu-item), which doesn't offer this
  slot.
- Can be more than one element, although we recommended avoiding where possible due to space
  constraints. Recommended usages are for non-interactive elements such as small icons (12px),
  badge, and lozenge.
- Disappears when [\`actionsOnHover\`](/packages/navigation/side-nav-items#actions-and-actionsonhover) display. If
  [\`actions\`](/packages/navigation/side-nav-items#actions-and-actionsonhover) are present, these take the end position and shift
  \`elemAfter\` to the left.

${(
	<Example
		packageName="@atlaskit/side-nav-items"
		Component={require('../../examples/docs/elem-after').ElemAfterExample}
		title="elemAfter"
		source={require('!!raw-loader!../../examples/docs/elem-after')}
	/>
)}

### actions and actionsOnHover

Slots for icon buttons that trigger actions independent from the menu item.

- Note that \`actions\` always display, and \`actionsOnHover\` display when interacting with the menu
  item (hover, press, and focus states). When an [expandable menu item](/packages/navigation/side-nav-items#expandable-menu-item) is
  open, if \`actionsOnHover\` are present they will display on default.
- Always use subtle compact [icon buttons](https://atlassian.design/components/button/icon-button/examples) in these slots
  and enable tooltips. When using more than one icon button, apply 4px spacing.
- If the icon button triggers a
  [dropdown menu](https://atlassian.design/components/dropdown-menu/examples#default-placement), use the default (cozy)
  density and default \`bottom-start\` placement, and follow dropdown menu best practice.
- Do not apply side nav items in dropdown menus triggered by \`actions\` or \`actionsOnHover\`.

${(
	<Example
		packageName="@atlaskit/side-nav-items"
		Component={
			require('../../examples/docs/actions-and-actions-on-hover').ActionsAndActionsOnHoverExample
		}
		title="actions and actionsOnHover"
		source={require('!!raw-loader!../../examples/docs/actions-and-actions-on-hover')}
	/>
)}

## Truncation

When the label or description of side nav menu items exceed the available horizontal space, the text
becomes truncated. Tooltips expose the full menu label and are positioned right-start.

${(
	<Example
		packageName="@atlaskit/side-nav-items"
		Component={require('../../examples/docs/truncation').TruncationExample}
		title="Truncation"
		source={require('!!raw-loader!../../examples/docs/truncation')}
	/>
)}

## Menu section and menu section heading

Use **menu section** to group related menu items. This is important for accessibility as it acts as
a landmark for assistive technology.

A **menu section heading** is optional. When using, make sure it's both a visual heading and ARIA
label to name a menu section.

${(
	<Example
		packageName="@atlaskit/side-nav-items"
		Component={require('../../examples/docs/menu-section').MenuSectionExample}
		title="Menu section"
		source={require('!!raw-loader!../../examples/docs/menu-section')}
	/>
)}

## Menu divider

Avoid using this component. Instead, use a [menu section heading](/packages/navigation/side-nav-items#menu-section-and-menu-section-heading)
or a [top level spacer](/packages/navigation/side-nav-items#top-level-spacer).
If you think you have a strong use case for this component, talk to the [Navigation Experiences](https://hello.atlassian.net/wiki/spaces/navx/pages/5104144812) team first.

${(
	<Example
		packageName="@atlaskit/side-nav-items"
		Component={require('../../examples/docs/menu-divider').MenuDividerExample}
		title="Menu divider"
		source={require('!!raw-loader!../../examples/docs/menu-divider')}
	/>
)}

## Top level spacer

A 12px space to separate level 0 menu items or sections.

${(
	<Example
		packageName="@atlaskit/side-nav-items"
		Component={require('../../examples/docs/top-level-spacer').TopLevelSpacerExample}
		title="Top level spacer"
		source={require('!!raw-loader!../../examples/docs/top-level-spacer')}
	/>
)}

## Right to left languages

All side nav items support right to left languages.

${(
	<Example
		packageName="@atlaskit/side-nav-items"
		Component={require('../../examples/docs/right-to-left').RightToLeftExample}
		title="Right to left languages"
		source={require('!!raw-loader!../../examples/docs/right-to-left')}
	/>
)}

## Loading states

The following skeleton components are available for loading states of side nav menu items and section headings.
For loading states of other components that appear in the side navigation, compose your own using [skeleton](https://atlassian.design/components/skeleton/examples).

### Menu item skeleton

Use the menu item skeleton to represent the loading state of side nav [menu items](/packages/navigation/side-nav-items#menu-items). Configure each skeleton so it visually matches the menu item it represents.
- By default, the skeleton represents the menu item label.
- Use the \`hasDescription\` prop to add a skeleton for the menu item \`description\`.
- Use the \`hasElemBefore\` prop to add a skeleton for the icon, app tile, or container avatar in the \`elemBefore\` slot.

${(
	<Example
		packageName="@atlaskit/side-nav-items"
		Component={require('../../examples/docs/skeleton-menu-item').SkeletonMenuItemExample}
		title="Menu item skeleton"
		source={require('!!raw-loader!../../examples/docs/skeleton-menu-item')}
	/>
)}

### Menu section heading skeleton

Use the menu section heading skeleton to represent the loading state of side nav [menu section heading](/packages/navigation/side-nav-items#menu-section-and-menu-section-heading).

${(
	<Example
		packageName="@atlaskit/side-nav-items"
		Component={
			require('../../examples/docs/skeleton-menu-section-heading').SkeletonMenuSectionHeadingExample
		}
		title="Menu section heading skeleton"
		source={require('!!raw-loader!../../examples/docs/skeleton-menu-section-heading')}
	/>
)}
`;

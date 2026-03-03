import React from 'react';

import { code, Disclosure, Example, md } from '@atlaskit/docs';
import Link from '@atlaskit/link';
import Lozenge from '@atlaskit/lozenge';
import { Text } from '@atlaskit/primitives/compiled';
import SectionMessage, { SectionMessageAction } from '@atlaskit/section-message';

export const DragAndDropTab: JSX.Element = md`
This guide will show you how to setup drag and drop for menu items in the side navigation. These
guidelines correspond to our wider drag and drop
[design guidelines](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines) and
[accessibility guidelines](https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines/), adding
some specific affordances and decisions specifically for our side navigation.

${(
		<Example
			packageName="@atlaskit/side-nav-items"
			Component={
				require('../../examples/drag-and-drop/standalone-jira-sidebar').StandaloneJiraSidebar
			}
			title="Drag and drop example"
			source={require('!!raw-loader!../../examples/drag-and-drop/standalone-jira-sidebar')}
		/>
	)}

${(
		<Disclosure heading="Thinking about our approach">
			<Text>Our approach to drag and drop in the sidebar has been guided by three concerns:</Text>
			<ol>
				<li><Text as="strong">Performance</Text>: we only want consumers who need drag and drop to
					include code for it.
				</li>
				<li><Text as="strong">Flexibility</Text>: we have created a system that lets you achieve any
					drag and drop operation you could think of, and puts you in control of all of the business
					logic
				</li>
				<li><Text as="strong">Consistency</Text>: we want drag and drop operations in the sidebar to
					all feel the same to our users
				</li>
			</ol>
			<Text>These desired outcomes have pushed us towards a solution were we provide a lot of the small
				pieces, and it is up to you to put them together.</Text>
		</Disclosure>
	)}

<br />

${(
		<SectionMessage title="Required" appearance="warning">
			<Text>
				It is so important that you stay within these guidelines for your experiences as it will
				promote user experience consistency as well as enable us to more easily evolve all
				experiences.
			</Text>
		</SectionMessage>
	)}

<br />

${(
		<SectionMessage
			title="Pre reading"
			appearance="discovery"
			actions={
				<SectionMessageAction href="https://atlassian.design/components/pragmatic-drag-and-drop" target="_blank">
					Learn about Pragmatic drag and drop
				</SectionMessageAction>
			}
		>
			<Text>This guide assumes you already have a working knowledge of Pragmatic drag and drop.</Text>
		</SectionMessage>
	)}

## Before a drag

${(
		<Text>
			<Lozenge appearance="success" isBold>
				Goal
			</Lozenge>{' '}
			<Text as="strong">let a user know that a menu item can be dragged</Text>
		</Text>
	)}



All types of sidebar menu items can be dragged (\`ButtonMenuItem\`, \`LinkMenuItem\`,
\`FlyoutMenuItemTrigger\`, \`ExpandableMenuItemTrigger\`).

By default, menu items are _not draggable_ and you need to opt into making them draggable. To make a
menu item draggable there are two things you need to do:

1. Set \`hasDragIndicator\` to \`true\` on the menu item
2. Make the menu item \`draggable()\`

### hasDragIndicator

Setting \`hasDragIndicator\` to true on a menu item will enable visual affordances on the menu item to
make it clear that the item is draggable:

- Showing a drag handle icon before the start of the menu item on \`:hover\`
- **Changing** the cursor to \`grab\` after \`800ms\`. We have a delayed cursor change as
  [dragging is a non-primary action](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines#cursor-changes)

\`hasDragIndicator\` will not automatically make the menu item a \`draggable\` (which is why we avoided
the prop name \`isDraggable\` or \`draggable\`) - you need to make the item a \`draggable\` element in
step 2.

${code`function Item({ item }) {
	return <ButtonMenuItem hasDragIndicator>{item.content}</ButtonMenuItem>;
}`}

### Make the menu item \`draggable()\`

You make a menu item _actually_ draggable by users with \`draggable({element})\` from Pragmatic drag
and drop.

Be sure to use the forwarded \`ref\` from the menu item as the \`draggable\` element, and not another
\`ref\` such as \`visualContentRef\`. We want users to be able to drag from the main interactive element
of a menu item (the \`ref\`), but not from buttons (eg \`actions\` or \`actionsOnHover\`) that appear on
top of menu items.

With \`useMenuItemDragAndDrop()\` _(recommended)_

${code`function Item({ item }) {
	const { draggableButtonRef } = useMenuItemDragAndDrop({
		draggable: {
			/*...*/
		},
	});

	return (
		<ButtonMenuItem ref={draggableButtonRef} hasDragIndicator>
			{item.content}
		</ButtonMenuItem>
	);
}`}

Without \`useMenuItemDragAndDrop()\`

${code`function Item({ item }) {
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const element = ref.current;
		invariant(element && dropTarget);

		return draggable({
			element,
		});
	}, []);

	return (
		<ButtonMenuItem ref={ref} hasDragIndicator>
			{item.content}
		</ButtonMenuItem>
	);
}`}

## Start of a drag

${(
		<Text>
			<Lozenge appearance="success" isBold>
				Goal
			</Lozenge>{' '}
			<Text as="strong">make it clear what is dragging</Text>
		</Text>
	)}

When a drag is starting, there are two things you need to do:

1. Setup the drag preview

We have a \`<DragPreview />\` component that embodies the visual language we want for menu item drag
previews:

- Only displays essential information - \`elemBefore\` and content (the \`children\`)
- Is limited in width
  ([due to web platform design constraints](https://atlassian.design/components/pragmatic-drag-and-drop/web-platform-design-constraints))

${code`import { DragPreview } from '@atlaskit/side-nav-items/drag-and-drop/drag-preview';
import ProjectIcon from '@atlaskit/icon/core/project';

function ProjectsDragPreview() {
	return <DragPreview elemBefore={<ProjectIcon label="" />} content="Projects" />;
}`}

If no \`elemBefore\` is provided, then the \`elemBefore\` will automatically collapse. There is no need
to pass in \`COLLAPSE_ELEM_BEFORE\`. We do this as there is no need to maintain vertical side
navigation vertical alignment in the drag preview.

${code`import { DragPreview } from '@atlaskit/side-nav-items/drag-and-drop/drag-preview';

function ProjectsDragPreview() {
	return <DragPreview content="Projects" />;
}`}

${(
		<SectionMessage>
			<Text>
				<code>useMenuItemDragAndDrop()</code> does a lot of the wiring talked about below. Please try
				to use the hook first before reaching for the lower level pieces.
			</Text>
		</SectionMessage>
	)}

Please ensure the drag preview is pushed away from the users pointer (with \`pointerOutsideOfPreview\`
from Pragmatic drag and drop) by our
[standard amount](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines)
(\`{x: token('space.200'), y: token('space.100')\`).

See our
[drag preview guidelines](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/adapters/element/drag-previews)
for more information about mounting native drag previews.

2. Pass \`isDragging={true}\` to the menu item

This will lower the opacity on the item being dragged as our
[standard visual cue](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines) that something is being
dragged.

## While dragging

${(
		<Text>
			<Lozenge appearance="success" isBold>
				Goal
			</Lozenge>{' '}
			<Text as="strong">make it clear what the result of the drag will be</Text>
		</Text>
	)}

There are four things you need to do in order to make it possible for a menu item to be dropped on:

1. Make the menu item a _drop target_
2. Add hitbox information to the menu item
3. Display drop indicators as needed on menu item
4. Display a group drop indicator around the current group of menu items

1, 2 and 3 can more easily be achieved with \`useMenuItemDragAndDrop()\`; and 4 requires some light
wiring by consumers.

### Making a menu item a drop target

#### Use \`visualContentRef\`

To make a menu item a drop target you call \`dropTargetForElements\` with the \`visualContentRef\`
provided by all menu items.

_Rationale:_

- It is the full width of the element. We want to enable users to be able to drag only vertically to
  be able to drag into nested menu items
- It wraps all elements in the menu item and so will be triggered even when dragging over \`actions\`
  and other elements on top of the main interactive element.

With \`useMenuItemDragAndDrop()\` _(recommended)_

${code`function Item({ item }) {
	const { draggableButtonRef, dropTargetRef } = useMenuItemDragAndDrop({});

	return (
		<ButtonMenuItem visualContentRef={dropTargetRef} ref={draggableButtonRef}>
			{item.content}
		</ButtonMenuItem>
	);
}`}

Custom implementation

${code`function Item({ item }) {
	const dropTargetRef = useRef<HTMLDivElement | null>(null);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const element = ref.current;
		const dropTarget = dropTargetRef.current;
		invariant(element && dropTarget);

		return combine(
			// make the menu item a drop target
			dropTargetForElements({
				element: dropTarget,
				// make the drop target sticky
				getIsSticky: () => true,
				// prevent dropping on self
				canDrop: ({ source }) => source.element !== element && source.data.type === 'menu-item',
			}),
			// make the menu item draggable
			draggable({
				element,
			}),
		);
	}, []);

	return (
		<ButtonMenuItem ref={ref} visualContentRef={dropTargetRef}>
			{item.content}
		</ButtonMenuItem>
	);
}`}

#### Stickiness

${(
		<SectionMessage>
			<Link
				target="_blank"
				href="https://atlassian.design/components/pragmatic-drag-and-drop/core-package/drop-targets#getissticky"
			>
				Background information about stickiness
			</Link>
		</SectionMessage>
	)}

If you are setting up drop targets without \`useMenuItemDragAndDrop()\` it is important that you make
the menu item drop target sticky \`getIsSticky: () => true\`. The \`<GroupDropIndicator>\` should _not_
be sticky, and it will clear stickiness when you leave the group. Stickiness on the menu items helps
to have a nicer experience when dragging over a group that contains gaps in drop targets, for
example when there are titles in the sidebar.

#### Don't allow menu items to drop on themselves

If you are setting up drop targets without \`useMenuItemDragAndDrop()\`, you need to manually ensure
that a menu item cannot drop on itself with \`canDrop()\`

${code`dropTargetForElements({
	element: dropTarget,
	// Don't allow dropping on itself
	canDrop: ({ source }) => source.element !== element && source.data.type === 'menu-item',
});`}

### Add hitbox information to a menu item

The hitbox is responsible for examining the user input when over a drop target and outputting the
appropriate operation for that input. For a menu item, you can specify which of the following
operations are permitted:

- \`"reorder-before"\`
- \`"reorder-after"\`
- \`"combine"\`

A result of a hitbox function call, will result in an \`Instruction\` which you can use to determine
what operation should be completed when the drag finishes, as well as for displaying the drop
indicator during a drag operation.

Each operation has three possible values:

- \`"not-available"\` (default)
- \`"available"\`
- \`"blocked"\` (similar to \`"available"\`, but will show warning colors. See below for more
  information)

The hitbox for an drop target will automatically adjust to accommodate each additional available
operation.

${code`type Operation = 'reorder-before' | 'reorder-after' | 'combine';

type Instruction = {
	// What the operation is
	operation: Operation;

	// whether or not the operation was "blocked"
	blocked: boolean;
};`}

With \`useMenuItemDragAndDrop()\` _(recommended)_

${code`import { useMenuItemDragAndDrop } from '@atlaskit/side-nav-items/drag-and-drop/use-menu-item-drag-and-drop';

function OurButtonItem() {
	const { state, draggableButtonRef, dragPreview, dropTargetRef, dropIndicator } =
		useMenuItemDragAndDrop({
			dropTarget: {
				getOperations: () => ({
					'reorder-before': 'available',
					combine: 'available',
					'reorder-after': 'available',
				}),
			},
		});

	return (
		<>
			<ButtonMenuItem
				elemBefore={<BasketballIcon label="" />}
				ref={draggableButtonRef}
				isDragging={state.type === 'dragging'}
				hasDragIndicator
				dropIndicator={dropIndicator}
				visualContentRef={dropTargetRef}
			>
				Button menu item
			</ButtonMenuItem>
			{dragPreview}
		</>
	);
}`}

Manually adding operations

${code`import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
	attachInstruction,
	extractInstruction,
	type Instruction,
} from '@atlaskit/side-nav-items/drag-and-drop/hitbox';

function Item({ item }) {
	const dropTargetRef = useRef<HTMLDivElement | null>(null);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const element = ref.current;
		const dropTarget = dropTargetRef.current;
		invariant(element && dropTarget);

		return combine(
			// make the menu item a drop target
			dropTargetForElements({
				element: dropTarget,
				getData: ({ input, element }) => {
					// your base data you want to attach to the drop target
					const data = {
						type: 'menu-item',
						itemId: 'A',
					};
					// this will 'attach' an \`Instruction\` to your data object
					return attachInstruction(data, {
						input,
						element,
						operations: {
							'reorder-before': 'available',
							'reorder-after': 'available',
							combine: 'available',
						},
					});
				},
				onDrop: (args) => {
					const instruction: Instruction | null = extractInstruction(args.self.data);
				},
			}),
			// make the menu item draggable
			draggable({
				element,
			}),
		);
	}, []);

	return (
		<ButtonMenuItem ref={ref} visualContentRef={dropTargetRef}>
			{item.content}
		</ButtonMenuItem>
	);
}`}

#### Preventing operations

If you don't want an operation to be available, you have a few options.

1. Set \`canDrop: () => false\`
2. Set an operation to \`"not-available"\`

With \`useMenuItemDragAndDrop()\` _(recommended)_

${code`useMenuItemDragAndDrop({
	dropTarget: {
		getOperations: () => ({
			'reorder-before': 'available',
			'reorder-after': 'not-available', // reordering after no longer available
		}),
	},
});`}

Without \`useMenuItemDragAndDrop()\`

${code`return attachInstruction(data, {
	input,
	element,
	operations: {
		'reorder-before': 'available',
		'reorder-after': 'not-available', // reordering after no longer available
	},
});`}

3. Don't include an operation in \`operations\`

With \`useMenuItemDragAndDrop()\` _(recommended)_

${code`useMenuItemDragAndDrop({
	dropTarget: {
		getOperations: () => ({
			'reorder-before': 'available',
			// 'reorder-after' and 'combine' are "not-available" by default
		}),
	},
});`}

Without \`useMenuItemDragAndDrop()\`

${code`return attachInstruction(data, {
	input,
	element,
	operations: {
		'reorder-before': 'available',
		// 'reorder-after' and 'combine' are "not-available" by default
	},
});`}

#### Blocking operations

Sometimes you want to explicitly call out that an operation is not permitted _right now_. An example
of this is draft pages in Confluence which cannot be the target of a drag operation, but once page
is no longer a draft it could be the target of a drag operation. In these cases, it can be helpful
to make it explicit to the user that a particular drag operation can not permitted. You can use
\`blocked\` for this use case. When an operation is blocked, it will be used by our _drop indicator_
to show a drop indicator with a warning color.

${code`useMenuItemDragAndDrop({
	dropTarget: {
		getOperations: () => ({
			combine: 'blocked',
		}),
	},
});`}

### Drop indicators

Drop indicators are used to make it clear what the result of a drag operation will be. There are two
types of drop indicators that are **required** for you to setup:

1. Drop indicators that appear on menu items
2. Drop indicators that appear around groups of menu items (\`<GroupDropIndicator/>\`)

#### Menu item drop indicator

A menu item \`<DropIndicator>\` component is responsible for the visual representation of an
\`Instruction\` from the \`hitbox\`. In order for the \`<DropIndicator>\` to be rendered correctly, it is
important that you provide the component to the \`dropIndicator\` prop on a menu item.

The \`<DropIndicator />\` is handled for you when leveraging \`useMenuItemDragAndDrop()\`

${code`import { useMenuItemDragAndDrop } from '@atlaskit/side-nav-items/drag-and-drop/use-menu-item-drag-and-drop';

function OurButtonItem() {
	const { state, draggableButtonRef, dragPreview, dropTargetRef, dropIndicator } =
		useMenuItemDragAndDrop({
			dropTarget: {
				getOperations: () => ({
					'reorder-before': 'available',
					'reorder-after': 'available',
				}),
			},
		});

	return (
		<>
			<ButtonMenuItem
				elemBefore={<BasketballIcon label="" />}
				ref={draggableButtonRef}
				isDragging={state.type === 'dragging'}
				hasDragIndicator
				// 👇 pass the drop indicator ReactNode into the dropIndicator prop
				dropIndicator={dropIndicator}
				visualContentRef={dropTargetRef}
			>
				Button menu item
			</ButtonMenuItem>
			{dragPreview}
		</>
	);
}`}

Rough idea when not using \`useMenuItemDragAndDrop()\`

${code`import { DropIndicator } from '@atlaskit/side-nav-items/drag-and-drop/drop-indicator';

function Item({ item }) {
	const [state, setState] = useState<TItemState>({ type: 'idle' });
	const dropIndicator = state.type === 'is-over' && state.instruction && (
		<DropIndicator instruction={state.instruction} />
	);

	return (
		<ButtonMenuItem
			ref={ref}
			elemBefore={item.elemBefore}
			isDragging={state.type === 'dragging'}
			// 👇 pass the drop indicator to the dropIndicator prop
			dropIndicator={dropIndicator}
			visualContentRef={dropTargetRef}
			hasDragIndicator
		>
			{item.content}
		</ButtonMenuItem>
	);
}`}

#### Group drop indicator

As a part of the design language for drag and drop in the sidebar, we also add a visual affordance
around the section that the user is dragging over. This is to help make it even clearer where
something will end up after a drop.

To achieve this, you need to wrap any groups of draggable menu items in our \`<GroupDropIndicator>\`.
A group is any logical list of menu items at the same level in the side navigation. A group could be
all items on a particular level, or a logical subset of items at a particular level (eg a "recent
projects" section).

- You need to setup the \`<GroupDropIndicator>\` as a drop target
- The drop target should _not_ have stickiness. This is important as it is the mechanism for
  clearing stickiness on menu item drop targets.
- Set \`isActive={true}\` on the \`<GroupDropIndicator>\` when it is the innermost available
  \`<GroupDropIndicator>\`

${(
		<Example
			packageName="@atlaskit/side-nav-items"
			Component={require('../../examples/drag-and-drop/simple').AllMenuItems}
			title="Group drop indicator example"
			source={require('!!raw-loader!../../examples/drag-and-drop/simple')}
		/>
	)}

${code`import { GroupDropIndicator } from '@atlaskit/side-nav-items/drag-and-drop/group-drop-indicator';

function isInnerMostGroup({ location, self }: ElementDropTargetEventBasePayload): boolean {
	const [innerMost] = location.current.dropTargets.filter(
		(dropTarget) => dropTarget.data.type === 'menu-item-group',
	);
	return innerMost?.element === self.element;
}

export function MyMenuItemGroup() {
	const [isInnerMostOver, setIsInnerMostOver] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const element = ref.current;
		invariant(element);
		return dropTargetForElements({
			element,
			canDrop: ({ source }) => source.data.type === 'menu-item',
			getData: () => ({ type: 'menu-item-group' }),
			onDragStart: (args) => setIsInnerMostOver(isInnerMostGroup(args)),
			onDropTargetChange: (args) => setIsInnerMostOver(isInnerMostGroup(args)),
			onDrop: () => setIsInnerMostOver(false),
		});
	}, []);

	return (
		<GroupDropIndicator isActive={isInnerMostOver} ref={ref}>
			<OurLinkMenuItem />
			<OurButtonItem />
			<OurFlyoutItem />
			<OurExpandableItem />
		</GroupDropIndicator>
	);
}`}

### Automatic scrolling

During a drag operation, it is important that a user be able to effortlessly scroll the sidebar in
order to easily place a dragging item in any position.
[Please wire up \`autoScrollForElements\`](https://atlassian.design/components/pragmatic-drag-and-drop/optional-packages/auto-scroll/about)
on the \`ref\` that the \`<SideNavContent>\` returns to ensure the scrollable portion of the sidebar
automatically scrolls during a drag operation.

${code`import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';

function Sidebar() {
	const scrollableRef = useRef<HTMLDivElement | null>(null);

	// setup auto scrolling for sidenav scroll container
	useEffect(() => {
		const scrollable = scrollableRef.current;
		invariant(scrollable);
		return autoScrollForElements({
			element: scrollable,
			canScroll: ({ source }) => source.data.type === 'menu-item',
		});
	}, []);

	return <SideNavContent ref={scrollableRef}>{/* ... */}</SideNavContent>;
}`}

## On drop

${(
		<Text>
			<Lozenge appearance="success" isBold>
				Goal
			</Lozenge>{' '}
			<Text as="strong">immediately update the interface</Text>
		</Text>
	)}

1. Figure out what \`Operation\` to do

Using \`extractInstruction\` you can extract the \`Instruction\` to be performed.

${code`type Operation = 'reorder-before' | 'reorder-after' | 'combine';

type Instruction = {
	// What the operation is
	operation: Operation;

	// whether or not the operation was "blocked"
	blocked: boolean;
};`}

${code`useEffect(() => {
		return monitorForElements({
			canMonitor: ({ source }) => source.data.type === 'menu-item',
			onDrop({ source, location }) {
				const dragging = source.data;
				const [innerMost] = location.current.dropTargets;

				if (!innerMost) {
					return;
				}
				const dropTargetData = innerMost.data;

				const instruction: Instruction | null = extractInstruction(dropTargetData);
				if (!instruction) {
					return;
				}

				// Do something based on the instruction
			});
}, []);`}

2. Optimistically update the interface

When a drag operation is finished, you need to optimistically update the interface (don't wait for
the update to persist on the server). Don't lock the interface while the update is persisting, allow
them to continue to engage with the interface (including performing more drag and drop operations).

If an update fails, please let the user know in the interface through a flag; and synchronize the
interface with the server state. The interface can become locked during this synchronization if
needed.

3. Flash the moved menu item

Leverage
[\`triggerPostMoveFlash\`](https://atlassian.design/components/pragmatic-drag-and-drop/optional-packages/flourish/trigger-post-move-flash/examples)
to trigger a flash on the interactive element (it's \`ref\`) of the moved menu item. This gives
helpful clarity to users about what has changed.

See our complete example above to see how you can achieve this.

Some possible options:

- Keep a registry of \`HTMLElement\`s for all menu items, so you can look up the menu item element
  after it has been moved
- Lookup elements with data attributes after the drop. Not ideal, but can get the job done.

## useMenuItemDragAndDrop

We have created a \`react\` hook \`useMenuItemDragAndDrop()\` which takes care of a lot of plumbing when
setting up drag and drop for menu items in the sidebar. We strongly recommend that you start with
this hook, and if it doesn't work for you, then you can build up everything using the pieces we
expose.

${code`import { getProjectData, isProjectData } from './helpers';

function Project({ project }: { project: TProject }) {
	const { state, draggableAnchorRef, dragPreview, dropTargetRef, dropIndicator } =
		useMenuItemDragAndDrop({
			draggable: {
				getInitialData: () => getProjectData(project),
				getDragPreviewPieces: () => ({
					elemBefore: <ProjectIcon label="" color="currentColor" />,
					content: project.name,
				}),
			},
			dropTarget: {
				getData: () => getProjectData(project),
				getOperations: () => ({
					'reorder-after': 'available',
					'reorder-before': 'available',
				}),
				canDrop: ({ source }) => isProjectData(source.data),
			},
		});

	return (
		<>
			<LinkMenuItem
				href={project.href}
				elemBefore={project.icon}
				ref={draggableAnchorRef}
				isDragging={state.type === 'dragging'}
				hasDragIndicator
				dropIndicator={dropIndicator}
				visualContentRef={dropTargetRef}
			>
				{project.name}
			</LinkMenuItem>
			{dragPreview}
		</>
	);
}`}

What \`useMenuItemDragAndDrop\` does for you:

- Sets up a \`draggable()\` (with conditional dragging)
- Sets up a \`dropTargetForElements()\` (with conditional dropping)
- Prevents dropping on self
- Sets up the \`<DragPreview>\`, pushes it away from the users pointer by the desired amount, and
  mounts it to a \`react\` portal
- Attaches \`Operation\`s to the drop target
- Returns the correct drop indicator for the current \`Operation\`.
- Manages it's own state in a performant way and let's you respond to state changes
- Automatically makes the drop target sticky (stickiness will be cleared by \`GroupDropIndicator\`)

Arguments:

- \`draggable\`: object containing arguments relevant for setting up the \`draggable()\`. Don't include
  the \`draggable\` property if you don't ever want the menu item it be a draggable.
- \`draggable.canDrag\`: Whether or not the element should be \`draggable\` (useful for conditional
  dragging)
- \`draggable.getInitialData()\`: data to attach to the \`draggable\` (see
  [draggable | getInitialData](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/adapters/element/about#draggable))
- \`draggable.getDragPreviewPieces()\`: provide the \`ReactNode\`s to be used when rendering the
  \`<DragPreview />\`

- \`dropTarget\`: object containg arguments relevant for setting up a menu item as a drop target.
  Don't include the \`dropTarget\` property if you don't ever want the menu item it be a draggable.
- \`dropTarget.canDrop()\`: whether or not the menu item can be dropped on (see
  [dropTarget | canDrop](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/drop-targets#candrop))
- \`dropTarget.getData()\`: data to attach to the drop target (see [dropTarget | getData](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/drop-targets#getdata))
- \`dropTarget.getOperations()\`: which drop \`Operation\`s
  (\`"reorder-before" | "reorder-after" | "combine"\`) are permitted on the menu item

Return value:

- \`state\`: an object containing what the drag and drop state of the menu item is
  (\`"idle" | "preview" | "dragging" | "is-over"\`)
- \`draggableAnchorRef\`: used to mark an anchor element as the draggable element. Use this if the
  menu item is an anchor.
- \`draggableButtonRef\`: used to mark an button element as the draggable element. Use this if the
  menu item is an button.
- \`dropTargetRef\`: must be used to mark the \`HTMLDivElement\` as the \`dropTargetForElements\`
- \`dragPreview\`: a \`ReactNode\` to be included in your \`react\` tree which will be used to render the
  \`<DragPreview />\`
- \`dropIndicator\`: a \`ReactNode\` containing the drop indicator if it's needed

## Accessible actions

${(
		<Text>
			<Lozenge appearance="success" isBold>
				Goal
			</Lozenge>{' '}
			<Text as="strong">
				provide a delightful way for folks leveraging assistive technologies to achieve the same
				outcomes as a drag and drop operation
			</Text>
		</Text>
	)}

All menu items that have drag and drop enabled must also include an alternative mechanism to achieve
the same outcomes as drag and drop operations.

${(
		<Example
			packageName="@atlaskit/side-nav-items"
			Component={
				require('../../examples/drag-and-drop/standalone-jira-sidebar').StandaloneJiraSidebar
			}
			title="Accessible actions example"
			source={require('!!raw-loader!../../examples/drag-and-drop/standalone-jira-sidebar')}
		/>
	)}

What you need to do (for all menu items _except_ \`FlyoutMenuItemTrigger\`)

- All menu items with drag and drop enabled must have a "more" button as \`actionsOnHover\`
- The more menu should be a trigger for a \`DropdownMenu\`
- The \`DropdownMenu\` menu should contain an entry called \`"Reorder \${entityName}"\` or \`"Move"\`. The
  \`DropdownMenu\` can also contain other actions for the entity (eg "Archive").

For \`FlyoutMenuItemTrigger\`:

- \`FlyoutMenuItemTrigger\` does not support \`actionsOnHover\`, so you need to put a
  \`"Reorder \${entityName}"\` menu item in the \`FlyoutMenuItemContent\` of the \`FlyoutMenuItem\`.
- It is known that this is a minor inconsistency with other menu items; however, this was decided to
  be the best available option based on how our menu items work today.

### Move operations

There are two categories of movement actions:

1. Only reordering is available

Show a further submenu with available operations. The possible operations are:

1. "Move to top"
2. "Move up"
3. "Move down"
4. "Move to bottom"

- When an item is in the last position: "Move down" and "Move to bottom" should be disabled
- When an item is in the first position: "Move to top" and "Move up" should be disabled
- When there is only one item in the group, the \`"Reorder \${entityName}"\` dropdown menu should be
  disabled.

_See "project" menu items in the above example for what this looks like_

2. More complex operations are available

When operations other than just reordering are possible (eg combining, moving to different levels in
the navigation and so on), then show a modal containing a form with a way for a user to input any
available action.

_See "filter" menu items in the above example for what this looks like_

### Focus restoration

After an item has been moved with an action menu, and the control triggering the action had focus,
then the **menu item** \`ref\` should be given focus in it's new location. At this stage we have
decided not to give focus to the more menu dropdown button as that is not universally available on
the menu item (eg for flyout menu items, we are putting the move action in the flyout).

See
["Let the user easily continue to trigger more outcomes"](https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines#3-let-the-user-easily-continue-to-trigger-more-outcomes)
in our drag and drop accessibility guide.

When working with complex movement actions (eg move into child) this will require expanding all
parent expandable menu items when the drag finishes.

## Special guidance

### ExpandableMenuItem

Sometimes you want the \`ExpandableMenuItemTrigger\` to be your drop target, and sometimes you want
the \`ExpandableMenuItemTrigger\` and the \`ExpandableMenuItemContent\` to be a single drop target.

_In our provided example, when dragging a top level menu item, the whole \`ExpandableMenuItem\` is a
drop target, whereas when dragging a filter, the \`ExpandableMenuItemTrigger\` is the drop target._

When the \`ExpandableMenuItemTrigger\` is the drop target, you should attach the \`dropTargetRef\` and
provide the \`dropIndicator\` to the \`ExpandableMenuItemTrigger\`.

${code`function Project({ project }: { project: TProject }) {
	const { state, draggableAnchorRef, dragPreview, dropTargetRef, dropIndicator } =
		useMenuItemDragAndDrop({
			draggable: {
				getInitialData: () => getProjectData(project),
				getDragPreviewPieces: () => ({
					elemBefore: project.icon,
					content: project.name,
				}),
			},
			dropTarget: {
				getData: () => getProjectData(project),
				getOperations: () => ({
					'reorder-after': 'available',
					'reorder-before': 'available',
				}),
				canDrop: ({ source }) => isProjectData(source.data),
			},
		});

	return (
		<>
			<LinkMenuItem
				href={project.href}
				elemBefore={project.icon}
				ref={draggableAnchorRef}
				isDragging={state.type === 'dragging'}
				hasDragIndicator
				// 👇 drop target is the the trigger
				visualContentRef={dropTargetRef}
				dropIndicator={dropIndicator}
			>
				{project.name}
			</LinkMenuItem>
			{dragPreview}
		</>
	);
}`}

When the whole \`ExpandableMenuItem\` is the drop target, you should attach the \`dropTargetRef\` and
provide the \`dropIndicator\` to the \`ExpandableMenuItem\`.

${code`export function ProjectsMenuItem() {
	const { state, draggableButtonRef, dragPreview, dropTargetRef, dropIndicator } =
		useMenuItemDragAndDrop({
			draggable: {
				getInitialData: () => getTopLevelItemData('projects'),
				getDragPreviewPieces: () => ({
					elemBefore: <ProjectIcon label="" color="currentColor" />,
					content: 'Projects',
				}),
			},
			dropTarget: {
				getData: () => getTopLevelItemData('projects'),
				getOperations: () => ({
					'reorder-after': 'available',
					'reorder-before': 'available',
				}),
				canDrop: ({ source }) => isTopLevelItemData(source.data),
			},
		});

	return (
		<>
			<ExpandableMenuItem
				// 👇 drop target is the whole expandable item
				ref={dropTargetRef}
				// 👇 pass the drop indicator to the whole expandable item
				dropIndicator={dropIndicator}
			>
				<ExpandableMenuItemTrigger
					// 👇 trigger is still the draggable
					ref={draggableButtonRef}
					isDragging={state.type === 'dragging'}
					hasDragIndicator
					elemBefore={<ProjectIcon label="" color="currentColor" />}
				>
					Projects
				</ExpandableMenuItemTrigger>
				<ExpandableMenuItemContent>{/* ... */}</ExpandableMenuItemContent>
			</ExpandableMenuItem>
			{dragPreview}
		</>
	);
}`}

### ExpandableMenuItemTrigger

#### Drag start

When dragging any menu item, all expandable menu items that are valid drop targets, or contain valid
drop targets, should have their \`<ExpandableMenuItemTrigger>\` should no longer show any custom
\`elemBefore\` and use the default icons. Expandable menu items can be expanded during a drag, and
showing their chevrons is a helpful way for users to see at a glance which parts of the side
navigation can potentially be nested into

${code`<ExpandableMenuItemTrigger elemBefore={isFilterDragging ? null : item.elemBefore}>
	{filter.name}
</ExpandableMenuItemTrigger>`}

When dragging a \`<ExpandableMenuItemTrigger>\` you should collapse the expandable menu when the drag
is starting. This prevents the strange case of a parent dragging into itself.

#### While dragging

If a user drags over of \`<ExpandableMenuItemTrigger>\` for \`500ms\` with the \`"combine"\` operation,
and the menu item is not expanded, then it should be expanded. This allows users to drag into
collapsed menu items.

#### On drop

Once the drag is completed, you should restore the collapsed state of the
\`ExpandableMenuItemTrigger\`

- If it was collapsed before the drag started: keep it collapsed
- If it was expanded before the drag started: expand it again after the drag as completed

The dragged \`ExpandableMenuItemTrigger\` must be visible after the drag has finished. This will
involve expanding any parent \`ExpandableMenuItemTrigger\` needed.

An example: Dragging Filter A and the drop operation is a \`"combine"\` on a collapsed Filter B
\`ExpandableMenuItemTrigger\`. Outcome: Filter B should be expanded to make Filter A visible after the
drop.

### FlyoutMenuItemTrigger

#### Drag start

All \`<FlyoutMenuItemTrigger>\`s should be closed when dragging _any_ menu item.

#### While dragging

${(
		<SectionMessage title="Not supported (yet)" appearance="warning">
			<Text>
				It is currently _not supported_ to drop an item onto a <code>FlyoutMenuItemTrigger</code> or
				into <code>FlyoutMenuItemContent</code>. There are some experience questions to be worked
				through to support this. We thought we would wait and see if anybody needed this before
				spending too much time on it. If you have need of this use case, please reach out and we can
				prioritize working through the design challenges.
			</Text>
		</SectionMessage>
	)}

#### Accessible actions for flyouts

See our [accessible actions](/packages/navigation/side-nav-items?tab=drag_and_drop#accessible-actions) section for \`FlyoutMenuItemTrigger\` specific
guidance.

### anchors

By default, menu items that are **anchor elements (\`<a>\`)** are _not_ draggable (unlike standard
anchor elements that are **draggable** by default).

Menu items that are anchors:

- \`LinkMenuItem\`
- \`ExpandableMenuItemTrigger\` with a \`href\`
- \`FlyoutMenuItemTrigger\` with a \`href\`

If you want one of these menu items to be draggable, then you need to wire them up for drag and drop
according to this guide. For anchor elements, the URL information is _automatically_ attached to the
native drag data, so the anchor can be dragged into the browser menu bar, other external application
and so on. You are welcome to attach additional information using
[\`getInitialData()\` and \`getInitialDataForExternal()\` from Pragmatic drag and drop](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/adapters/element/about#draggable).
`;

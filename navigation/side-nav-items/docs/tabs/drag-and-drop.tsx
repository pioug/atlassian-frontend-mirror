/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@atlaskit/css';
import { code, Disclosure, Example, md, TSProps } from '@atlaskit/docs';
import { Stack, Text } from '@atlaskit/primitives/compiled';
import SectionMessage from '@atlaskit/section-message';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	insetPropTable: {
		marginInlineStart: token('space.400'),
		marginBlockStart: token('space.negative.400'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-invalid-css-map -- false positive
export const DragAndDropTab: JSX.Element = md`

Use this guide to set up drag and drop for menu items in the side navigation. This guide assumes a working knowledge of [Pragmatic drag and drop](https://atlassian.design/components/pragmatic-drag-and-drop).

These guidelines align with our wider drag and drop
[design guidelines](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines) and
[accessibility guidelines](https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines/), with
some specific affordances and decisions for our side navigation.


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


## useMenuItemDragAndDrop

For standard use cases, use the \`useMenuItemDragAndDrop()\` hook to set up drag and drop for menu items in the sidebar.
This hook handles most of the wiring for you, and can be customized to your needs.

\`useMenuItemDragAndDrop()\` is a convenience hook that:

- Sets up a [draggable](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/adapters/element/about#draggable) (with conditional dragging)
- Sets up a [drop target](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/drop-targets) (with conditional dropping)
- Prevents dropping on self
- Sets up the \`<DragPreview>\`, pushes it away from the user's pointer by the desired amount, and mounts it to a React portal
- Attaches \`Operation\`s to the drop target
- Returns the correct drop indicator for the current \`Operation\`
- Manages its own state in a performant way and lets you respond to state changes
- Automatically makes the drop target sticky (stickiness will be cleared by \`GroupDropIndicator\`)

${(
	<Disclosure heading="Arguments">
		<Stack space="space.400">
			<Stack>
				<TSProps
					props={{
						types: [
							{
								name: 'draggable',
								type: 'object',
								description:
									"Arguments relevant for setting up the `draggable()`. Don't include the `draggable` property if you don't ever want the menu item to be a draggable.",
								required: false,
								deprecated: false,
							},
						],
					}}
				/>

				<div css={styles.insetPropTable}>
					<TSProps
						props={{
							types: [
								{
									name: 'draggable.canDrag',
									type: 'function',
									description:
										'Whether or not the element should be `draggable` (useful for conditional dragging)',
									required: false,
									deprecated: false,
								},
								{
									name: 'draggable.getInitialData',
									type: 'function',
									description:
										'data to attach to the `draggable` (see [draggable | getInitialData](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/adapters/element/about#draggable))',
									required: false,
									deprecated: false,
								},
								{
									name: 'draggable.getDragPreviewPieces',
									type: 'function',
									description:
										'provide the `ReactNode`s to be used when rendering the `<DragPreview />`',
									required: false,
									deprecated: false,
								},
							],
						}}
					/>
				</div>
			</Stack>

			<Stack>
				<TSProps
					props={{
						types: [
							{
								name: 'dropTarget',
								type: 'object',
								description:
									"Arguments relevant for setting up the `dropTarget()`. Don't include the `dropTarget` property if you don't ever want the menu item to be a drop target.",
								required: false,
								deprecated: false,
							},
						],
					}}
				/>

				<div css={styles.insetPropTable}>
					<TSProps
						props={{
							types: [
								{
									name: 'dropTarget.canDrop',
									type: 'function',
									description:
										'whether or not the menu item can be dropped on (see [dropTarget | canDrop](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/drop-targets#candrop))',
									required: false,
									deprecated: false,
								},
								{
									name: 'dropTarget.getData',
									type: 'function',
									description:
										'data to attach to the drop target (see [dropTarget | getData](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/drop-targets#getdata))',
									required: false,
									deprecated: false,
								},
								{
									name: 'dropTarget.getOperations',
									type: 'function',
									description:
										'which drop `Operation`s (`"reorder-before" | "reorder-after" | "combine"`) are permitted on the menu item',
									required: false,
									deprecated: false,
								},
							],
						}}
					/>
				</div>
			</Stack>
		</Stack>
	</Disclosure>
)}

${(
	<Disclosure heading="Return value">
		<TSProps
			props={{
				types: [
					{
						name: 'state',
						type: 'object',
						description:
							'an object containing what the drag and drop state of the menu item is (`"idle" | "preview" | "dragging" | "is-over"`)',
						required: false,
						deprecated: false,
					},
				],
			}}
		/>

		<div css={styles.insetPropTable}>
			<TSProps
				props={{
					types: [
						{
							name: 'state.draggableAnchorRef',
							type: 'object',
							description:
								'used to mark an anchor element as the draggable element. Use this if the menu item is an anchor.',
							required: false,
							deprecated: false,
						},
						{
							name: 'state.draggableButtonRef',
							type: 'object',
							description:
								'used to mark a button element as the draggable element. Use this if the menu item is a button.',
							required: false,
							deprecated: false,
						},
						{
							name: 'state.dropTargetRef',
							type: 'object',
							description:
								'attach to the `HTMLDivElement` that should be the `dropTargetForElements`',
							required: false,
							deprecated: false,
						},
						{
							name: 'state.dragPreview',
							type: 'object',
							description:
								'a `ReactNode` to be included in your React tree which will be used to render the `<DragPreview />`',
							required: false,
							deprecated: false,
						},
						{
							name: 'state.dropIndicator',
							type: 'object',
							description: "a `ReactNode` containing the drop indicator if it's needed",
							required: false,
							deprecated: false,
						},
					],
				}}
			/>
		</div>
	</Disclosure>
)}

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

${(
	<Disclosure heading="Non-standard usage">
		{md`
## Non-standard usage

Although not recommended, you can wire up menu items manually with
[Pragmatic drag and drop](https://atlassian.design/components/pragmatic-drag-and-drop/about)
without using \`useMenuItemDragAndDrop()\`.

In addition to the [standard usage](#standard-usage) guidance, you must:

- Make the menu item draggable
- Set up the drag preview
- Pass \`isDragging={true}\` to the menu item
- Make the menu item a drop target
- Add hitbox information to the menu item
- Display drop indicators as needed on menu item

### Make the menu item draggable

#### Register the menu item as a draggable

Use the Pragmatic drag and drop [element adapter](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/adapters/element/about) to
make the menu item draggable.

#### Pass isDragging state to the menu item

Pass \`isDragging={true}\` to the menu item when it is being dragged.
This will lower the opacity on the item being dragged as our
[standard visual cue](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines)
that something is being dragged.

#### Set up the drag preview

Use the side nav item \`<DragPreview />\` to display a condensed representation of the menu item being dragged.
If no \`elemBefore\` is provided, then the \`elemBefore\` will automatically collapse.

Use \`pointerOutsideOfPreview\` to push the drag preview away from the user's pointer by our
[standard amount](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines)
(\`{x: token('space.200'), y: token('space.100')}\`). See our
[drag preview guidelines](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/adapters/element/drag-previews)
for more information about mounting native drag previews.

${code`import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { DragPreview } from '@atlaskit/navigation-system/side-nav-items/drag-and-drop/drag-preview';
import ProjectIcon from '@atlaskit/icon/core/project';

draggable({
	element: myElement,
	onGenerateDragPreview: ({ nativeSetDragImage }) => {
		setCustomNativeDragPreview({
			getOffset: pointerOutsideOfPreview({
				x: token('space.200'),
				y: token('space.100'),
			}),
			render({ container }) {
				ReactDOM.render(<DragPreview elemBefore={<ProjectIcon label="" />} content="Projects" />, container);
				return function cleanup() {
					ReactDOM.unmountComponentAtNode(container);
				};
			},
			nativeSetDragImage,
		});
	},
});`}



### Make the menu item a drop target

To make a menu item a drop target, you must:

1. Register the menu item as a _drop target_
2. Add hitbox information to the menu item
3. Display drop indicators as needed on menu item

#### Register the menu item as a drop target

- Use the \`visualContentRef\` to register the drop target.
- Ensure that
[stickiness](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/drop-targets#getissticky)
is enabled.
- Do not allow items to drop on themselves.

${code`function Item({ item }) {
	const ref = useRef<HTMLDivElement | null>(null);
	const dropTargetRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const element = ref.current;
		const dropTarget = dropTargetRef.current;
		invariant(element && dropTarget);

		return combine(
			dropTargetForElements({
				element: dropTarget,
				getIsSticky: () => true,
				canDrop: ({ source }) => source.element !== element && source.data.type === 'menu-item',
			}),
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

#### Add hitbox information to a menu item

Use the list item [hitbox](https://atlassian.design/components/pragmatic-drag-and-drop/optional-packages/hitbox/about)
utilities for side nav items.


#### Menu item drop indicator

Pass the menu item \`<DropIndicator>\` component to the \`dropIndicator\` prop on a menu item,
to display a drop indicator on the menu item.

${code`import { DropIndicator } from '@atlaskit/navigation-system/side-nav-items/drag-and-drop/drop-indicator';

function Item({ item }) {
	const [state, setState] = useState<ItemState>({ type: 'idle' });
	const dropIndicator = state.type === 'is-over' && state.instruction && (
		<DropIndicator instruction={state.instruction} />
	);

	return (
		<ButtonMenuItem
			// 👇 pass the drop indicator to the dropIndicator prop
			dropIndicator={dropIndicator}
		>
			{item.content}
		</ButtonMenuItem>
	);
}`}

`}
	</Disclosure>
)}

## Drag indicator

Set \`hasDragIndicator\` on a menu item to enable visual affordances for dragging.

This will:

- Show a drag handle icon before the start of the menu item on hover.
- Change the cursor to \`grab\` after \`800ms\`. A delayed cursor change is used because
  [dragging is a non-primary action](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines#cursor-changes).

${code`<ButtonMenuItem hasDragIndicator>{children}</ButtonMenuItem>`}


## Group drop indicator

A group drop indicator is a visual affordance that appears around the group that the user is dragging over,
to make it clearer where the dragged item will end up after a drop.

A group is any logical list of menu items at the same level in the side navigation. A group could be
all items on a particular level, or a logical subset of items at a particular level (e.g. a "recent
projects" section).

To wire up a group drop indicator, you must:

- Wrap a group of draggable menu items in \`<GroupDropIndicator>\`
- Set up the \`<GroupDropIndicator>\` as a drop target __without__ stickiness
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

${code`import { GroupDropIndicator } from '@atlaskit/navigation-system/side-nav-items/drag-and-drop/group-drop-indicator';

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

## Automatic scrolling

Users must be able to scroll the sidebar while dragging, in order to place items in any position.
[Wire up \`autoScrollForElements\`](https://atlassian.design/components/pragmatic-drag-and-drop/optional-packages/auto-scroll/about)
on the \`ref\` that the \`<SideNavContent>\` returns to ensure the scrollable portion of the sidebar
automatically scrolls during a drag operation.

${code`import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';

function Sidebar() {
	const scrollableRef = useRef<HTMLDivElement | null>(null);

	// set up auto scrolling for sidenav scroll container
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

## Handling drops

### 1. Determine the operation

Use \`extractInstruction\` to extract the \`Instruction\` from the drop target data.

${code`type Operation = 'reorder-before' | 'reorder-after' | 'combine';

type Instruction = {
	// What the operation is
	operation: Operation;
	// whether or not the operation was "blocked"
	blocked: boolean;
};

useEffect(() => {
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

### 2. Optimistically update the interface

Update the interface optimistically, without waiting for the update to persist on the server.
Do not lock the interface, and allow further interactions, including more drag and drop operations.

If an update fails, you should notify the user with a [flag](https://atlassian.design/components/flag/examples) and resync state.
It's acceptable to briefly lock the interface during this process.

### 3. Flash the moved menu item

Use
[\`triggerPostMoveFlash\`](https://atlassian.design/components/pragmatic-drag-and-drop/optional-packages/flourish/trigger-post-move-flash/examples)
to trigger a flash on the moved menu item (using its \`ref\`) to highlight what has changed.

${(
	<Disclosure heading="Tracking the HTML element">
		{md`
			The \`triggerPostMoveFlash()\` function requires the HTML element to be passed in.

			Possible options for tracking the HTML element include:

			- Keep a registry of \`HTMLElement\`s for all menu items, so you can look up the menu item
			  element after it has been moved.
			- Look up elements with data attributes after the drop. Not ideal, but can get the job done.

			Refer to the complete example above for implementation details.
		`}
	</Disclosure>
)}









## Special guidance

### Expandable menu items

#### Hide the \`elemBefore\` during a drag

During a drag, all expandable menu items that contain or are themselves valid drop targets,
should not render any custom \`elemBefore\` and instead display the default chevron.
This allows users to visualise the nested structure of the side navigation.

${code`<ExpandableMenuItemTrigger elemBefore={isFilterDragging ? null : item.elemBefore}>
	{filter.name}
</ExpandableMenuItemTrigger>`}

#### Collapse dragged expandable menu items

When dragging a \`<ExpandableMenuItemTrigger>\`, collapse the expandable menu when the drag
starts. This prevents invalid drag and drop operations, such as a parent dragging into itself.

#### Auto-expand collapsed menu items

If a user drags over a \`<ExpandableMenuItemTrigger>\` for \`500ms\` with the \`"combine"\` operation,
and the menu item is not expanded, then it should be expanded. This allows users to drag into
collapsed menu items.

#### Restore collapsed state on drop

After a drag, restore the initial expanded or collapsed state of the expandable menu item.

One exception is that dragged menu items must be visible after the drag has finished, which may require expanding parent menu items.

#### Drop target variants

Sometimes you want the \`ExpandableMenuItemTrigger\` to be your drop target, and sometimes you want
the \`ExpandableMenuItemTrigger\` and the \`ExpandableMenuItemContent\` to be a single drop target.

In the example above, when dragging a top level menu item, the whole \`ExpandableMenuItem\` is a
drop target, whereas when dragging a filter, the \`ExpandableMenuItemTrigger\` is the drop target.

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
				// 👇 drop target is the trigger
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



### Flyout menu items

${(
	<SectionMessage title="Known limitations" appearance="warning">
		<Text>
			Using flyout menu items or their popups as drop targets is not currently supported, as there
			are open experience questions. If you need this functionality, please reach out and we can
			discuss your use case.
		</Text>
	</SectionMessage>
)}

#### Close flyout menu items when dragging

All flyout menu item popups should be closed when dragging _any_ menu item.


### Anchor elements

Menu items that are also anchor elements (using \`href\`) are not draggable by default, like standard anchor elements.
You must wire them up like other menu items.

URL information is automatically attached to the native drag data, so the anchor can be dragged into the browser menu bar, other external applications,
and so on. Additional information can be attached using \`getInitialData()\` and \`getInitialDataForExternal()\` from Pragmatic drag and drop.
See the [element adapter](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/adapters/element/about) documentation for more information.




<!--
	This can possibly move to the Accessibility tab in the future.
-->


## Accessibility

Following our [accessibility guidelines](https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines),
users must be able to achieve all reordering and move outcomes through alternative keyboard-accessible interactions

The standard approach for side nav items is a 'more' dropdown menu in \`actionsOnHover\`,
containing either \`"Reorder \${entityName}"\` or \`"Move"\` actions.

For flyout menu item triggers, the \`"Reorder \${entityName}"\` or \`"Move"\` actions should be placed in the flyout popup (\`FlyoutMenuItemContent\`).

### Move operations

The content of the 'more' menu depends on whether __only reordering is available__ or __more complex move operations are available__.

#### Only reordering is available

${(<SectionMessage>The project menu items in the example above use this approach.</SectionMessage>)}

When only reordering is available, the 'more' menu should contain __Move to top__, __Move up__, __Move down__, and __Move to bottom__ actions.

Unavailable actions should be disabled:

- Items in the last position should have __Move down__ and __Move to bottom__ disabled.
- Items in the first position should have __Move to top__ and __Move up__ disabled.
- Items with no siblings should have the entire reorder menu disabled.


#### More complex move operations are available

${(<SectionMessage>The filter menu items in the example above use this approach.</SectionMessage>)}

When further move operations are available, such as combining or moving to different levels in
the navigation, then use a modal containing a form with a way for a user to input any
available action.

### Focus restoration

After an item has been moved with an action menu, and the control triggering the action had focus,
then move focus to the menu item (the element exposed by the \`ref\`).

When working with complex movement actions, such as move into child, you should expand all
parent expandable menu items when the drag finishes.

Do not restore focus to the 'more' menu dropdown button, because flyout menu items do not have one.

For more information on focus restoration, refer to
['Let the user easily continue to trigger more outcomes'](https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines#3-let-the-user-easily-continue-to-trigger-more-outcomes)
in our drag and drop accessibility guide.

`;

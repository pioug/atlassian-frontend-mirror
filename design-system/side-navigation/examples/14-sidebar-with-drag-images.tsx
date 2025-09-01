/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	createContext,
	Fragment,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import { cssMap, jsx } from '@compiled/react';
import invariant from 'tiny-invariant';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import Image from '@atlaskit/image';
import { easeInOut } from '@atlaskit/motion/curves';
import { durations } from '@atlaskit/motion/durations';
import * as liveRegion from '@atlaskit/pragmatic-drag-and-drop-live-region';
import { DragHandleButton } from '@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-button';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
	draggable,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Box, Grid } from '@atlaskit/primitives/compiled';
import {
	HeadingItem,
	NavigationHeader,
	NestableNavigationContent,
	NestingItem,
	SideNavigation,
} from '@atlaskit/side-navigation';
import { token } from '@atlaskit/tokens';

import AppFrame from './common/app-frame';
import SampleHeader from './common/sample-header';

const InstanceIdContext = createContext<symbol | null>(null);
const ListContext = createContext<any>(null);

const styles = cssMap({
	item: {
		boxSizing: 'border-box',
		width: '100%',
		paddingTop: token('space.050'),
		paddingRight: token('space.050'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.050'),
		backgroundColor: token('elevation.surface.raised'),
		borderRadius: token('radius.small'),
		boxShadow: token('elevation.shadow.raised'),
		objectFit: 'cover',
		WebkitTouchCallout: 'none',
	},
	idle: {
		'&:hover': {
			backgroundColor: token('elevation.surface.overlay'),
			boxShadow: token('elevation.shadow.overlay'),
		},
	},
	dragging: {
		filter: 'grayscale(0.8)',
	},
	over: {
		boxShadow: token('elevation.shadow.overlay'),
		filter: 'brightness(1.15)',
		transform: 'scale(1.1) rotate(8deg)',
	},
	grid: {
		gridTemplateColumns: 'auto 1fr auto',
	},
});

type ItemState = 'idle' | 'dragging' | 'over';

function DraggableItem({
	item,
	index,
	onDrop,
	moveToTop,
	moveUp,
	moveDown,
	moveToBottom,
	itemCount,
}: {
	item: any;
	index: number;
	onDrop: (sourceIndex: number, destinationIndex: number) => void;
	moveToTop: (index: number) => void;
	moveUp: (index: number) => void;
	moveDown: (index: number) => void;
	moveToBottom: (index: number) => void;
	itemCount: number;
}) {
	const ref = useRef(null);
	const [state, setState] = useState<ItemState>('idle');
	const instanceId = useContext(InstanceIdContext);
	const { registerItem } = useContext(ListContext);

	const dragHandleRef = useRef(null);
	const [closestEdge] = useState(null);

	useEffect(() => {
		const el = ref.current;
		const dragHandle = dragHandleRef.current;
		invariant(el);
		invariant(dragHandle);

		return combine(
			registerItem({ itemId: item.key, element: el }),
			draggable({
				element: dragHandle,
				getInitialData: () => ({ type: 'item', index, instanceId }),
				onDragStart: () => setState('dragging'),
				onDrop: () => setState('idle'),
			}),
			dropTargetForElements({
				element: el,
				getData: () => ({ index }),
				canDrop: ({ source }) =>
					source.data.instanceId === instanceId &&
					source.data.type === 'item' &&
					source.data.index !== index,
				onDragEnter: () => setState('over'),
				onDragLeave: () => setState('idle'),
				onDrop: ({ source }) => {
					setState('idle');
					onDrop(source.data.index as any, index);
				},
			}),
		);
	}, [index, instanceId, onDrop, registerItem, item.key, item.label]);

	const isMoveUpDisabled = index === 0;
	const isMoveDownDisabled = index === itemCount - 1;

	return (
		<Fragment>
			<Box ref={ref} xcss={styles[state] as any}>
				<Box
					xcss={styles.item as any}
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						transition: `all ${durations.small}ms ${easeInOut}`,
					}}
				>
					<Grid alignItems="center" columnGap="space.050" xcss={styles.grid}>
						<DropdownMenu
							shouldRenderToParent
							trigger={({ triggerRef, ...triggerProps }) => (
								<DragHandleButton
									ref={mergeRefs([dragHandleRef, triggerRef])}
									{...triggerProps}
									label={`Reorder item`}
								/>
							)}
						>
							<DropdownItemGroup>
								<DropdownItem onClick={() => moveToTop(index)} isDisabled={isMoveUpDisabled}>
									Move to top
								</DropdownItem>
								<DropdownItem onClick={() => moveUp(index)} isDisabled={isMoveUpDisabled}>
									Move up
								</DropdownItem>
								<DropdownItem onClick={() => moveDown(index)} isDisabled={isMoveDownDisabled}>
									Move down
								</DropdownItem>
								<DropdownItem onClick={() => moveToBottom(index)} isDisabled={isMoveDownDisabled}>
									Move to bottom
								</DropdownItem>
							</DropdownItemGroup>
						</DropdownMenu>
						{item.renderItem({ ref: null, draggableProps: {}, onDrop })}
					</Grid>
				</Box>
				{closestEdge && <DropIndicator edge={closestEdge} gap="1px" />}
			</Box>
		</Fragment>
	);
}

const DraggableList = ({
	items,
	onDrop,
	moveToTop,
	moveUp,
	moveDown,
	moveToBottom,
	itemCount,
}: {
	items: any[];
	onDrop: (sourceIndex: number, destinationIndex: number) => void;
	moveToTop: (index: number) => void;
	moveUp: (index: number) => void;
	moveDown: (index: number) => void;
	moveToBottom: (index: number) => void;
	itemCount: number;
}) => {
	return (
		<Fragment>
			{items.map((item, index) => (
				<DraggableItem
					key={item.key}
					item={item}
					index={index}
					onDrop={onDrop}
					moveToTop={moveToTop}
					moveUp={moveUp}
					moveDown={moveDown}
					moveToBottom={moveToBottom}
					itemCount={itemCount}
				/>
			))}
		</Fragment>
	);
};

const ADragDropView = ({ items }: { items: any[] }) => {
	const [draggables, setDraggables] = useState(items);

	const announceMovement = (itemLabel: string, previousIndex: number, currentIndex: number) => {
		liveRegion.announce(
			`You've moved ${itemLabel} from position ${previousIndex + 1} to position ${currentIndex + 1}.`,
		);
	};

	const moveToTop = useCallback(
		(index: number) => {
			if (index > 0) {
				const updatedItems = [...draggables];
				const [movedItem] = updatedItems.splice(index, 1);
				updatedItems.unshift(movedItem);
				setDraggables(updatedItems);

				announceMovement(movedItem.label, index, 0);
			}
		},
		[draggables],
	);

	const moveUp = useCallback(
		(index: number) => {
			if (index > 0) {
				const updatedItems = [...draggables];
				const [movedItem] = updatedItems.splice(index, 1);
				updatedItems.splice(index - 1, 0, movedItem);
				setDraggables(updatedItems);

				announceMovement(movedItem.label, index, index - 1);
			}
		},
		[draggables],
	);

	const moveDown = useCallback(
		(index: number) => {
			if (index < draggables.length - 1) {
				const updatedItems = [...draggables];
				const [movedItem] = updatedItems.splice(index, 1);
				updatedItems.splice(index + 1, 0, movedItem);
				setDraggables(updatedItems);

				announceMovement(movedItem.label, index, index + 1);
			}
		},
		[draggables],
	);

	const moveToBottom = useCallback(
		(index: number) => {
			if (index < draggables.length - 1) {
				const updatedItems = [...draggables];
				const [movedItem] = updatedItems.splice(index, 1);
				updatedItems.push(movedItem);
				setDraggables(updatedItems);

				announceMovement(movedItem.label, index, updatedItems.length - 1);
			}
		},
		[draggables],
	);

	const handleDrop = (sourceIndex: number, destinationIndex: number) => {
		const updatedItems = Array.from(draggables);
		const [movedItem] = updatedItems.splice(sourceIndex, 1);
		updatedItems.splice(destinationIndex, 0, movedItem);
		setDraggables(updatedItems);

		announceMovement(movedItem.label, sourceIndex, destinationIndex);
	};

	return (
		<DraggableList
			items={draggables}
			onDrop={handleDrop}
			moveToTop={moveToTop}
			moveUp={moveUp}
			moveDown={moveDown}
			moveToBottom={moveToBottom}
			itemCount={draggables.length}
		/>
	);
};

const generateDraggableCats = () => {
	const urls = [
		'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
		'https://images.pexels.com/photos/320014/pexels-photo-320014.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
		'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
		'https://images.pexels.com/photos/208984/pexels-photo-208984.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
		'https://images.pexels.com/photos/2194261/pexels-photo-2194261.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	];

	return urls.map((url, index) => ({
		key: url,
		label: `Cat ${index + 1}`,
		renderItem: ({ onDrop }: any) => <Image src={url} alt={`Cat ${index + 1}`} />,
	}));
};

const RBDImageExample = () => {
	const getItemRegistry = () => {
		const registry = new Map();

		function register({ itemId, element }: { itemId: string; element: HTMLElement }) {
			registry.set(itemId, element);

			return function unregister() {
				registry.delete(itemId);
			};
		}

		function getElement(itemId: string) {
			return registry.get(itemId) ?? null;
		}

		return { register, getElement };
	};

	const [instanceId] = useState(() => Symbol('instance-id'));
	const [registry] = useState(getItemRegistry);

	const contextValue = useMemo(() => {
		return {
			registerItem: registry.register,
			instanceId,
		};
	}, [registry.register, instanceId]);

	return (
		<InstanceIdContext.Provider value={instanceId}>
			<ListContext.Provider value={contextValue}>
				<AppFrame>
					<SideNavigation label="project">
						<NavigationHeader>
							<SampleHeader />
						</NavigationHeader>
						<NestableNavigationContent>
							<NestingItem id="3" iconBefore="🐱" title="Draggable Cats">
								<HeadingItem>Click and drag the items below to rearrange</HeadingItem>
								<ADragDropView items={generateDraggableCats()} />
							</NestingItem>
						</NestableNavigationContent>
					</SideNavigation>
				</AppFrame>
			</ListContext.Provider>
		</InstanceIdContext.Provider>
	);
};

export default RBDImageExample;

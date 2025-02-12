/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * @jsxFrag React.Fragment
 */

import React, {
	createContext,
	Fragment,
	memo,
	type Ref,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import ItemIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import RBDIcon from '@atlaskit/icon/glyph/editor/media-wide';
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
import { Box, Grid } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import {
	ButtonItem,
	NavigationHeader,
	NestableNavigationContent,
	NestingItem,
	Section,
	SideNavigation,
} from '../src';

import AppFrame from './common/app-frame';
import SampleHeader from './common/sample-header';

const InstanceIdContext = createContext<symbol | null>(null);
const ListContext = createContext<any>(null);
interface RenderDraggableProps {
	ref: Ref<any>;
	['data-testid']?: string;
	onDrop: (sourceIndex: number, destinationIndex: number) => void;
}

interface CustomDraggable {
	key: string;
	renderItem: (props: RenderDraggableProps) => JSX.Element;
}

interface DraggableItemProps {
	item: CustomDraggable;
	index: number;
	onDrop: (sourceIndex: number, destinationIndex: number) => void;
	moveToTop: (index: number) => void;
	moveUp: (index: number) => void;
	moveDown: (index: number) => void;
	moveToBottom: (index: number) => void;
	itemCount: number;
}

interface DraggableCatItemProps {
	src: string;
	index: number;
	onDrop: (sourceIndex: number, destinationIndex: number) => void;
}

interface DraggableItemProps {
	index: number;
	onDrop: (sourceIndex: number, destinationIndex: number) => void;
}

const itemStyles = css({
	boxSizing: 'border-box',
	width: '100%',
	backgroundColor: 'elevation.surface.raised',
	borderRadius: 'border.radius.100',
	boxShadow: 'elevation.shadow.raised',
	objectFit: 'cover',
	paddingBlockEnd: 'space.050',
	paddingBlockStart: 'space.050',
	paddingInlineEnd: 'space.050',
	paddingInlineStart: 'space.050',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	transition: `all ${durations.small}ms ${easeInOut}`,
	WebkitTouchCallout: 'none',
});

type ItemState = 'idle' | 'dragging' | 'over';

const itemStateStyles: Record<ItemState, any> = {
	idle: css({
		'&:hover': {
			background: token('elevation.surface.overlay', '#FFF'),
			boxShadow: token('elevation.shadow.overlay', 'none'),
		},
	}),
	dragging: css({
		filter: 'grayscale(0.8)',
	}),
	over: css({
		boxShadow: token('elevation.shadow.overlay', 'none'),
		filter: 'brightness(1.15)',
		transform: 'scale(1.1) rotate(8deg)',
	}),
};

function DraggableItem({
	item,
	index,
	onDrop,
	moveToTop,
	moveUp,
	moveDown,
	moveToBottom,
	itemCount,
	...restProps
}: DraggableItemProps) {
	const ref = useRef(null);
	const [state, setState] = useState<ItemState>('idle');
	const instanceId = useContext(InstanceIdContext);
	const { registerItem } = useContext(ListContext);

	const [closestEdge] = useState(null);

	useEffect(() => {
		const el = ref.current;
		invariant(el);

		return combine(
			registerItem({ itemId: item.key, element: el }),
			draggable({
				element: el,
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
					onDrop(source.data.index as number, index);
				},
			}),
		);
	}, [index, instanceId, onDrop, registerItem, item.key]);

	const isMoveUpDisabled = index === 0;
	const isMoveDownDisabled = index === itemCount - 1;

	return (
		<Fragment>
			<Box ref={ref} xcss={itemStateStyles[state]}>
				<Box xcss={itemStyles}>
					<Grid alignItems="center" columnGap="space.050" templateColumns="auto 1fr auto">
						<DropdownMenu
							shouldRenderToParent
							trigger={({ triggerRef, ...triggerProps }) => (
								<DragHandleButton
									ref={mergeRefs([ref, triggerRef])}
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
						{item.renderItem({ ref: null, onDrop, ...restProps })}
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
	items: CustomDraggable[];
	onDrop: (sourceIndex: number, destinationIndex: number) => void;
	moveToTop: (index: number) => void;
	moveUp: (index: number) => void;
	moveDown: (index: number) => void;
	moveToBottom: (index: number) => void;
	itemCount: number;
}) => {
	return (
		<React.Fragment>
			{items.map((item: CustomDraggable, index: number) => (
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
		</React.Fragment>
	);
};

const ADragDropView = ({ items }: any) => {
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
				announceMovement('Item', index, 0);
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

				announceMovement('Item', index, index - 1);
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

				announceMovement('Item', index, index + 1);
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

				announceMovement('Item', index, updatedItems.length - 1);
			}
		},
		[draggables],
	);

	const handleDrop = (sourceIndex: number, destinationIndex: number) => {
		const updatedItems: CustomDraggable[] = Array.from(draggables);
		const [movedItem] = updatedItems.splice(sourceIndex, 1);
		updatedItems.splice(destinationIndex, 0, movedItem);
		setDraggables(updatedItems);
		announceMovement('Item', sourceIndex, destinationIndex);
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

const generateDraggableButtonItems = (n: number) => {
	const CustomComponent = memo(function DraggableItem({ index, onDrop }: any) {
		const ref = useRef<HTMLImageElement | null>(null);
		const instanceId = useContext(InstanceIdContext);

		useEffect(() => {
			const el = ref.current;
			invariant(el);

			return combine(
				draggable({
					element: el,
					getInitialData: () => ({ type: 'custom', index, instanceId }),
				}),
				dropTargetForElements({
					element: el,
					getData: () => ({ index }),
					getIsSticky: () => true,
					canDrop: ({ source }) =>
						source.data.instanceId === instanceId &&
						source.data.type === 'custom' &&
						source.data.index !== index,
					onDrop: ({ source }) => onDrop(source.data.index as number, index),
				}),
			);
		}, [instanceId, index, onDrop]);

		return (
			<ButtonItem iconBefore={<ItemIcon label="" />} ref={ref}>
				Item {index}
			</ButtonItem>
		);
	});

	return Array.from(Array(n)).map((_, index) => {
		return {
			key: index.toString(),
			renderItem: ({ onDrop, ...rest }: RenderDraggableProps) => (
				<CustomComponent index={index} onDrop={onDrop} {...rest} />
			),
		};
	});
};

const generateDraggableCustomItems = (n: number): CustomDraggable[] => {
	const CustomComponent = memo(function DraggableItem({
		index,
		onDrop,
		testId,
		...restProps
	}: any) {
		const ref = useRef<HTMLImageElement | null>(null);
		const instanceId = useContext(InstanceIdContext);

		useEffect(() => {
			const el = ref.current;
			invariant(el);

			return combine(
				draggable({
					element: el,
					getInitialData: () => ({ type: 'custom', index, instanceId }),
				}),
				dropTargetForElements({
					element: el,
					getData: () => ({ index }),
					getIsSticky: () => true,
					canDrop: ({ source }) =>
						source.data.instanceId === instanceId &&
						source.data.type === 'custom' &&
						source.data.index !== index,
					onDrop: ({ source }) => onDrop(source.data.index as number, index),
				}),
			);
		}, [instanceId, index, onDrop]);

		return (
			<Box ref={ref} testId={testId} {...restProps}>
				Item {index}
			</Box>
		);
	});
	return Array.from(Array(n)).map((_, index) => {
		return {
			key: index.toString(),
			renderItem: ({ onDrop, ...rest }: RenderDraggableProps) => (
				<CustomComponent index={index} onDrop={onDrop} {...rest} />
			),
		};
	});
};
const generateDraggableCats = (): CustomDraggable[] => {
	const urls = [
		'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
		'https://images.pexels.com/photos/320014/pexels-photo-320014.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
		'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
		'https://images.pexels.com/photos/208984/pexels-photo-208984.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
		'https://images.pexels.com/photos/2194261/pexels-photo-2194261.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	];

	const DraggableCatItem = memo(function DraggableCatItem({
		src,
		index,
		onDrop,
	}: DraggableCatItemProps) {
		const ref = useRef<HTMLImageElement | null>(null);
		const [state, setState] = useState<ItemState>('idle');
		const instanceId = useContext(InstanceIdContext);

		useEffect(() => {
			const el = ref.current;
			invariant(el);

			return combine(
				draggable({
					element: el,
					getInitialData: () => ({ type: 'cat', index, instanceId, src }),
					onDragStart: () => setState('dragging'),
					onDrop: () => setState('idle'),
				}),
				dropTargetForElements({
					element: el,
					getData: () => ({ index, src }),
					getIsSticky: () => true,
					canDrop: ({ source }) =>
						source.data.instanceId === instanceId &&
						source.data.type === 'cat' &&
						source.data.index !== index,
					onDragEnter: () => setState('over'),
					onDragLeave: () => setState('idle'),
					onDrop: ({ source }) => {
						setState('idle');
						onDrop(source.data.index as number, index);
					},
				}),
			);
		}, [instanceId, index, onDrop, src]);

		const altText = `Draggable cat image ${index + 1}`;

		return <img css={[itemStyles, itemStateStyles[state]]} ref={ref} src={src} alt={altText} />;
	});

	return urls.map((url, index) => ({
		key: url,
		renderItem: ({ onDrop }: any) => <DraggableCatItem src={url} index={index} onDrop={onDrop} />,
	}));
};

const RBDExample = () => {
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
							<NestingItem
								id="draggable-button-items"
								iconBefore={<RBDIcon label="" />}
								title="Draggable <ButtonItem/>s"
							>
								<Section title="Click and drag the items below to rearrange">
									<ADragDropView items={generateDraggableButtonItems(10)} />
								</Section>
							</NestingItem>
							<NestingItem
								id="draggable-custom-items"
								iconBefore={<RBDIcon label="" />}
								title="Draggable <CustomItem/>s"
							>
								<Section title="Click and drag the items below to rearrange">
									<ADragDropView items={generateDraggableCustomItems(10)} />
								</Section>
							</NestingItem>
							<NestingItem id="3" iconBefore="🐱" title="Draggable Cats">
								<Section title="Click and drag the items below to rearrange">
									<ADragDropView items={generateDraggableCats()} />
								</Section>
							</NestingItem>
						</NestableNavigationContent>
					</SideNavigation>
				</AppFrame>
			</ListContext.Provider>
		</InstanceIdContext.Provider>
	);
};

export default RBDExample;

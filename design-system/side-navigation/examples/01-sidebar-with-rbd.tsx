/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * @jsxFrag React.Fragment
 */

import React, {
	createContext,
	forwardRef,
	memo,
	type Ref,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import ItemIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import RBDIcon from '@atlaskit/icon/glyph/editor/media-wide';
import { type CustomItemComponentProps } from '@atlaskit/menu';
import { easeInOut } from '@atlaskit/motion/curves';
import { smallDurationMs } from '@atlaskit/motion/durations';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
	draggable,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Box } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import {
	ButtonItem,
	CustomItem,
	HeadingItem,
	NavigationHeader,
	NestableNavigationContent,
	NestingItem,
	SideNavigation,
} from '../src';

import AppFrame from './common/app-frame';
import SampleHeader from './common/sample-header';

const InstanceIdContext = createContext<symbol | null>(null);
interface RenderDraggableProps {
	ref: Ref<any>;
	draggableProps: {
		['data-testid']?: string;
	};
	onDrop: (sourceIndex: number, destinationIndex: number) => void;
}

interface CustomDraggable {
	key: string;
	renderItem: (props: RenderDraggableProps) => JSX.Element;
}

interface DraggableItemProps {
	item: JSX.Element;
	index: number;
	onDrop: (sourceIndex: number, destinationIndex: number) => void;
}

interface DraggableCatItemProps {
	src: string;
	index: number;
	onDrop: (sourceIndex: number, destinationIndex: number) => void;
}

const itemStyles = css({
	boxSizing: 'border-box',
	width: '100%',
	padding: token('space.050', '4px'),
	background: token('elevation.surface.raised', '#FFF'),
	borderRadius: token('border.radius.100', '4px'),
	boxShadow: token('elevation.shadow.raised', 'none'),
	objectFit: 'cover',
	transition: `all ${smallDurationMs}ms ${easeInOut}`,
	'-webkit-touch-callout': 'none',
});

type State = 'idle' | 'dragging' | 'over';

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

const DraggableItem = memo(function DraggableItem({ item, index, onDrop }: DraggableItemProps) {
	const ref = useRef(null);
	const [state, setState] = useState<ItemState>('idle');
	const instanceId = useContext(InstanceIdContext);

	useEffect(() => {
		const el = ref.current;
		invariant(el);

		return combine(
			draggable({
				element: el,
				getInitialData: () => ({ type: 'item', index, instanceId }),
				onDragStart: () => setState('dragging'),
				onDrop: () => setState('idle'),
			}),
			dropTargetForElements({
				element: el,
				getData: () => ({ index }),
				getIsSticky: () => true,
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
	}, [index, instanceId, onDrop]);

	return (
		<Box ref={ref} xcss={itemStateStyles[state]}>
			{item}
		</Box>
	);
});

const DraggableList = ({
	items,
	onDrop,
}: {
	items: CustomDraggable[];
	onDrop: (sourceIndex: number, destinationIndex: number) => void;
}) => {
	return (
		<React.Fragment>
			{items.map((item: CustomDraggable, index: number) => (
				<DraggableItem
					key={item.key}
					item={item.renderItem({
						ref: null,
						draggableProps: {},
						onDrop,
					})}
					index={index}
					onDrop={onDrop}
				/>
			))}
		</React.Fragment>
	);
};

const ADragDropView = ({ items }: any) => {
	const [draggables, setDraggables] = useState(items);

	const handleDrop = (sourceIndex: number, destinationIndex: number) => {
		const updatedItems = Array.from(draggables);
		const [movedItem] = updatedItems.splice(sourceIndex, 1);
		updatedItems.splice(destinationIndex, 0, movedItem);
		setDraggables(updatedItems);
	};

	return <DraggableList items={draggables} onDrop={handleDrop} />;
};

const generateDraggableButtonItems = (n: number): CustomDraggable[] => {
	return Array.from(Array(n)).map((_, index) => {
		return {
			key: index.toString(),
			renderItem: (props: RenderDraggableProps) => (
				<ButtonItem ref={props.ref} iconBefore={<ItemIcon label="" />} {...props.draggableProps}>
					Item {index}
				</ButtonItem>
			),
		};
	});
};

const generateDraggableCustomItems = (n: number): CustomDraggable[] => {
	const CustomComponent = forwardRef<any, CustomItemComponentProps>(
		({ children, 'data-testid': testId, ...rest }, ref) => {
			return (
				<Box ref={ref} testId={testId} {...rest}>
					{children}
				</Box>
			);
		},
	);

	return Array.from(Array(n)).map((_, index) => {
		return {
			key: index.toString(),
			renderItem: (props: RenderDraggableProps) => (
				<CustomItem
					component={CustomComponent}
					iconBefore={<ItemIcon label="" />}
					ref={props.ref}
					{...props.draggableProps}
				>
					Item {index}
				</CustomItem>
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
		const [state, setState] = useState<State>('idle');
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
	return (
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
						<HeadingItem>Click and drag the items below to rearrange</HeadingItem>
						<ADragDropView items={generateDraggableButtonItems(10)} />
					</NestingItem>
					<NestingItem
						id="draggable-custom-items"
						iconBefore={<RBDIcon label="" />}
						title="Draggable <CustomItem/>s"
					>
						<HeadingItem>Click and drag the items below to rearrange</HeadingItem>
						<ADragDropView items={generateDraggableCustomItems(10)} />
					</NestingItem>
					<NestingItem id="3" iconBefore="🐱" title="Draggable Cats">
						<HeadingItem>Click and drag the items below to rearrange</HeadingItem>
						<ADragDropView items={generateDraggableCats()} />
					</NestingItem>
				</NestableNavigationContent>
			</SideNavigation>
		</AppFrame>
	);
};

export default RBDExample;

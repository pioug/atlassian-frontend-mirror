import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';

import { fg } from '@atlaskit/platform-feature-flags';

export interface ElementBoundingBox {
	height: number;
	left: number;
	top: number;
	width: number;
}

type ResizeUpdateMethod = 'polling' | 'resizeListener';

// The minimum interval between position updates in milliseconds
const POSITION_UPDATE_INTERVAL = 200;

const getElementRect = (element: HTMLElement): ElementBoundingBox => {
	const { height, left, top, width } = element.getBoundingClientRect();
	return {
		height,
		left,
		top,
		width,
	};
};

const useResizeAwareElementBox = (element: HTMLElement, updateMethod: ResizeUpdateMethod) => {
	const [box, setBox] = useState<ElementBoundingBox>({
		width: 0,
		height: 0,
		left: 0,
		top: 0,
	});

	useLayoutEffect(() => {
		if (updateMethod === 'resizeListener') {
			if (fg('scroll-lock-replacement')) {
				// use setTimeout 0 to defer the state update to avoid content shifting when pages have scrollbars
				// more details are https://www.loom.com/share/96a5d7c2afd74146a3c005bf20a8c69e?sid=968b00c1-e5ab-4ea0-9fe4-e534fe7088e4
				setTimeout(() => {
					setBox(getElementRect(element));
				}, 0);
			} else {
				setBox(getElementRect(element));
			}
		}
	}, [element, updateMethod]);

	useEffect(() => {
		const onResize = () => {
			requestAnimationFrame(() => {
				setBox(getElementRect(element));
			});
		};

		if (updateMethod === 'resizeListener') {
			return bind(window, {
				type: 'resize',
				listener: onResize,
			});
		}
	}, [element, updateMethod]);

	return box;
};

const usePollingElementBox = (element: HTMLElement, updateMethod: ResizeUpdateMethod) => {
	// These are intentionally tracked as number primitives rather than as a shared `box` object.
	// Since the requestAnimationFrame code below updates this often, we want to avoid re-renders
	// when the values are the same.  React uses `Object.is` to figure out if the state changed after a setState.
	// If we represent this as a shared `box` object, this will re-render even if the two objects have identical contents.
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [left, setLeft] = useState(0);
	const [top, setTop] = useState(0);

	useLayoutEffect(() => {
		if (updateMethod === 'polling') {
			if (fg('scroll-lock-replacement')) {
				// use setTimeout 0 to defer the state update to avoid content shifting when pages have scrollbars
				// more details are https://www.loom.com/share/96a5d7c2afd74146a3c005bf20a8c69e?sid=968b00c1-e5ab-4ea0-9fe4-e534fe7088e4
				setTimeout(() => {
					const newBox = getElementRect(element);
					setWidth(newBox.width);
					setHeight(newBox.height);
					setLeft(newBox.left);
					setTop(newBox.top);
				}, 0);
			} else {
				const newBox = getElementRect(element);
				setWidth(newBox.width);
				setHeight(newBox.height);
				setLeft(newBox.left);
				setTop(newBox.top);
			}
		}
	}, [element, updateMethod]);

	// Souce: https://css-tricks.com/using-requestanimationframe-with-react-hooks/
	// Use useRef for mutable variables that we want to persist
	// without triggering a re-render on their change
	const requestRef = useRef<number>();
	const previousUpdateTimeRef = useRef<number>();

	const animate = useCallback(
		(time: number) => {
			if (previousUpdateTimeRef.current !== undefined) {
				const timeSinceLastUpdate = time - previousUpdateTimeRef.current;
				if (timeSinceLastUpdate > POSITION_UPDATE_INTERVAL) {
					const newBox = getElementRect(element);
					setWidth(newBox.width);
					setHeight(newBox.height);
					setLeft(newBox.left);
					setTop(newBox.top);

					previousUpdateTimeRef.current = time;
				}
			} else {
				// Initialize previousUpdateTimeRef
				previousUpdateTimeRef.current = time;
			}
			requestRef.current = requestAnimationFrame(animate);
		},
		[element],
	);

	useEffect(() => {
		if (updateMethod === 'polling') {
			requestRef.current = requestAnimationFrame(animate);
		}
		return () => {
			if (requestRef.current !== undefined) {
				cancelAnimationFrame(requestRef.current);
			}
		};
		// This useEffect should only run on mount and when `element` or `updateMethod` changes.
	}, [animate, element, updateMethod]);

	const box: ElementBoundingBox = useMemo(
		() => ({
			width,
			height,
			left,
			top,
		}),
		[width, height, left, top],
	);

	return box;
};

/**
 * Will listen to the document resizing to see if an element has moved positions.
 * Not using ResizeObserver because of IE11 support.
 * @param element HTMLElement to watch when resizing.
 */
const useElementBox = (element: HTMLElement, resizeUpdateMethod?: ResizeUpdateMethod) => {
	const updateMethod = resizeUpdateMethod || 'resizeListener';
	const boxViaResizeListener = useResizeAwareElementBox(element, updateMethod);
	const boxViaPolling = usePollingElementBox(element, updateMethod);

	return updateMethod === 'resizeListener' ? boxViaResizeListener : boxViaPolling;
};

/**
 * __Element box__
 *
 * Allows consumption of `userElementBox` hook through render props.
 *
 * @internal
 */
export const ElementBox = (props: {
	element: HTMLElement;
	children: (box: ElementBoundingBox) => any;
	resizeUpdateMethod?: ResizeUpdateMethod;
}) => {
	const box = useElementBox(props.element, props.resizeUpdateMethod);
	return props.children(box);
};

import React, { type ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { createRoot, type Root } from 'react-dom/client';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { RelativePosition } from '../../types';

let reactRoots = new WeakMap<Element, Root>();

/** Mounts `element` into `mountPoint`: uses the React 18/19 `createRoot` API when `nike_r19_render_unmount` is on, else the legacy render path. */
const renderToMountPoint = (element: React.ReactElement, mountPoint: Element) => {
	if (fg('nike_r19_render_unmount')) {
		let root = reactRoots.get(mountPoint);

		if (!root) {
			root = createRoot(mountPoint);
			reactRoots.set(mountPoint, root);
		}

		root.render(element);
	} else {
		ReactDOM.render<ReactElement<any>>(element, mountPoint);
	}
};

/** Unmounts the tree at `mountPoint`: uses `root.unmount()` when `nike_r19_render_unmount` is on, else the legacy unmount path. */
const unmountFromMountPoint = (mountPoint: Element) => {
	if (fg('nike_r19_render_unmount')) {
		const root = reactRoots.get(mountPoint);

		if (root) {
			root.unmount();
			reactRoots.delete(mountPoint);
		}
	} else {
		ReactDOM.unmountComponentAtNode(mountPoint);
	}
};

const getTargetNode = (target: string | Element): Element | null => {
	if (typeof target === 'string') {
		return document.querySelector(target);
	}
	// Expect to be an element
	return target;
};

const getWindowScroll = (): { x: number; y: number } => ({
	x: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
	y: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
});

export interface Props {
	children: ReactElement<any>;
	horizontalAlign?: 'start' | 'end' | 'end-to-start';
	offsetX?: number;
	offsetY?: number;
	relativePosition?: RelativePosition;
	target: string | Element;
	zIndex?: string | number;
}

const Popup = (props: React.PropsWithChildren<Props>): React.JSX.Element => {
	const {
		relativePosition = 'auto',
		horizontalAlign = 'start',
		offsetX = 0,
		offsetY = 0,
		zIndex = 9,
		target,
		children,
	} = props;
	const popup = useRef<HTMLElement>();
	const [debounced, setDebounced] = useState<number | null>(null);
	const getLeftPosition = useCallback(
		(box: DOMRect): number => {
			if (horizontalAlign === 'end-to-start') {
				return box.left - 152;
			}
			if (horizontalAlign === 'end') {
				return box.right - (popup.current?.offsetWidth || 0) + (offsetX || 0);
			}
			return box.left + (offsetX || 0);
		},
		[horizontalAlign, offsetX],
	);

	const applyBelowPosition = useCallback(() => {
		const targetNode = getTargetNode(target);
		if (targetNode && popup.current) {
			const box = targetNode.getBoundingClientRect();
			const scroll = getWindowScroll();
			const top = box.bottom + scroll.y + (offsetY || 0);
			const left = getLeftPosition(box) + scroll.x;
			popup.current.style.top = `${top}px`;
			popup.current.style.bottom = '';
			popup.current.style.left = `${left}px`;
		}
	}, [getLeftPosition, offsetY, target]);

	const applyAbovePosition = useCallback(() => {
		if (typeof window === 'undefined') {
			return;
		}
		const targetNode = getTargetNode(target);
		if (targetNode && popup.current) {
			const box = targetNode.getBoundingClientRect();
			const scroll = getWindowScroll();
			const bottom = window.innerHeight - box.top - scroll.y + (offsetY || 0);
			const left = getLeftPosition(box) + scroll.x;
			popup.current.style.top = '';
			popup.current.style.bottom = `${bottom}px`;
			popup.current.style.left = `${left}px`;
		}
	}, [getLeftPosition, offsetY, target]);

	const applyAbsolutePosition = useCallback(() => {
		if (typeof window === 'undefined') {
			return;
		}
		if (relativePosition === 'above') {
			applyAbovePosition();
		} else if (relativePosition === 'below') {
			applyBelowPosition();
		} else {
			const targetNode = getTargetNode(target);
			if (targetNode) {
				const box = targetNode.getBoundingClientRect();
				const viewPortHeight = window.innerHeight;
				if (box.top < viewPortHeight / 2) {
					applyBelowPosition();
				} else {
					applyAbovePosition();
				}
			}
		}
		if (zIndex && popup.current) {
			popup.current.style.zIndex = `${zIndex}`;
		}
	}, [applyAbovePosition, applyBelowPosition, relativePosition, target, zIndex]);

	const handleResize = useCallback(() => {
		if (debounced) {
			clearTimeout(debounced);
			setDebounced(null);
		}
		if (typeof window === 'undefined') {
			return;
		}
		// Timeout set to 30ms as to not throttle IE11
		const debounceId = window.setTimeout(() => {
			applyAbsolutePosition();
			setDebounced(null);
		}, 30);
		setDebounced(debounceId);
	}, [applyAbsolutePosition, debounced]);

	const renderPopup = useCallback(() => {
		if (!popup.current) {
			return;
		}
		renderToMountPoint(children, popup.current);
	}, [children]);

	useEffect(() => {
		popup.current = document.createElement('div');
		document.body.appendChild(popup.current);
		popup.current.style.position = 'absolute';
		if (typeof window !== 'undefined') {
			window.addEventListener('resize', handleResize);
		}

		applyAbsolutePosition();
		renderPopup();
		if (horizontalAlign !== 'start') {
			applyAbsolutePosition();
		}

		return () => {
			if (typeof window === 'undefined') {
				return;
			}
			window.removeEventListener('resize', handleResize);
			if (popup.current) {
				unmountFromMountPoint(popup.current);
				document.body.removeChild(popup.current);
			}
		};
	}, [applyAbsolutePosition, handleResize, horizontalAlign, renderPopup]);

	return <div />;
};

export default Popup;

import React, { type ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import type { RelativePosition } from '../../types';

const getTargetNode = (target: string | Element): Element | null => {
	if (typeof target === 'string') {
		return document.querySelector(target);
	}
	// Expect to be an element
	return target;
};

export interface Props {
	target: string | Element;
	relativePosition?: RelativePosition;
	offsetX?: number;
	offsetY?: number;
	zIndex?: string | number;
	children: ReactElement<any>;
}

const Popup = (props: React.PropsWithChildren<Props>) => {
	const {
		relativePosition = 'auto',
		offsetX = 0,
		offsetY = 0,
		zIndex = 9,
		target,
		children,
	} = props;
	const popup = useRef<HTMLElement>();
	const [debounced, setDebounced] = useState<number | null>(null);

	const applyBelowPosition = useCallback(() => {
		const targetNode = getTargetNode(target);
		if (targetNode && popup.current) {
			const box = targetNode.getBoundingClientRect();
			const top = box.bottom + (offsetY || 0);
			const left = box.left + (offsetX || 0);
			popup.current.style.top = `${top}px`;
			popup.current.style.bottom = '';
			popup.current.style.left = `${left}px`;
		}
	}, [offsetX, offsetY, target]);

	const applyAbovePosition = useCallback(() => {
		if (typeof window === 'undefined') {
			return;
		}
		const targetNode = getTargetNode(target);
		if (targetNode && popup.current) {
			const box = targetNode.getBoundingClientRect();
			const bottom = window.innerHeight - box.top + (offsetY || 0);
			const left = box.left + (offsetX || 0);
			popup.current.style.top = '';
			popup.current.style.bottom = `${bottom}px`;
			popup.current.style.left = `${left}px`;
		}
	}, [offsetX, offsetY, target]);

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
		ReactDOM.render<ReactElement<any>>(children, popup.current);
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

		return () => {
			if (typeof window === 'undefined') {
				return;
			}
			window.removeEventListener('resize', handleResize);
			if (popup.current) {
				ReactDOM.unmountComponentAtNode(popup.current);
				document.body.removeChild(popup.current);
			}
		};
	}, [applyAbsolutePosition, handleResize, renderPopup]);

	return <div />;
};

export default Popup;

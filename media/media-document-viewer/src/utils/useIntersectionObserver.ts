import { useEffect, useRef } from 'react';

import { useStaticCallback } from './useStaticCallback';

export const useIntersectionObserver = (
	options: IntersectionObserverInit,
	onVisible: () => void,
) => {
	const staticOnVisible = useStaticCallback(onVisible);

	const observerRef = useRef<IntersectionObserver | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const isVisibleRef = useRef(false);
	const currentNodeRef = useRef<HTMLElement | null>(null);

	const observedRef = useStaticCallback((node: HTMLElement | null) => {
		currentNodeRef.current = node;
		if (observerRef.current) {
			observerRef.current.disconnect();
		}

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		if (node) {
			observerRef.current = new IntersectionObserver(([entry]) => {
				if (entry.isIntersecting && !isVisibleRef.current) {
					isVisibleRef.current = true;
					timeoutRef.current = setTimeout(() => {
						if (isVisibleRef.current) {
							staticOnVisible();
							timeoutRef.current = null;
						}
					}, 100);
				}

				if (!entry.isIntersecting && isVisibleRef.current) {
					isVisibleRef.current = false;
				}

				if (!entry.isIntersecting && isVisibleRef.current && timeoutRef.current) {
					isVisibleRef.current = false;
					clearTimeout(timeoutRef.current);
					timeoutRef.current = null;
				}
			}, options);

			observerRef.current.observe(node);
		}
	});

	useEffect(() => {
		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return { observedRef, isVisibleRef };
};

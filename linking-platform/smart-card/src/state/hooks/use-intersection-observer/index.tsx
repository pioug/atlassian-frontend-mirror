import { useCallback, useEffect, useRef, type MutableRefObject } from 'react';

import { isIntersectionObserverSupported } from '../../../utils';

// This property enables the intersection observer to be run once the
// HTML element being observed is within `X` px of the target container it is
// being compared to. Since the default container is the `document`, we set this
// up to check once a Smart Link is within `X` px from the bottom of the viewport.
const ROOT_MARGIN_VERTICAL = '360px';

type UseIntersectionObserverProps = {
	onIntersecting?: () => void;
	onIntersection?: (isIntersecting: boolean) => void;
};
const useIntersectionObserver = ({
	onIntersecting: onIntersectingCallback,
	onIntersection: onIntersectionCallback,
}: UseIntersectionObserverProps): MutableRefObject<HTMLDivElement | null> => {
	const ref = useRef<HTMLDivElement | null>(null);

	const onIntersectingCallbackRef = useRef(onIntersectingCallback);
	const onIntersectionCallbackRef = useRef(onIntersectionCallback);

	useEffect(() => {
		onIntersectingCallbackRef.current = onIntersectingCallback;
		onIntersectionCallbackRef.current = onIntersectionCallback;
	}, [onIntersectingCallback, onIntersectionCallback]);

	const onIntersection: IntersectionObserverCallback = useCallback((entries, observer) => {
		const isIntersecting = entries.some((entry) => entry.isIntersecting);
		onIntersectionCallbackRef.current?.(isIntersecting);

		if (isIntersecting) {
			onIntersectingCallbackRef.current?.();
			observer.disconnect();
		}
	}, []);

	useEffect(() => {
		if (!isIntersectionObserverSupported() || !ref.current) {
			return;
		}

		const intersectionObserver = new IntersectionObserver(onIntersection, {
			rootMargin: `${ROOT_MARGIN_VERTICAL} 0px ${ROOT_MARGIN_VERTICAL} 0px`,
		});

		intersectionObserver.observe(ref.current);

		return () => intersectionObserver.disconnect();
	}, [ref, onIntersection]);

	return ref;
};

export default useIntersectionObserver;

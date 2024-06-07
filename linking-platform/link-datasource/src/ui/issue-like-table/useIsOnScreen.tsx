import { useEffect, useMemo, useState } from 'react';

// Hook which tracks if a ref is visible or not. Taken from: https://stackoverflow.com/a/65008608
export const useIsOnScreen = (el: HTMLElement | null) => {
	const [isIntersecting, setIntersecting] = useState<boolean>(false);

	const observer = useMemo(
		() =>
			new IntersectionObserver(([entry]) => {
				return setIntersecting(entry.isIntersecting);
			}),
		[],
	);

	useEffect(() => {
		el && observer.observe(el);
		return () => {
			setIntersecting(false);
			return observer.disconnect();
		};
	}, [observer, el]);

	return isIntersecting;
};

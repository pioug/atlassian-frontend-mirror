import { useLayoutEffect, useState } from 'react';

import type { UnbindFn } from 'bind-event-listener';
import { bind } from 'bind-event-listener';

export const useWindowWidth = () => {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	useLayoutEffect(() => {
		function handleResize() {
			setWindowWidth(window.innerWidth);
		}

		const unbind: UnbindFn = bind(window, {
			type: 'resize',
			listener: handleResize,
		});

		return () => unbind();
	}, []);

	return windowWidth;
};

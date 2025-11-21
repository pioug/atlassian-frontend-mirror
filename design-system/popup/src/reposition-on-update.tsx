import React, { Fragment, useLayoutEffect, useRef } from 'react';

import { type RepositionOnUpdateProps } from './types';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const RepositionOnUpdate = ({
	children,
	update,
}: RepositionOnUpdateProps): React.JSX.Element => {
	// Ref used here to skip update on first render (when refs haven't been set)
	const isFirstRenderRef = useRef<boolean>(true);

	useLayoutEffect(() => {
		if (isFirstRenderRef.current) {
			isFirstRenderRef.current = false;
			return;
		}
		// callback function from popper that repositions pop-up on content Update
		update();
	}, [update]);

	// wrapping in fragment to make TS happy (known issue with FC returning children)
	return <Fragment>{children}</Fragment>;
};

/**
 * Copied from ADS popup component with some tweeks for our use
 */
import React, { Fragment, useLayoutEffect, useRef } from 'react';
import { type PopperChildrenProps, type Placement } from '@atlaskit/popper';

export type RepositionOnUpdateProps = {
	update: PopperChildrenProps['update'];
	settings: {
		showFullPicker: boolean;
		popperPlacement: Placement;
	};
	isOpen: boolean;
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const RepositionOnUpdate = ({
	children,
	update,
	settings,
	isOpen,
}: React.PropsWithChildren<RepositionOnUpdateProps>) => {
	// Ref used here to skip update on first render (when refs haven't been set)
	const isFirstRenderRef = useRef<boolean>(true);

	useLayoutEffect(() => {
		if (isFirstRenderRef.current) {
			isFirstRenderRef.current = false;
			return;
		}
		// callback function from popper that repositions pop-up on content Update
		update();
	}, [update, settings, isOpen]);

	// wrapping in fragment to make TS happy (known issue with FC returning children)
	return <Fragment>{children}</Fragment>;
};

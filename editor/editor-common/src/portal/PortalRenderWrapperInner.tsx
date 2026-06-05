import React, { useLayoutEffect } from 'react';

/**
 * Wraps the children of a portal to allow for React rendering
 * lifecycle hook to be exposed, primarily for node virtualization.
 */
export const PortalRenderWrapperInner = ({
	getChildren,
	onBeforeRender,
}: {
	getChildren: () => React.ReactNode;
	onBeforeRender: () => void;
}): React.JSX.Element => {
	useLayoutEffect(() => {
		if (onBeforeRender) {
			onBeforeRender();
		}
	}, [onBeforeRender]);
	return <>{getChildren()}</>;
};

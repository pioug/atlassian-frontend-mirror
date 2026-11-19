import React from 'react';

import { useIsInsetFullscreen } from './useIsInsetFullscreen';
import { useIsInsetViewer } from './useIsInsetViewer';

export type WithInsetViewerProps = {
	isInsetViewer?: boolean;
	isInsetFullscreen?: boolean;
};

export const withInsetViewer = <Props, Component>(
	WrappedComponent: (
		| React.ComponentType<WithInsetViewerProps & Props>
		| React.ForwardRefExoticComponent<WithInsetViewerProps & Props>
	) &
		Component,
): React.ForwardRefExoticComponent<
	React.PropsWithoutRef<
		JSX.LibraryManagedAttributes<Component, Omit<Props, keyof WithInsetViewerProps>>
	> &
		React.RefAttributes<any>
> => {
	type WrappedProps = JSX.LibraryManagedAttributes<
		Component,
		Omit<Props, keyof WithInsetViewerProps>
	>;
	const WithInsetViewer = React.forwardRef<any, WrappedProps>((props, ref) => {
		const isInsetViewer = useIsInsetViewer();
		const isInsetFullscreen = useIsInsetFullscreen();
		return (
			<WrappedComponent
				{...(props as any)}
				ref={ref}
				isInsetViewer={isInsetViewer}
				isInsetFullscreen={isInsetFullscreen}
			/>
		);
	});
	WithInsetViewer.displayName = `WithInsetViewer(${
		WrappedComponent.displayName || WrappedComponent.name || 'Component'
	})`;
	return WithInsetViewer;
};

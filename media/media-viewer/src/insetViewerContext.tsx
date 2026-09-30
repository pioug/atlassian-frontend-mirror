import React, { createContext, useContext, type ReactNode } from 'react';

const InsetViewerContext = createContext(false);

export const InsetViewerProvider = ({
	isInsetViewer = false,
	children,
}: {
	isInsetViewer?: boolean;
	children: ReactNode;
}): React.JSX.Element => (
	<InsetViewerContext.Provider value={isInsetViewer}>{children}</InsetViewerContext.Provider>
);

export const useIsInsetViewer = (): boolean => useContext(InsetViewerContext);

export type WithInsetViewerProps = {
	isInsetViewer?: boolean;
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
		return <WrappedComponent {...(props as any)} ref={ref} isInsetViewer={isInsetViewer} />;
	});
	WithInsetViewer.displayName = `WithInsetViewer(${
		WrappedComponent.displayName || WrappedComponent.name || 'Component'
	})`;
	return WithInsetViewer;
};

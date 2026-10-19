import React, { createContext, useContext, useState, type ReactNode } from 'react';

const InsetViewerContext = createContext(false);

// The inset media footer element, once mounted, so controls can portal into it.
const MediaFooterControlsContext = createContext<HTMLElement | null>(null);
const SetMediaFooterControlsContext = createContext<(element: HTMLElement | null) => void>(
	() => {},
);

// Whether a viewer has registered video controls in the footer, which gives the footer extra room.
const HasMediaFooterPlayerControlsContext = createContext(false);
const SetHasMediaFooterPlayerControlsContext = createContext<(hasPlayerControls: boolean) => void>(
	() => {},
);

export const InsetViewerProvider = ({
	isInsetViewer = false,
	children,
}: {
	isInsetViewer?: boolean;
	children: ReactNode;
}): React.JSX.Element => {
	const [mediaFooterControls, setMediaFooterControls] = useState<HTMLElement | null>(null);
	const [hasPlayerControls, setHasPlayerControls] = useState(false);
	return (
		<InsetViewerContext.Provider value={isInsetViewer}>
			<SetMediaFooterControlsContext.Provider value={setMediaFooterControls}>
				<MediaFooterControlsContext.Provider value={mediaFooterControls}>
					<SetHasMediaFooterPlayerControlsContext.Provider value={setHasPlayerControls}>
						<HasMediaFooterPlayerControlsContext.Provider value={hasPlayerControls}>
							{children}
						</HasMediaFooterPlayerControlsContext.Provider>
					</SetHasMediaFooterPlayerControlsContext.Provider>
				</MediaFooterControlsContext.Provider>
			</SetMediaFooterControlsContext.Provider>
		</InsetViewerContext.Provider>
	);
};

export const useIsInsetViewer = (): boolean => useContext(InsetViewerContext);

export const useMediaFooterControls = (): HTMLElement | null =>
	useContext(MediaFooterControlsContext);

export const useSetMediaFooterControls = (): ((element: HTMLElement | null) => void) =>
	useContext(SetMediaFooterControlsContext);

export const useHasMediaFooterPlayerControls = (): boolean =>
	useContext(HasMediaFooterPlayerControlsContext);

export const useSetHasMediaFooterPlayerControls = (): ((hasPlayerControls: boolean) => void) =>
	useContext(SetHasMediaFooterPlayerControlsContext);

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

export type WithInsetViewerFooterProps = WithInsetViewerProps & {
	mediaFooterControls?: HTMLElement | null;
	setHasPlayerControls?: (hasPlayerControls: boolean) => void;
};

export const withInsetViewerFooter = <Props, Component>(
	WrappedComponent: (
		| React.ComponentType<WithInsetViewerFooterProps & Props>
		| React.ForwardRefExoticComponent<WithInsetViewerFooterProps & Props>
	) &
		Component,
): React.ForwardRefExoticComponent<
	React.PropsWithoutRef<
		JSX.LibraryManagedAttributes<Component, Omit<Props, keyof WithInsetViewerFooterProps>>
	> &
		React.RefAttributes<any>
> => {
	type WrappedProps = JSX.LibraryManagedAttributes<
		Component,
		Omit<Props, keyof WithInsetViewerFooterProps>
	>;
	const WithInsetViewerFooter = React.forwardRef<any, WrappedProps>((props, ref) => {
		const isInsetViewer = useIsInsetViewer();
		const mediaFooterControls = useMediaFooterControls();
		const setHasPlayerControls = useSetHasMediaFooterPlayerControls();
		return (
			<WrappedComponent
				{...(props as any)}
				ref={ref}
				isInsetViewer={isInsetViewer}
				mediaFooterControls={mediaFooterControls}
				setHasPlayerControls={setHasPlayerControls}
			/>
		);
	});
	WithInsetViewerFooter.displayName = `WithInsetViewerFooter(${
		WrappedComponent.displayName || WrappedComponent.name || 'Component'
	})`;
	return WithInsetViewerFooter;
};

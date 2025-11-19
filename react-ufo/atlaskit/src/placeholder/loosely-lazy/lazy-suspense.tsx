import React, {
	createContext,
	Fragment,
	Suspense,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import type {
	DynamicFallbackProps,
	Fallback,
	LazySuspenseContextType,
	LazySuspenseProps,
} from './types';

const isNodeEnvironment = () => {
	return typeof window === 'undefined' || window.name === 'nodejs';
};

const LazySuspenseContext = createContext<LazySuspenseContextType>({
	fallback: <Fragment />,
	setFallback: () => {
		// eslint-disable-next-line no-console
		console.warn('Missing <LooselySuspense /> boundary');
	},
	name: '',
});

const DynamicFallback = ({ children, outsideSuspense }: DynamicFallbackProps) => {
	const { fallback, setFallback } = React.useContext(LazySuspenseContext);

	useLayoutEffect(() => {
		return () => {
			if (!outsideSuspense) {
				setFallback(null);
			}
		};
	}, [outsideSuspense, setFallback]);

	return children(outsideSuspense ? null : fallback);
};

DynamicFallback.displayName = 'DynamicFallback';

export const LazySuspense: {
	({ fallback, children, name }: LazySuspenseProps): React.JSX.Element;
	displayName: string;
} = ({ fallback, children, name }: LazySuspenseProps): React.JSX.Element => {
	const [hydrationFallback, setHydrationFallback] = useState<Fallback>(null);

	const mountedRef = useRef(false);
	useLayoutEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const contextValue = useMemo(
		() => ({
			fallback,
			setFallback: (newFallback: Fallback) => {
				if (hydrationFallback === newFallback) {
					return;
				}
				setHydrationFallback(newFallback);
			},
			name,
		}),
		[fallback, hydrationFallback, name],
	);

	const renderFallback = (outsideSuspense: boolean) => (
		<DynamicFallback outsideSuspense={outsideSuspense}>
			{(resolvedFallback) =>
				outsideSuspense && hydrationFallback ? hydrationFallback : resolvedFallback
			}
		</DynamicFallback>
	);

	return (
		<LazySuspenseContext.Provider value={contextValue}>
			{isNodeEnvironment() ? (
				children
			) : (
				<>
					<Suspense fallback={renderFallback(false)}>{children}</Suspense>
					{(!mountedRef.current || hydrationFallback) && renderFallback(true)}
				</>
			)}
		</LazySuspenseContext.Provider>
	);
};

LazySuspense.displayName = 'LazySuspense';

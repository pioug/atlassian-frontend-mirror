import type { ReactNode } from 'react';
import React, { createContext, useState, useContext, useMemo, useRef, useCallback } from 'react';

interface AnnotationHoverStateContext {
	isWithinRange: boolean;
}

interface AnnotationHoverDispatchContext {
	cancelTimeout: () => void;
	initiateTimeout: () => void;
	setIsWithinRange: (isWithinRange: boolean) => void;
}

const AnnotationHoverStateContext = createContext<AnnotationHoverStateContext>({
	isWithinRange: false,
});

const AnnotationHoverDispatchContext = createContext<AnnotationHoverDispatchContext>({
	cancelTimeout: () => {},
	initiateTimeout: () => {},
	setIsWithinRange: () => {},
});

export const AnnotationHoverContext = ({ children }: { children?: ReactNode }) => {
	const [isWithinRange, setIsWithinRange] = useState(false);
	const timeoutHandler = useRef<NodeJS.Timeout>();

	const cancelTimeout = useCallback(() => {
		if (timeoutHandler) {
			clearTimeout(timeoutHandler.current);
		}
	}, [timeoutHandler]);

	const initiateTimeout = useCallback(() => {
		if (isWithinRange) {
			timeoutHandler.current = setTimeout(() => {
				setIsWithinRange(false);
			}, 500);
		}
	}, [isWithinRange]);

	const stateData = useMemo(() => ({ isWithinRange }), [isWithinRange]);
	const dispatchData = useMemo(
		() => ({ cancelTimeout, initiateTimeout, setIsWithinRange }),
		[cancelTimeout, initiateTimeout, setIsWithinRange],
	);

	return (
		<AnnotationHoverStateContext.Provider value={stateData}>
			<AnnotationHoverDispatchContext.Provider value={dispatchData}>
				{children}
			</AnnotationHoverDispatchContext.Provider>
		</AnnotationHoverStateContext.Provider>
	);
};

export const useAnnotationHoverContext = () => {
	return useContext(AnnotationHoverStateContext);
};

export const useAnnotationHoverDispatch = () => {
	return useContext(AnnotationHoverDispatchContext);
};

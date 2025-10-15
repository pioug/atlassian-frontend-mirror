/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	createContext,
	type Dispatch,
	type MutableRefObject,
	type ReactNode,
	type SetStateAction,
	useId,
	useRef,
	useState,
} from 'react';

import { jsx } from '@atlaskit/css';

import type { DismissEvent, Placement } from '../types';

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export interface SpotlightContextType {
	card: {
		ref: MutableRefObject<HTMLDivElement | null> | null;
		setRef: Dispatch<SetStateAction<MutableRefObject<HTMLDivElement | null> | null>>;
		placement: Placement;
		setPlacement: Dispatch<SetStateAction<Placement>>;
	};
	heading: {
		id: string;
		setId: Dispatch<SetStateAction<string>>;
	};
	popoverContent: {
		ref: MutableRefObject<HTMLDivElement | undefined> | undefined;
		setRef: Dispatch<SetStateAction<MutableRefObject<HTMLDivElement | undefined> | undefined>>;
		update: () => () => Promise<any>;
		setUpdate: Dispatch<SetStateAction<() => () => Promise<any>>>;
		dismiss: MutableRefObject<(_event: DismissEvent) => void>;
		setDismiss: (dismissFn: (_event: DismissEvent) => void) => void;
	};
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SpotlightContext = createContext<SpotlightContextType>({
	card: {
		ref: null,
		setRef: () => undefined,
		placement: 'bottom-end',
		setPlacement: () => undefined,
	},
	heading: {
		id: '',
		setId: () => undefined,
	},
	popoverContent: {
		ref: undefined,
		setRef: () => undefined,
		update: () => () => new Promise(() => null),
		setUpdate: () => () => new Promise(() => null),
		dismiss: { current: () => undefined },
		setDismiss: () => undefined,
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SpotlightContextProvider = ({ children }: { children: ReactNode }) => {
	const id = useId();
	const [placement, setPlacement] = useState<Placement>('bottom-end');
	const [headingId, setHeadingId] = useState<string>(`${id}-heading`);
	const [update, setUpdate] = useState<() => () => Promise<any>>(() => async () => undefined);
	const [popoverRef, setPopoverRef] = useState<
		MutableRefObject<HTMLDivElement | undefined> | undefined
	>();
	const [cardRef, setCardRef] = useState<MutableRefObject<HTMLDivElement | null> | null>(null);
	const dismissRef = useRef<(_event: DismissEvent) => void>(() => undefined);
	const setDismiss = (dismissFn: (_event: DismissEvent) => void) => {
		dismissRef.current = dismissFn;
	};

	return (
		<SpotlightContext.Provider
			value={{
				card: {
					ref: cardRef,
					setRef: setCardRef,
					placement,
					setPlacement,
				},
				heading: {
					id: headingId,
					setId: setHeadingId,
				},
				popoverContent: {
					ref: popoverRef,
					setRef: setPopoverRef,
					update,
					setUpdate,
					dismiss: dismissRef,
					setDismiss,
				},
			}}
		>
			{children}
		</SpotlightContext.Provider>
	);
};

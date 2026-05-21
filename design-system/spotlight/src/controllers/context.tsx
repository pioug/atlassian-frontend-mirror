/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type Context,
	createContext,
	type Dispatch,
	type MutableRefObject,
	type ReactNode,
	type RefObject,
	type SetStateAction,
	useId,
	useRef,
	useState,
} from 'react';

import { jsx } from '@atlaskit/css';

import type { BackEvent, DismissEvent, DoneEvent, Placement, PositionArea } from '../types';

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export interface SpotlightContextType {
	card: {
		ref: MutableRefObject<HTMLDivElement | null> | null;
		setRef: Dispatch<SetStateAction<MutableRefObject<HTMLDivElement | null> | null>>;
		placement: Placement;
		setPlacement: Dispatch<SetStateAction<Placement>>;
		motion: React.ComponentType<{ children: ReactNode }> | undefined;
		setMotion: Dispatch<SetStateAction<React.ComponentType<{ children: ReactNode }> | undefined>>;
	};
	heading: {
		id: string;
		setId: Dispatch<SetStateAction<string>>;
	};
	popoverContent: {
		ref: MutableRefObject<HTMLDivElement | null> | undefined;
		setRef: Dispatch<SetStateAction<MutableRefObject<HTMLDivElement | null> | undefined>>;
		positionArea: PositionArea | 'none' | undefined;
		setPositionArea: Dispatch<SetStateAction<PositionArea | 'none' | undefined>>;
		update: () => Promise<any>;
		setUpdate: Dispatch<SetStateAction<() => Promise<any>>>;
		dismiss: MutableRefObject<(_event: DismissEvent) => void>;
		setDismiss: (dismissFn: (_event: DismissEvent) => void) => void;
	};
	target: {
		ref: RefObject<HTMLDivElement | null>;
		setRef: Dispatch<SetStateAction<RefObject<HTMLDivElement | null>>>;
	};
	primaryAction: {
		action: MutableRefObject<(_event: DoneEvent) => void>;
		setAction: (doneFn: (_event: DoneEvent) => void) => void;
	};
	secondaryAction: {
		action: MutableRefObject<(_event: BackEvent) => void>;
		setAction: (backFn: (_event: BackEvent) => void) => void;
	};
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SpotlightContext: Context<SpotlightContextType> = createContext<SpotlightContextType>({
	card: {
		ref: null,
		setRef: () => undefined,
		placement: 'bottom-end',
		setPlacement: () => undefined,
		motion: undefined,
		setMotion: () => undefined,
	},
	heading: {
		id: '',
		setId: () => undefined,
	},
	popoverContent: {
		ref: undefined,
		setRef: () => undefined,
		positionArea: undefined,
		setPositionArea: () => undefined,
		update: () => new Promise(() => null),
		setUpdate: () => new Promise(() => null),
		dismiss: { current: () => undefined },
		setDismiss: () => undefined,
	},
	target: {
		ref: { current: null },
		setRef: () => undefined,
	},
	primaryAction: {
		action: { current: () => undefined },
		setAction: () => undefined,
	},
	secondaryAction: {
		action: { current: () => undefined },
		setAction: () => undefined,
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const SpotlightContextProvider = ({ children }: { children: ReactNode }): JSX.Element => {
	const id = useId();
	const defaultTargetRef = useRef<HTMLDivElement>(null);
	const [motion, setMotion] = useState<React.ComponentType<{ children: ReactNode }>>();
	const [placement, setPlacement] = useState<Placement>('bottom-end');
	const [headingId, setHeadingId] = useState<string>(`${id}-heading`);
	const [update, setUpdate] = useState<() => Promise<any>>(() => async () => undefined);
	const [popoverRef, setPopoverRef] = useState<
		MutableRefObject<HTMLDivElement | null> | undefined
	>();
	const [positionArea, setPositionArea] = useState<PositionArea | 'none' | undefined>();
	const [cardRef, setCardRef] = useState<MutableRefObject<HTMLDivElement | null> | null>(null);
	const [targetRef, setTargetRef] = useState<RefObject<HTMLDivElement | null>>(defaultTargetRef);

	const dismissRef = useRef<(_event: DismissEvent) => void>(() => undefined);
	const setDismiss = (dismissFn: (_event: DismissEvent) => void) => {
		dismissRef.current = dismissFn;
	};

	const secondaryActionRef = useRef<(_event: BackEvent) => void>(() => undefined);
	const setSecondaryAction = (actionFn: (_event: BackEvent) => void) => {
		secondaryActionRef.current = actionFn;
	};

	const primaryActionRef = useRef<(_event: DoneEvent) => void>(() => undefined);
	const setPrimaryAction = (actionFn: (_event: DoneEvent) => void) => {
		primaryActionRef.current = actionFn;
	};

	return (
		<SpotlightContext.Provider
			value={{
				card: {
					ref: cardRef,
					setRef: setCardRef,
					placement,
					setPlacement,
					motion,
					setMotion,
				},
				heading: {
					id: headingId,
					setId: setHeadingId,
				},
				popoverContent: {
					ref: popoverRef,
					setRef: setPopoverRef,
					positionArea,
					setPositionArea,
					update,
					setUpdate,
					dismiss: dismissRef,
					setDismiss,
				},
				target: {
					ref: targetRef,
					setRef: setTargetRef,
				},
				primaryAction: {
					action: primaryActionRef,
					setAction: setPrimaryAction,
				},
				secondaryAction: {
					action: secondaryActionRef,
					setAction: setSecondaryAction,
				},
			}}
		>
			{children}
		</SpotlightContext.Provider>
	);
};

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
	type SetStateAction,
} from 'react';

import type { BackEvent, DismissEvent, DoneEvent, Placement } from '../types';

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
		ref: MutableRefObject<HTMLDivElement | undefined> | undefined;
		setRef: Dispatch<SetStateAction<MutableRefObject<HTMLDivElement | undefined> | undefined>>;
		update: () => () => Promise<any>;
		setUpdate: Dispatch<SetStateAction<() => () => Promise<any>>>;
		dismiss: MutableRefObject<(_event: DismissEvent) => void>;
		setDismiss: (dismissFn: (_event: DismissEvent) => void) => void;
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
		update: () => () => new Promise(() => null),
		setUpdate: () => () => new Promise(() => null),
		dismiss: { current: () => undefined },
		setDismiss: () => undefined,
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

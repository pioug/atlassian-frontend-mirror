import React, { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';

import type { SmartLinkChoreographerProps } from './state/context/types';

type Controls = {
	startMessage: (...args: unknown[]) => Promise<string>;
	stopMessage: () => Promise<string>;
};

type Choreography = {
	callbacks: { start: (attempt: unknown) => boolean; stop: () => boolean };
	connect: (controls: Controls) => () => void;
	hasPermission: boolean;
	messageId: string;
};

/** Owns permission and claim cleanup for one experiment instance. */
function useChoreographedContent({
	messageId,
	isActive,
	onUnavailable,
}: SmartLinkChoreographerProps): Choreography {
	const instanceId = useId();
	const request = useRef<object | null>(null);
	const granted = useRef<object | null>(null);
	const pending = useRef(Promise.resolve());
	const unavailable = useRef(onUnavailable);
	const [hasPermission, setPermission] = useState(false);
	useLayoutEffect(() => {
		unavailable.current = onUnavailable;
	}, [onUnavailable]);
	useLayoutEffect(
		() => () => {
			request.current = null;
		},
		[],
	);
	const callbacks = useMemo(
		() => ({
			start: (attempt: unknown) => {
				// A delayed offer must not revive a cancelled or replaced request.
				if (!attempt || attempt !== request.current) return false;
				granted.current = request.current;
				setPermission(true);
				return true;
			},
			stop: () => {
				setPermission(false);
				if (granted.current && granted.current === request.current) unavailable.current();
				granted.current = null;
				return true;
			},
		}),
		[],
	);

	const connect = useCallback(
		({ startMessage, stopMessage }: Controls) => {
			if (!isActive) return () => {};
			const attempt = {};
			request.current = attempt;
			// Serialize cancellation and a new request: the host hook registers callbacks by ID.
			// Deferring also lets Strict Mode cleanup cancel a request before it is submitted.
			pending.current = pending.current.then(async () => {
				if (request.current !== attempt) return;
				try {
					const status = await startMessage(attempt);
					if (request.current === attempt && status !== 'started') unavailable.current();
				} catch {
					await stopMessage().catch(() => {});
					if (request.current === attempt) {
						setPermission(false);
						unavailable.current();
					}
				}
			});
			return () => {
				request.current = null;
				setPermission(false);
				pending.current = pending.current.then(async () => {
					await stopMessage().catch(() => {});
				});
			};
		},
		[isActive],
	);

	return useMemo(
		() => ({
			callbacks,
			connect,
			hasPermission: isActive && hasPermission,
			messageId: `${messageId}-${instanceId}`,
		}),
		[callbacks, connect, hasPermission, instanceId, isActive, messageId],
	);
}

/**
 * Product hook that registers a choreographed message.
 * Return a stable Controls object across renders (e.g. via useMemo or a ref).
 * Changing its identity causes the adapter to stop and restart an active request.
 */
export type ChoreographerHook = (
	messageId: string,
	callbacks: Choreography['callbacks'],
	messageTtl: number,
) => Controls;

/** Create once at module scope using the product's existing choreographer hook. */
export function createChoreographedContent(
	useChoreographer: ChoreographerHook,
): React.ComponentType<SmartLinkChoreographerProps> {
	return function ChoreographedContentAdapter(
		props: SmartLinkChoreographerProps,
	): React.JSX.Element {
		const { messageId, callbacks, connect, hasPermission } = useChoreographedContent(props);
		const controls = useChoreographer(messageId, callbacks, 0);
		useLayoutEffect(() => connect(controls), [connect, controls]);
		return <>{props.children({ hasPermission })}</>;
	};
}

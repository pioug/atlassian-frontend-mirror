import React, { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import InteractionContext from '@atlaskit/react-ufo/interaction-context';
import UFOLoadHold from '@atlaskit/react-ufo/load-hold';

/**
 * Proxies `@atlaskit/react-ufo/interaction-context` context with hold markers
 * for Gemini
 * Copied from @atlassian/gemini as it is a privately scoped package
 */
export function GeminiInteractionContext({ children }: { children: ReactNode | undefined }) {
	let interactionCount = useRef(0);

	const interactionTracker = React.useMemo(
		() => ({
			hold: () => {
				// @ts-ignore ts(2339) --`__gemini_component_hold__` is injected by gemini's component loader
				window.__gemini_component_hold__ = true;
				// track UFOHold components as blocking
				interactionCount.current += 1;

				// unlock with timeout as new elements might come in place
				return () => {
					setTimeout(() => {
						interactionCount.current -= 1;

						if (interactionCount.current === 0) {
							// @ts-ignore ts(2339) --`__gemini_component_hold__` is injected by gemini's component loader
							window.__gemini_component_hold__ = false;
						}
					}, 0);
				};
			},
			tracePress: () => {},
			labelStack: [],
			segmentIdMap: new Map<string, string>(),
			addMark: () => {},
			addCustomData: () => {},
			addCustomTimings: () => {},
			addApdex: () => {},
			onRender: () => {},
			retainQuery: () => {},
			addPreload: () => {},
			addLoad: () => {},
			_internalHold: () => {},
			complete: () => {},
		}),
		[],
	);

	return (
		<InteractionContext.Provider value={interactionTracker}>{children}</InteractionContext.Provider>
	);
}

const MockLoading = ({ getItem, onError }: { getItem: () => unknown; onError: () => void }) => {
	const [isLoading, setIsLoading] = useState(true);

	const counter = useRef(0);

	useEffect(() => {
		if (!isLoading) {
			return;
		}

		const interval = setInterval(() => {
			counter.current++;
			const item = getItem();
			if (item) {
				setIsLoading(false);
			} else {
				if (counter.current >= 20) {
					onError();
					throw new Error('Item not found');
				}
			}
		}, 100);

		return () => clearTimeout(interval);
	}, [onError, getItem, isLoading]);

	return isLoading ? <UFOLoadHold name="wait-for-item" /> : null;
};

const withGeminiInteractionContext = (Component: React.ComponentType<unknown>) => () => (
	<GeminiInteractionContext>
		<Component />
	</GeminiInteractionContext>
);

export const withWaitForItem = (Component: React.ComponentType<any>, getItem: () => unknown) =>
	withGeminiInteractionContext(() => {
		const [error, setError] = useState(false);

		const onError = useCallback(() => {
			setError(true);
		}, []);

		if (error) {
			return <>Item not found</>;
		}

		return (
			<>
				<MockLoading getItem={getItem} onError={onError} />
				<Component />
			</>
		);
	});

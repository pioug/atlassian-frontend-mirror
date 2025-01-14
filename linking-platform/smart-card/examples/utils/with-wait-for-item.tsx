import React, { useCallback, useEffect, useRef, useState } from 'react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import { GeminiInteractionContext } from '@atlassian/gemini/interaction-context';

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

export const withWaitForItem = (Component: React.ComponentType<unknown>, getItem: () => unknown) =>
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

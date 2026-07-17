import React, { useCallback, useMemo, useState } from 'react';

import InteractionContext from '@atlaskit/interaction-context';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import Skeleton from '@atlaskit/skeleton';

const INTERACTION_NAME = 'skeleton.example.content';

/**
 * Demonstrates how `@atlaskit/skeleton` participates in UFO interaction tracing.
 *
 * When a `Skeleton` is given an `interactionName`, it "holds" the current UFO
 * interaction (via `InteractionContext`) for as long as it is mounted, and releases
 * the hold when it unmounts. This keeps the interaction open while placeholder
 * content is on screen, so performance metrics reflect the time users spend waiting
 * for real content.
 *
 * In a real app the `InteractionContext.Provider` is supplied by UFO. Here we provide
 * a lightweight stand-in that surfaces the hold/release lifecycle on screen so the
 * otherwise-invisible behaviour is observable. Toggle the button to mount/unmount the
 * skeleton and watch the interaction be held and then released.
 */
export default function SkeletonInteractionTracing(): React.JSX.Element {
	const [isLoading, setIsLoading] = useState(true);
	const [log, setLog] = useState<string[]>([]);

	const appendLog = useCallback((message: string) => {
		setLog((current) => [...current, message]);
	}, []);

	const hold = useCallback(
		(name?: string) => {
			appendLog(`Held interaction: ${name ?? '(unnamed)'}`);
			return () => {
				appendLog(`Released interaction: ${name ?? '(unnamed)'}`);
			};
		},
		[appendLog],
	);

	// The context value must have a stable identity. `Skeleton` re-runs its
	// hold/release effect whenever the context object changes, so recreating this
	// object on every render (e.g. as an inline literal) would release and re-hold
	// the interaction in a loop each time the log updates.
	const contextValue = useMemo(() => ({ hold, tracePress: () => {} }), [hold]);

	return (
		<InteractionContext.Provider value={contextValue}>
			<Stack space="space.150" alignInline="start">
				<button type="button" onClick={() => setIsLoading((value) => !value)}>
					{isLoading ? 'Finish loading (unmount skeleton)' : 'Start loading (mount skeleton)'}
				</button>

				{isLoading ? (
					<Skeleton width="200px" height="16px" interactionName={INTERACTION_NAME} />
				) : (
					<Text>Content loaded</Text>
				)}

				<Box backgroundColor="color.background.neutral.subtle" padding="space.150">
					<Stack space="space.050">
						<Text weight="bold">Interaction log</Text>
						{log.length === 0 ? (
							<Text color="color.text.subtle">No events yet.</Text>
						) : (
							log.map((entry, index) => (
								<Text key={index} color="color.text.subtle">
									{entry}
								</Text>
							))
						)}
					</Stack>
				</Box>
			</Stack>
		</InteractionContext.Provider>
	);
}

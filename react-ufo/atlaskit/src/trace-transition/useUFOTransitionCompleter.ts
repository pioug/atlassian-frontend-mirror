import { useContext, useEffect } from 'react';

import UFOInteractionIDContext from '../interaction-id-context';
import { addOnCancelCallback, tryComplete } from '../interaction-metrics';

export function useUFOTransitionCompleter(): void {
	const interactionId = useContext(UFOInteractionIDContext);
	const capturedInteractionId = interactionId.current;
	useEffect(() => {
		// If we have a current interaction set...
		if (capturedInteractionId != null) {
			let cancel = requestAnimationFrame(() => {
				cancel = requestAnimationFrame(() => {
					if (capturedInteractionId === interactionId.current) {
						tryComplete(capturedInteractionId);
					}
				});
			});

			addOnCancelCallback(capturedInteractionId, () => {
				cancelAnimationFrame(cancel);
			});
		}
	}, [capturedInteractionId, interactionId]);
}

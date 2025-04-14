import { DefaultInteractionID } from '../interaction-id-context';
import { addRedirect } from '../interaction-metrics';
import UFORouteName from '../route-name-context';
import { withProfiling } from '../self-measurements';

const traceUFORedirect = withProfiling(function traceUFORedirect(
	fromUfoName: string,
	nextUfoName: string,
	nextRouteName: string,
	time: number,
) {
	UFORouteName.current = nextUfoName;
	const interactionId = DefaultInteractionID.current;
	if (interactionId) {
		addRedirect(interactionId, fromUfoName, nextUfoName, nextRouteName, time);
	}
});

export default traceUFORedirect;

import {
	type EventOrTimestamp,
	resolveInteractionTimestamp,
} from '../common/interaction-timestamp';
import DefaultInteractionID from '../interaction-id-context/defaultInteractionId';
import { addRedirect } from '../interaction-metrics';
import UFORouteName from '../route-name-context';

function traceUFORedirect(
	fromUfoName: string,
	nextUfoName: string,
	nextRouteName: string,
	eventOrTimestamp: EventOrTimestamp,
): void {
	UFORouteName.current = nextUfoName;
	const interactionId = DefaultInteractionID.current;
	if (interactionId) {
		addRedirect(
			interactionId,
			fromUfoName,
			nextUfoName,
			nextRouteName,
			resolveInteractionTimestamp(eventOrTimestamp) ?? performance.now(),
		);
	}
}

export default traceUFORedirect;

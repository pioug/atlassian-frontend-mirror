import { generateSpanId } from './generate-span-id';
import { setActiveTrace } from './set-active-trace';

// DO NOT CALL THIS FUNCTION DIRECTLY!!!!
// It is only to be called by React UFO libraries for the automatic handling of trace context for experiences.
// Calling this may cause trace context to be broken
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function setInteractionActiveTrace(interactionId: string, experienceType: string): void {
	setActiveTrace(interactionId.replace(/-/g, ''), generateSpanId(), experienceType);
}

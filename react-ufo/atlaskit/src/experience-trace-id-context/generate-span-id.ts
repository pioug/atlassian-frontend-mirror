// DO NOT CALL THIS FUNCTION DIRECTLY!!!!
// It is only to be called by React UFO libraries for the automatic handling of trace context for experiences.
// Calling this may cause trace context to be broken
export function generateSpanId(): string {
	return Array.from(new Array(16), () => Math.floor(Math.random() * 16).toString(16)).join('');
}

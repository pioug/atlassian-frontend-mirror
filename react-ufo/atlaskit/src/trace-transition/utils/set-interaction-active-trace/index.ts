import { setActiveTrace } from '../../../experience-trace-id-context';
import { withProfiling } from '../../../self-measurements';
import { generateSpanId } from '../generate-span-id';

export const setInteractionActiveTrace = withProfiling(function setInteractionActiveTrace(
	newId: string,
) {
	setActiveTrace(newId.replace(/-/g, ''), generateSpanId(), 'transition');
});

import { setActiveTrace } from '../../../experience-trace-id-context';
import { generateSpanId } from '../generate-span-id';

export function setInteractionActiveTrace(newId: string) {
	setActiveTrace(newId.replace(/-/g, ''), generateSpanId(), 'transition');
}

import type { SegmentLabel } from '../../../interaction-context';

export function isSegmentLabel(obj: any): obj is SegmentLabel {
	return obj && typeof obj.name === 'string' && typeof obj.segmentId === 'string';
}

import { type SegmentLabel } from '../../../interaction-context';

export const sanitizeUfoName = (name: string) => {
	return name.replace(/_/g, '-');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSegmentLabel(obj: any): obj is SegmentLabel {
	return obj && typeof obj.name === 'string' && typeof obj.segmentId === 'string';
}

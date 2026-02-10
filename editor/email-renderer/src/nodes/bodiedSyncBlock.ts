import type { NodeSerializerOpts } from '../interfaces';

export const styles: string = '';

export default function bodiedSyncBlock({ text }: NodeSerializerOpts): string {
	return text || '';
}

import { checkClipboardTypes } from './checkClipboardTypes';

export function isPastedFile(rawEvent: ClipboardEvent): boolean {
	const { clipboardData } = rawEvent;
	if (!clipboardData) {
		return false;
	}
	return checkClipboardTypes(clipboardData.types, 'Files');
}
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { checkClipboardTypes } from './checkClipboardTypes';

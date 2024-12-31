// Typeguard Function
export const isDragEvent = (event: Event): event is DragEvent => 'dataTransfer' in event;

export function isDroppedFile(rawEvent: Event): boolean {
	const e = rawEvent as DragEvent;

	if (!e.dataTransfer) {
		return false;
	}

	return Array.prototype.slice.call(e.dataTransfer.types).indexOf('Files') !== -1;
}

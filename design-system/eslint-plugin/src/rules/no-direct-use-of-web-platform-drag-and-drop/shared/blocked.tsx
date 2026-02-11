export const blockedJSXAttributeLookup: Set<string> = new Set([
	'onDragStart',
	'onDragEnter',
	'onDragLeave',
	'onDragOver',
	'onDrag',
	'onDrop',
	'onDragEnd',
]);

export const blockedEventNameLookup: Set<string> = new Set([
	'dragstart',
	'dragenter',
	'dragleave',
	'dragover',
	'drag',
	'drop',
	'dragend',
]);

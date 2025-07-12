import type { ADFEntity } from '@atlaskit/adf-utils/types';

/**
 * Finds the path to the "text" node in an ADF entity based on a JSON pointer.
 * Returns the path and size of the text node if found, otherwise returns null.
 *
 * @param selectedNodeAdf - The ADF entity to search within.
 * @param jsonPointer - The JSON pointer string to navigate through the ADF entity.
 * @returns An object containing the path and size of the text node, or null if not found.
 */
interface TextNodeResult {
	path: string;
	size: number;
}

export function findTextNodePath(
	selectedNodeAdf: ADFEntity,
	jsonPointer: string,
): TextNodeResult | null {
	// Split the JSON pointer into parts
	const parts = jsonPointer
		.trim()
		.split('/')
		.filter((p) => p.length > 0);

	let currentObj: ADFEntity = selectedNodeAdf;
	let path = '';

	for (const part of parts) {
		// Try to access the next part of the JSON object
		if (Array.isArray(currentObj)) {
			const index = parseInt(part, 10);
			if (isNaN(index) || index < 0 || index >= currentObj.length) {
				return null; // Invalid index
			}
			currentObj = currentObj[index];
			path += `/${index}`;
		} else if (typeof currentObj === 'object' && currentObj !== null) {
			currentObj = currentObj[part];
			path += `/${part}`;
		} else {
			return null; // Invalid path
		}
	}

	// Now search for the "text" node from the current object position
	function findText(obj: ADFEntity, currentPath: string): TextNodeResult | null {
		if (Array.isArray(obj)) {
			for (let index = 0; index < obj.length; index++) {
				const result = findText(obj[index], `${currentPath}/${index}`);
				if (result !== null) {
					return result;
				}
			}
		} else if (typeof obj === 'object' && obj !== null) {
			if ('text' in obj && typeof obj['text'] === 'string') {
				return { path: `${currentPath}/text`, size: obj['text'].length };
			}
			for (const key in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, key)) {
					const result = findText(obj[key], `${currentPath}/${key}`);
					if (result !== null) {
						return result;
					}
				}
			}
		}
		return null;
	}

	// Start finding the text node from the current object
	return findText(currentObj, path);
}

// Example usage
const jsonObj = {
	type: 'table',
	attrs: {
		displayMode: null,
		isNumberColumnEnabled: false,
		layout: 'default',
		localId: 'ed03bdaf-dcb0-4947-8129-fd218d4b6100',
		width: 760,
		__autoSize: false,
	},
	content: [
		{
			type: 'tableRow',
			content: [
				{
					type: 'tableHeader',
					attrs: {
						colspan: 1,
						rowspan: 1,
						colwidth: [254],
						background: null,
					},
					content: [
						{
							type: 'paragraph',
							attrs: { localId: null },
							content: [
								{
									type: 'text',
									marks: [{ type: 'strong' }],
									text: 'title',
								},
							],
						},
					],
				},
				// Other cells omitted for brevity
			],
		},
		// Other rows omitted for brevity
	],
};

const givenPath = '/content/0/content/0';
const result = findTextNodePath(jsonObj, givenPath);
if (result) {
	console.log(`Path: ${result.path}, Size: ${result.size}`); // Output: Path: /content/0/content/0/content/0/content/0/text, Size: 5
} else {
	console.log('Text node not found.');
}

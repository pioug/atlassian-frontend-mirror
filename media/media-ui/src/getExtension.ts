/**
 * Given an item, it grabs the file name of that item. For example, an item with the filename item.txt
 * would return the extension txt
 */
export function getExtension(filename: string): string {
	if (filename.indexOf('.') > -1) {
		return filename.split('.').pop() as string;
	}
	return '';
}

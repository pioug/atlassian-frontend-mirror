export function stripImportPath(typeText: string): string {
	return typeText.replace(/import\("[^"]+"\)\./g, '');
}

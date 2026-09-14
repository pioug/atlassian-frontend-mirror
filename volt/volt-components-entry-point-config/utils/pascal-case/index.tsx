export function pascalCase(value: string): string {
	return value
		.split(/[-_/]/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');
}

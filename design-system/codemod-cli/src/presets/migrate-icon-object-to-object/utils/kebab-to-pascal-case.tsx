/* eslint-disable @repo/internal/fs/filename-pattern-match */

export function kebabToPascalCase(str: string): string {
	return str
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');
}

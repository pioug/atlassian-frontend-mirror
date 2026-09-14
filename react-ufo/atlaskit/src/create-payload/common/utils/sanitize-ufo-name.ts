export function sanitizeUfoName(name: string): string {
	return name.replace(/_/g, '-');
}

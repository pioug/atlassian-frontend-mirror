export function sanitizeLabelStackName(name: string): string {
	if (name.startsWith('/')) {
		name = name.replace(/^\/+/, '');
	}

	if (name.endsWith('/')) {
		name = name.replace(/\/+$/, '');
	}

	return name;
}

export function normalizeExportTarget(target: string | Record<string, string>): string | null {
	if (typeof target === 'string') {
		return target;
	}

	const preferred = target.default ?? target.publish ?? target.import ?? target.require;
	if (typeof preferred === 'string') {
		return preferred;
	}

	return null;
}

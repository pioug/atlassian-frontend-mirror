export function getVisibilityStateFromPerformance(stop: number) {
	try {
		const results = performance.getEntriesByType('visibility-state');
		if (!results || results.length === 0) {
			return null;
		}
		return results.reduce((acc: null | string = null, { name, startTime }) => {
			if (startTime > stop) {
				return acc;
			}
			if (acc === null && name === null) {
				return null;
			}
			if (acc === null) {
				return name;
			}
			if (acc !== name) {
				return 'mixed';
			}
			return acc;
		}, null);
	} catch (e) {
		return null;
	}
}

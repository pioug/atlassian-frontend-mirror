export function objectToArray(obj: Record<string, any> = {}): any {
	return Object.keys(obj).reduce(
		(result, key) => {
			result.push({
				label: key,
				data: obj[key],
			});

			return result;
		},
		[] as { label: string; data: any }[],
	);
}

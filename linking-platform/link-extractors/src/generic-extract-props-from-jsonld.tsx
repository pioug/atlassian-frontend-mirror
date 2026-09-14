import type { ExtractOptions } from './types';

export function genericExtractPropsFromJSONLD<T>(options: ExtractOptions<T>): T {
	const { defaultExtractorFunction, extractorPrioritiesByType, extractorFunctionsByType, json } =
		options;

	if (json) {
		const type = json['@type'];

		if (type && Array.isArray(type)) {
			let highestPriority = 0;
			let highestPriorityExtractorFunction = defaultExtractorFunction;
			for (let t of type) {
				if (extractorPrioritiesByType[t] > highestPriority) {
					highestPriority = extractorPrioritiesByType[t];
					highestPriorityExtractorFunction = extractorFunctionsByType[t];
				}
			}
			return highestPriorityExtractorFunction(json);
		}

		if (type && extractorFunctionsByType[type]) {
			return extractorFunctionsByType[type](json);
		}
	}

	return defaultExtractorFunction(json);
}

import path, { type ParsedPath } from 'path';

export const getTransformVersion = (transform: ParsedPath): string => {
	let transformName = transform.base;
	if (transformName.startsWith('index.')) {
		const pathSegments = transform.dir.split(path.sep);
		transformName = pathSegments[pathSegments.length - 1];
	}

	return transformName.split('-')[0];
};

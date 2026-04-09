import path from 'path';

export const parseTransformPath = (transformPath: string): path.ParsedPath =>
	path.parse(transformPath);

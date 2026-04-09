import path, { type ParsedPath } from 'path';

export const getTransformModule = (transform: ParsedPath): string => {
	const pathSegments = transform.dir.split(path.sep);
	const nodeModulesIdx = pathSegments.indexOf('node_modules');
	// pathSegments will be of the form [node_modules, '@atlaskit', 'avatar', 'codemods']
	return pathSegments.slice(nodeModulesIdx + 1, nodeModulesIdx + 3).join('/');
};

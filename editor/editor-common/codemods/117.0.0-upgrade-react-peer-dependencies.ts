// Usage: cd platform && ../node_modules/.bin/jscodeshift -t packages/editor/editor-common/codemods/117.0.0-upgrade-react-peer-dependencies.ts --extensions json --parser babel packages/editor/*/package.json

import type { API, FileInfo, Options } from 'jscodeshift';

const NEW_PEER_DEP_RANGE = '^18.2.0 || ^19.0.0'; // Ensure backwards compatible while rest of Platform migrates
const NEW_DEV_DEP_RANGE = '^19.0.0'; // Ensure everyone is using React 19 types from now on
const VALID_ORIGINAL_RANGES = [NEW_PEER_DEP_RANGE, NEW_DEV_DEP_RANGE, 'root:*', '^18.2.0'];
type DependencyName = 'react' | 'react-dom' | '@types/react' | '@types/react-dom';

const updateDependency = (
	dependencies: Record<string, string> | undefined,
	dependencyName: DependencyName,
	filePath: string,
	newValue: string,
): void => {
	if (!dependencies?.[dependencyName]) {
		return;
	}

	const dependencyRange = dependencies[dependencyName];
	if (!VALID_ORIGINAL_RANGES.includes(dependencyRange)) {
		// oxlint-disable-next-line no-console -- Codemod intentionally reports unexpected dependency ranges.
		console.warn(
			`WARNING: ${dependencyName} in ${filePath} has unexpected range ${dependencyRange}. Skipping...`,
		);
		return;
	}

	dependencies[dependencyName] = newValue;
};

const NODE_MODULES_REGEX = /[\\/]node_modules[\\/]/u;
const transformer = (fileInfo: FileInfo, _api: API, _options: Options): string => {
	if (!fileInfo.path.endsWith('package.json') || NODE_MODULES_REGEX.test(fileInfo.path)) {
		return fileInfo.source;
	}

	const packageJson = JSON.parse(fileInfo.source);

	updateDependency(packageJson.peerDependencies, 'react', fileInfo.path, NEW_PEER_DEP_RANGE);
	updateDependency(packageJson.peerDependencies, 'react-dom', fileInfo.path, NEW_PEER_DEP_RANGE);
	updateDependency(packageJson.devDependencies, 'react', fileInfo.path, NEW_DEV_DEP_RANGE);
	updateDependency(packageJson.devDependencies, 'react-dom', fileInfo.path, NEW_DEV_DEP_RANGE);
	updateDependency(packageJson.devDependencies, '@types/react', fileInfo.path, NEW_DEV_DEP_RANGE);
	updateDependency(
		packageJson.devDependencies,
		'@types/react-dom',
		fileInfo.path,
		NEW_DEV_DEP_RANGE,
	);

	return `${JSON.stringify(packageJson, null, '\t')}\n`;
};

export default transformer;

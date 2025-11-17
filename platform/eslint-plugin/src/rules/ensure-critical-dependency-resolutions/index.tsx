import { findRootSync } from '@manypkg/find-root';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import type { ObjectExpression } from 'estree';
import { getObjectPropertyAsObject } from '../util/handle-ast-object';

// Here we only need to specify the major and minor versions
// In matchMinorVersion, we will check if the versions in resolutions fall in the right ranges.
//
const DESIRED_PKG_VERSIONS: Record<string, string[]> = {
	typescript: ['5.4', '5.9'],
	tslib: ['2.6', '2.8'],
	'@types/react': ['16.14', '18.2', '18.3'],
	'react-relay': ['npm:atl-react-relay@0.0.0-main-39e79f66'],
	'relay-compiler': ['npm:atl-relay-compiler@0.0.0-main-39e79f66'],
	'relay-runtime': ['npm:atl-relay-runtime@0.0.0-main-39e79f66'],
	'relay-test-utils': ['npm:atl-relay-test-utils@0.0.0-main-39e79f66'],
};

const matchMinorVersion = (desiredVersion: string, versionInResolutions: string): boolean => {
	const firstChar = versionInResolutions[0];
	// The version is invalid if it doesn't start with a number or ~
	if (!/^\d$/.test(firstChar) && firstChar !== '~' && !versionInResolutions.startsWith('npm:')) {
		return false;
	}

	return (
		versionInResolutions.startsWith(desiredVersion) ||
		versionInResolutions.startsWith('~' + desiredVersion)
	);
};

const verifyResolutionFromObject = ({
	resolutions,
	dependencies,
	devDependencies,
	pkg,
	version,
	optional,
}: {
	resolutions: ObjectExpression;
	dependencies: ObjectExpression | null;
	devDependencies: ObjectExpression | null;
	pkg: string;
	version: string;
	optional: boolean;
}): boolean => {
	// For root package.json, we require the critical packages' resolutions exist and with matching version
	// For individual package's package.json, it's ok if resolutions don't exist. But if they do, the version should match
	const resolutionExist = resolutions.properties.some(
		(p) => p.type === 'Property' && p.key.type === 'Literal' && p.key.value === pkg,
	);

	isDependencyPresent({
		resolutions,
		dependencies,
		devDependencies,
		pkg,
	});

	if (!resolutionExist) {
		// when package is not a part of dependencies/devDependencies
		if (
			optional === false &&
			!isDependencyPresent({
				resolutions,
				dependencies,
				devDependencies,
				pkg,
			})
		) {
			return true;
		}

		return optional;
	}

	const resolutionExistAndMatch = resolutions.properties.some(
		(p) =>
			p.type === 'Property' &&
			p.key.type === 'Literal' &&
			p.key.value === pkg &&
			p.value.type === 'Literal' &&
			matchMinorVersion(version, p.value.value as string),
	);

	return resolutionExistAndMatch;
};

type IsDependencyPresentProps = {
	resolutions: ObjectExpression | null;
	dependencies: ObjectExpression | null;
	devDependencies: ObjectExpression | null;
	pkg: string;
};
const isDependencyPresent = ({
	resolutions,
	dependencies,
	devDependencies,
	pkg,
}: IsDependencyPresentProps) => {
	const dependencyExist =
		dependencies !== null &&
		dependencies.properties.some(
			(p) => p.type === 'Property' && p.key.type === 'Literal' && p.key.value === pkg,
		);

	const devDependencyExist =
		devDependencies !== null &&
		devDependencies.properties.some(
			(p) => p.type === 'Property' && p.key.type === 'Literal' && p.key.value === pkg,
		);

	return dependencyExist || devDependencyExist;
};

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Enforce the versions of critical packages are within desired ranges by checking resolutions section in package.json',
			recommended: true,
		},
		hasSuggestions: false,
		messages: {
			invalidPackageResolution: `Make sure the resolutions for the following packages match major and minor version ranges ${JSON.stringify(
				DESIRED_PKG_VERSIONS,
			)}`,
		},
	},
	create(context) {
		const fileName = context.getFilename();
		return {
			ObjectExpression: (node: Rule.Node) => {
				if (!fileName.endsWith('package.json') || node.type !== 'ObjectExpression') {
					return;
				}

				const packageResolutions = getObjectPropertyAsObject(node, 'resolutions');
				const packageDependencies = getObjectPropertyAsObject(node, 'dependencies');
				const packageDevDependencies = getObjectPropertyAsObject(node, 'devDependencies');
				const rootDir = findRootSync(process.cwd());
				const isRootPackageJson = fileName.endsWith(`${rootDir}/package.json`);

				if (packageResolutions !== null) {
					for (const [key, values] of Object.entries(DESIRED_PKG_VERSIONS)) {
						if (
							!values.some((value) => {
								return verifyResolutionFromObject({
									resolutions: packageResolutions as ObjectExpression,
									dependencies: packageDependencies,
									devDependencies: packageDevDependencies,
									pkg: key,
									version: value,
									optional: !isRootPackageJson,
								});
							})
						) {
							return context.report({
								node,
								messageId: 'invalidPackageResolution',
							});
						}
					}
				}
			},
		};
	},
};

export default rule;

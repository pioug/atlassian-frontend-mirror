import type { Rule } from 'eslint';
import path from 'path';

import { getMetadataForFilename } from '../util/registration-utils';

interface ExportsValidationExceptions {
	[key: string]: { ignoredAfExportKeys: string[] };
}

const exportsValidationExceptions: ExportsValidationExceptions = {
	'@af/yarn-workspace': {
		ignoredAfExportKeys: ['./lock-parser'],
	},
	'@atlaskit/tokens': {
		ignoredAfExportKeys: ['./babel-plugin'],
	},
	'@atlaskit/storybook-addon-design-system': {
		ignoredAfExportKeys: ['.'],
	},
};

const rule: Rule.RuleModule = {
	meta: {
		docs: {
			recommended: false,
		},
		type: 'problem',
		messages: {
			missingExportsProperty: `The exports property must be defined for {{pkgName}}; it most likely can just be a duplicate of the "af:exports" property. See http://go/eslint-exports for details`,
			missingExportsKey: `Missing package.json exports key "{{expectedKey}}" in {{pkgName}}. The exports entry should be "{{expectedKey}}": "{{expectedValue}}". See http://go/eslint-exports for details`,
			unexpectedExportsKey: `Unexpected package.json exports key "{{key}}" in {{pkgName}}. The exports entry should be "{{expectedKey}}": "{{expectedValue}}". See http://go/eslint-exports for details`,
			unexpectedExportsValue: `Unexpected package.json exports value in {{pkgName}} for the "{{key}}" key. The exports entry should be "{{key}}": "{{expectedValue}}". See http://go/eslint-exports for details`,
		},
	},

	create(context) {
		const fileName = context.getFilename();

		if (!fileName.endsWith('package.json')) {
			return {};
		}

		const { pkgJson: packageJson } = getMetadataForFilename(fileName);

		const pkgName = packageJson.name;

		if (!pkgName || !packageJson['af:exports']) {
			return {};
		}

		if (!packageJson['exports']) {
			context.report({
				node: context.getSourceCode().ast,
				messageId: 'missingExportsProperty',
				data: { pkgName },
			});
			return {};
		}

		const afExports: { [key: string]: any } = packageJson['af:exports'];
		const nativeExports: { [key: string]: any } = packageJson['exports'];

		return {
			Program(node) {
				for (const [afExportsKey, afExportsValue] of Object.entries(afExports)) {
					if (exportsValidationExceptions[pkgName]?.ignoredAfExportKeys.includes(afExportsKey)) {
						continue;
					}

					const exportKeyViolations = getExportKeyViolation(
						afExportsKey,
						afExportsValue,
						nativeExports,
					);

					if (exportKeyViolations) {
						context.report({
							data: { ...exportKeyViolations, key: afExportsKey, pkgName },
							node,
							messageId: exportKeyViolations.messageId,
						});

						continue;
					}

					const exportValueViolations = getExportValueViolation(
						afExportsKey,
						afExportsValue,
						nativeExports,
					);

					if (exportValueViolations) {
						context.report({
							data: { ...exportValueViolations, pkgName },
							node,
							messageId: 'unexpectedExportsValue',
						});

						continue;
					}
				}
			},
		};
	},
};

function getExportKeyViolation(
	afExportsKey: string,
	afExportsValue: string,
	nativeExports: { [key: string]: any },
) {
	const afExportsValueHasExtension = path.extname(afExportsValue) !== '';

	if (afExportsValueHasExtension && !nativeExports.hasOwnProperty(afExportsKey)) {
		return {
			messageId: 'missingExportsKey',
			expectedKey: afExportsKey,
			expectedValue: afExportsValue,
		};
	}

	if (!afExportsValueHasExtension && nativeExports.hasOwnProperty(afExportsKey)) {
		return {
			messageId: 'unexpectedExportsKey',
			expectedKey: `${afExportsKey}/*`,
			expectedValue: `${afExportsValue}/*`,
		};
	}

	if (!afExportsValueHasExtension && !nativeExports.hasOwnProperty(`${afExportsKey}/*`)) {
		return {
			messageId: 'missingExportsKey',
			expectedKey: `${afExportsKey}/*`,
			expectedValue: `${afExportsValue}/*`,
		};
	}
}

function getNativeExportsValue(
	afExportsKey: string,
	afExportsValueHasExtension: boolean,
	nativeExports: { [key: string]: any },
) {
	const nativeExportsKey = afExportsValueHasExtension ? afExportsKey : `${afExportsKey}/*`;

	if (typeof nativeExports[nativeExportsKey] === 'object') {
		return nativeExports[nativeExportsKey].default;
	}

	return nativeExports[nativeExportsKey];
}

function getExportValueViolation(
	afExportsKey: string,
	afExportsValue: string,
	nativeExports: { [key: string]: any },
) {
	const afExportsValueHasExtension = path.extname(afExportsValue) !== '';

	const nativeExportsValue = getNativeExportsValue(
		afExportsKey,
		afExportsValueHasExtension,
		nativeExports,
	);

	// Some entrypoints have been updated to an index.js file that registers ts-node
	// Use path.basename to get the file name to see if it is equal to 'index.js'
	if (afExportsValueHasExtension && path.basename(nativeExportsValue) === 'index.js') {
		return;
	}

	if (afExportsValueHasExtension && nativeExportsValue !== afExportsValue) {
		return {
			key: afExportsKey,
			expectedValue: afExportsValue,
		};
	}

	// af:exports entrypoints without a file extension export the whole directory so check to ensure the exports value includes the wildcard
	if (!afExportsValueHasExtension && !nativeExportsValue.startsWith(`${afExportsValue}/*`)) {
		return {
			key: `${afExportsKey}/*`,
			expectedValue: `${afExportsValue}/*`,
		};
	}
}

export default rule;

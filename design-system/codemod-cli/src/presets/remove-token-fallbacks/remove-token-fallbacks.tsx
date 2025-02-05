/* eslint-disable no-console */
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';

import { hasImportDeclaration } from '@hypermod/utils';
import { findRoot } from '@manypkg/find-root';
import chalk from 'chalk';
import type { API, ASTPath, FileInfo, VariableDeclarator } from 'jscodeshift';

import { RemoveTokenFallbackOptions, TransformationDetails } from './types';
import { getTokenMap } from './utils/all-tokens';
import { getTeamInfo } from './utils/get-team-info';
import { removeUnusedImports } from './utils/remove-unused-imports';
import { removeUnusedVariables } from './utils/remove-unused-variables';
import { clearFolder, combineReports, writeReports } from './utils/reporter';
import { TokenProcessor } from './utils/token-processor';
const execAsync = promisify(exec);

/**
 * Transforms the source code of a file by removing fallback values from the @atlaskit/tokens/token functions.
 * By default removes only the fallbacks that have the same values as the tokens.
 *
 * @param {FileInfo} fileInfo - Information about the file to be transformed.
 * @param {API} api - The jscodeshift API, providing utilities for AST transformations.
 * @param {RemoveTokenFallbackOptions} options - Options for the transformation, including:
 *   @param {boolean} [options.verbose] - If true, enables verbose logging.
 *   @param {boolean} [options.forceUpdate] - If true, removes the fallbacks regardless of the difference between token and fallback. Otherwise removes only the fallbacks that are equal to the token values.
 *   @param {boolean} [options.addEslintComments] - If true, adds the eslint ignore comment for the rule @atlaskit/design-system/no-unsafe-design-token-usage for the fallbacks that weren't removed.
 *   @param {boolean} [options.useLegacyColorTheme] - If true, uses the legacy theme for color token mapping.
 *   @param {string} [options.reportFolder] - Directory path to output transformation reports. Reports will be generated only if this option is provided.
 *   @param {boolean} [options.dry] - If true, performs a dry run without modifying the files.
 *
 * @returns {Promise<string>} A promise that resolves to the transformed source code as a string.
 */
export default async function transformer(
	fileInfo: FileInfo,
	{ jscodeshift: j }: API,
	options: RemoveTokenFallbackOptions,
): Promise<string> {
	const rootDir = await findRoot(path.dirname(fileInfo.path));
	const source = j(fileInfo.source);

	if (!hasImportDeclaration(j, source, '@atlaskit/tokens')) {
		return fileInfo.source;
	}

	const details: TransformationDetails = {
		replaced: [],
		notReplaced: [],
	};

	if (options.verbose) {
		console.log(
			chalk.yellow(`Using ${options.useLegacyColorTheme ? 'legacy light' : 'light'} theme.`),
		);
	}

	const tokenMap = getTokenMap(options.useLegacyColorTheme ?? false);
	const teamInfo = await getTeamInfo(fileInfo.path);

	const transformPromises = source
		.find(j.CallExpression, {
			callee: {
				type: 'Identifier',
				name: 'token',
			},
		})
		.paths()
		.map((callPath) => {
			const processor = new TokenProcessor(
				j,
				options,
				fileInfo,
				source,
				rootDir,
				details,
				tokenMap,
				teamInfo,
			);
			return processor.processAndLogSingleToken(callPath);
		});
	const results = await Promise.all(transformPromises);

	const unusedVars: ASTPath<VariableDeclarator>[] = [];

	if (results.some((result) => result.fallbackRemoved)) {
		const allImports = results.flatMap((result) => result.resolvedImportDeclaration ?? []);
		const allVars = results.flatMap((result) => result.resolvedLocalVarDeclaration ?? []);
		unusedVars.push(...allVars);

		if (allImports.length) {
			if (options.verbose) {
				console.log(
					chalk.green(
						`${fileInfo.path}: Some fallbacks were removed. Cleaning up ${allImports.length} imports.`,
					),
				);
			}
			removeUnusedImports(allImports, j);
		}
	}

	removeUnusedVariables(unusedVars, j);

	if (options.reportFolder) {
		await writeReports(details, options.reportFolder);
	}

	if (options.dry) {
		if (options.verbose) {
			console.log(chalk.cyan(`${fileInfo.path}: dry run mode active. Source was not modified.`));
		}
		// Return the unmodified source if dryRun is true
		return fileInfo.source;
	} else {
		// Return the transformed source
		return source.toSource();
	}
}

export const parser = 'tsx';

/**
 * Function executed before all transformations to prepare the environment by clearing the report folder.
 */
export async function beforeAll(options: RemoveTokenFallbackOptions): Promise<void> {
	if (options.reportFolder) {
		await clearFolder(options.reportFolder);
	}
}

/**
 * Function executed after all transformations to combine individual file reports into a comprehensive transformation report.
 * It also applies prettier to the affected files.
 */
export async function afterAll(options: RemoveTokenFallbackOptions): Promise<void> {
	if (options.reportFolder) {
		await combineReports(options.reportFolder);
	}

	if (options.reportFolder && !options.dry) {
		try {
			const filesTxtPath = path.join(options.reportFolder, 'files.txt');
			const fileContent = await fs.readFile(filesTxtPath, 'utf-8');
			if (fileContent.length > 0) {
				console.log(`Running prettier on files: ${chalk.magenta(fileContent)}`);
				await execAsync(`yarn prettier --write ${fileContent}`);
				console.log(chalk.green(`Prettier was run successfully`));
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error(chalk.red(`Unexpected error running Prettier: ${error.message}`));
			} else {
				console.error(chalk.red('An unknown error occurred while running Prettier.'));
			}
		}
	}
}

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
import { chunkArray } from './utils/chunk';
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
 *   @param {string} [options.skipTokens] - A comma-separated list of token prefixes to exempt from automatic fallback removal. By default, 'border' tokens are always included in this list. Whether fallbacks for these tokens are removed when they exactly match depends on the preserveSkippedFallbacks option.
 *   @param {boolean} [options.preserveSkippedFallbacks] - If true, fallbacks for skipped tokens will never be removed, even if they exactly match the token value. If false (default), fallbacks for skipped tokens will be removed if they exactly match.
 *   @param {boolean} [options.skipEslint] - If true, skips running ESLint on modified files after transformation.
 *   @param {boolean} [options.skipPrettier] - If true, skips running Prettier on modified files after transformation.
 *   @param {number} [options.colorDifferenceThreshold] - The maximum allowed difference for color tokens to be considered acceptable for removal. Default is 15.
 *   @param {number} [options.spaceDifferenceThreshold] - The maximum allowed percentage difference for space tokens to be considered acceptable for removal. Default is 0.
 *   @param {number} [options.numericDifferenceThreshold] - The maximum allowed percentage difference for numeric tokens to be considered acceptable for removal. Default is 0.
 *   @param {number} [options.borderDifferenceThreshold] - The maximum allowed percentage difference for border tokens to be considered acceptable for removal. Default is 0.
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

		if (options.skipTokens) {
			console.log(chalk.yellow(`Auto fallback exemptions active for: ${options.skipTokens}`));
		}

		if (options.preserveSkippedFallbacks) {
			console.log(
				chalk.yellow(`Preserving all fallbacks for skipped tokens, even if they match exactly.`),
			);
		}

		if (options.skipEslint) {
			console.log(chalk.yellow(`Skipping ESLint post-processing.`));
		}

		if (options.skipPrettier) {
			console.log(chalk.yellow(`Skipping Prettier post-processing.`));
		}

		// Log threshold values if they are set
		if (options.colorDifferenceThreshold !== undefined) {
			console.log(
				chalk.yellow(`Color difference threshold set to: ${options.colorDifferenceThreshold}`),
			);
		}

		if (options.spaceDifferenceThreshold !== undefined) {
			console.log(
				chalk.yellow(`Space difference threshold set to: ${options.spaceDifferenceThreshold}%`),
			);
		}

		if (options.numericDifferenceThreshold !== undefined) {
			console.log(
				chalk.yellow(`Numeric difference threshold set to: ${options.numericDifferenceThreshold}%`),
			);
		}

		if (options.borderDifferenceThreshold !== undefined) {
			console.log(
				chalk.yellow(`Border difference threshold set to: ${options.borderDifferenceThreshold}%`),
			);
		}
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

	if (options.reportFolder) {
		await writeReports(details, options.reportFolder);
	}

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

		if (unusedVars.length) {
			removeUnusedVariables(unusedVars, j);
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
	} else {
		// Return the unmodified source if dryRun is true
		return fileInfo.source;
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
 * It also applies prettier and eslint (to remove dangling suppressions) to the affected files.
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
				const filePaths = fileContent.split(/\r?\n/).filter(Boolean);

				// Get the first file path and strip any quotes
				const firstFilePath = filePaths[0].replace(/^['"]|['"]$/g, '');

				// Determine the root directory using findRoot
				const rootDir = await findRoot(path.dirname(firstFilePath));
				console.log('Root directory:', rootDir);

				await gitStage(filePaths, rootDir);

				if (!options.skipEslint) {
					await runEslint(filePaths, rootDir);
				} else if (options.verbose) {
					console.log(chalk.blue('Skipping ESLint post-processing as requested.'));
				}

				if (!options.skipPrettier) {
					await runPrettier(filePaths, rootDir);
				} else if (options.verbose) {
					console.log(chalk.blue('Skipping Prettier post-processing as requested.'));
				}
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error(chalk.red(`Unexpected error: ${error.message}`));
			} else {
				console.error(chalk.red('An unknown error occurred.'));
			}
		}
	}
}

async function gitStage(filePaths: string[], cwd: string) {
	const gitAddCommand = `git add ${filePaths.join(' ')}`;
	console.log(`Executing command: ${gitAddCommand}`);
	const { stdout: gitAddStdout, stderr: gitAddStderr } = await execAsync(gitAddCommand, { cwd });
	if (gitAddStdout) {
		console.log(chalk.blue(`Git add output:\n${gitAddStdout}`));
	}
	if (gitAddStderr) {
		console.error(chalk.yellow(`Git add errors:\n${gitAddStderr}`));
	}
	console.log(chalk.green(`All changes have been staged.`));
}

async function runPrettier(filePaths: string[], cwd: string) {
	const prettierCommand = `yarn prettier --write ${filePaths.join(' ')}`;
	console.log(`Executing command: ${prettierCommand}`);
	const { stdout: prettierStdout, stderr: prettierStderr } = await execAsync(prettierCommand, {
		cwd,
	});
	if (prettierStdout) {
		console.log(chalk.blue(`Prettier output:\n${prettierStdout}`));
	}
	if (prettierStderr) {
		console.error(chalk.yellow(`Prettier errors:\n${prettierStderr}`));
	}
	console.log(chalk.green(`Prettier was run successfully`));
}

async function runEslint(filePaths: string[], cwd: string) {
	const fileChunks = chunkArray(filePaths, 20);
	const totalChunks = fileChunks.length;

	for (const [chunkIndex, fileChunk] of fileChunks.entries()) {
		const eslintCommand = `yarn eslint ${fileChunk.join(' ')} --report-unused-disable-directives --fix`;
		console.log(
			`Executing command for chunk ${chunkIndex + 1} of ${totalChunks}: ${eslintCommand}`,
		);

		try {
			const result = await execAsync(eslintCommand, { cwd });

			const { stdout, stderr } = result;
			if (stdout) {
				console.log(
					chalk.blue(`ESLint output for chunk ${chunkIndex + 1} of ${totalChunks}:\n${stdout}`),
				);
			}
			if (stderr) {
				console.error(
					chalk.yellow(`ESLint errors for chunk ${chunkIndex + 1} of ${totalChunks}:\n${stderr}`),
				);
			}
		} catch (error: unknown) {
			console.error(
				chalk.red(`Error running ESLint on chunk ${chunkIndex + 1} of ${totalChunks}: ${error}`),
			);

			// Retry each file individually
			console.log(
				chalk.yellow(
					`Retrying each file in chunk ${chunkIndex + 1} of ${totalChunks} individually...`,
				),
			);

			// Chunk the files into smaller groups of 5 for parallel retry
			const smallerChunks = chunkArray(fileChunk, 5);
			const totalSmallerChunks = smallerChunks.length;

			for (const [smallChunkIndex, smallerChunk] of smallerChunks.entries()) {
				await Promise.all(
					smallerChunk.map(async (file) => {
						try {
							const individualEslintCommand = `yarn eslint ${file} --report-unused-disable-directives --fix`;
							console.log(
								`Executing command for file in small chunk ${smallChunkIndex + 1} of ${totalSmallerChunks}: ${individualEslintCommand}`,
							);

							const result = await execAsync(individualEslintCommand, { cwd });

							const { stdout, stderr } = result;
							if (stdout) {
								console.log(
									chalk.blue(
										`ESLint output for file ${file} in small chunk ${smallChunkIndex + 1} of ${totalSmallerChunks}:\n${stdout}`,
									),
								);
							}
							if (stderr) {
								console.error(
									chalk.yellow(
										`ESLint errors for file ${file} in small chunk ${smallChunkIndex + 1} of ${totalSmallerChunks}:\n${stderr}`,
									),
								);
							}
						} catch (fileError: unknown) {
							console.error(
								chalk.red(
									`Error running ESLint on file ${file} in small chunk ${smallChunkIndex + 1} of ${totalSmallerChunks}: ${fileError}`,
								),
							);
						}
					}),
				);
			}
		}

		console.log(
			chalk.green(`Finished running ESLint for chunk ${chunkIndex + 1} of ${totalChunks}.`),
		);
	}

	console.log(chalk.green(`ESLint was run on all files successfully`));
}

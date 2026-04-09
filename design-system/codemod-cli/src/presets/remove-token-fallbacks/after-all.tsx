/* eslint-disable no-console */
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';

import { findRoot } from '@manypkg/find-root';
import chalk from 'chalk';

import { type RemoveTokenFallbackOptions } from './types';
import { chunkArray } from './utils/chunk';
import { combineReports } from './utils/combine-reports';

const execAsync = promisify(exec);

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

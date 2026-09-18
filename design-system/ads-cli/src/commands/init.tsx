import { spawnSync } from 'node:child_process';
import { lstatSync } from 'node:fs';
import path from 'node:path';

import { createErrorEnvelope } from '../envelope/create-error-envelope';
import { createSuccessEnvelope } from '../envelope/create-success-envelope';
import { writeHumanError } from '../output/write-human-error';
import { writeJsonEnvelope } from '../output/write-json-envelope';
import type { Writer } from '../output/writer';
import { ExitCode, type ExitCodeValue } from '../types';
import { CLI_ATLAS_INVOCATION } from './cli-metadata';
import type { CommandInput } from './types';
import {
	AGENTS_FILE_RELATIVE_PATH,
	type AgentsFileResult,
	updateAgentsFile,
} from './update-agents-file';

const SKILL_ENTRYPOINT = 'SKILL.md';
const SKILLS = [
	{
		name: 'atlassian-design-system',
		displayName: 'ADS',
		relativePath: '.agents/skills/atlassian-design-system',
		requiredFiles: [SKILL_ENTRYPOINT],
	},
	{
		name: 'ui-styling-standard',
		displayName: 'UI Styling Standard',
		relativePath: '.agents/skills/ui-styling-standard',
		requiredFiles: [SKILL_ENTRYPOINT],
	},
	{
		name: 'a11y-foundation',
		displayName: 'Accessibility Foundation',
		relativePath: '.agents/skills/a11y-foundation',
		requiredFiles: [SKILL_ENTRYPOINT],
	},
] as const;
const ADS_SKILL = SKILLS[0];
const SKILL_GET_STARTED_RELATIVE_PATH = `${ADS_SKILL.relativePath}/references/get-started.md`;
const GIT_MARKER = '.git';
const SKILLS_INSTALLER_PACKAGE = '@atlassian/skills';
const SKILLS_INSTALLER_UNAVAILABLE_REASON = 'skills-installer-unavailable' as const;
const SKILLS_INSTALLER_UNAVAILABLE_ERROR_CODES = new Set([
	'EACCES',
	'EAI_AGAIN',
	'ECONNREFUSED',
	'ECONNRESET',
	'ENOENT',
	'ENOTFOUND',
	'ETIMEDOUT',
]);

type ProcessRequest = {
	command: string;
	args: string[];
	cwd: string;
	capture: boolean;
};

type ProcessResult = {
	status: number | null;
	stdout: string;
	stderr: string;
	error?: Error & { code?: string };
};

type AtlasPluginStatus = 'installed' | 'already-installed' | 'atlas-cli-unavailable';

type SkillResult =
	| {
			name: (typeof SKILLS)[number]['name'];
			status: 'installed' | 'updated' | 'already-installed';
			path: string;
	  }
	| {
			name: (typeof SKILLS)[number]['name'];
			status: 'not-installed';
			path: string;
			reason: 'not-in-git-repository' | typeof SKILLS_INSTALLER_UNAVAILABLE_REASON;
	  };

type InitResult = {
	projectRoot: string | null;
	skills: SkillResult[];
	agentsMd: AgentsFileResult;
	atlas: {
		status: AtlasPluginStatus;
	};
	nextStep: string | null;
};

const defaultPathExists = (target: string): boolean => {
	try {
		lstatSync(target);
		return true;
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			return false;
		}
		throw error;
	}
};

const defaultRunProcess = ({ command, args, cwd, capture }: ProcessRequest): ProcessResult => {
	const result = spawnSync(command, args, {
		cwd,
		encoding: 'utf8',
		stdio: capture ? 'pipe' : 'inherit',
	});

	return {
		status: result.status,
		stdout: typeof result.stdout === 'string' ? result.stdout : '',
		stderr: typeof result.stderr === 'string' ? result.stderr : '',
		error: result.error,
	};
};

const processFailureMessage = (result: ProcessResult, fallback: string): string => {
	const details = result.stderr.trim() || result.error?.message;
	return details ? `${fallback}: ${details}` : fallback;
};

const isSkillsInstallerUnavailableFailure = (result: ProcessResult): boolean => {
	if (
		result.status === null ||
		(result.error?.code && SKILLS_INSTALLER_UNAVAILABLE_ERROR_CODES.has(result.error.code))
	) {
		return true;
	}

	const details =
		`${result.stdout}\n${result.stderr}\n${result.error?.message ?? ''}`.toLowerCase();
	if (!details.trim()) {
		return true;
	}

	return [
		'401 unauthorized',
		'403 forbidden',
		'404 not found',
		'authentication required',
		'could not resolve',
		'e401',
		'e403',
		'e404',
		'eneedauth',
		'failed to fetch',
		'network error',
		'not in this registry',
		'registry unavailable',
		'unable to authenticate',
		'unable to resolve',
	].some((message) => details.includes(message));
};

const createNotInstalledSkillResults = (
	reason: Extract<SkillResult, { status: 'not-installed' }>['reason'],
): SkillResult[] =>
	SKILLS.map((skillDefinition) => ({
		name: skillDefinition.name,
		status: 'not-installed',
		path: skillDefinition.relativePath,
		reason,
	}));

const findRepositoryRoot = (cwd: string): string | undefined => {
	let current = path.resolve(cwd);
	while (true) {
		if (defaultPathExists(path.join(current, GIT_MARKER))) {
			return current;
		}

		const parent = path.dirname(current);
		if (parent === current) {
			return undefined;
		}
		current = parent;
	}
};

const writeUsageError = ({
	message,
	json,
	writer,
}: {
	message: string;
	json: boolean;
	writer: Writer;
}): ExitCodeValue => {
	if (json) {
		writeJsonEnvelope({
			envelope: createErrorEnvelope({ command: 'init', code: 'USAGE_ERROR', message }),
			writer,
		});
	} else {
		writeHumanError({ message, writer });
		writer.err('Usage: init');
	}
	return ExitCode.UsageError;
};

const validateInput = (input: CommandInput): string | undefined => {
	if (input.positionals.length > 0) {
		return '`init` does not accept positional arguments.';
	}

	const allowedFlags = new Set(['json']);
	const unknownFlag = Object.keys(input.flags).find((flag) => !allowedFlags.has(flag));
	if (unknownFlag) {
		return `Unknown flag "--${unknownFlag}".`;
	}
	return undefined;
};

const writeAgentsFileResult = ({
	result,
	writer,
}: {
	result: AgentsFileResult;
	writer: Writer;
}): void => {
	switch (result.status) {
		case 'created':
			writer.out(`✓ Created ${AGENTS_FILE_RELATIVE_PATH} with ADS setup guidance`);
			return;
		case 'appended':
			writer.out(`✓ Appended ADS setup guidance to ${AGENTS_FILE_RELATIVE_PATH}`);
			return;
		case 'updated':
			writer.out(`✓ Updated ADS setup guidance in ${AGENTS_FILE_RELATIVE_PATH}`);
			return;
		case 'already-current':
			writer.out(`✓ ADS setup guidance already current in ${AGENTS_FILE_RELATIVE_PATH}`);
			return;
		case 'not-written':
			writer.out(
				`– ${AGENTS_FILE_RELATIVE_PATH} not updated because the current directory is not in a Git repository`,
			);
	}
};

export const runInitCommand = async ({
	input,
	json,
	writer,
	invocation,
	cwd,
}: {
	input: CommandInput;
	json: boolean;
	writer: Writer;
	invocation: string;
	cwd: string;
}): Promise<ExitCodeValue> => {
	const usageError = validateInput(input);
	if (usageError) {
		return writeUsageError({ message: usageError, json, writer });
	}

	const projectRoot = findRepositoryRoot(cwd);
	const skills: SkillResult[] = [];
	let agentsMd: AgentsFileResult | undefined;
	const repositorySetupErrors: Error[] = [];

	if (!projectRoot) {
		skills.push(...createNotInstalledSkillResults('not-in-git-repository'));
		if (!json) {
			writer.out(
				'– Repository-local skills not installed because the current directory is not in a Git repository',
			);
		}
		agentsMd = {
			status: 'not-written',
			path: AGENTS_FILE_RELATIVE_PATH,
			reason: 'not-in-git-repository',
		};
		if (!json) {
			writeAgentsFileResult({ result: agentsMd, writer });
		}
	} else {
		const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
		let skillsInstallerUnavailable = false;
		const skillHumanOutput: string[] = [];

		for (const skillDefinition of SKILLS) {
			try {
				const skillPath = path.join(projectRoot, skillDefinition.relativePath);
				const skillEntrypoint = path.join(skillPath, SKILL_ENTRYPOINT);
				const skillPathExists = defaultPathExists(skillPath);
				const skillEntrypointExists = defaultPathExists(skillEntrypoint);
				const isCurrent = skillDefinition.requiredFiles.every((requiredFile) =>
					defaultPathExists(path.join(skillPath, requiredFile)),
				);

				if (skillPathExists && !skillEntrypointExists) {
					throw new Error(
						`Cannot install the ${skillDefinition.displayName} skill because ${skillDefinition.relativePath} already exists without a ${SKILL_ENTRYPOINT}. Move or remove it, then run init again.`,
					);
				}

				let skillResult: SkillResult;
				if (isCurrent) {
					skillResult = {
						name: skillDefinition.name,
						status: 'already-installed',
						path: skillDefinition.relativePath,
					};
				} else {
					const result = defaultRunProcess({
						command: npxCommand,
						args: [
							'--yes',
							SKILLS_INSTALLER_PACKAGE,
							'add',
							skillDefinition.name,
							'--universal',
							'--yes',
						],
						cwd: projectRoot,
						capture: true,
					});
					if (result.status !== 0) {
						if (isSkillsInstallerUnavailableFailure(result)) {
							skillsInstallerUnavailable = true;
							break;
						}
						throw new Error(
							processFailureMessage(
								result,
								`Failed to install the ${skillDefinition.displayName} skill`,
							),
						);
					}

					const missingRequiredFile = skillDefinition.requiredFiles.find(
						(requiredFile) => !defaultPathExists(path.join(skillPath, requiredFile)),
					);
					if (missingRequiredFile) {
						const missingRelativePath = `${skillDefinition.relativePath}/${missingRequiredFile}`;
						throw new Error(
							`The skill installer completed without creating ${missingRelativePath}.`,
						);
					}

					skillResult = {
						name: skillDefinition.name,
						status: skillEntrypointExists ? 'updated' : 'installed',
						path: skillDefinition.relativePath,
					};
				}

				skills.push(skillResult);
				if (!json) {
					const statusMessage =
						skillResult.status === 'already-installed' ? 'already set up' : skillResult.status;
					skillHumanOutput.push(
						`✓ ${skillDefinition.displayName} skill ${statusMessage} at ${skillDefinition.relativePath}`,
					);
				}
			} catch (error) {
				repositorySetupErrors.push(
					error instanceof Error
						? error
						: new Error(`Failed to set up the ${skillDefinition.displayName} skill.`),
				);
			}
		}

		if (skillsInstallerUnavailable) {
			const skillResultsByName = new Map(skills.map((skill) => [skill.name, skill]));
			skills.splice(
				0,
				skills.length,
				...SKILLS.map(
					(skillDefinition): SkillResult =>
						skillResultsByName.get(skillDefinition.name) ?? {
							name: skillDefinition.name,
							status: 'not-installed',
							path: skillDefinition.relativePath,
							reason: SKILLS_INSTALLER_UNAVAILABLE_REASON,
						},
				),
			);
		}

		if (!json) {
			for (const line of skillHumanOutput) {
				writer.out(line);
			}
			if (skillsInstallerUnavailable) {
				writer.out(
					skillHumanOutput.length > 0
						? '– Remaining repository-local skills skipped because @atlassian/skills is unavailable; npx @atlaskit/ads-cli remains available'
						: '– Repository-local skills skipped because @atlassian/skills is unavailable; npx @atlaskit/ads-cli remains available',
				);
			}
		}

		const installedSkills = skills.filter((skill) => skill.status !== 'not-installed');
		const adsSkillInstalled = installedSkills.some((skill) => skill.name === ADS_SKILL.name);
		if (skillsInstallerUnavailable || adsSkillInstalled) {
			try {
				agentsMd = updateAgentsFile({
					projectRoot,
					guidance: adsSkillInstalled
						? {
								mode: 'skills-installed',
								skillEntrypoints: installedSkills.map(
									(skill) => `${skill.path}/${SKILL_ENTRYPOINT}`,
								),
								getStartedPath: SKILL_GET_STARTED_RELATIVE_PATH,
							}
						: { mode: 'public' },
				});
				if (!json) {
					writeAgentsFileResult({ result: agentsMd, writer });
				}
			} catch (error) {
				repositorySetupErrors.push(
					error instanceof Error
						? error
						: new Error('Failed to set up the ADS repository guidance.'),
				);
			}
		}
	}

	const atlasCwd = projectRoot ?? path.resolve(cwd);
	let atlasPluginStatus: AtlasPluginStatus;
	if (invocation === CLI_ATLAS_INVOCATION) {
		atlasPluginStatus = 'already-installed';
		if (!json) {
			writer.out('✓ Atlas CLI ADS plugin already available');
		}
	} else {
		const atlasCheck = defaultRunProcess({
			command: 'atlas',
			args: ['ads', '--help'],
			cwd: atlasCwd,
			capture: true,
		});

		if (atlasCheck.status === 0) {
			atlasPluginStatus = 'already-installed';
			if (!json) {
				writer.out('✓ Atlas CLI ADS plugin already available');
			}
		} else if (atlasCheck.error?.code === 'ENOENT') {
			atlasPluginStatus = 'atlas-cli-unavailable';
			if (!json) {
				writer.out('– Atlas CLI is unavailable; use npx @atlaskit/ads-cli for ADS commands');
			}
		} else {
			const installResult = defaultRunProcess({
				command: 'atlas',
				args: ['plugin', 'install', '--name', 'ads'],
				cwd: atlasCwd,
				capture: json,
			});
			if (installResult.status !== 0) {
				throw new Error(
					processFailureMessage(
						installResult,
						'Failed to install the Atlas CLI ADS plugin. npx @atlaskit/ads-cli remains available',
					),
				);
			}

			const verification = defaultRunProcess({
				command: 'atlas',
				args: ['ads', '--help'],
				cwd: atlasCwd,
				capture: true,
			});
			if (verification.status !== 0) {
				throw new Error(
					'The Atlas CLI ADS plugin was installed but `atlas ads --help` did not succeed. npx @atlaskit/ads-cli remains available.',
				);
			}
			atlasPluginStatus = 'installed';
			if (!json) {
				writer.out('✓ Atlas CLI ADS plugin installed');
			}
		}
	}

	if (repositorySetupErrors.length > 0) {
		throw new Error(repositorySetupErrors.map((error) => error.message).join('\n'));
	}
	// Keep the successful-path invariant explicit so future control-flow changes cannot return a partial result.
	if (skills.length !== SKILLS.length || !agentsMd) {
		throw new Error('Failed to determine the ADS repository setup result.');
	}

	const adsSkillInstalled = skills.some(
		(skill) => skill.name === ADS_SKILL.name && skill.status !== 'not-installed',
	);
	const nextStep = projectRoot && adsSkillInstalled ? SKILL_GET_STARTED_RELATIVE_PATH : null;
	if (!json && nextStep) {
		writer.out(`→ Next: follow ${nextStep} to complete repository setup`);
	}

	const data: InitResult = {
		projectRoot: projectRoot ?? null,
		skills,
		agentsMd,
		atlas: { status: atlasPluginStatus },
		nextStep,
	};

	if (json) {
		writeJsonEnvelope({
			envelope: createSuccessEnvelope({
				envelopeType: 'init',
				command: 'init',
				data,
				meta: {},
			}),
			writer,
		});
	}

	return ExitCode.Ok;
};

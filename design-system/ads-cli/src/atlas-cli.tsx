#!/usr/bin/env node

import { run } from './cli';
import { CLI_ATLAS_INVOCATION } from './commands/cli-metadata';
import { getCommand } from './commands/get-command';
import { createErrorEnvelope } from './envelope/create-error-envelope';
import { getAtlasReleaseVersion } from './get-atlas-release-version';
import { getAtlasVersionPolicy } from './get-atlas-version-policy';
import { isAtlasReleaseOutdated } from './is-atlas-release-outdated';
import { writeHumanError } from './output/write-human-error';
import { writeJsonEnvelope } from './output/write-json-envelope';
import { defaultWriter } from './output/writer';
import { parseArgs } from './parse-args';

/**
 * Process entrypoint for the `atlas ads` distribution.
 *
 * Atlas forwards everything after `atlas ads` as process arguments. The shared CLI owns parsing,
 * output, and its exit-code contract. This entrypoint enforces the Atlas release policy before
 * command dispatch and maps the result onto the plugin process.
 */
export const main = async (argv: string[] = process.argv.slice(2)): Promise<void> => {
	try {
		const { command, flags } = parseArgs(argv);
		const version = getAtlasReleaseVersion();
		if (flags.version === true && version) {
			defaultWriter.out(version);
			process.exitCode = 0;
			return;
		}
		// Match `run()`'s flag semantics exactly: only a bare `--help`/`--version` short-circuits
		// there, so only those may skip the policy check here.
		if (
			version &&
			command &&
			getCommand(command) &&
			flags.help !== true &&
			flags.version !== true
		) {
			// Policy checks are best-effort: even unexpected setup failures must leave ADS usable.
			const policy = await getAtlasVersionPolicy().catch(() => undefined);
			if (policy?.enabled && isAtlasReleaseOutdated(version, policy.minimumVersion)) {
				const message =
					`ADS Atlas plugin ${version} is older than the minimum supported release ${policy.minimumVersion}. ` +
					'Run `atlas plugin upgrade --name ads --channel stable`, then retry your command.';
				if (flags.json === true) {
					writeJsonEnvelope({
						envelope: createErrorEnvelope({ command, code: 'UPGRADE_REQUIRED', message }),
						writer: defaultWriter,
					});
				} else {
					writeHumanError({ message, writer: defaultWriter });
				}
				process.exitCode = 1;
				return;
			}
			if (policy?.enabled && isAtlasReleaseOutdated(version, policy.recommendedVersion)) {
				// Diagnostics belong on stderr, leaving successful JSON/data output unchanged.
				defaultWriter.err(
					`Warning: ADS Atlas plugin ${version} is behind the latest stable release ${policy.recommendedVersion}. ` +
						'Run `atlas plugin upgrade --name ads --channel stable` to update.',
				);
			}
		}
		const exitCode = await run(argv, undefined, { invocation: CLI_ATLAS_INVOCATION });
		process.exitCode = exitCode;
	} catch (error) {
		if (typeof error === 'number') {
			process.exitCode = error;
			return;
		}

		process.stderr.write(
			`${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`,
		);
		process.exitCode = 1;
	}
};

if (require.main === module) {
	void main();
}

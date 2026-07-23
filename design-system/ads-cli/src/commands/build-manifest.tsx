/**
 * Build machine-readable metadata for the ADS CLI.
 *
 * The manifest is projected from the same command definitions used for dispatch and help, so it
 * does not duplicate the runnable command surface.
 */

import { CLI_BIN_NAME, CLI_DESCRIPTION, CLI_NAME, globalFlags } from './cli-metadata';
import type { CommandDefinition, CommandFlag } from './types';

export type ManifestCommand = Pick<
	CommandDefinition,
	'name' | 'description' | 'usage' | 'arguments' | 'flags' | 'examples' | 'responseTypes'
> & {
	jsonSupported: true;
};

export type Manifest = {
	schemaVersion: 1;
	name: typeof CLI_NAME;
	bin: typeof CLI_BIN_NAME;
	version: string;
	description: string;
	invocation: string;
	commands: ManifestCommand[];
	globalFlags: CommandFlag[];
	errorResponseType: 'ads-cli/error';
};

/**
 * Build a serializable capability manifest from the live command registry.
 */
export const buildManifest = (commands: CommandDefinition[], version: string): Manifest => ({
	schemaVersion: 1,
	name: CLI_NAME,
	bin: CLI_BIN_NAME,
	version,
	description: CLI_DESCRIPTION,
	invocation: `npx ${CLI_NAME}`,
	commands: commands.map(
		({
			name,
			description,
			usage,
			arguments: commandArguments,
			flags,
			examples,
			responseTypes,
		}) => ({
			name,
			description,
			usage,
			arguments: commandArguments,
			flags,
			examples,
			jsonSupported: true,
			responseTypes,
		}),
	),
	globalFlags,
	errorResponseType: 'ads-cli/error',
});

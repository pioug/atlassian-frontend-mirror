/**
 * Shared top-level ADS CLI metadata used by help and the capability manifest.
 */

import type { CommandFlag } from './types';

export const CLI_NAME = '@atlaskit/ads-cli';
export const CLI_BIN_NAME = 'ads-cli';
export const CLI_DESCRIPTION =
	'Query Atlassian Design System (ADS) structured content — components, tokens, icons, and guidelines — from the terminal.';

export const globalFlags: CommandFlag[] = [
	{
		name: 'json',
		type: 'boolean',
		default: false,
		description: 'Emit a machine-readable JSON envelope on stdout.',
	},
	{
		name: 'help',
		type: 'boolean',
		alias: 'h',
		default: false,
		description: 'Show help.',
	},
	{
		name: 'version',
		type: 'boolean',
		alias: 'v',
		default: false,
		description: 'Show the CLI version.',
	},
];

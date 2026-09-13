/// <reference lib="es2017.object" />

import chalk from 'chalk';
import meow from 'meow';
import { populateProduct, populatePackage } from './commands/populate-historic-data';
import type { UpgradeEvent } from './types';

// prettier-ignore
const HELP_MSG = `
${chalk.green('Global options')}
     ${chalk.yellow('--dev')}            Send analytics to dev analytics pipeline instead of prod
     ${chalk.yellow('--dryRun')}         Performs a dry run, prints analytics events to console in JSON format instead of sending them
     ${chalk.yellow('--limit')}          Limit the number of events sent, used for validation purposes
     ${chalk.yellow('--no-interactive')} Disable any interactive prompts
     ${chalk.yellow('--include-restricted-scopes')}    Include analytics for @atlassian and @atlassiansox scoped packages as well

${chalk.yellow.bold('[populate-product] <product>')}
   Sends analytics events for atlaskit dependency versions changes in package.json.

   Detects changes since the last time the tool was run by storing the last run in either statlas (--statlas flag) or using the
   'atlaskit-dependency-version-analytics-last-run' git tag.
   If running the tool for the first time (last run does not exist), --reset must be used to detect changes since the beginning of the repo.

   ${chalk.green('Options')}
     ${chalk.yellow('--csv')}         Prints dependency history in CSV format
     ${chalk.yellow('--reset')}       Reset change detection to detect changes from the beginning of time
     ${chalk.yellow('--tag')}         Specify a different tag to mark when the tool was last run
     ${chalk.yellow('--statlas')}     Use statlas rather than git tags for storing and sourcing last run info
     ${chalk.yellow('--supported-packages')}     List of supported packages in JSON format

   ${chalk.green('Examples')}
     ${chalk.dim('$ atlaskit-version-analytics populate-product jira')}

${chalk.yellow.bold('[populate-package] <package>')}
   Sends analytics events for published versions of the specified package.

   ${chalk.green('Options')}
     ${chalk.yellow('--since')}       Only publish versions since the following JS date string (exclusive)

   ${chalk.green('Examples')}
     ${chalk.dim('$ atlaskit-version-analytics populate-package @atlaskit/button')}
`;

export function run({ dev }: { dev: boolean }): Promise<void> | Promise<UpgradeEvent[]> {
	const cli = meow(HELP_MSG, {
		flags: {
			csv: {
				type: 'boolean',
			},
			dev: {
				type: 'boolean',
			},
			dryRun: {
				type: 'boolean',
				alias: 'd',
			},
			reset: {
				type: 'boolean',
			},
			limit: {
				type: 'string',
			},
			interactive: {
				type: 'boolean',
				default: true,
			},
			since: {
				type: 'string',
			},
			tag: {
				type: 'string',
			},
			statlas: {
				type: 'boolean',
			},
			includeRestrictedScopes: {
				type: 'boolean',
			},
			supportedPackages: {
				type: 'string',
			},
		},
	});

	const [command, ...inputs] = cli.input;

	const limit = cli.flags.limit != null ? +cli.flags.limit : undefined;

	if (command === 'populate-product') {
		const product = inputs[0];
		if (!product) {
			console.error(chalk.red('Must pass a product parameter'));
			process.exit(1);
		}

		return populateProduct({
			csv: cli.flags.csv || false,
			dev: dev || cli.flags.dev || false,
			dryRun: cli.flags.dryRun || false,
			interactive: cli.flags.interactive,
			limit,
			product,
			reset: cli.flags.reset || false,
			statlas: cli.flags.statlas,
			tag: cli.flags.tag,
			includeRestrictedScopes: cli.flags.includeRestrictedScopes || false,
			supportedPackages: cli.flags.supportedPackages,
		});
	} else if (command === 'populate-package') {
		const pkg = inputs[0];
		if (!pkg) {
			console.error(chalk.red('Must pass a package parameter'));
			process.exit(1);
		}
		return populatePackage({
			dev: dev || cli.flags.dev || false,
			dryRun: cli.flags.dryRun || false,
			interactive: cli.flags.interactive,
			limit,
			pkg,
			since: cli.flags.since,
			includeRestrictedScopes: cli.flags.includeRestrictedScopes || false,
		});
	}

	/* eslint-disable no-console */
	return Promise.resolve(console.log(cli.help));
}

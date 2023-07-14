import meow from 'meow';
import { CliFlags, ValidationError, NoTransformsExistError } from './types';
import main from './main';
import chalk from 'chalk';

export async function run() {
  const cli = meow(
    `
Usage
  $ npx @atlaskit/codemod-cli [options] <file-paths>...

Options
  --preset, -n select transform by preset name, avoid user interaction
  --transform, -t the transform to run, will prompt for a transform if not provided and no module is passed
  --since-ref, runs transforms for all packages that have been upgraded since the specified git ref
  --packages, runs transforms for the specified comma separated list of packages, optionally include a version for each package to run all transforms since that version
  --parser, -p babel|babylon|flow|ts|tsx parser to use for parsing the source files (default: babel)
  --extensions, -e transform files with these file extensions (comma separated list) (default: js)
  --ignore-pattern, ignore files that match a provided glob expression
  --fail-on-error, return a 1 exit code when errors were found during execution of codemods
  --version, -v version number
  --no-filter-paths disables dependant package file path filtering logic   
  --help Help me 😱

Examples
  # Run a codemod over the /project/src directory, will be prompted for which codemod to run
  $ npx @atlaskit/codemod-cli /project/src

  # Run the "4.0.0-remove-appearance-prop" transform of the "button" package
  $ npx @atlaskit/codemod-cli -t button@4.0.0-remove-appearance-prop /project/src

  # Run all transforms for "@atlaskit/button" greater than version 3.0.0 and @atlaskit/range greater than 4.0.0
  $ npx @atlaskit/codemod-cli --packages @atlaskit/button@3.0.0,@atlaskit/range@4.0.0 /project/src
`,
    {
      flags: {
        transform: {
          type: 'string',
          alias: 't',
        },
        preset: {
          type: 'string',
          alias: 'n',
        },
        packages: {
          type: 'string',
        },
        parser: {
          type: 'string',
          alias: 'p',
        },
        extensions: {
          type: 'string',
          alias: 'e',
        },
        ignorePattern: {
          type: 'string',
        },
        sinceRef: {
          type: 'string',
        },
        failOnError: {
          type: 'boolean',
        },
        filterPaths: {
          type: 'boolean',
          default: true,
        },
      },
    },
  );

  main(cli.input, cli.flags as CliFlags).catch((e) => {
    if (e instanceof ValidationError) {
      // eslint-disable-next-line no-console
      console.error(cli.help);
      // eslint-disable-next-line no-console
      console.error(chalk.red(e.message));
      process.exit(1);
    } else if (e instanceof NoTransformsExistError) {
      // eslint-disable-next-line no-console
      console.warn(chalk.yellow(e.message));
      process.exit(0);
    } else {
      // eslint-disable-next-line no-console
      console.error(chalk.red(e));
      process.exit(3);
    }
  });
}

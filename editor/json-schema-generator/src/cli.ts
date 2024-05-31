import meow from 'meow';
import app from './';

const cli = meow(
	`
  Usage
    $ json-schema-generator --outDir [...] <input>

  Options
    --outDir -o   Output directory
    --mode -m     Output modes: JSON or Spec. Default: JSON
    --stage       Include stage n nodes/marks/attributes

  Examples
    $ json-schema-generator --outDir=output/dir path/to/ts-definitions
    $ json-schema-generator --outDir=output/dir --stage=0 path/to/ts-definitions
    $ json-schema-generator --mode=Spec --outDir=output/dir path/to/ts-definitions
`,
	{
		flags: {
			mode: {
				type: 'string',
				alias: 'm',
				default: 'JSON',
			},
			outDir: {
				type: 'string',
				alias: 'o',
			},
			stage: {
				type: 'string',
			},
		},
	},
);

const { input, flags } = cli;

if (input.length === 0 && process.stdin.isTTY) {
	// eslint-disable-next-line no-console
	console.error('Input required');
	process.exit(1);
}

// meow doesn't support required as of now
// https://github.com/sindresorhus/meow/issues/51
if (!flags.outDir) {
	cli.showHelp();
}

app(input, flags)
	.then(() => process.exit(0))
	.catch((err) => {
		// eslint-disable-next-line no-console
		console.error(err);
		process.exit(1);
	});

import { type API, type FileInfo, type Options } from 'jscodeshift';

import { applyTransform } from '@hypermod/utils';
import * as prettier from 'prettier';
import * as parserTypeScript from 'prettier/plugins/typescript';
import * as prettierPluginEstree from 'prettier/plugins/estree';

type Transformer = (file: FileInfo, jscodeshift: API, options: Options) => void;

type TestArgs = {
	it: string;
	original: string;
	expected: string;
	transformer?: Transformer;
	mode?: 'only' | 'skip' | 'standard';
	before?: () => void;
	after?: () => void;
};

async function format(value: string): Promise<string> {
	const formatted = await prettier.format(value, {
		semi: true,
		printWidth: 100,
		tabWidth: 4,
		useTabs: false,
		singleQuote: true,
		trailingComma: 'all',
		bracketSpacing: true,
		bracketSameLine: false,
		proseWrap: 'always',
		parser: 'typescript',
		plugins: [parserTypeScript, prettierPluginEstree],
	});
	return formatted;
}

export function createCheck(transformer: Transformer) {
	return function check({
		it: name,
		original,
		expected,
		transformer: transformerOverride,
		before = () => {},
		after = () => {},
		mode = 'standard',
	}: TestArgs) {
		const run = mode === 'only' ? it.only : mode === 'skip' ? it.skip : it;

		run(name, async () => {
			before();
			try {
				const output: string = await applyTransform(transformerOverride || transformer, original, {
					parser: 'tsx',
				});
				expect(await format(output)).toEqual(await format(expected));
			} catch (e) {
				// a failed assertion will throw
				after();
				throw e;
			}
			// will only be hit if we don't throw
			after();
		});
	};
}

/* eslint-disable no-console */
export async function withMockedConsoleWarn(fn: any) {
	const originalWarn = console.warn;
	const warn = jest.fn();
	console.warn = warn;

	await fn(warn);

	console.warn = originalWarn;
}
/* eslint-enable no-console */

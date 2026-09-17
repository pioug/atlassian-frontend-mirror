import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { typescriptEslintTester } from '../../__tests__/utils/_ts-tester';
import rule from '../index';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'volt-third-party-'));
const filename = path.join(root, 'src', 'adapter.ts');
for (const name of ['upstream', '@vendor/upstream', 'workspace-copy']) {
	const directory = path.join(root, 'node_modules', name);
	fs.mkdirSync(directory, { recursive: true });
	fs.writeFileSync(path.join(directory, 'package.json'), JSON.stringify({ name }));
}
fs.writeFileSync(
	path.join(root, 'package.json'),
	JSON.stringify({
		name: 'adapter',
		dependencies: { 'workspace-copy': 'workspace:^' },
	}),
);
const workspace = path.join(root, 'packages', 'local');
fs.mkdirSync(workspace, { recursive: true });
fs.writeFileSync(path.join(workspace, 'package.json'), JSON.stringify({ name: 'local' }));
fs.symlinkSync(workspace, path.join(root, 'node_modules', 'local'), 'dir');
const malformed = path.join(root, 'node_modules', 'malformed');
fs.mkdirSync(malformed);
fs.writeFileSync(path.join(malformed, 'package.json'), '{');
afterAll(() => fs.rmSync(root, { recursive: true, force: true }));

typescriptEslintTester.run(
	'no-re-exports third-party boundary',
	// @ts-expect-error — RuleTester accepts our rule module shape
	rule,
	{
		valid: [
			`export { Transform, StepMap as Map } from 'upstream';`,
			`export { Transform } from '@vendor/upstream/transform';`,
			`export * from 'upstream';`,
			`export * as transform from 'upstream';`,
			`import { Transform } from 'upstream'; export { Transform }; export function local() {}`,
			`import Transform from 'upstream'; export default Transform; export function local() {}`,
		].map((code) => ({ filename, code })),
		invalid: [
			`export { Transform } from './local';`,
			`export { Transform } from 'local';`,
			`export { Transform } from 'workspace-copy';`,
			`export { Transform } from 'missing';`,
			`export { Transform } from 'malformed';`,
			`export { Transform } from '#alias';`,
			`export { Transform } from 'upstream/../local';`,
			`export * from 'local';`,
			`import { Transform } from 'local'; export { Transform }; export function local() {}`,
			`export { Transform } from 'upstream'; export { Step } from './override';`,
		].map((code) => ({ filename, code, errors: [{ messageId: 'no-re-exports' }] })),
	},
);

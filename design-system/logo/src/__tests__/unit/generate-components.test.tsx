import os from 'os';
import path from 'path';

import fs from 'fs-extra';

import generateComponents from '../../../build/generators/generate-components';

jest.mock('../../logo-docs-schema', () => ({
	logoDocsSchema: [
		{ name: 'jira', type: 'migration', category: 'app' },
		{ name: 'home', type: 'new', category: 'app', deprecated: false },
		{ name: 'confluence', type: 'migration', category: 'app', deprecated: true },
	],
}));

const componentTypes = ['icon', 'logo', 'logo-cs'] as const;

let root: string;

beforeAll(() => {
	root = fs.mkdtempSync(path.join(os.tmpdir(), 'logo-deprecation-'));
	for (const type of componentTypes) {
		for (const name of ['jira', 'home', 'confluence']) {
			fs.outputFileSync(
				path.join(root, 'raw', type, `${name}.svg`),
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" /></svg>',
			);
		}
	}
	generateComponents(root, 'raw', 'generated');
});

afterAll(() => {
	fs.removeSync(root);
});

describe('generated component deprecations', () => {
	it.each(componentTypes)('preserves explicit deprecation for %s', (type) => {
		const source = fs.readFileSync(
			path.join(root, 'src/generated/confluence', `${type}.tsx`),
			'utf8',
		);

		expect(source).toContain('@deprecated');
		expect(source).not.toContain('Import `');
	});

	it.each(componentTypes)(
		'does not deprecate a migration %s without explicit deprecation',
		(type) => {
			const source = fs.readFileSync(path.join(root, 'src/generated/jira', `${type}.tsx`), 'utf8');

			expect(source).not.toContain('@deprecated');
		},
	);

	it.each(componentTypes)('does not deprecate %s when deprecated is false', (type) => {
		const source = fs.readFileSync(path.join(root, 'src/generated/home', `${type}.tsx`), 'utf8');

		expect(source).not.toContain('@deprecated');
	});
});

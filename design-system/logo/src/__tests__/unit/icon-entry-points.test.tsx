import path from 'path';

import fs from 'fs-extra';

import packageJson from '../../../package.json';

const packageRoot = path.resolve(__dirname, '../../..');

describe('supported icon entry points', () => {
	it.each([
		['./jira/icon', 'JiraIcon'],
		['./jira-icon', 'JiraIcon'],
		['./confluence/icon', 'ConfluenceIcon'],
		['./bitbucket/icon', 'BitbucketIcon'],
		['./home/icon', 'HomeIcon'],
	] as const)('%s exposes a supported named export', (entryPoint, componentName) => {
		const source = fs.readFileSync(
			path.resolve(packageRoot, packageJson.exports[entryPoint]),
			'utf8',
		);

		expect(source).toContain(`export function ${componentName}(`);
		expect(source).not.toContain('@deprecated');
		expect(source).not.toContain('from `@atlaskit/logo`');
		expect(source).not.toContain('in `@atlaskit/logo`');
	});
});

import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

const code = (pkg: object) => `module.exports = ${JSON.stringify(pkg, null, '\t')};`;

jest.mock(`${process.cwd()}/package.json`, () => ({
	dependencies: {
		react: '^18.2.0',
		'react-dom': '^18.2.0',
	},
}), { virtual: true });

describe('ensure-react-peer-deps-in-dev-deps', () => {
	tester.run('ensure-react-peer-deps-in-dev-deps', rule, {
		valid: [
			{
				code: code({
					dependencies: {
						react: 'root:*',
						'react-dom': 'root:*',
					},
					peerDependencies: {
						react: '^18.2.0 || ^19.0.0',
						'react-dom': '^18.2.0 || ^19.0.0',
					},
				}),
			},
			{
				code: code({
					peerDependencies: {
						react: '^18.2.0 || ^19.0.0',
						'react-dom': '~18.2.0 || ^19.0.0',
						'react-intl': '^5.25.1 || ^6.0.0 || ^7.0.0',
					},
					devDependencies: {
						react: '^19.0.0',
						'react-dom': '^19.0.0',
					},
				}),
			},
			{
				code: code({
					peerDependencies: {
						react: '~18.2.0',
						'react-dom': '^18.2.0',
					},
					devDependencies: {
						react: 'root:*',
						'react-dom': 'root:*',
					},
				}),
			},
			{
				code: code({
					peerDependencies: {
						react: '*',
						'react-dom': '*',
					},
					devDependencies: {
						react: 'root:*',
						'react-dom': 'root:*',
					},
				}),
			},
		],
		invalid: [
			{
				code: code({
					peerDependencies: {
						react: '^18.2.0 || ^19.0.0',
						'react-dom': '^18.2.0',
						'react-intl': '^5.25.1 || ^6.0.0 || ^7.0.0',
					},
					devDependencies: {
						react: '^18.2.0',
					},
				}),
				output: code({
					peerDependencies: {
						react: '^18.2.0 || ^19.0.0',
						'react-dom': '^18.2.0',
						'react-intl': '^5.25.1 || ^6.0.0 || ^7.0.0',
					},
					devDependencies: {
						react: '^19.0.0',
						'react-dom': 'root:*',
					},
				}),
				errors: [
					{
						messageId: 'invalidPeerDevDependency',
					},
				],
			},
		],
	});
});

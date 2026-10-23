import { resolveInvocation } from '../invocation';

describe.each([
	['ADS', 'npx @atlaskit/ads-cli', 'ADS_CLI_DISPLAY_INVOCATION'],
	['Platform', 'npx @atlassian/platform-cli', 'PLATFORM_CLI_DISPLAY_INVOCATION'],
])('%s CLI invocation', (_name, publishedInvocation, environmentVariable) => {
	const options = {
		argv1: '/repo/node_modules/.bin/cli',
		isDev: true,
		publishedInvocation,
		environmentVariable,
	};

	it('uses npx when npm exec resolves a local source package', () => {
		expect(resolveInvocation({ ...options, environment: { npm_command: 'exec' } })).toBe(
			publishedInvocation,
		);
	});

	it('keeps the direct source command outside npm exec', () => {
		expect(resolveInvocation({ ...options, environment: {} })).toBe(
			'node /repo/node_modules/.bin/cli',
		);
		expect(resolveInvocation({ ...options, environment: { npm_command: 'run-script' } })).toBe(
			'node /repo/node_modules/.bin/cli',
		);
	});

	it('quotes direct source paths containing spaces', () => {
		expect(resolveInvocation({ ...options, argv1: '/my repo/cli.js', environment: {} })).toBe(
			'node "/my repo/cli.js"',
		);
	});

	it('uses npx for installed packages', () => {
		expect(resolveInvocation({ ...options, isDev: false, environment: {} })).toBe(
			publishedInvocation,
		);
	});

	it('honours display overrides ahead of npm exec detection', () => {
		expect(
			resolveInvocation({
				...options,
				environment: { npm_command: 'exec', [environmentVariable]: 'custom-cli' },
			}),
		).toBe('custom-cli');
		expect(
			resolveInvocation({
				...options,
				environment: {
					npm_command: 'exec',
					[environmentVariable]: 'custom-cli',
					ATLASSIAN_CLI_DISPLAY_INVOCATION: 'wrapper-cli',
				},
			}),
		).toBe('wrapper-cli');
	});
});

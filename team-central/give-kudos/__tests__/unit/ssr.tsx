import { hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

// @ts-ignore
jest.spyOn(global.console, 'error').mockImplementation(() => {});

afterEach(() => {
	jest.resetAllMocks();
});

// A list of warnings that's safe to ignore during ssr
type IgnoredWarningPredicate = (call: string[]) => boolean;

const IgnoredWarnings: IgnoredWarningPredicate[] = [
	([_1, _2]) =>
		_1 === 'Warning: Did not expect server HTML to contain a <%s> in <%s>.%s' && _2 === 'style',
	([_1]) => _1.startsWith('Warning: useLayoutEffect does nothing on the server,'),
];

test('should ssr then hydrate example component correctly', async () => {
	const examplePath = require.resolve('../../examples/01-giveKudosLauncher');
	const elem = document.createElement('div');
	const { html, styles } = await ssr(examplePath);

	elem.innerHTML = html;

	await hydrateWithAct(examplePath, elem, styles);

	// ignore warnings caused by emotion's server-side rendering approach
	// @ts-ignore
	// eslint-disable-next-line no-console
	const mockCalls = console.error.mock.calls.filter((call) =>
		IgnoredWarnings.every((p) => !p(call)),
	);
	expect(mockCalls.length).toBe(0);
});

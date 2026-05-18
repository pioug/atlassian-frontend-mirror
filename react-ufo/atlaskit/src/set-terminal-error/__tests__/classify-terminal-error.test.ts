import { classifyTerminalError } from '../classify-terminal-error';

function makeError(name: string, message: string = ''): Error {
	const err = new Error(message);
	err.name = name;
	return err;
}

function makeWrappedError(outerMessage: string, causeName: string, causeMessage: string): Error {
	const cause = makeError(causeName, causeMessage);
	const outer = new Error(outerMessage);
	Object.defineProperty(outer, 'cause', { value: cause });
	return outer;
}

describe('classifyTerminalError', () => {
	it.each([
		['AbortError', 'The operation was aborted'],
		['Error', 'The operation was aborted'],
		['AuthError', 'auth_window_closed'],
	])('classifies %s / "%s" as abort', (name, message) => {
		expect(classifyTerminalError(makeError(name, message))).toBe('abort');
	});

	it.each([
		['AuthError', 'server_error'],
		['AuthError', 'unauthorized_client'],
	])('classifies %s / "%s" as auth', (name, message) => {
		expect(classifyTerminalError(makeError(name, message))).toBe('auth');
	});

	it.each([
		['ChunkLoadError', 'Loading chunk 42 failed'],
		['Error', 'Unable to fetch manifest: app.json'],
		['Error', 'Failed to fetch dynamically imported module: /static/chunk.js'],
		['Error', 'Importing a module script failed'],
	])('classifies %s / "%s" as chunk-load', (name, message) => {
		expect(classifyTerminalError(makeError(name, message))).toBe('chunk-load');
	});

	it.each([
		['TypeError', 'Failed to fetch'],
		['TypeError', 'Load failed'],
		['NetworkError', 'A network error occurred'],
		['Network error', ''],
		['Error', 'The network connection was lost'],
		['Error', 'The request timed out'],
		['Error', 'CloseEvent: Ping timeout'],
	])('classifies %s / "%s" as network-client', (name, message) => {
		expect(classifyTerminalError(makeError(name, message))).toBe('network-client');
	});

	it.each([
		['SyntaxError', 'Unexpected token \'<\', "<!DOCTYPE "... is not valid JSON'],
		['SyntaxError', 'Unexpected token < in JSON at position 0'],
		['SyntaxError', 'JSON.parse: unexpected character at line 1 column 1 of the JSON data'],
		['SyntaxError', 'Unexpected end of JSON input'],
		['Error', 'cannot parse response'],
	])('classifies %s / "%s" as network-server', (name, message) => {
		expect(classifyTerminalError(makeError(name, message))).toBe('network-server');
	});

	it.each([
		['TypeError', 'Cannot read properties of undefined'],
		['ReferenceError', 'foo is not defined'],
	])('classifies %s / "%s" as product', (name, message) => {
		expect(classifyTerminalError(makeError(name, message))).toBe('product');
	});

	it('defaults to product for unrecognised errors', () => {
		expect(classifyTerminalError(new Error())).toBe('product');
	});

	it('checks error.cause when the top-level error does not match', () => {
		const wrapped = makeWrappedError('Something failed', 'TypeError', 'Failed to fetch');
		expect(classifyTerminalError(wrapped)).toBe('network-client');
	});

	it('prefers top-level match over cause match', () => {
		const wrapped = makeWrappedError('The operation was aborted', 'TypeError', 'Failed to fetch');
		expect(classifyTerminalError(wrapped)).toBe('abort');
	});

	it('prefers abort over auth for user-dismissed AuthErrors', () => {
		expect(classifyTerminalError(makeError('AuthError', 'auth_window_closed'))).toBe('abort');
	});

	it('classifies access_denied as abort only when name is AuthError', () => {
		expect(classifyTerminalError(makeError('AuthError', 'access_denied'))).toBe('abort');
	});

	it('does not classify access_denied as abort when name is not AuthError', () => {
		// e.g. a 403 response body containing "access_denied"
		expect(classifyTerminalError(makeError('Error', 'Policy check: access_denied'))).toBe('product');
	});
});

import { normalizeBatchRequest } from '../commands/normalize-batch-request';

describe('normalizeBatchRequest', () => {
	it('leaves canonical tokenized argv unchanged', () => {
		expect(normalizeBatchRequest(['search', 'Grid', '--type', 'component'])).toEqual({
			argv: ['search', 'Grid', '--type', 'component'],
		});
	});

	it('normalizes a complete request in the first token and appends trailing argv', () => {
		expect(normalizeBatchRequest(['search Grid', '--type', 'component'])).toEqual({
			argv: ['search', 'Grid', '--type', 'component'],
		});
	});

	it('preserves a tokenized multi-word argument', () => {
		expect(normalizeBatchRequest(['component', 'Inline Dialog'])).toEqual({
			argv: ['component', 'Inline Dialog'],
		});
	});

	it('supports inner quoting in a complete request', () => {
		expect(normalizeBatchRequest(['component "Inline Dialog"'])).toEqual({
			argv: ['component', 'Inline Dialog'],
		});
	});

	it('supports escaped whitespace and empty quoted arguments', () => {
		expect(normalizeBatchRequest(['search Inline\\ Dialog ""'])).toEqual({
			argv: ['search', 'Inline Dialog', ''],
		});
	});

	it.each([
		['search Grid | cat', 'the `|` operator'],
		['search Grid > output.txt', 'the `>` operator'],
		['search $QUERY', 'environment expansion'],
		['search $(whoami)', 'command substitution'],
		['search `whoami`', 'command substitution'],
		['search Grid && echo nope', 'the `&&` operator'],
	])('rejects unsafe shell syntax in %p', (request, expectedError) => {
		expect(normalizeBatchRequest([request])).toEqual({
			error: expect.stringContaining(expectedError),
		});
	});

	it('rejects shell syntax in an already-tokenized request', () => {
		expect(normalizeBatchRequest(['search', 'Grid', '|', 'cat'])).toEqual({
			error: expect.stringContaining('the `|` operator'),
		});
	});

	it.each([
		['component "Inline Dialog', 'unterminated " quote'],
		['component Inline\\', 'ends with an escape character'],
	])('rejects malformed complete input in %p', (request, expectedError) => {
		expect(normalizeBatchRequest([request])).toEqual({
			error: expect.stringContaining(expectedError),
		});
	});
});

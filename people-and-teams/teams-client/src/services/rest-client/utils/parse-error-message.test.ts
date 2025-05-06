import { parseErrorMessage } from './parse-error-message';

describe('parseErrorMessage function', () => {
	it('should return the text of the response if it cannot be parsed as JSON', async () => {
		const mockResponse = new Response('Not JSON');
		const errorMessage = await parseErrorMessage(mockResponse);
		expect(errorMessage).toEqual('Not JSON');
	});

	it('should return joined error messages if the response contains errors', async () => {
		const mockResponse = new Response(
			JSON.stringify({
				errors: [
					'Error 1',
					{ code: 'Error 2', message: 'Error 2 message' },
					{ message: 'Error 3 message' },
					{ code: 'Error 4' },
					{},
				],
			}),
		);
		const errorMessage = await parseErrorMessage(mockResponse);
		expect(errorMessage).toEqual(
			'Error 1\n - Error 2\n - Error 3 message\n - Error 4\n - MISSING_ERROR_MESSAGE',
		);
	});

	it('should return the stringified JSON (minus the timestamp) if the response does not contain errors', async () => {
		const mockResponse = new Response(
			JSON.stringify({
				timestamp: '2022-03-01T00:00:00Z',
				someField: 'Some value',
			}),
		);
		const errorMessage = await parseErrorMessage(mockResponse);
		expect(errorMessage).toEqual(JSON.stringify({ someField: 'Some value' }));
	});

	it('should return the error message if the response contains a single error', async () => {
		const mockResponse = new Response(
			JSON.stringify({
				error: 'Single error message',
			}),
		);
		const errorMessage = await parseErrorMessage(mockResponse);
		expect(errorMessage).toEqual('UNKNOWN_STATUS Single error message');
	});

	it('should return the error status and error if the error is an object', async () => {
		const mockResponse = new Response(
			JSON.stringify({
				status: 599,
				error: 'Error message',
			}),
		);
		const errorMessage = await parseErrorMessage(mockResponse);
		expect(errorMessage).toEqual('599 Error message');
	});

	it('should return "MISSING_ERROR_MESSAGE" if the error message is missing', async () => {
		const mockResponse = new Response(
			JSON.stringify({
				status: 599,
			}),
		);
		const errorMessage = await parseErrorMessage(mockResponse);
		expect(errorMessage).toEqual('599 MISSING_ERROR_MESSAGE');
	});

	it('should return the object ', async () => {
		const mockResponse = new Response(
			JSON.stringify({
				weird: 'error object',
			}),
		);
		const errorMessage = await parseErrorMessage(mockResponse);
		expect(errorMessage).toEqual(
			JSON.stringify({
				weird: 'error object',
			}),
		);
	});
});

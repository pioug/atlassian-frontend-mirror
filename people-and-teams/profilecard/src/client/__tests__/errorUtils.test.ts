import { AGGErrors, DirectoryGraphQLErrors } from '../../util/errors';
import { getErrorAttributes } from '../errorUtils';

describe('getErrorAttributes', () => {
	it('should handle DirectoryGraphQLErrors', () => {
		const errors = new DirectoryGraphQLErrors(
			[
				{
					message: 'message1',
					category: 'NotFound',
					type: 'type1',
					extensions: { errorNumber: 1 },
				},
				{
					message: 'message2',
					category: 'NotPermitted',
					type: 'Gone',
					extensions: { errorNumber: 2 },
					path: ['path', 'two'],
				},
			],
			'123',
		);

		const attrs = getErrorAttributes(errors);

		expect(attrs).toEqual({
			errorMessage: 'DirectoryGraphQLErrors',
			errorCount: 2,
			errorDetails: [
				{
					errorMessage: 'message1',
					errorCategory: 'NotFound',
					errorPath: '',
					errorType: 'type1',
					errorNumber: 1,
					isSLOFailure: true,
				},
				{
					errorMessage: 'message2',
					errorCategory: 'NotPermitted',
					errorType: 'Gone',
					errorPath: 'path.two',
					errorNumber: 2,
					isSLOFailure: false,
				},
			],
			isSLOFailure: true,
			traceId: '123',
		});
	});

	it('should handle AGGErrors', () => {
		const errors = new AGGErrors(
			[
				{
					message: 'message1',
					extensions: {
						statusCode: 404,
						errorType: 'IdentityUserNotFoundError',
					},
				},
				{
					message: 'message2',
					extensions: { statusCode: 500, errorType: 'SERVER_ERROR' },
				},
				{
					message:
						'Exception while fetching data (/Team/team) : [TeamDeleted(teamId=bb947681-3815-4a37-8ace-fa5e716d7f1b)]',
					path: ['Team', 'team'],
					extensions: {
						errorSource: 'UNDERLYING_SERVICE',
						statusCode: 410,
						classification: 'Gone',
					},
				},
			],
			'123',
		);

		const attrs = getErrorAttributes(errors);

		expect(attrs).toEqual({
			errorMessage: 'AGGErrors',
			errorCount: 3,
			errorDetails: [
				{
					errorCategory: undefined,
					errorMessage: 'message1',
					errorType: 'IdentityUserNotFoundError',
					errorStatusCode: 404,
					isSLOFailure: false,
				},
				{
					errorCategory: undefined,
					errorMessage: 'message2',
					errorType: 'SERVER_ERROR',
					errorStatusCode: 500,
					isSLOFailure: true,
				},
				{
					errorCategory: 'Gone',
					errorMessage:
						'Exception while fetching data (/Team/team) : [TeamDeleted(teamId=bb947681-3815-4a37-8ace-fa5e716d7f1b)]',
					errorType: undefined,
					errorStatusCode: 410,
					isSLOFailure: false,
				},
			],
			isSLOFailure: true,
			traceId: '123',
		});
	});

	it('should handle unknown errors', () => {
		const error = new Error('Something went wrong');
		const attrs = getErrorAttributes(error);

		expect(attrs).toEqual({
			errorMessage: 'Something went wrong',
			isSLOFailure: true,
		});
	});

	it('should handle Jira Custom Profile Card client error with cause', () => {
		const causeError = new DirectoryGraphQLErrors(
			[
				{
					message: 'message1',
					category: 'NotFound',
					type: 'type1',
					extensions: { errorNumber: 1 },
				},
				{
					message: 'message2',
					category: 'NotPermitted',
					type: 'Gone',
					extensions: { errorNumber: 2 },
					path: ['path', 'two'],
				},
			],
			'123',
		);
		const error = new Error('Unable to fetch user: Some reason...');
		(error as any).cause = causeError;

		const expected = getErrorAttributes(causeError);

		expect(getErrorAttributes(error)).toEqual(expected);
	});

	it('should handle Jira Custom Profile Card client error without cause', () => {
		const error = new Error('Unable to fetch user: Some reason...');

		expect(getErrorAttributes(error)).toEqual({
			errorMessage: error.message,
			isSLOFailure: false,
		});
	});

	it('should handle Jira Custom Profile Card client error with cause that is not known', () => {
		const error = new Error('Unable to fetch user: Some reason...');
		const causeError = new Error('Who knows');
		(error as any).cause = causeError;

		expect(getErrorAttributes(error)).toEqual({
			errorMessage: error.message,
			isSLOFailure: false,
		});
	});
});

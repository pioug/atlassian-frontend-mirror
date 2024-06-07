import { DirectoryGraphQLError } from './errors';

describe('DirectoryGraphQLError', () => {
	it('should create an error with the correct properties', () => {
		const message = 'Some error message';
		const category = 'NotFound';
		const type = 'someType';
		const path = ['path', 'to', 'error'];
		const extensions = { errorNumber: 123, someOtherProperty: 'value' };

		const error = new DirectoryGraphQLError(message, category, type, extensions, path);

		expect(error.message).toBe(message);
		expect(error.category).toBe(category);
		expect(error.type).toBe(type);
		expect(error.path).toBe(path.join('.'));
		expect(error.errorNumber).toBe(extensions.errorNumber);
		expect(error.extensions).toEqual({ someOtherProperty: 'value' });
	});

	it('should create an error with default values when extensions is undefined', () => {
		const message = 'Some error message';
		const category = 'NotFound';
		const type = 'someType';
		const path = ['path', 'to', 'error'];

		const error = new DirectoryGraphQLError(message, category, type, undefined, path);

		expect(error.message).toBe(message);
		expect(error.category).toBe(category);
		expect(error.type).toBe(type);
		expect(error.path).toBe(path.join('.'));
		expect(error.errorNumber).toBeUndefined();
		expect(error.extensions).toEqual({});
	});
});

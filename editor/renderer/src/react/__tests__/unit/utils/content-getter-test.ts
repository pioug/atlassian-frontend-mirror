import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';

import { createContentGetter } from '../../../utils/content-getter';

const fragmentOf = (content: unknown[]) =>
	schema.nodeFromJSON({
		type: 'paragraph',
		content,
	}).content;

describe('createContentGetter', () => {
	it('does not serialize until called', () => {
		const fragment = fragmentOf([{ type: 'text', text: 'hello' }]);
		const toJSON = jest.spyOn(fragment, 'toJSON');

		const getContent = createContentGetter(fragment);
		expect(toJSON).not.toHaveBeenCalled();

		expect(getContent()).toEqual([{ type: 'text', text: 'hello' }]);
		expect(toJSON).toHaveBeenCalledTimes(1);
	});

	it('memoizes across calls', () => {
		const fragment = fragmentOf([{ type: 'text', text: 'hello' }]);
		const toJSON = jest.spyOn(fragment, 'toJSON');

		const getContent = createContentGetter(fragment);
		const first = getContent();

		expect(getContent()).toBe(first);
		expect(toJSON).toHaveBeenCalledTimes(1);
	});

	it('matches what the eager path produced for an empty fragment', () => {
		const fragment = fragmentOf([]);

		// `Fragment.toJSON()` returns null rather than an empty array.
		expect(createContentGetter(fragment)()).toBeNull();
		expect(createContentGetter(fragment)()).toEqual(fragment.toJSON());
	});

	it('returns undefined when there is no fragment', () => {
		expect(createContentGetter(undefined)()).toBeUndefined();
	});

	it('does not cache a failed serialization', () => {
		const fragment = fragmentOf([{ type: 'text', text: 'hello' }]);
		const toJSON = jest
			.spyOn(fragment, 'toJSON')
			.mockImplementationOnce(() => {
				throw new Error('boom');
			})
			.mockImplementationOnce(() => [{ type: 'text', text: 'hello' }]);

		const getContent = createContentGetter(fragment);

		expect(() => getContent()).toThrow('boom');
		expect(getContent()).toEqual([{ type: 'text', text: 'hello' }]);
		expect(toJSON).toHaveBeenCalledTimes(2);
	});
});

import { createRef, type RefCallback } from 'react';

import mergeRefs from '../merge-refs';

describe('#mergeRefs', () => {
	const node = document.createElement('div');

	it('should invoke the ref with the node passed if ref is a function', () => {
		const ref = jest.fn() as (node: HTMLElement | null) => void;

		mergeRefs([ref])(node);

		expect(ref).toHaveBeenCalledTimes(1);
		expect(ref).toHaveBeenCalledWith(node);
	});

	it('should set the current value with the node passed if ref is not null', () => {
		const ref = createRef<HTMLElement | null>();
		mergeRefs([ref])(node);

		expect(ref.current).toEqual(node);
	});

	it('should do nothing if ref is null', () => {
		const ref = null;
		mergeRefs([ref])(node);

		expect(ref).toEqual(null);
	});

	it('should pass the node to all refs if there are multiple', () => {
		const refFn = jest.fn() as (node: HTMLElement | null) => void;
		const refObject = createRef<HTMLElement | null>();

		mergeRefs([refFn, refObject])(node);

		expect(refFn).toHaveBeenCalledTimes(1);
		expect(refFn).toHaveBeenCalledWith(node);
		expect(refObject.current).toEqual(node);
	});

	it('should allow you to pass in null, undefined or false', () => {
		const refObject = createRef<HTMLElement | null>();
		const refFn = jest.fn() as (node: HTMLElement | null) => void;

		mergeRefs([refObject, null, undefined, false, refFn])(node);

		expect(refFn).toHaveBeenCalledTimes(1);
		expect(refFn).toHaveBeenCalledWith(node);
		expect(refObject.current).toEqual(node);
	});

	it('should maintain the types of the passed in ref', () => {
		const button = document.createElement('button');
		const refObject = createRef<HTMLButtonElement | null>();

		// no errors
		mergeRefs([refObject, null, undefined, false])(button);
		mergeRefs<HTMLButtonElement | null>([refObject, null, undefined, false])(button);
		const callback = mergeRefs([
			refObject,
			null,
			undefined,
			false,
		]) satisfies RefCallback<HTMLButtonElement | null>;

		expect(typeof callback).toBe('function');
	});

	it('should maintain the types of the passed in ref (lower ref type)', () => {
		const button = document.createElement('button');
		button.type = 'button'; // appeasing a11y tooling
		const refObject = createRef<HTMLElement | null>();

		// no errors
		mergeRefs([refObject, null, undefined, false])(button);
		mergeRefs<HTMLElement | null>([refObject, null, undefined, false])(button);
		const callback = mergeRefs([
			refObject,
			null,
			undefined,
			false,
		]) satisfies RefCallback<HTMLElement | null>;

		expect(typeof callback).toBe('function');
	});
});

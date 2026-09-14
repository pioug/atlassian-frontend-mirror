import React, { type ReactNode } from 'react';

import { type FormSubscription } from 'final-form';

import { act, renderHook } from '@atlassian/testing-library';
import __noop from '@atlaskit/ds-lib/noop';

import { FormContext } from '../../form-context';
import { useFormState } from '../../use-form-state';

const getCurrentValue = jest.fn(() => undefined);
const registerField = jest.fn(() => __noop);
const unsubscribe = jest.fn(__noop);
const subscribe = jest.fn(() => unsubscribe);

const ContextWrapper = ({ children }: { children: ReactNode } & any) => (
	<FormContext.Provider value={{ registerField, getCurrentValue, subscribe }}>
		{children}
	</FormContext.Provider>
);

describe('use-form-state hook', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('without a context, will return undefined safely', () => {
		const utils = renderHook(() => useFormState({ values: true }));

		expect(utils.current).toEqual(undefined);
	});

	describe('with a context provider', () => {
		it('without subscribe called, will return undefined safely', () => {
			const utils = renderHook(() => useFormState({ values: true }), {
				wrapper: ContextWrapper,
			});

			expect(utils.current).toEqual(undefined);
			expect(subscribe).toHaveBeenCalledTimes(1);
			expect(unsubscribe).not.toHaveBeenCalled();
		});

		it('mimicking `final-form` updating the subscription returns state from our `useFormState`', () => {
			const utils = renderHook(() => useFormState({ values: true }), {
				wrapper: ContextWrapper,
			});

			expect(utils.current).toEqual(undefined);
			expect(subscribe).toHaveBeenCalledTimes(1);
			expect(unsubscribe).not.toHaveBeenCalled();

			// Mimic what `final-form` would do, calling the subscribe callback with the form state
			const subscribeCallback = (subscribe.mock.calls[0] as any)[0];
			const newFormState = { form: 'state' };
			act(() => {
				subscribeCallback(newFormState);
			});

			// Now our result is updated with exact referential equality and subscribe is never updated
			expect(utils.current).toBe(newFormState);
			expect(subscribe).toHaveBeenCalledTimes(1);
			expect(unsubscribe).not.toHaveBeenCalled();
		});

		it('calling the hook with a new object reference, but same shallow equality as the default value, does not trigger a re-subscription', () => {
			const utils = renderHook((subscription?: FormSubscription) => useFormState(subscription), {
				args: [undefined],
				wrapper: ContextWrapper,
			});

			expect(utils.current).toEqual(undefined);
			expect(subscribe).toHaveBeenCalledTimes(1);
			expect(unsubscribe).not.toHaveBeenCalled();

			// NOTE: This is the same as the first render effectively doing `useFormState()`
			// Then the second render effectively doing `useFormState({ values: true })`
			// Because this matches the default, nothing happens
			utils.update({ values: true });

			expect(utils.current).toEqual(undefined);
			expect(subscribe).toHaveBeenCalledTimes(1);
			expect(unsubscribe).not.toHaveBeenCalled();
		});

		it('calling the hook with a value that does not match shallow equality results in a re-subscription', () => {
			const utils = renderHook((subscription?: FormSubscription) => useFormState(subscription), {
				args: [{ values: true }],
				wrapper: ContextWrapper,
			});

			// Rendered with the initial value, won't be re-subscribed as it's the same shallow equality
			utils.update({ values: true });
			expect(utils.current).toEqual(undefined);
			expect(subscribe).toHaveBeenCalledTimes(1);
			expect(unsubscribe).not.toHaveBeenCalled();

			// Rendered again with a different shallow value, will re-subscribe
			utils.update({ values: false });
			expect(utils.current).toEqual(undefined);
			expect(subscribe).toHaveBeenCalledTimes(2);
			expect(unsubscribe).toHaveBeenCalledTimes(1);

			// Rendered again with a different shallow value, will re-subscribe
			// @ts-ignore - TS2353 TypeScript 5.9.2 upgrade
			utils.update({ dirty: true });
			expect(subscribe).toHaveBeenCalledTimes(3);
			expect(unsubscribe).toHaveBeenCalledTimes(2);

			// Rendered again, won't be re-subscribed as it's the same shallow equality
			// @ts-ignore - TS2353 TypeScript 5.9.2 upgrade
			utils.update({ dirty: true });
			expect(subscribe).toHaveBeenCalledTimes(3);
			expect(unsubscribe).toHaveBeenCalledTimes(2);
		});
	});
});

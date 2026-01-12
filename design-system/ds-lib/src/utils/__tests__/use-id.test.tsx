import React from 'react';

import { renderHook } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { useId } from '../use-id';

describe('useId', () => {
	it('returns an identifier from react-uid', () => {
		// Our useId use `_` instead of `:` so it works with selectors.
		const { result: useIdResult } = renderHook(() => useId());
		expect(useIdResult.current).toMatch(/^uid[\d]+$/);
	});

	ffTest.on('platform-dst-react-18-use-id', 'true', () => {
		it('returns a React.useId identifier', () => {
			const { result: useIdResult } = renderHook(() => useId());
			expect(useIdResult.current).toMatch(/^:r[\d]+:$/);
		});

		ffTest.on('platform-dst-react-18-use-id-selector-safe', 'true', () => {
			it('returns an identifier similar to React.useId, but with selector-safe characters', () => {
				// Our useId use `_` instead of `:` so it works with selectors.
				const { result: useIdResult } = renderHook(() => useId());
				expect(useIdResult.current).toMatch(/^_r[\d]+_$/);

				// For context, `React.useId` uses `:` which isn't valid in `document.querySelector(…)`
				// This test isn't necessary, but it's here so we realize we can remove
				// this wrapper up once React updates to selector-safe `_` characters
				const { result: reactUseIdResult } = renderHook(() => React.useId());
				expect(reactUseIdResult.current).toMatch(/^:r[\d]+:$/);
			});
		});
	});
});

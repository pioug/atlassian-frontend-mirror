import { renderHook } from '@testing-library/react';

import { fg } from '@atlaskit/platform-feature-flags';

import { useEditorTheme } from './index';

jest.mock('@atlaskit/platform-feature-flags');

describe('useEditorTheme', () => {
	beforeEach(() => {
		(fg as jest.Mock).mockReturnValue(true);
	});

	it('return defaultMaxRows=3 when defaultRows is not defined', () => {
		const { result } = renderHook(() => useEditorTheme({}));
		expect(result.current.defaultMaxRows).toBe(3);
	});

	it('return defaultMaxRows=defaultRows when defaultRows > 3', () => {
		const { result } = renderHook(() => useEditorTheme({ defaultRows: 5 }));
		expect(result.current.defaultMaxRows).toBe(5);
	});

	it('return defaultMaxRows=3 when defaultRows < 3', () => {
		const { result } = renderHook(() => useEditorTheme({ defaultRows: 2 }));
		expect(result.current.defaultMaxRows).toBe(3);
	});
});

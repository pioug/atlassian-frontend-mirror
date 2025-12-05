import { renderHook } from '@testing-library/react';

import { useSmartCardContext } from '@atlaskit/link-provider';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import { useIsInPDFRender } from '../useIsInPDFRender';

jest.mock('@atlaskit/link-provider', () => {
	const originalModule = jest.requireActual('@atlaskit/link-provider');
	return {
		...originalModule,
		useSmartCardContext: jest.fn(),
	};
});

describe('useIsInPdfExport', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return true when shouldControlDataExport is true', () => {
		asMock(useSmartCardContext).mockReturnValue({
			value: {
				shouldControlDataExport: true,
			},
		} as any);

		const { result } = renderHook(() => useIsInPDFRender());

		expect(result.current).toBe(true);
	});

	it('should return false when shouldControlDataExport is false', () => {
		asMock(useSmartCardContext).mockReturnValue({
			value: {
				shouldControlDataExport: false,
			},
		} as any);

		const { result } = renderHook(() => useIsInPDFRender());

		expect(result.current).toBe(false);
	});

	it('should return false when shouldControlDataExport is undefined', () => {
		asMock(useSmartCardContext).mockReturnValue({
			value: {},
		} as any);

		const { result } = renderHook(() => useIsInPDFRender());

		expect(result.current).toBe(false);
	});

	it('should return false when value is undefined', () => {
		asMock(useSmartCardContext).mockReturnValue({} as any);

		const { result } = renderHook(() => useIsInPDFRender());

		expect(result.current).toBe(false);
	});

	it('should return false when smartCardContext is null', () => {
		asMock(useSmartCardContext).mockReturnValue(null as any);

		const { result } = renderHook(() => useIsInPDFRender());

		expect(result.current).toBe(false);
	});

	it('should return false when smartCardContext is undefined', () => {
		asMock(useSmartCardContext).mockReturnValue(undefined as any);

		const { result } = renderHook(() => useIsInPDFRender());

		expect(result.current).toBe(false);
	});
});

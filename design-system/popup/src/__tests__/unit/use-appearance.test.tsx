import { renderHook } from '@testing-library/react-hooks';

import { UNSAFE_useMediaQuery } from '@atlaskit/primitives/compiled';

import { usePopupAppearance } from '../../use-appearance';

jest.mock('@atlaskit/primitives/compiled');

const mockUseMediaQuery = UNSAFE_useMediaQuery as jest.Mock;

describe('useAppearance hook', () => {
	it('should honor the render to parent prop when appearance is default', () => {
		mockUseMediaQuery.mockReturnValueOnce({ matches: false });

		const { result } = renderHook(() => {
			return usePopupAppearance({ appearance: 'default', shouldRenderToParent: true });
		});

		expect(result.current.shouldRenderToParent).toBe(true);
	});

	it('should honor the render to parent prop when appearance is modal below when on larger viewports', () => {
		mockUseMediaQuery.mockReturnValueOnce({ matches: false });

		const { result } = renderHook(() => {
			return usePopupAppearance({
				appearance: 'UNSAFE_modal-below-sm',
				shouldRenderToParent: true,
			});
		});

		expect(result.current.shouldRenderToParent).toBe(true);
	});

	it('should override the render to parent prop when appearance is modal below when on small viewports', () => {
		mockUseMediaQuery.mockReturnValueOnce({ matches: true });

		const { result } = renderHook(() => {
			return usePopupAppearance({
				appearance: 'UNSAFE_modal-below-sm',
				shouldRenderToParent: true,
			});
		});

		expect(result.current.shouldRenderToParent).toBe(false);
	});
});

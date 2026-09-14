import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { renderHook } from '@atlassian/testing-library';
import { UNSAFE_useMediaQuery } from '@atlaskit/primitives/compiled';

import { usePopupAppearance } from '../../use-appearance';

jest.mock('@atlaskit/primitives/compiled');

const mockUseMediaQuery = UNSAFE_useMediaQuery as jest.Mock;

const PERF_FIX_GATE = 'platform_dst_popup_media_query_perf_fix';

describe('useAppearance hook', () => {
	beforeEach(() => {
		mockUseMediaQuery.mockClear();
	});

	describe('media query subscription', () => {
		it('does not subscribe a default popup to the breakpoint when the gate is on', () => {
			passGate(PERF_FIX_GATE);
			mockUseMediaQuery.mockReturnValue({ matches: false });

			renderHook(() => usePopupAppearance({ appearance: 'default', shouldRenderToParent: true }));

			expect(mockUseMediaQuery).toHaveBeenCalledWith('below.sm', undefined);
		});

		it('still subscribes a modal-below-sm popup to the breakpoint when the gate is on', () => {
			passGate(PERF_FIX_GATE);
			mockUseMediaQuery.mockReturnValue({ matches: false });

			renderHook(() =>
				usePopupAppearance({ appearance: 'UNSAFE_modal-below-sm', shouldRenderToParent: true }),
			);

			expect(mockUseMediaQuery).toHaveBeenCalledWith('below.sm', expect.any(Function));
		});

		it('subscribes a default popup to the breakpoint when the gate is off', () => {
			failGate(PERF_FIX_GATE);
			mockUseMediaQuery.mockReturnValue({ matches: false });

			renderHook(() => usePopupAppearance({ appearance: 'default', shouldRenderToParent: true }));

			expect(mockUseMediaQuery).toHaveBeenCalledWith('below.sm', expect.any(Function));
		});
	});

	it('should honor the render to parent prop when appearance is default', () => {
		mockUseMediaQuery.mockReturnValueOnce({ matches: false });

		const utils = renderHook(() => {
			return usePopupAppearance({ appearance: 'default', shouldRenderToParent: true });
		});

		expect(utils.current.shouldRenderToParent).toBe(true);
	});

	it('should honor the render to parent prop when appearance is modal below when on larger viewports', () => {
		mockUseMediaQuery.mockReturnValueOnce({ matches: false });

		const utils = renderHook(() => {
			return usePopupAppearance({
				appearance: 'UNSAFE_modal-below-sm',
				shouldRenderToParent: true,
			});
		});

		expect(utils.current.shouldRenderToParent).toBe(true);
	});

	it('should override the render to parent prop when appearance is modal below when on small viewports', () => {
		mockUseMediaQuery.mockReturnValueOnce({ matches: true });

		const utils = renderHook(() => {
			return usePopupAppearance({
				appearance: 'UNSAFE_modal-below-sm',
				shouldRenderToParent: true,
			});
		});

		expect(utils.current.shouldRenderToParent).toBe(false);
	});
});

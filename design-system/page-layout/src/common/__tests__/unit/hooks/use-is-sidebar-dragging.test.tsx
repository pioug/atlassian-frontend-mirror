import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { skipA11yAudit } from '@af/accessibility-testing';

import { Content, LeftSidebar, PageLayout } from '../../../../index';
import { IS_SIDEBAR_DRAGGING } from '../../../constants';
import { useIsSidebarDragging } from '../../../hooks';

describe('useIsSidebarDragging', () => {
	beforeEach(() => {
		document.documentElement.removeAttribute(IS_SIDEBAR_DRAGGING);
	});

	describe('initial values', () => {
		it('should be true when the data attribute is set to "true" on the root element', () => {
			document.documentElement.setAttribute(IS_SIDEBAR_DRAGGING, 'true');
			const { result, unmount } = renderHook(() => useIsSidebarDragging());
			expect(result.current).toBe(true);
			unmount(); // Avoids some act() warnings
		});

		it('should be false when the data attribute is set to "false" on the root element', async () => {
			document.documentElement.setAttribute(IS_SIDEBAR_DRAGGING, 'false');
			const { result, unmount } = renderHook(() => useIsSidebarDragging());
			expect(result.current).toBe(false);
			unmount(); // Avoids some act() warnings
		});

		it('should be false when the data attribute is not set on the root element', () => {
			document.documentElement.removeAttribute(IS_SIDEBAR_DRAGGING);
			const { result, unmount } = renderHook(() => useIsSidebarDragging());
			expect(result.current).toBe(false);
			unmount(); // Avoids some act() warnings
		});
	});

	describe('responding to changes', () => {
		it('should respond when the data attribute changes ["false" -> "true"]', async () => {
			document.documentElement.setAttribute(IS_SIDEBAR_DRAGGING, 'false');
			const { result, unmount } = renderHook(() => useIsSidebarDragging());

			document.documentElement.setAttribute(IS_SIDEBAR_DRAGGING, 'true');
			await waitFor(() => expect(result.current).toBe(true));

			unmount(); // Avoids some act() warnings
		});

		it('should respond when the data attribute changes ["true" -> "false"]', async () => {
			document.documentElement.setAttribute(IS_SIDEBAR_DRAGGING, 'true');
			const { result, unmount } = renderHook(() => useIsSidebarDragging());

			document.documentElement.setAttribute(IS_SIDEBAR_DRAGGING, 'false');
			await waitFor(() => expect(result.current).toBe(false));

			unmount(); // Avoids some act() warnings
		});

		it('should respond when the data attribute changes ["true" -> undefined]', async () => {
			document.documentElement.setAttribute(IS_SIDEBAR_DRAGGING, 'true');
			const { result, unmount } = renderHook(() => useIsSidebarDragging());

			document.documentElement.removeAttribute(IS_SIDEBAR_DRAGGING);
			await waitFor(() => expect(result.current).toBe(false));

			unmount(); // Avoids some act() warnings
		});

		it('should respond when the data attribute changes ["false" -> undefined]', async () => {
			document.documentElement.setAttribute(IS_SIDEBAR_DRAGGING, 'false');
			const { result, unmount } = renderHook(() => useIsSidebarDragging());

			/**
			 * The hook value shouldn't change.
			 */
			document.documentElement.removeAttribute(IS_SIDEBAR_DRAGGING);
			expect(result.current).toBe(false);

			unmount(); // Avoids some act() warnings
		});
	});

	describe('user interaction', () => {
		const Harness = () => {
			return (
				<PageLayout>
					<Content testId="content">
						<LeftSidebar testId="leftSidebar" collapsedState="expanded" children={null} />
					</Content>
				</PageLayout>
			);
		};
		const grabAreaSelector = 'leftSidebar-grab-area';

		it('should be false by default', async () => {
			render(<Harness />);
			const { result, unmount } = renderHook(() => useIsSidebarDragging());
			expect(result.current).toBe(false);

			unmount(); // Avoids some act() warnings

			// a11y audits fail due to old axe rules that need to be updated
			// See https://product-fabric.atlassian.net/browse/DSP-17790 for info
			skipA11yAudit();
		});

		it('should correctly update with mouse interactions', async () => {
			const { getByTestId } = render(<Harness />);
			const grabArea = getByTestId(grabAreaSelector);

			const { result, unmount } = renderHook(() => useIsSidebarDragging());

			fireEvent.mouseDown(grabArea);
			await waitFor(() => expect(result.current).toBe(true));

			fireEvent.mouseUp(grabArea);
			await waitFor(() => expect(result.current).toBe(false));

			unmount(); // Avoids some act() warnings
		});
	});
});

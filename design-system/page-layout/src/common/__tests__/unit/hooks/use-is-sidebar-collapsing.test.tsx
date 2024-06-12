import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { skipA11yAudit } from '@af/accessibility-testing';

import { Content, LeftSidebar, PageLayout } from '../../../../index';
import { IS_SIDEBAR_COLLAPSING } from '../../../constants';
import { useIsSidebarCollapsing } from '../../../hooks';

describe('useIsSidebarCollapsing', () => {
	beforeEach(() => {
		document.documentElement.removeAttribute(IS_SIDEBAR_COLLAPSING);

		// a11y audits fail due to old axe rules that need to be updated
		// See https://product-fabric.atlassian.net/browse/DSP-17790 for info
		skipA11yAudit();
	});

	describe('initial values', () => {
		it('should be true when the data attribute is set to "true" on the root element', () => {
			document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSING, 'true');
			const { result, unmount } = renderHook(() => useIsSidebarCollapsing());
			expect(result.current).toBe(true);
			unmount(); // Avoids some act() warnings
		});

		it('should be false when the data attribute is set to "false" on the root element', async () => {
			document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSING, 'false');
			const { result, unmount } = renderHook(() => useIsSidebarCollapsing());
			expect(result.current).toBe(false);
			unmount(); // Avoids some act() warnings
		});

		it('should be false when the data attribute is not set on the root element', () => {
			document.documentElement.removeAttribute(IS_SIDEBAR_COLLAPSING);
			const { result, unmount } = renderHook(() => useIsSidebarCollapsing());
			expect(result.current).toBe(false);
			unmount(); // Avoids some act() warnings
		});
	});

	describe('responding to changes', () => {
		it('should respond when the data attribute changes ["false" -> "true"]', async () => {
			document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSING, 'false');
			const { result, unmount } = renderHook(() => useIsSidebarCollapsing());

			document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSING, 'true');
			await waitFor(() => expect(result.current).toBe(true));

			unmount(); // Avoids some act() warnings
		});

		it('should respond when the data attribute changes ["true" -> "false"]', async () => {
			document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSING, 'true');
			const { result, unmount } = renderHook(() => useIsSidebarCollapsing());

			document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSING, 'false');
			await waitFor(() => expect(result.current).toBe(false));

			unmount(); // Avoids some act() warnings
		});

		it('should respond when the data attribute changes ["true" -> undefined]', async () => {
			document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSING, 'true');
			const { result, unmount } = renderHook(() => useIsSidebarCollapsing());

			document.documentElement.removeAttribute(IS_SIDEBAR_COLLAPSING);
			await waitFor(() => expect(result.current).toBe(false));

			unmount(); // Avoids some act() warnings
		});

		it('should respond when the data attribute changes ["false" -> undefined]', async () => {
			document.documentElement.setAttribute(IS_SIDEBAR_COLLAPSING, 'false');
			const { result, unmount } = renderHook(() => useIsSidebarCollapsing());

			/**
			 * The hook value shouldn't change.
			 */
			document.documentElement.removeAttribute(IS_SIDEBAR_COLLAPSING);
			expect(result.current).toBe(false);

			unmount(); // Avoids some act() warnings
		});
	});

	describe('user interaction', () => {
		const Harness = ({ isCollapsed = false }: { isCollapsed?: boolean }) => {
			return (
				<PageLayout>
					<Content testId="content">
						<LeftSidebar
							testId="leftSidebar"
							collapsedState={isCollapsed ? 'collapsed' : 'expanded'}
							children={null}
						/>
					</Content>
				</PageLayout>
			);
		};
		const resizeButtonSelector = 'leftSidebar-resize-button';

		it('should be false when the sidebar is collapsed', async () => {
			render(<Harness isCollapsed />);
			const { result, unmount } = renderHook(() => useIsSidebarCollapsing());
			expect(result.current).toBe(false);

			unmount(); // Avoids some act() warnings
		});

		it('should be false when the sidebar is expanded', async () => {
			render(<Harness />);
			const { result, unmount } = renderHook(() => useIsSidebarCollapsing());
			expect(result.current).toBe(false);

			unmount(); // Avoids some act() warnings
		});

		it('should be true when the sidebar is collapsing', async () => {
			render(<Harness />);
			const resizeButton = screen.getByTestId(resizeButtonSelector);

			const { result, unmount } = renderHook(() => useIsSidebarCollapsing());

			fireEvent.click(resizeButton);
			await waitFor(() => expect(result.current).toBe(true));

			unmount(); // Avoids some act() warnings
		});

		it('should be false when the sidebar is expanding', async () => {
			render(<Harness isCollapsed />);
			const resizeButton = screen.getByTestId(resizeButtonSelector);

			const { result, unmount } = renderHook(() => useIsSidebarCollapsing());

			fireEvent.click(resizeButton);
			await waitFor(() => expect(result.current).toBe(false));

			unmount(); // Avoids some act() warnings
		});
	});
});

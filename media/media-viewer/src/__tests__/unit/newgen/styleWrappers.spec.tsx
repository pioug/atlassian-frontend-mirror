import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { InsetViewerProvider, useMediaFooterControls } from '../../../insetViewerContext';
import { InsetSidebarHeaderRow, MediaFooterBar, SidebarColumn } from '../../../styleWrappers';

describe('styleWrappers', () => {
	describe('SidebarColumn', () => {
		it('should render its children and stay interactive when open', () => {
			// `Motion` reads this @atlaskit/motion gate when the open column mounts it.
			failGate('platform-dst-use-motion');
			render(
				<SidebarColumn isOpen>
					<div>Sidebar header</div>
					<div>Sidebar body</div>
				</SidebarColumn>,
			);

			expect(screen.getByText('Sidebar header')).toBeInTheDocument();
			expect(screen.getByText('Sidebar body')).toBeInTheDocument();
			const column = screen.getByTestId('media-viewer-sidebar-column');
			expect(column).toHaveAttribute('aria-hidden', 'false');
		});

		it.each([
			{ motion: 'the current Motion', setGate: passGate },
			{ motion: 'the legacy Motion', setGate: failGate },
		])(
			'should animate the content in when opened, but not when it mounts open, with $motion',
			({ setGate }) => {
				setGate('platform-dst-use-motion');
				// The content sits in a wrapper inside Motion's own element, which carries the animation.
				const getMotionElement = () =>
					screen.getByText('Sidebar body').parentElement?.parentElement;

				const { unmount } = render(
					<SidebarColumn isOpen>
						<div>Sidebar body</div>
					</SidebarColumn>,
				);
				expect(getMotionElement()?.style.animation).toBeFalsy();
				unmount();

				const view = render(
					<SidebarColumn isOpen={false}>
						<div>Sidebar body</div>
					</SidebarColumn>,
				);
				view.rerender(
					<SidebarColumn isOpen>
						<div>Sidebar body</div>
					</SidebarColumn>,
				);
				expect(getMotionElement()?.style.animation).toBeTruthy();
			},
		);

		it('should stay mounted but be aria-hidden when closed', () => {
			render(
				<SidebarColumn isOpen={false}>
					<div>Sidebar body</div>
				</SidebarColumn>,
			);

			const column = screen.getByTestId('media-viewer-sidebar-column');
			expect(column).toHaveAttribute('aria-hidden', 'true');
			expect(screen.queryByText('Sidebar body')).not.toBeInTheDocument();
		});
	});

	describe('InsetSidebarHeaderRow', () => {
		it('should show the title beside its actions', () => {
			render(
				<InsetSidebarHeaderRow title="Comments">
					<button type="button">Action</button>
				</InsetSidebarHeaderRow>,
			);

			expect(screen.getByRole('heading', { name: 'Comments' })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
		});
	});

	describe('MediaFooterBar', () => {
		it('should register its element with the media footer context', () => {
			const FooterProbe = () => {
				const footer = useMediaFooterControls();
				return <span>{footer ? 'registered' : 'none'}</span>;
			};

			render(
				<InsetViewerProvider isInsetViewer>
					<MediaFooterBar />
					<FooterProbe />
				</InsetViewerProvider>,
			);

			expect(screen.getByText('registered')).toBeInTheDocument();
		});
	});
});

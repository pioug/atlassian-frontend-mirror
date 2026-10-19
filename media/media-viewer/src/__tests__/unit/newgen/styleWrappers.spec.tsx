import React from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';

import {
	InsetViewerProvider,
	useMediaFooterControls,
	withInsetViewerFooter,
} from '../../../insetViewerContext';
import { InsetSidebarHeaderRow, MediaFooterBar, SidebarColumn } from '../../../styleWrappers';

describe('styleWrappers', () => {
	describe('SidebarColumn', () => {
		it('should render its children and not be aria-hidden when open', () => {
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

		it('should stay mounted but be aria-hidden when it mounts closed', () => {
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

		it('should use different footer styles once video controls are registered', async () => {
			class Setter extends React.Component<{
				setHasPlayerControls?: (hasPlayerControls: boolean) => void;
			}> {
				render() {
					return (
						<button type="button" onClick={() => this.props.setHasPlayerControls?.(true)}>
							register video controls
						</button>
					);
				}
			}
			const WrappedSetter = withInsetViewerFooter(Setter);

			render(
				<InsetViewerProvider isInsetViewer>
					<MediaFooterBar />
					<WrappedSetter />
				</InsetViewerProvider>,
			);
			const classesBefore = screen.getByTestId('media-viewer-media-footer').getAttribute('class');

			await userEvent.click(screen.getByRole('button', { name: 'register video controls' }));

			expect(screen.getByTestId('media-viewer-media-footer').getAttribute('class')).not.toEqual(
				classesBefore,
			);
		});
	});
});

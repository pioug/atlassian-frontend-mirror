import React, { useEffect } from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import {
	InsetViewerProvider,
	useMediaFooterControls,
	useRegisterMediaFooterPlayerControls,
	useSetHasArchiveColumn,
} from '../../../insetViewerContext';
import {
	HeaderWrapper,
	InsetSidebarHeaderRow,
	MediaFooterBar,
	SidebarColumn,
} from '../../../styleWrappers';

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

	describe('archive column line', () => {
		const ArchiveColumnSetter = ({ hasArchiveColumn }: { hasArchiveColumn: boolean }) => {
			const setHasArchiveColumn = useSetHasArchiveColumn();
			useEffect(() => {
				setHasArchiveColumn(hasArchiveColumn);
			}, [hasArchiveColumn, setHasArchiveColumn]);
			return null;
		};

		it.each([
			{ isInsetViewer: true, hasArchiveColumn: true, hasLine: true },
			{ isInsetViewer: true, hasArchiveColumn: false, hasLine: false },
			{ isInsetViewer: false, hasArchiveColumn: true, hasLine: false },
		])(
			'should render the line in the header and footer: $hasLine (inset: $isInsetViewer, archive column: $hasArchiveColumn)',
			({ isInsetViewer, hasArchiveColumn, hasLine }) => {
				render(
					<InsetViewerProvider isInsetViewer={isInsetViewer}>
						<ArchiveColumnSetter hasArchiveColumn={hasArchiveColumn} />
						<HeaderWrapper isArchiveSideBarVisible={false}>
							<span>Header content</span>
						</HeaderWrapper>
						<MediaFooterBar />
					</InsetViewerProvider>,
				);

				expect(screen.getByText('Header content')).toBeInTheDocument();
				expect(!!screen.queryByTestId('media-viewer-header-archive-column-line')).toBe(hasLine);
				expect(!!screen.queryByTestId('media-viewer-footer-archive-column-line')).toBe(hasLine);
			},
		);
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

		it('should use different footer styles once video controls are registered', () => {
			const Player = () => {
				useRegisterMediaFooterPlayerControls();
				return null;
			};
			const tree = (hasPlayer: boolean) => (
				<InsetViewerProvider isInsetViewer>
					<MediaFooterBar />
					{hasPlayer && <Player />}
				</InsetViewerProvider>
			);
			const { rerender } = render(tree(false));
			const classesBefore = screen.getByTestId('media-viewer-media-footer').getAttribute('class');

			rerender(tree(true));

			expect(screen.getByTestId('media-viewer-media-footer').getAttribute('class')).not.toEqual(
				classesBefore,
			);
		});
	});
});

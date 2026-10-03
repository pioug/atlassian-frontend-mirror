import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import PanelRightIcon from '@atlaskit/icon/core/panel-right';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/mocked-media-client-provider';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers/mocked-media-api';
import { generateSampleFileItem } from '@atlaskit/media-test-data/sample-file-items';

import { InsetSidebarHeader } from '../../../inset-sidebar-header';
import { ToolbarDownloadButton } from '../../../ToolbarDownloadButton';
import { ViewerIconButton } from '../../../viewer-icon-button';

jest.mock('../../../viewer-icon-button', () => {
	const original = jest.requireActual('../../../viewer-icon-button');
	return { ...original, ViewerIconButton: jest.fn(original.ViewerIconButton) };
});
jest.mock('../../../ToolbarDownloadButton', () => {
	const original = jest.requireActual('../../../ToolbarDownloadButton');
	return { ...original, ToolbarDownloadButton: jest.fn(original.ToolbarDownloadButton) };
});

describe('InsetSidebarHeader', () => {
	const renderSidebarHeader = (
		props: Partial<React.ComponentProps<typeof InsetSidebarHeader>> = {},
		[fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview(),
	) => {
		const { mediaApi } = createMockedMediaApi(fileItem);
		render(
			<IntlProvider locale="en">
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<InsetSidebarHeader
						identifier={identifier}
						onHideSidebar={jest.fn()}
						onClose={jest.fn()}
						{...props}
					/>
				</MockedMediaClientProvider>
			</IntlProvider>,
		);
		return { fileItem, identifier };
	};

	beforeEach(() => {
		jest.mocked(ViewerIconButton).mockClear();
		jest.mocked(ToolbarDownloadButton).mockClear();
	});

	it('should be accessible', async () => {
		renderSidebarHeader({ title: 'Comments' });

		await waitFor(() => expect(screen.getByRole('button', { name: 'Download' })).toBeEnabled());
		await expect(document.body).toBeAccessible();
	});

	it('should show the title, then download, the sidebar toggle and close', async () => {
		renderSidebarHeader({ title: 'Comments' });

		expect(screen.getByRole('heading', { name: 'Comments' })).toBeInTheDocument();
		await waitFor(() => expect(screen.getByRole('button', { name: 'Download' })).toBeEnabled());
		expect(screen.getAllByRole('button')).toEqual([
			screen.getByRole('button', { name: 'Download' }),
			screen.getByRole('button', { name: 'Hide sidebar' }),
			screen.getByRole('button', { name: 'Close' }),
		]);
	});

	it('should show the sidebar toggle as selected, with the viewer ref and the consumer label', () => {
		const hideSidebarButtonRef = React.createRef<HTMLButtonElement>();
		renderSidebarHeader({ hideSidebarButtonRef, label: 'Hide comments' });

		expect(ViewerIconButton).toHaveBeenCalledWith(
			expect.objectContaining({
				testId: 'media-viewer-sidebar-button',
				isSelected: true,
				icon: PanelRightIcon,
				label: 'Hide comments',
				buttonRef: hideSidebarButtonRef,
			}),
			expect.anything(),
		);
	});

	it('should hide the sidebar and close the viewer from its buttons', () => {
		const onHideSidebar = jest.fn();
		const onClose = jest.fn();
		renderSidebarHeader({ onHideSidebar, onClose });

		fireEvent.click(screen.getByRole('button', { name: 'Hide sidebar' }));
		fireEvent.click(screen.getByRole('button', { name: 'Close' }));

		expect(onHideSidebar).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('should disable download when the file fails to load', async () => {
		const [, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
		const [otherFileItem] = generateSampleFileItem.workingVideo();
		renderSidebarHeader({}, [otherFileItem, identifier]);

		await waitFor(() => expect(screen.getByRole('button', { name: 'Download' })).toBeDisabled());
		expect(ToolbarDownloadButton).not.toHaveBeenCalled();
	});

	it('should download with the fallback name when the file has none', async () => {
		const fallbackMediaNameFetcher = jest.fn().mockResolvedValue('fallback-file-name.jpg');
		const { fileItem } = renderSidebarHeader(
			{ fallbackMediaNameFetcher },
			generateSampleFileItem.workingImgWithNoName(),
		);

		await waitFor(() =>
			expect(ToolbarDownloadButton).toHaveBeenLastCalledWith(
				expect.objectContaining({ fallbackMediaName: 'fallback-file-name.jpg' }),
				expect.anything(),
			),
		);
		expect(fallbackMediaNameFetcher).toHaveBeenCalledWith(fileItem.id);
	});

	it('should not fetch a fallback name when the file has one', async () => {
		const fallbackMediaNameFetcher = jest.fn();
		renderSidebarHeader({ fallbackMediaNameFetcher });

		await waitFor(() => expect(ToolbarDownloadButton).toHaveBeenCalled());
		expect(fallbackMediaNameFetcher).not.toHaveBeenCalled();
	});
});

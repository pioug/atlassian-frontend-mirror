import React, { useEffect } from 'react';
import { waitFor, cleanup } from '@testing-library/react';

let mockModalRender = jest.fn();
jest.mock('../../../../view/EmbedModal', () => ({
	__esModule: true,
	default: (...args: any) => mockModalRender(...args),
}));

import PreviewAction from '../../../../view/BlockCard/actions/PreviewAction';
import { openEmbedModal } from '../../../../view/EmbedModal/utils';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { mockAnalytics } from '../../../../utils/mocks';

describe('PreviewAction', () => {
	beforeEach(() => {
		mockModalRender = jest.fn().mockImplementation(() => <div>My modal mock</div>);
	});

	afterEach(() => {
		jest.clearAllMocks();
		cleanup();
	});

	it('sets up a renderer function which runs on execution of promise handler', async () => {
		const action = PreviewAction({ analytics: mockAnalytics });
		expect(action).toEqual({
			id: 'preview-content',
			text: expect.any(Object),
			promise: expect.any(Function),
		});

		const { container } = renderWithIntl(action.text);
		expect(container.textContent).toBe('Open preview');

		const handlerExecutor = action.promise;
		await handlerExecutor();
		expect(mockModalRender).toBeCalledTimes(1);
		expect(mockModalRender).toBeCalledWith(
			{
				iframeName: 'twp-editor-preview-iframe',
				onClose: expect.any(Function),
				providerName: 'Preview',
				showModal: true,
				analytics: expect.any(Object),
			},
			{},
		);
	});

	it('renders correctly using the openEmbedModal', async () => {
		const mockOnClose = jest.fn();
		const mockPopupMountPointId = 'twp-editor-preview-iframe';

		const PreviewWrapper = () => {
			useEffect(() => {
				openEmbedModal({
					onClose: mockOnClose,
					iframeName: 'my-iframe',
					analytics: mockAnalytics,
				});
			}, []);
			return <div>My Preview</div>;
		};

		const { getByTestId } = renderWithIntl(<PreviewWrapper />);
		const modal = await waitFor(() => getByTestId('preview-modal'));
		expect(modal).toBeTruthy();
		expect(modal.textContent).toBe('My modal mock');
		expect(modal.id).toBe(mockPopupMountPointId);
	});
});

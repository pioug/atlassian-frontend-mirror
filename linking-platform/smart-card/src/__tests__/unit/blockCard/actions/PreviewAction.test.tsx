import React, { useEffect } from 'react';

import { screen } from '@testing-library/react';

let mockModalRender = jest.fn();
jest.mock('../../../../view/EmbedModal', () => ({
	__esModule: true,
	default: (...args: any) => mockModalRender(...args),
}));

import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';

import { mockAnalytics } from '../../../../utils/mocks';
import PreviewAction from '../../../../view/BlockCard/actions/PreviewAction';
import { openEmbedModal } from '../../../../view/EmbedModal/utils';

describe('PreviewAction', () => {
	beforeEach(() => {
		mockModalRender = jest.fn().mockImplementation(() => <div>My modal mock</div>);
	});

	afterEach(() => {
		jest.clearAllMocks();
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
		expect(mockModalRender).toHaveBeenCalledTimes(1);
		expect(mockModalRender).toHaveBeenCalledWith(
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

		renderWithIntl(<PreviewWrapper />);
		const modal = await screen.findByTestId('preview-modal');
		expect(modal).toBeTruthy();
		expect(modal.textContent).toBe('My modal mock');
		expect(modal.id).toBe(mockPopupMountPointId);
	});
});

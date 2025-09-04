import React, { useEffect } from 'react';

import { screen } from '@testing-library/react';

import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { openEmbedModalInParent } from '../../../utils/iframe-utils';
import { openEmbedModal } from '../utils';

jest.mock('../../../utils/iframe-utils', () => ({
	openEmbedModalInParent: jest.fn(),
}));

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(),
}));

describe('openEmbedModal', () => {
	const testId = 'smart-embed-preview-modal';
	const mockOpenEmbedModalInParent = openEmbedModalInParent as jest.MockedFunction<
		typeof openEmbedModalInParent
	>;
	const mockExpValEquals = expValEquals as jest.MockedFunction<typeof expValEquals>;

	beforeEach(() => {
		jest.clearAllMocks();
		mockExpValEquals.mockReturnValue(false);
	});

	it('opens embed modal', async () => {
		const Wrapper = () => {
			useEffect(() => {
				openEmbedModal();
			}, []);
			return <div>Open</div>;
		};

		renderWithIntl(<Wrapper />);

		const modal = await screen.findByTestId(testId);
		expect(modal).toBeInTheDocument();

		const mountPoint = await screen.findByTestId('preview-modal');
		expect(mountPoint).toBeInTheDocument();
		expect(mountPoint?.id).toBe('twp-editor-preview-iframe');
	});

	it('should open embed modal with custom props', async () => {
		const customProps = {
			title: 'Custom Title',
			src: 'https://example.com',
			onClose: jest.fn(),
		};

		const Wrapper = () => {
			useEffect(() => {
				openEmbedModal(customProps);
			}, []);
			return <div>Open</div>;
		};

		renderWithIntl(<Wrapper />);

		await screen.findByTestId(testId);

		// Check that custom title is rendered
		const titleElement = await screen.findByTestId(`${testId}-title`);
		expect(titleElement).toHaveTextContent('Custom Title');
	});

	it('should send message to parent when preview panels are enabled and isInPreviewPanel is true', async () => {
		mockExpValEquals.mockReturnValue(true);

		const customProps = {
			title: 'Preview Panel Title',
			src: 'https://example.com',
			onClose: jest.fn(),
			isInPreviewPanel: true,
		};

		const Wrapper = () => {
			useEffect(() => {
				openEmbedModal(customProps);
			}, []);
			return <div>Open</div>;
		};

		renderWithIntl(<Wrapper />);

		expect(mockOpenEmbedModalInParent).toHaveBeenCalledWith(customProps);
		expect(mockExpValEquals).toHaveBeenCalledWith(
			'platform_hover_card_preview_panel',
			'cohort',
			'test',
		);
	});

	it('should render embed modal locally when preview panels are enabled but isInPreviewPanel is false', async () => {
		mockExpValEquals.mockReturnValue(true);

		const customProps = {
			title: 'Local Modal Title',
			src: 'https://example.com',
			onClose: jest.fn(),
			isInPreviewPanel: false,
		};

		const Wrapper = () => {
			useEffect(() => {
				openEmbedModal(customProps);
			}, []);
			return <div>Open</div>;
		};

		renderWithIntl(<Wrapper />);

		await screen.findByTestId(testId);

		// Should not call openEmbedModalInParent
		expect(mockOpenEmbedModalInParent).not.toHaveBeenCalled();
	});

	it('should render modal locally when preview panels are disabled regardless of isInPreviewPanel setting', async () => {
		mockExpValEquals.mockReturnValue(false);

		const customProps = {
			title: 'Local Modal Title',
			src: 'https://example.com',
			onClose: jest.fn(),
			isInPreviewPanel: true,
		};

		const Wrapper = () => {
			useEffect(() => {
				openEmbedModal(customProps);
			}, []);
			return <div>Open</div>;
		};

		renderWithIntl(<Wrapper />);

		await screen.findByTestId(testId);

		// Should not call openEmbedModalInParent
		expect(mockOpenEmbedModalInParent).not.toHaveBeenCalled();
	});

	it('should create mount point if it does not exist', async () => {
		// Remove any existing mount point
		const existingMountPoint = document.getElementById('twp-editor-preview-iframe');
		if (existingMountPoint) {
			existingMountPoint.remove();
		}

		const Wrapper = () => {
			useEffect(() => {
				openEmbedModal();
			}, []);
			return <div>Open</div>;
		};

		renderWithIntl(<Wrapper />);

		const modal = await screen.findByTestId(testId);
		expect(modal).toBeInTheDocument();

		const mountPoint = await screen.findByTestId('preview-modal');
		expect(mountPoint).toBeInTheDocument();
		expect(mountPoint?.id).toBe('twp-editor-preview-iframe');
	});
});

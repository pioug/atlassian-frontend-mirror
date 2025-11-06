import React, { useEffect } from 'react';

import { screen } from '@testing-library/react';

import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';

import { openEmbedModal } from '../utils';

describe('openEmbedModal', () => {
	const testId = 'smart-embed-preview-modal';

	beforeEach(() => {
		jest.clearAllMocks();
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

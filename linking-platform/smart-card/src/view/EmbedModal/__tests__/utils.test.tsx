import React, { useEffect } from 'react';

import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { openEmbedModal } from '../utils';

describe('openEmbedModal', () => {
	const testId = 'smart-embed-preview-modal';

	it('opens embed modal', async () => {
		const Wrapper = () => {
			useEffect(() => {
				openEmbedModal();
			}, []);
			return <div>Open</div>;
		};

		const { findByTestId } = renderWithIntl(<Wrapper />);

		const modal = await findByTestId(testId);
		expect(modal).toBeInTheDocument();

		const mountPoint = await findByTestId('preview-modal');
		expect(mountPoint).toBeInTheDocument();
		expect(mountPoint?.id).toBe('twp-editor-preview-iframe');
	});
});

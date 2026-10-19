import React from 'react';

import { render } from '@testing-library/react';

import { InsetViewerProvider } from '../../../../../insetViewerContext';
import { CodeViewerHeaderBar } from '../../../../../viewers/codeViewer/CodeViewerHeaderBar';

describe('CodeViewerHeaderBar', () => {
	it('should render the bar when the inset viewer is disabled', () => {
		const { container } = render(
			<InsetViewerProvider isInsetViewer={false}>
				<CodeViewerHeaderBar />
			</InsetViewerProvider>,
		);

		expect(container).not.toBeEmptyDOMElement();
	});

	it('should render nothing when the inset viewer is enabled', () => {
		const { container } = render(
			<InsetViewerProvider isInsetViewer>
				<CodeViewerHeaderBar />
			</InsetViewerProvider>,
		);

		expect(container).toBeEmptyDOMElement();
	});

	it('should be accessible', async () => {
		render(
			<InsetViewerProvider isInsetViewer={false}>
				<CodeViewerHeaderBar />
			</InsetViewerProvider>,
		);

		await expect(document.body).toBeAccessible();
	});
});

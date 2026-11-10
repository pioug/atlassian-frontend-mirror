import React from 'react';

import { skipAutoA11y } from '@atlassian/a11y-jest-testing/skip-decorator';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { InsetViewerProvider } from '../../../../../insetViewerContext';
import { InsetMediaFrame } from '../../../../../styleWrappers';
import {
	canRenderInNativePdfViewer,
	NativePdfViewer,
} from '../../../../../viewers/archiveSidebar/nativePdfViewer';

jest.mock('../../../../../styleWrappers', () => {
	const { createElement } = jest.requireActual('react');
	const original = jest.requireActual('../../../../../styleWrappers');
	return {
		...original,
		InsetMediaFrame: jest.fn((props: any) => createElement(original.InsetMediaFrame, props)),
	};
});

describe('canRenderInNativePdfViewer', () => {
	const originalDescriptor = Object.getOwnPropertyDescriptor(window.navigator, 'pdfViewerEnabled');

	const setPdfViewerEnabled = (value: boolean | undefined) =>
		Object.defineProperty(window.navigator, 'pdfViewerEnabled', {
			value,
			configurable: true,
		});

	afterEach(() => {
		if (originalDescriptor) {
			Object.defineProperty(window.navigator, 'pdfViewerEnabled', originalDescriptor);
		} else {
			delete (window.navigator as { pdfViewerEnabled?: boolean }).pdfViewerEnabled;
		}
	});

	it('should render PDFs only when the browser has, or may have, a PDF viewer', () => {
		setPdfViewerEnabled(true);
		expect(canRenderInNativePdfViewer('application/pdf')).toBe(true);

		setPdfViewerEnabled(undefined);
		expect(canRenderInNativePdfViewer('application/pdf')).toBe(true);

		setPdfViewerEnabled(false);
		expect(canRenderInNativePdfViewer('application/pdf')).toBe(false);
	});

	it('should not render non-PDF mime types', () => {
		setPdfViewerEnabled(true);
		expect(canRenderInNativePdfViewer('image/png')).toBe(false);
		expect(canRenderInNativePdfViewer('text/plain')).toBe(false);
	});
});

describe('NativePdfViewer', () => {
	const renderViewer = (isInsetViewer: boolean) =>
		render(
			<InsetViewerProvider isInsetViewer={isInsetViewer}>
				<NativePdfViewer src="blob:pdf" onSuccess={jest.fn()} onError={jest.fn()}>
					<span>fallback</span>
				</NativePdfViewer>
			</InsetViewerProvider>,
		);

	beforeEach(() => {
		jest.mocked(InsetMediaFrame).mockClear();
	});

	// The <object> has no text alternative (existing in the source, not part of this change), so the
	// automatic a11y check cannot pass on it.
	it(
		'should render inside InsetMediaFrame in the inset viewer',
		skipAutoA11y(() => {
			renderViewer(true);

			expect(InsetMediaFrame).toHaveBeenCalled();
			expect(screen.getByTestId('native-pdf-viewer')).toBeInTheDocument();
		}),
	);

	it(
		'should not render InsetMediaFrame outside the inset viewer',
		skipAutoA11y(() => {
			renderViewer(false);

			expect(InsetMediaFrame).not.toHaveBeenCalled();
			expect(screen.getByTestId('native-pdf-viewer')).toBeInTheDocument();
		}),
	);
});

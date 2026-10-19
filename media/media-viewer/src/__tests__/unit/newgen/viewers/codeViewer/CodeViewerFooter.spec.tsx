import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { CodeViewerFooter } from '../../../../../viewers/codeViewer/CodeViewerFooter';

describe('CodeViewerFooter', () => {
	let footerElement: HTMLDivElement;

	const renderFooter = (props: Partial<React.ComponentProps<typeof CodeViewerFooter>> = {}) =>
		render(
			<IntlProvider locale="en">
				<CodeViewerFooter
					lineCount={3}
					languageName="Python"
					footerElement={footerElement}
					{...props}
				/>
			</IntlProvider>,
		);

	beforeEach(() => {
		footerElement = document.createElement('div');
		document.body.appendChild(footerElement);
	});

	afterEach(() => {
		footerElement.remove();
	});

	it('should render the line count and the language into the footer element', () => {
		renderFooter();

		const footer = screen.getByTestId('media-viewer-code-footer');
		expect(footerElement).toContainElement(footer);
		expect(footer).toHaveTextContent('3 lines');
		expect(screen.getByTestId('media-viewer-code-footer-language')).toHaveTextContent('Python');
	});

	it('should use the singular for a one-line file', () => {
		renderFooter({ lineCount: 1 });

		expect(screen.getByTestId('media-viewer-code-footer')).toHaveTextContent('1 line');
	});

	it('should show only the language when there is no line count', () => {
		renderFooter({ lineCount: undefined });

		expect(screen.getByTestId('media-viewer-code-footer')).toHaveTextContent(/^Python$/);
	});

	it('should show Plain text when there is no language name', () => {
		renderFooter({ languageName: undefined });

		expect(screen.getByTestId('media-viewer-code-footer-language')).toHaveTextContent('Plain text');
	});

	it('should render nothing when there is no footer element', () => {
		const { container } = renderFooter({ footerElement: null });

		expect(container).toBeEmptyDOMElement();
		expect(screen.queryByTestId('media-viewer-code-footer')).not.toBeInTheDocument();
	});

	it('should be accessible', async () => {
		renderFooter();

		await expect(document.body).toBeAccessible();
	});
});

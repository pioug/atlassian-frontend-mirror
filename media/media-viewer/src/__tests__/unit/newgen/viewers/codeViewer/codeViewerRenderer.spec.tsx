import React from 'react';
import { CodeViewRenderer } from '../../../../../viewers/codeViewer/codeViewerRenderer';
import { render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

const defaultSrc = 'hello\n';
const defaultLanguage = 'c';

function createFixture(customSrc?: string) {
	const onClose = jest.fn();
	const onSuccess = jest.fn();
	const onError = jest.fn();

	const el = render(
		<IntlProvider locale="en">
			<CodeViewRenderer
				item={{
					id: '1',
					status: 'processing',
					mediaType: 'doc',
					mimeType: 'text/plain',
					name: 'file.txt',
					size: 1,
				}}
				src={customSrc || defaultSrc}
				onClose={onClose}
				onSuccess={onSuccess}
				onError={onError}
				language={defaultLanguage}
				testId="codeViewRenderer"
			/>
		</IntlProvider>,
	);

	return { el, onClose, onSuccess, onError };
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('CodeViewRenderer', () => {
	it('should call onSuccess when loaded, and onSuccess should render the CodeBlock component with the passed in language style if text (src) <= max formatted lines and fileSize is less than limit', async () => {
		const { onSuccess } = createFixture();
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());
		expect(screen.getByTestId('code-block')).toBeInTheDocument();

		expect(onSuccess).toHaveBeenCalled();
		expect(screen.getByTestId('code-block')).toBeInTheDocument();
		expect(screen.getByText('hello')).toBeInTheDocument();
	});

	it('should render file with html code if text (src) >= max formatted lines', async () => {
		const longString = defaultSrc.repeat(10001);

		const { onSuccess } = createFixture(longString);
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		expect(onSuccess).toHaveBeenCalled();
	});
});

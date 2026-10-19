import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { asMockFunction } from '@atlaskit/media-test-helpers/jestHelpers';

import { InsetViewerProvider } from '../../../../../insetViewerContext';
import { MediaFooterBar } from '../../../../../styleWrappers';
import { CodeViewerFooter } from '../../../../../viewers/codeViewer/CodeViewerFooter';
import { CodeViewRenderer } from '../../../../../viewers/codeViewer/CodeViewRenderer-2';

jest.mock('../../../../../viewers/codeViewer/CodeViewerFooter', () => {
	const original = jest.requireActual('../../../../../viewers/codeViewer/CodeViewerFooter');
	return { ...original, CodeViewerFooter: jest.fn(original.CodeViewerFooter) };
});

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

	describe('in the inset viewer', () => {
		const renderInsetViewer = ({ isInsetViewer = true, withFooter = true } = {}) =>
			render(
				<IntlProvider locale="en">
					<InsetViewerProvider isInsetViewer={isInsetViewer}>
						{withFooter && <MediaFooterBar />}
						<CodeViewRenderer
							item={{
								id: '1',
								status: 'processing',
								mediaType: 'doc',
								mimeType: 'text/plain',
								name: 'file.txt',
								size: 1,
							}}
							src={'hello brave world\n'}
							language={defaultLanguage}
							testId="codeViewRenderer"
						/>
					</InsetViewerProvider>
				</IntlProvider>,
			);

		const lastFooterProps = () => asMockFunction(CodeViewerFooter).mock.lastCall?.[0];

		beforeEach(() => {
			asMockFunction(CodeViewerFooter).mockClear();
		});

		it('should not render the footer when it is disabled', async () => {
			renderInsetViewer({ isInsetViewer: false });

			await screen.findByTestId('code-block');

			expect(CodeViewerFooter).not.toHaveBeenCalled();
		});

		it('should render the footer with the language name and the footer element when it is enabled', async () => {
			renderInsetViewer();

			await waitFor(() =>
				expect(lastFooterProps()).toEqual({
					languageName: 'C',
					footerElement: expect.any(HTMLElement),
				}),
			);
		});

		it('should pass no footer element when the footer is not mounted', async () => {
			renderInsetViewer({ withFooter: false });

			await waitFor(() => expect(lastFooterProps()?.footerElement).toBeNull());
		});
	});
});

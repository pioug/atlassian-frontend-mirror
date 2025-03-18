import React from 'react';
import { waitUntil } from '@atlaskit/elements-test-helpers';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { MockEmojiResource } from '@atlaskit/util-data-test/mock-emoji-resource';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { axe, toHaveNoViolations } from 'jest-axe';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as ImageUtil from '../../../../util/image';
import * as helperTestingLibrary from '../picker/_emoji-picker-helpers-testing-library';
import {
	getEmojiResourcePromise,
	createPngFile,
	pngDataURL,
	pngFileUploadData,
} from '../../_test-data';
import EmojiUploader, { type Props } from '../../../../components/uploader/EmojiUploader';
import { uploadPreviewTestId } from '../../../../components/common/EmojiUploadPreview';
import {
	uploadEmojiComponentTestId,
	uploadEmojiNameInputTestId,
} from '../../../../components/common/EmojiUploadPicker';
import {
	selectedFileEvent,
	uploadCancelButton,
	uploadConfirmButton,
	uploadFailedEvent,
	uploadSucceededEvent,
} from '../../../../util/analytics';
import { messages } from '../../../../components/i18n';
import { renderWithIntl } from '../../_testing-library';

const sampleEmoji = {
	name: 'Sample',
	shortName: ':sample:',
	width: 30,
	height: 30,
};

// Add matcher provided by 'jest-axe'
expect.extend(toHaveNoViolations);

export function setupUploader(props?: Props, onEvent?: () => void): void {
	const uploaderProps: Props = {
		...props,
	} as Props;

	if (!props || !props.emojiProvider) {
		uploaderProps.emojiProvider = getEmojiResourcePromise();
	}

	onEvent
		? renderWithIntl(
				<AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
					<EmojiUploader {...uploaderProps} />
				</AnalyticsListener>,
			)
		: renderWithIntl(<EmojiUploader {...uploaderProps} />);
}

describe('<EmojiUploader />', () => {
	const uploadPreviewShown = () => {
		const uploadPreview = screen.getByTestId('upload-preview');
		expect(uploadPreview).toBeInTheDocument();
		const uploadedEmojis = screen.getAllByAltText(`${sampleEmoji.shortName}`);
		expect(uploadedEmojis.length).toBe(2);
		const emoji = uploadedEmojis[0];
		expect(emoji.getAttribute('src')).toBe(pngDataURL);
	};

	const typeEmojiName = async () => {
		const emojiNameInput = await screen.findByTestId(uploadEmojiNameInputTestId);
		expect(emojiNameInput).toBeInTheDocument();
		helperTestingLibrary.typeEmojiName(sampleEmoji.shortName);
	};

	describe('display', () => {
		it('should display disabled emoji file chooser initially', async () => {
			setupUploader();
			const fileChooser = await screen.findByTestId('choose-file-button');
			expect(fileChooser).toBeInTheDocument();
			expect(fileChooser).toBeDisabled();
		});

		it('should show text input', async () => {
			setupUploader();
			const input = await screen.findByTestId('upload-emoji-name-input');
			expect(input).toBeInTheDocument();
		});

		it('should have emoji upload component', async () => {
			setupUploader();
			const component = await screen.findByTestId('upload-emoji-component');
			expect(component).toBeInTheDocument();
		});
	});

	describe('upload', () => {
		let onEvent: () => void;
		let emojiProvider: Promise<any>;

		beforeEach(async () => {
			jest.spyOn(ImageUtil, 'parseImage').mockImplementation(() => Promise.resolve(new Image()));

			jest.spyOn(ImageUtil, 'hasFileExceededSize').mockImplementation(() => false);

			jest.spyOn(ImageUtil, 'getNaturalImageSize').mockImplementation(() =>
				Promise.resolve({
					width: 30,
					height: 30,
				}),
			);

			onEvent = jest.fn();
			emojiProvider = getEmojiResourcePromise({
				uploadSupported: true,
			});
			setupUploader(
				{
					emojiProvider,
				},
				onEvent,
			);
		});

		it('Main upload flow', async () => {
			const provider = await emojiProvider;

			await typeEmojiName();

			await helperTestingLibrary.chooseFile(createPngFile());
			const addEmojiButton = await screen.findByTestId('upload-emoji-button');
			uploadPreviewShown();
			addEmojiButton.click();

			await waitUntil(() => provider.getUploads().length > 0);
			// Check uploaded emoji
			const uploads = provider.getUploads();
			expect(uploads).toHaveLength(1);
			const upload = uploads[0];
			expect(upload.upload).toEqual({
				...sampleEmoji,
				...pngFileUploadData,
			});
			expect(onEvent).toHaveBeenCalledTimes(3);

			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: selectedFileEvent(),
				}),
				'fabric-elements',
			);
			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: uploadConfirmButton({ retry: false }),
				}),
				'fabric-elements',
			);
			expect(onEvent).toHaveBeenLastCalledWith(
				expect.objectContaining({
					payload: uploadSucceededEvent({
						duration: expect.any(Number),
					}),
				}),
				'fabric-elements',
			);
			expect(await screen.findByTestId('upload-emoji-component')).toBeInTheDocument();
		});

		it('Upload failure with invalid file', async () => {
			jest
				.spyOn(ImageUtil, 'parseImage')
				.mockImplementation(() => Promise.reject(new Error('file error')));

			await emojiProvider;

			await typeEmojiName();

			await helperTestingLibrary.chooseFile(createPngFile());

			const errorMessage = await screen.findByTestId('emoji-error-message');
			expect(errorMessage.textContent).toContain(messages.emojiInvalidImage.defaultMessage);
		});

		it('should show error if file too big', async () => {
			jest.spyOn(ImageUtil, 'hasFileExceededSize').mockImplementation(() => true);

			await emojiProvider;

			const emojiNameInput = await screen.findByTestId(uploadEmojiNameInputTestId);
			expect(emojiNameInput).toBeInTheDocument();
			helperTestingLibrary.typeEmojiName(sampleEmoji.shortName);

			await helperTestingLibrary.chooseFile(createPngFile());

			expect(await screen.findByTestId('upload-emoji-component')).toBeInTheDocument();

			const errorMessage = await screen.findByTestId('emoji-error-message');
			expect(errorMessage.textContent).toContain(messages.emojiImageTooBig.defaultMessage);
		});

		it('should go back when cancel clicked', async () => {
			await typeEmojiName();

			await helperTestingLibrary.chooseFile(createPngFile());

			expect(await screen.findByTestId('upload-emoji-button')).toBeInTheDocument();

			uploadPreviewShown();

			const cancelLink = await screen.findByTestId('cancel-upload-button');
			cancelLink.click();
			// Should be back to initial screen
			expect(await screen.findByTestId('upload-emoji-component')).toBeInTheDocument();

			expect(onEvent).toHaveBeenCalledTimes(2);

			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: selectedFileEvent(),
				}),
				'fabric-elements',
			);
			expect(onEvent).toHaveBeenLastCalledWith(
				expect.objectContaining({
					payload: uploadCancelButton(),
				}),
				'fabric-elements',
			);
		});

		it('retry on upload error', async () => {
			// Silence error being internally logged by `uploadEmoji` on failure
			// eslint-disable-next-line no-console
			console.error = jest.fn();
			const spy = jest
				.spyOn(MockEmojiResource.prototype, 'uploadCustomEmoji')
				.mockImplementation(() => Promise.reject(new Error('upload error')));

			const provider = await emojiProvider;
			await typeEmojiName();

			await helperTestingLibrary.chooseFile(createPngFile());
			const addEmojiButton = await screen.findByTestId('upload-emoji-button');

			// Try adding
			addEmojiButton.click();

			// Check for error message
			const errorIcon = await screen.findByTestId('emoji-error-icon');
			await userEvent.hover(errorIcon);
			expect((await screen.findByTestId('emoji-error-message-tooltip')).textContent).toContain(
				messages.emojiUploadFailed.defaultMessage,
			);

			const retryButton = screen.getByRole('button', { name: messages.retryLabel.defaultMessage });
			expect(spy).toHaveBeenCalledTimes(1);

			// Reset mocking to make upload successful
			spy.mockRestore();

			// Successfully upload this time
			retryButton.click();
			await waitUntil(() => provider.getUploads().length > 0);

			expect(onEvent).toHaveBeenCalledTimes(5);

			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: selectedFileEvent(),
				}),
				'fabric-elements',
			);
			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: uploadConfirmButton({ retry: false }),
				}),
				'fabric-elements',
			);
			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: uploadFailedEvent({
						duration: expect.any(Number),
						reason: 'Upload failed',
					}),
				}),
				'fabric-elements',
			);
			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: uploadConfirmButton({ retry: true }),
				}),
				'fabric-elements',
			);
			expect(onEvent).toHaveBeenLastCalledWith(
				expect.objectContaining({
					payload: uploadSucceededEvent({
						duration: expect.any(Number),
					}),
				}),
				'fabric-elements',
			);
		});
	});

	describe('Accessibility', () => {
		let emojiProvider: Promise<any>;

		beforeEach(async () => {
			jest.spyOn(ImageUtil, 'parseImage').mockImplementation(() => Promise.resolve(new Image()));

			jest.spyOn(ImageUtil, 'hasFileExceededSize').mockImplementation(() => false);

			jest.spyOn(ImageUtil, 'getNaturalImageSize').mockImplementation(() =>
				Promise.resolve({
					width: 30,
					height: 30,
				}),
			);

			emojiProvider = getEmojiResourcePromise({
				uploadSupported: true,
			});
		});

		it('emoji upload picker should have no accessibility violations', async () => {
			const { container } = renderWithIntl(<EmojiUploader emojiProvider={emojiProvider} />);

			const uploadEmojiComponent = await screen.findByTestId(uploadEmojiComponentTestId);

			expect(uploadEmojiComponent).toBeInTheDocument();

			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});

		it('emoji upload preview should have no accessibility violations', async () => {
			const { container } = renderWithIntl(<EmojiUploader emojiProvider={emojiProvider} />);

			const emojiNameInput = await screen.findByTestId(uploadEmojiNameInputTestId);
			expect(emojiNameInput).toBeInTheDocument();

			// type name
			helperTestingLibrary.typeEmojiName(':cheese burger:');

			// choose file
			await helperTestingLibrary.chooseFile(createPngFile());

			const uploadEmojiPreviewComponent = await screen.findByTestId(uploadPreviewTestId);

			expect(uploadEmojiPreviewComponent).toBeInTheDocument();

			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});

		it('emoji upload preview error should have no accessibility violations', async () => {
			jest.spyOn(ImageUtil, 'hasFileExceededSize').mockImplementation(() => true);

			const { container } = renderWithIntl(<EmojiUploader emojiProvider={emojiProvider} />);

			const emojiNameInput = await screen.findByTestId(uploadEmojiNameInputTestId);
			expect(emojiNameInput).toBeInTheDocument();

			// type name
			helperTestingLibrary.typeEmojiName(':cheese burger:');

			// choose file
			await helperTestingLibrary.chooseFile(createPngFile());

			await waitFor(() => {
				expect(helperTestingLibrary.getEmojiErrorMessage()).toBeInTheDocument();
			});

			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});
	});
});

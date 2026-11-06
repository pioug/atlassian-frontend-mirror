import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
import { MockEmojiResource } from '@atlaskit/util-data-test/mock-emoji-resource';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import EmojiUploadPicker, {
	cancelEmojiUploadPickerTestId,
	uploadEmojiComponentTestId,
	uploadEmojiNameInputTestId,
} from '../../../../components/common/EmojiUploadPicker';
import { messages } from '../../../../components/i18n';
import EmojiUploader, { type Props } from '../../../../components/uploader/EmojiUploader';
import { selectedFileEvent } from '../../../../util/analytics/selectedFileEvent';
import { uploadCancelButton } from '../../../../util/analytics/uploadCancelButton';
import { uploadConfirmButton } from '../../../../util/analytics/uploadConfirmButton';
import { uploadFailedEvent } from '../../../../util/analytics/uploadFailedEvent';
import { uploadSucceededEvent } from '../../../../util/analytics/uploadSucceededEvent';
import * as ImageUtil from '../../../../util/image';
import {
	getEmojiResourcePromise,
	createPngFile,
	pngDataURL,
	pngFileUploadData,
} from '../../_test-data';
import { renderWithIntl } from '../../_testing-library';
import * as helperTestingLibrary from '../picker/_emoji-picker-helpers-testing-library';

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
	it.each([
		['enabled', passGate, true],
		['disabled', failGate, false],
	])(
		'handles duplicate emoji name errors when the accessibility gate is %s',
		async (_, setGate, enabled) => {
			setGate('platform_ally_emoji_fixes_various');
			const onUploadEmoji = jest.fn();
			const onUploadCancelled = jest.fn();
			const props = { onUploadEmoji, onUploadCancelled, initialUploadName: 'sample' };
			const { rerender } = renderWithIntl(<EmojiUploadPicker {...props} />);
			const input = screen.getByTestId(uploadEmojiNameInputTestId);
			const cancelButton = screen.getByTestId(cancelEmojiUploadPickerTestId);
			cancelButton.focus();

			rerender(
				<EmojiUploadPicker {...props} errorMessage={messages.emojiDuplicateName.defaultMessage} />,
			);

			const error = screen.getByText(messages.emojiDuplicateName.defaultMessage);
			if (enabled) {
				const alert = error.closest('#new-emoji-name-error');
				await waitFor(() => expect(input).toHaveFocus());
				expect(alert).toHaveAttribute('id', input.getAttribute('aria-describedby'));
				expect(alert).toHaveAttribute('role', 'alert');
				expect(alert).toHaveAttribute('aria-atomic', 'true');
			} else {
				expect(input).not.toHaveAttribute('aria-describedby');
				expect(cancelButton).toHaveFocus();
			}
		},
	);

	const uploadPreviewShown = () => {
		const emoji = helperTestingLibrary.getUploadPreview();
		expect(emoji).toHaveAttribute('alt', 'sample');
		expect(emoji.getAttribute('src')).toBe(pngDataURL);
	};

	const typeEmojiName = async () => {
		const emojiNameInput = await screen.findByTestId(uploadEmojiNameInputTestId);
		expect(emojiNameInput).toBeInTheDocument();
		helperTestingLibrary.typeEmojiName(sampleEmoji.shortName);
	};

	describe('display', () => {
		it('should display emoji file chooser initially', async () => {
			setupUploader();
			const fileChooser = await screen.findByTestId('choose-file-button');
			expect(fileChooser).toBeInTheDocument();
			expect(fileChooser).toBeEnabled();
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
			const addEmojiButton = await screen.findByRole('button', {
				name: messages.addEmojiLabel.defaultMessage,
			});
			uploadPreviewShown();
			addEmojiButton.click();

			await waitFor(() => expect(provider.getUploads().length).toBeGreaterThan(0));
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

			expect(
				await screen.findByRole('button', { name: messages.addEmojiLabel.defaultMessage }),
			).toBeInTheDocument();

			uploadPreviewShown();

			const cancelLink = await screen.findByTestId(cancelEmojiUploadPickerTestId);
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
			const addEmojiButton = await screen.findByRole('button', {
				name: messages.addEmojiLabel.defaultMessage,
			});

			// Try adding
			addEmojiButton.click();

			expect((await screen.findByTestId('emoji-error-message')).textContent).toContain(
				messages.emojiUploadFailed.defaultMessage,
			);
			expect(spy).toHaveBeenCalledTimes(1);

			// Reset mocking to make upload successful
			spy.mockRestore();

			// Successfully upload this time
			addEmojiButton.click();
			await waitFor(() => expect(provider.getUploads().length).toBeGreaterThan(0));

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

			expect(helperTestingLibrary.getUploadPreview()).toBeInTheDocument();

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

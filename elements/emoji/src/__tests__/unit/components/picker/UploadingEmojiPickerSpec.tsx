// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { MockEmojiResource } from '@atlaskit/util-data-test/mock-emoji-resource';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import console from 'console';
import EmojiRepository from '../../../../api/EmojiRepository';
import { emojiDeletePreviewTestId } from '../../../../components/common/EmojiDeletePreview';
import { cancelUploadButtonTestId } from '../../../../components/common/EmojiUploadPreview';
import { messages } from '../../../../components/i18n';
import {
	deleteBeginEvent,
	deleteCancelEvent,
	deleteConfirmEvent,
	selectedFileEvent,
	ufoExperiences,
	uploadBeginButton,
	uploadCancelButton,
	uploadConfirmButton,
	uploadFailedEvent,
	uploadSucceededEvent,
} from '../../../../util/analytics';
import * as ImageUtil from '../../../../util/image';
import {
	atlassianEmojis,
	createPngFile,
	getEmojiResourcePromise,
	getEmojiResourcePromiseFromRepository,
	getNonUploadingEmojiResourcePromise,
	mediaEmoji,
	pngFileUploadData,
	siteEmojiFoo,
	standardEmojis,
} from '../../_test-data';
import * as helperTestingLibrary from './_emoji-picker-helpers-testing-library';
import * as helper from './_emoji-picker-test-helpers';

import userEvent from '@testing-library/user-event';
import * as utils from '../../../../components/picker/utils';
import { cancelEmojiUploadPickerTestId } from '../../../../components/common/EmojiUploadPicker';
import { EmojiPickerVirtualListInternalOld as EmojiPickerVirtualList } from '../../../../components/picker/EmojiPickerList';
import * as constants from '../../../../util/constants';

// Turn off delay to allow using user events with fake timers
const userEventWithoutDelay = userEvent.setup({ delay: null });

describe('<UploadingEmojiPicker />', () => {
	let onEvent: jest.SpyInstance;

	const experience = ufoExperiences['emoji-uploaded'];
	const ufoStartSpy = jest.spyOn(experience, 'start');
	const ufoSuccessSpy = jest.spyOn(experience, 'success');
	const ufoFailureSpy = jest.spyOn(experience, 'failure');

	beforeEach(async () => {
		onEvent = jest.fn();
	});

	afterEach(jest.clearAllMocks);

	beforeAll(() => {
		// scrolling of the virutal list doesn't work out of the box for the tests
		// mocking `scrollToRow` for all tests
		// Cleanup `platform_editor_react18_elements_emoji`: remove this next jest.spyOn
		// since it's for the class component (which has been refactored into FC)
		jest
			.spyOn(EmojiPickerVirtualList.prototype, 'scrollToRow')
			.mockImplementation((index?: number) => helperTestingLibrary.scrollToIndex(index || 0));
		jest
			.spyOn(utils, 'scrollToRow')
			.mockImplementation((listRef?: any, index?: number) =>
				helperTestingLibrary.scrollToIndex(index || 0),
			);

		// set search debounce to 0
		Object.defineProperty(constants, 'EMOJI_SEARCH_DEBOUNCE', { value: 0 });
	});

	describe('upload', () => {
		let consoleError: jest.SpyInstance;
		let emojiProvider: Promise<any>;

		beforeEach(() => {
			consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

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

		afterEach(() => {
			consoleError.mockRestore();
			ufoStartSpy.mockClear();
			ufoSuccessSpy.mockClear();
			ufoFailureSpy.mockClear();
		});

		it('Non-uploading EmojiResource - no upload UI', async () => {
			const emojiProvider = getNonUploadingEmojiResourcePromise();
			await helper.setupPicker({ emojiProvider });

			await waitFor(() => {
				expect(helperTestingLibrary.getEmojiActionsSection()).toBeInTheDocument();
				expect(helperTestingLibrary.queryAddCustomEmojiButton()).not.toBeInTheDocument();
			});
		});

		it('UploadingEmojiResource - "without media token" - no upload UI', async () => {
			await helper.setupPicker();

			await waitFor(() => {
				expect(helperTestingLibrary.getEmojiActionsSection()).toBeInTheDocument();
				expect(helperTestingLibrary.queryAddCustomEmojiButton()).not.toBeInTheDocument();
			});
		});

		it('UploadingEmojiResource - "with media token" - upload UI', async () => {
			await helper.setupPicker({ emojiProvider });

			await waitFor(() => {
				expect(helperTestingLibrary.getEmojiActionsSection()).toBeInTheDocument();
				expect(helperTestingLibrary.queryAddCustomEmojiButton()).toBeInTheDocument();
			});
		});

		it('Upload main flow interaction', async () => {
			onEvent = jest.fn();
			const emojiProvider = getEmojiResourcePromise({
				uploadSupported: true,
				currentUser: { id: 'blackpanther' },
			});
			await helper.setupPicker(
				{
					emojiProvider,
					hideToneSelector: true,
				},
				undefined,
				onEvent,
			);
			const provider = await emojiProvider;

			// click add
			await waitFor(() => {
				expect(helperTestingLibrary.getEmojiActionsSection()).toBeInTheDocument();
			});

			const addCustomEmojiButton = await helperTestingLibrary.getAddCustomEmojiButton();
			await userEvent.click(addCustomEmojiButton);

			await waitFor(() => {
				expect(helperTestingLibrary.getUploadEmojiNameInput()).toBeInTheDocument();
			});

			// type name
			helperTestingLibrary.typeEmojiName(':cheese burger:');

			// choose file
			await helperTestingLibrary.chooseFile(createPngFile());

			// check upload preview is shown
			await waitFor(() => {
				expect(helperTestingLibrary.getUploadPreview()).toBeInTheDocument();
			});

			const emojiInPreview = within(helperTestingLibrary.getUploadPreview()).getAllByTestId(
				'image-emoji-:cheese_burger:',
			);
			expect(emojiInPreview.length).toBe(2);

			jest.useFakeTimers();
			// trigger upload
			const uploadEmojiButton = helperTestingLibrary.getUploadEmojiButton();
			await userEventWithoutDelay.click(uploadEmojiButton);
			// wait for upload
			await waitFor(() => {
				expect(provider.getUploads().length).toEqual(1);
			});

			const uploads = provider.getUploads();
			const upload = uploads[0];
			expect(upload.upload).toEqual({
				name: 'Cheese burger',
				shortName: ':cheese_burger:',
				...pngFileUploadData,
				width: 30,
				height: 30,
			});

			await helperTestingLibrary.scrollToIndex(
				Math.round(standardEmojis.length) + Math.round(atlassianEmojis.length),
			);
			await waitFor(() => {
				// upload preview should disappear
				expect(screen.queryByTestId(cancelUploadButtonTestId)).not.toBeInTheDocument();
			});
			// list is scrolled to the new emoji, with preview emoji shown as well
			expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
			expect(
				within(helperTestingLibrary.getVirtualList()).getAllByTestId('image-emoji-:cheese_burger:')
					.length,
			).toBe(2);
			// picker footer is in the view
			expect(helperTestingLibrary.getEmojiPickerFooter()).toBeInTheDocument();

			// picker footer is displaying the uploaded emoji
			expect(
				within(helperTestingLibrary.getEmojiPickerFooter()).getByTestId(
					'image-emoji-:cheese_burger:',
				),
			).toBeInTheDocument();

			// "add custom emoji" button should appear
			expect(await helperTestingLibrary.getAddCustomEmojiButton()).toBeInTheDocument();

			expect(onEvent).toHaveBeenCalled();

			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: uploadBeginButton(),
				}),
				'fabric-elements',
			);
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
					payload: uploadSucceededEvent({
						duration: expect.any(Number),
					}),
				}),
				'fabric-elements',
			);

			const virtualList = helperTestingLibrary.getVirtualList();
			await waitFor(() => {
				expect(virtualList).toBeInTheDocument();
			});

			// let scroll finish after timeout
			jest.runAllTimers();

			expect(screen.getByText('Your uploads')).toBeInTheDocument();
			// focus on the first uploaded emoji, which is under your uploads category.
			expect(within(virtualList).queryAllByTestId('image-emoji-:cheese_burger:')[0]).toHaveFocus();

			expect(ufoStartSpy).toHaveBeenCalled();
			expect(ufoSuccessSpy).toHaveBeenCalled();
			expect(ufoFailureSpy).not.toHaveBeenCalled();

			jest.useRealTimers();
			ufoStartSpy.mockReset();
			ufoSuccessSpy.mockReset();
			ufoFailureSpy.mockReset();
		});

		it('Upload failure with invalid file', async () => {
			jest
				.spyOn(ImageUtil, 'parseImage')
				.mockImplementation(() => Promise.reject(new Error('file error')));

			await helper.setupPicker({
				emojiProvider,
				hideToneSelector: true,
			});
			await emojiProvider;

			// click add
			await waitFor(async () => {
				expect(helperTestingLibrary.getEmojiActionsSection()).toBeInTheDocument();
			});

			const addCustomEmojiButton = await helperTestingLibrary.getAddCustomEmojiButton();

			await userEvent.click(addCustomEmojiButton);

			await waitFor(() => {
				expect(helperTestingLibrary.getUploadEmojiNameInput()).toBeInTheDocument();
			});

			// type name
			helperTestingLibrary.typeEmojiName(':cheese burger:');

			// choose file
			await helperTestingLibrary.chooseFile(createPngFile());

			await waitFor(() => {
				expect(helperTestingLibrary.getEmojiErrorMessage()).toBeInTheDocument();
			});

			// Expect to have 2 identical error message texts
			// as we have one for visual display and one for accessibility message (visually hidden)
			screen
				.getAllByText(messages.emojiInvalidImage.defaultMessage)
				.forEach((element) => expect(element).toBeInTheDocument());
		});

		it('Upload failure with file too big', async () => {
			jest.spyOn(ImageUtil, 'hasFileExceededSize').mockImplementation(() => true);

			await helper.setupPicker({
				emojiProvider,
				hideToneSelector: true,
			});
			await emojiProvider;

			// click add
			await waitFor(async () => {
				expect(helperTestingLibrary.getEmojiActionsSection()).toBeInTheDocument();
			});

			const addCustomEmojiButton = await helperTestingLibrary.getAddCustomEmojiButton();

			await userEvent.click(addCustomEmojiButton);

			await waitFor(() => {
				expect(helperTestingLibrary.getUploadEmojiNameInput()).toBeInTheDocument();
			});

			// type name
			helperTestingLibrary.typeEmojiName(':cheese burger:');

			// choose file
			await helperTestingLibrary.chooseFile(createPngFile());

			await waitFor(() => {
				expect(helperTestingLibrary.getEmojiErrorMessage()).toBeInTheDocument();
			});

			// Expect to have 2 identical error message texts
			// as we have one for visual display and one for accessibility message (visually hidden)
			screen
				.getAllByText(messages.emojiImageTooBig.defaultMessage)
				.forEach((element) => expect(element).toBeInTheDocument());
		});

		it('Upload after searching', async () => {
			await helper.setupPicker({
				emojiProvider,
				hideToneSelector: true,
			});
			const provider = await emojiProvider;

			await waitFor(() => {
				expect(helperTestingLibrary.getEmojiSearchInput()).toBeInTheDocument();
			});

			await helperTestingLibrary.searchEmoji('cheese burger');

			await waitFor(() => {
				expect(screen.queryByTestId('image-emoji-:cheese_burger:')).not.toBeInTheDocument();
			});

			// click add
			await waitFor(async () => {
				expect(helperTestingLibrary.getEmojiActionsSection()).toBeInTheDocument();
			});

			const addCustomEmojiButton = await helperTestingLibrary.getAddCustomEmojiButton();
			await userEvent.click(addCustomEmojiButton);

			await waitFor(() => {
				expect(helperTestingLibrary.getUploadEmojiNameInput()).toBeInTheDocument();
			});

			expect(screen.getByDisplayValue('cheese_burger')).toBeInTheDocument();

			// choose file
			await helperTestingLibrary.chooseFile(createPngFile());

			// check upload preview is shown
			await waitFor(() => {
				expect(helperTestingLibrary.getUploadPreview()).toBeInTheDocument();
			});

			const emojiInPreview = within(helperTestingLibrary.getUploadPreview()).getAllByTestId(
				'image-emoji-:cheese_burger:',
			);
			expect(emojiInPreview.length).toBe(2);

			jest.useFakeTimers();
			// trigger upload
			const uploadEmojiButton = helperTestingLibrary.getUploadEmojiButton();
			await userEventWithoutDelay.click(uploadEmojiButton);

			// wait for upload
			await waitFor(() => {
				expect(provider.getUploads().length).toEqual(1);
			});

			const uploads = provider.getUploads();
			const upload = uploads[0];
			expect(upload.upload).toEqual({
				name: 'Cheese burger',
				shortName: ':cheese_burger:',
				...pngFileUploadData,
				width: 30,
				height: 30,
			});

			await waitFor(() => {
				expect(screen.queryByTestId(cancelUploadButtonTestId)).not.toBeInTheDocument();
			});

			expect(await helperTestingLibrary.getAddCustomEmojiButton()).toBeInTheDocument();

			// let scroll finish after timeout
			jest.runAllTimers();

			const cheeseBurgerEmoji = await screen.findAllByRole('img', {
				name: ':cheese_burger:',
			});
			// This is unexpected behaviour, focus goes to the body in JSDom
			expect(cheeseBurgerEmoji[0]).not.toHaveFocus();

			jest.useRealTimers();
		});

		it('Upload cancel interaction', async () => {
			onEvent = jest.fn();
			await helper.setupPicker(
				{
					emojiProvider,
					hideToneSelector: true,
				},
				undefined,
				onEvent,
			);
			const provider = await emojiProvider;

			// click add
			await waitFor(async () => {
				expect(helperTestingLibrary.getEmojiActionsSection()).toBeInTheDocument();
			});

			const addCustomEmojiButton = await helperTestingLibrary.getAddCustomEmojiButton();

			await userEvent.click(addCustomEmojiButton);

			await waitFor(() => {
				expect(helperTestingLibrary.getUploadEmojiNameInput()).toBeInTheDocument();
			});

			// type name
			helperTestingLibrary.typeEmojiName(':cheese burger:');

			// choose file
			await helperTestingLibrary.chooseFile(createPngFile());

			// check upload preview is shown
			await waitFor(() => {
				expect(helperTestingLibrary.getUploadPreview()).toBeInTheDocument();
			});

			const emojiInPreview = within(helperTestingLibrary.getUploadPreview()).getAllByTestId(
				'image-emoji-:cheese_burger:',
			);
			expect(emojiInPreview.length).toBe(2);

			// cancel upload
			helperTestingLibrary.cancelUpload();

			// wait for emoji picker footer to appear and upload preview to disappear
			await waitFor(() => {
				expect(helperTestingLibrary.queryUploadPreview()).not.toBeInTheDocument();
			});

			expect(provider.getUploads().length).toBe(0);

			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: uploadBeginButton(),
				}),
				'fabric-elements',
			);
			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: selectedFileEvent(),
				}),
				'fabric-elements',
			);
			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: uploadCancelButton(),
				}),
				'fabric-elements',
			);
		});

		it('Focus Add Emoji Button after upload cancel interaction when it was previously focused', async () => {
			await helper.setupPicker(
				{
					emojiProvider,
					hideToneSelector: true,
				},
				undefined,
				onEvent,
			);

			// click add
			await waitFor(async () => {
				expect(helperTestingLibrary.getEmojiActionsSection()).toBeInTheDocument();
			});

			const addCustomEmojiButton = await helperTestingLibrary.getAddCustomEmojiButton();

			// fireEvent.focus(addCustomEmojiButton);
			addCustomEmojiButton.focus();

			await waitFor(() => {
				expect(document.activeElement).toBe(addCustomEmojiButton);
			});

			await userEvent.click(addCustomEmojiButton);

			await waitFor(() => {
				expect(helperTestingLibrary.getUploadEmojiNameInput()).toBeInTheDocument();
			});

			const closeButton = screen.getByTestId(cancelEmojiUploadPickerTestId);
			await userEvent.click(closeButton);

			// wait for emoji picker footer to appear and upload preview to disappear
			await waitFor(() => {
				expect(helperTestingLibrary.queryUploadPreview()).not.toBeInTheDocument();
			});

			const addCustomEmojiButtonAfterCancel = await helperTestingLibrary.getAddCustomEmojiButton();

			await waitFor(() => expect(addCustomEmojiButtonAfterCancel).toHaveFocus());
		});

		it('Upload error interaction', async () => {
			const spy = jest
				.spyOn(MockEmojiResource.prototype, 'uploadCustomEmoji')
				.mockImplementation(() => Promise.reject(new Error('upload error')));

			await helper.setupPicker(
				{
					emojiProvider,
					hideToneSelector: true,
				},
				undefined,
				onEvent,
			);
			const provider = await emojiProvider;

			// click add
			await waitFor(async () => {
				expect(helperTestingLibrary.getEmojiActionsSection()).toBeInTheDocument();
			});

			const addCustomEmojiButton = await helperTestingLibrary.getAddCustomEmojiButton();

			await userEvent.click(addCustomEmojiButton);

			await waitFor(() => {
				expect(helperTestingLibrary.getUploadEmojiNameInput()).toBeInTheDocument();
			});

			// type name
			helperTestingLibrary.typeEmojiName(':cheese burger:');

			// choose file
			await helperTestingLibrary.chooseFile(createPngFile());
			await waitFor(() => {
				expect(helperTestingLibrary.getUploadPreview()).toBeInTheDocument();
			});

			// trigger upload
			helperTestingLibrary.uploadNewEmoji();

			await waitFor(() => {
				expect(helperTestingLibrary.getEmojiErrorMessage()).toBeInTheDocument();
				expect(helperTestingLibrary.getEmojiErrorIcon()).toBeInTheDocument();
			});

			// toggle error message
			fireEvent.mouseOver(helperTestingLibrary.getEmojiErrorIcon());

			await waitFor(() => {
				expect(helperTestingLibrary.getEmojiErrorMessageTooltip()).toBeInTheDocument();
			});

			// tooltip displays correct error message
			expect(
				within(helperTestingLibrary.getEmojiErrorMessageTooltip()).getByText(
					messages.emojiUploadFailed.defaultMessage,
				),
			).toBeInTheDocument();

			expect(screen.getByText('Retry')).toBeInTheDocument();

			helperTestingLibrary.cancelUpload();
			await waitFor(async () => {
				expect(await helperTestingLibrary.getAddCustomEmojiButton()).toBeInTheDocument();
			});

			// No uploads occurred
			const uploads = provider.getUploads();

			expect(uploads).toHaveLength(0);

			expect(onEvent).toHaveBeenCalled();

			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: uploadBeginButton(),
				}),
				'fabric-elements',
			);
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
						reason: expect.any(String),
					}),
				}),
				'fabric-elements',
			);
			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: uploadCancelButton(),
				}),
				'fabric-elements',
			);
			expect(ufoStartSpy).toHaveBeenCalled();
			expect(ufoSuccessSpy).not.toHaveBeenCalled();
			expect(ufoFailureSpy).toHaveBeenCalled();

			spy.mockReset();
		});

		it('Retry on upload error', async () => {
			const spy = jest
				.spyOn(MockEmojiResource.prototype, 'uploadCustomEmoji')
				.mockImplementation(() => Promise.reject(new Error('upload error')));

			await helper.setupPicker(
				{
					emojiProvider,
					hideToneSelector: true,
				},
				undefined,
				onEvent,
			);
			const provider = await emojiProvider;

			// click add
			await waitFor(async () => {
				expect(helperTestingLibrary.getEmojiActionsSection()).toBeInTheDocument();
			});

			const addCustomEmojiButton = await helperTestingLibrary.getAddCustomEmojiButton();

			await userEvent.click(addCustomEmojiButton);

			await waitFor(() => {
				expect(helperTestingLibrary.getUploadEmojiNameInput()).toBeInTheDocument();
			});

			// type name
			helperTestingLibrary.typeEmojiName(':cheese burger:');

			// choose file
			await helperTestingLibrary.chooseFile(createPngFile());
			await waitFor(() => {
				expect(helperTestingLibrary.getUploadPreview()).toBeInTheDocument();
			});

			// trigger upload
			helperTestingLibrary.uploadNewEmoji();

			await waitFor(() => {
				expect(helperTestingLibrary.getEmojiErrorMessage()).toBeInTheDocument();
				expect(helperTestingLibrary.getEmojiErrorIcon()).toBeInTheDocument();
			});

			// toggle error message
			fireEvent.mouseOver(helperTestingLibrary.getEmojiErrorIcon());

			await waitFor(() => {
				expect(helperTestingLibrary.getEmojiErrorMessageTooltip()).toBeInTheDocument();
			});

			// tooltip displays correct error message
			expect(
				within(helperTestingLibrary.getEmojiErrorMessageTooltip()).getByText(
					messages.emojiUploadFailed.defaultMessage,
				),
			).toBeInTheDocument();

			expect(screen.getByText('Retry')).toBeInTheDocument();

			// remove mock to make upload successful
			// @ts-ignore: prevent TS from complaining about mockRestore function
			spy.mockRestore();

			helperTestingLibrary.retryUpload();

			// wait for upload
			await waitFor(() => {
				expect(provider.getUploads().length).toEqual(1);
			});

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
						reason: expect.any(String),
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
			expect(onEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: uploadSucceededEvent({
						duration: expect.any(Number),
					}),
				}),
				'fabric-elements',
			);

			// failed first, and retried success second time
			expect(ufoStartSpy).toHaveBeenCalledTimes(2);
			expect(ufoSuccessSpy).toHaveBeenCalledTimes(1);
			expect(ufoFailureSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('delete', () => {
		let getUserProvider;
		let emojiProvider: Promise<any>;
		let onEvent: jest.SpyInstance;

		beforeEach(() => {
			onEvent = jest.fn();
			// Initialise repository with clone of siteEmojis
			const repository = new EmojiRepository(
				JSON.parse(JSON.stringify([mediaEmoji, siteEmojiFoo])),
			);
			getUserProvider = () =>
				getEmojiResourcePromiseFromRepository(repository, {
					currentUser: { id: 'hulk' },
				});
			emojiProvider = getUserProvider();
		});

		const getEmojiDeletePreview = () => screen.getByTestId(emojiDeletePreviewTestId);

		// Click delete button on user emoji in picker
		const openDeletePrompt = async () => {
			await waitFor(() => {
				expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
			});

			const deleteButton = await screen.findByTestId('emoji-delete-button');
			fireEvent.click(deleteButton);

			await waitFor(() => {
				expect(getEmojiDeletePreview()).toBeInTheDocument();
			});
		};

		const queryEmojiDeletePreview = () => screen.queryByTestId(emojiDeletePreviewTestId);

		// Click 'Remove' in delete preview
		const clickRemove = async () => {
			const removeButton = within(getEmojiDeletePreview()).getAllByRole('button')[0];
			await userEvent.click(removeButton);
		};

		const clickCancelDelete = async () => {
			const cancelDeleteButton = within(getEmojiDeletePreview()).getAllByRole('button')[1];
			await userEvent.click(cancelDeleteButton);
		};

		it('shows the emoji delete preview when the delete button is clicked', async () => {
			await helper.setupPicker({ emojiProvider }, undefined, onEvent);
			await openDeletePrompt();
		});

		it('calls #deleteSiteEmoji with the emoji to delete when button is clicked', async () => {
			const spy = jest.spyOn(MockEmojiResource.prototype, 'deleteSiteEmoji');

			await helper.setupPicker({ emojiProvider }, undefined, onEvent);
			await openDeletePrompt();
			clickRemove();
			// Delete called with user custom emoji
			await waitFor(() => expect(spy).toHaveBeenCalledWith(siteEmojiFoo));
		});

		it('fires analytics for confirmed deletion path', async () => {
			await helper.setupPicker({ emojiProvider }, undefined, onEvent);
			await openDeletePrompt();
			expect(onEvent).toHaveBeenLastCalledWith(
				expect.objectContaining({
					payload: deleteBeginEvent({ emojiId: siteEmojiFoo.id }),
				}),
				'fabric-elements',
			);

			await waitFor(() =>
				expect(onEvent).not.toHaveBeenCalledWith(
					expect.objectContaining({
						payload: deleteConfirmEvent({ emojiId: siteEmojiFoo.id }),
					}),
					'fabric-elements',
				),
			);

			clickRemove();

			await waitFor(() =>
				expect(onEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						payload: deleteConfirmEvent({ emojiId: siteEmojiFoo.id }),
					}),
					'fabric-elements',
				),
			);
		});

		it('fires analytics for deletion cancel', async () => {
			await helper.setupPicker({ emojiProvider }, undefined, onEvent);
			await openDeletePrompt();
			clickCancelDelete();
			await waitFor(() =>
				expect(onEvent).toHaveBeenLastCalledWith(
					expect.objectContaining({
						payload: deleteCancelEvent({ emojiId: siteEmojiFoo.id }),
					}),
					'fabric-elements',
				),
			);
		});

		it('closes the delete preview onCancel', async () => {
			await helper.setupPicker({ emojiProvider }, undefined, onEvent);
			await openDeletePrompt();
			clickCancelDelete();
			await waitFor(() => {
				expect(queryEmojiDeletePreview()).not.toBeInTheDocument();
			});
		});

		it('cannot find deleted emoji from provider', async () => {
			await helper.setupPicker({ emojiProvider }, undefined, onEvent);

			const provider = await emojiProvider;

			await waitFor(async () => {
				expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
			});

			expect(await provider.findById('foo')).toEqual(siteEmojiFoo);

			await openDeletePrompt();

			clickRemove();

			await waitFor(() => {
				expect(queryEmojiDeletePreview()).not.toBeInTheDocument();
			});

			expect(await provider.findById('foo')).toBeUndefined();
		});

		it('deleting user emoji removes from both sections', async () => {
			await helper.setupPicker({ emojiProvider }, undefined, onEvent);
			await openDeletePrompt();
			clickRemove();

			await waitFor(() => {
				expect(queryEmojiDeletePreview()).not.toBeInTheDocument();
			});

			// Emoji removed from 'Your uploads' and 'All uploads'
			await waitFor(() =>
				expect(within(helperTestingLibrary.getVirtualList()).getAllByRole('button').length).toEqual(
					1,
				),
			);
		});

		it('removes Your Uploads if the only user emoji was deleted', async () => {
			await helper.setupPicker({ emojiProvider }, undefined, onEvent);

			await waitFor(async () => {
				expect(helperTestingLibrary.getVirtualList()).toBeInTheDocument();
			});
			// show 'Your uploads'
			await screen.findByText('Your uploads');

			await openDeletePrompt();
			clickRemove();

			await waitFor(() => {
				expect(queryEmojiDeletePreview()).not.toBeInTheDocument();
			});
			await waitFor(() => {
				expect(screen.queryByText('Your uploads')).not.toBeInTheDocument();
			});
		});

		it('does not remove emoji from list on failure', async () => {
			const spy = jest
				.spyOn(MockEmojiResource.prototype, 'deleteSiteEmoji')
				.mockImplementation(() => Promise.resolve(false));

			await helper.setupPicker({ emojiProvider }, undefined, onEvent);

			await openDeletePrompt();

			clickRemove();

			await waitFor(() => {
				expect(helperTestingLibrary.getEmojiErrorMessage()).toBeInTheDocument();
			});

			// Same number of emoji
			expect(within(helperTestingLibrary.getVirtualList()).getAllByRole('button').length).toEqual(
				3,
			);
			spy.mockReset();
		});

		it('displays a retry button if call to #deleteSiteEmoji fails', async () => {
			const spy = jest
				.spyOn(MockEmojiResource.prototype, 'deleteSiteEmoji')
				.mockImplementation(() => Promise.resolve(false));

			await helper.setupPicker({ emojiProvider }, undefined, onEvent);

			await await openDeletePrompt();
			clickRemove();

			await waitFor(() => {
				expect(helperTestingLibrary.getEmojiErrorMessage()).toBeInTheDocument();
			});

			expect(within(getEmojiDeletePreview()).getByText('Retry')).toBeInTheDocument();
			spy.mockReset();
		});

		it('calls #deleteSiteEmoji again on retry', async () => {
			const spy = jest
				.spyOn(MockEmojiResource.prototype, 'deleteSiteEmoji')
				.mockImplementation(() => Promise.resolve(false));

			await helper.setupPicker({ emojiProvider }, undefined, onEvent);

			await openDeletePrompt();
			clickRemove();

			await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));

			// Expect error to occur
			await waitFor(() => {
				expect(helperTestingLibrary.getEmojiErrorMessage()).toBeInTheDocument();
			});

			const retryButton = within(getEmojiDeletePreview()).getByText('Retry');
			await userEvent.click(retryButton);

			// Tries to call #deleteSiteEmoji again
			expect(spy).toHaveBeenCalledTimes(2);
			spy.mockReset();
		});
	});
});

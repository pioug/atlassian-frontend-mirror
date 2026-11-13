// NOTE: the source now imports `dataURItoFile` from the `@atlaskit/media-ui/dataURItoFile`
// subpath (Volt debarrel), so the mock must target that subpath, not the `@atlaskit/media-ui`
// barrel. `jest.mock` is hoisted above module-level `const`s, so the factory creates the
// mocked File inline to avoid a temporal-dead-zone reference to an outer `const`.
jest.mock('@atlaskit/media-ui/dataURItoFile', () => ({
	...jest.requireActual('@atlaskit/media-ui/dataURItoFile'),
	dataURItoFile: jest.fn(
		() =>
			new File(['dsjklDFljk'], 'nice-photo.png', {
				type: 'image/png',
			}),
	),
}));

import React from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { smallImage } from '@atlaskit/media-test-helpers/smallImageURI';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { type Avatar } from '../../avatar-list';
import { AvatarPickerDialog, fixedCrop } from '../../avatar-picker-dialog';
import { DEFAULT_VISIBLE_PREDEFINED_AVATARS } from '../../avatar-picker-dialog/layout-const';
import * as exportCroppedImageModule from '../../image-navigator/exportCroppedImage';
import * as utilModule from '../../util';

// Polyfill needed for CSS.supports
// @ts-ignore
if (window.CSS.supports) {
	jest.spyOn(window.CSS, 'supports').mockImplementation(() => false);
} else {
	window.CSS.supports = () => false;
}

const croppedImgDataURI = 'data:image/meme;based64:w0w';
jest
	.spyOn(exportCroppedImageModule, 'exportCroppedImage')
	.mockImplementation(() => croppedImgDataURI);

const someAvatar = { dataURI: 'http://an.avatar.com/456', name: 'a-nice-avatar.jpg' };

describe('Avatar Picker Dialog', () => {
	it('should capture and report a11y violations', async () => {
		const onImagePicked = jest.fn();
		const { container } = render(
			<AvatarPickerDialog
				imageSource={smallImage}
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={onImagePicked}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		await expect(container).toBeAccessible();
	});

	it('should handle the proper focus management for show more & go back buttons from in avatar picker dialog', async () => {
		jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => setTimeout(cb, 0));
		render(
			<AvatarPickerDialog
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		const moreButtonBefore = screen.getByRole('button', { name: 'Show more' });

		moreButtonBefore.focus();
		await userEvent.keyboard('{Enter}');

		const backBtn = screen.getByRole('button', { name: 'Go Back' });

		expect(backBtn).toHaveFocus();

		await userEvent.keyboard('{Enter}');

		const moreButtonAfter = screen.getByRole('button', { name: 'Show more' });

		expect(moreButtonAfter).toHaveFocus();
	});

	it('when save button is clicked onImagePicked and onImagePickedDataURI should be called', async () => {
		const onImagePicked = jest.fn();

		render(
			<AvatarPickerDialog
				imageSource={smallImage}
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={onImagePicked}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		const mediaImage = await screen.findByTestId('media-image');
		fireEvent.load(mediaImage);

		const form = await screen.findByRole('form');
		fireEvent.submit(form);
		expect(onImagePicked.mock.calls[0][1]).toEqual(fixedCrop);
	});

	it('when save button is clicked onImagePickedDataURI should be called', async () => {
		const onImagePickedDataURI = jest.fn();

		render(
			<AvatarPickerDialog
				imageSource={smallImage}
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={onImagePickedDataURI}
				onCancel={jest.fn()}
			/>,
		);
		const mediaImage = await screen.findByTestId('media-image');
		fireEvent.load(mediaImage);

		const form = await screen.findByRole('form');
		fireEvent.submit(form);

		expect(onImagePickedDataURI).toHaveBeenCalledWith(croppedImgDataURI);
	});

	it('when save button is clicked onAvatarPicked should be called', async () => {
		const onAvatarPicked = jest.fn();

		render(
			<AvatarPickerDialog
				avatars={[someAvatar]}
				onAvatarPicked={onAvatarPicked}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		const radio = await screen.findByRole('radio', { name: /avatar/i });
		await userEvent.click(radio);

		const form = await screen.findByRole('form');
		fireEvent.submit(form);

		await waitFor(() => expect(onAvatarPicked).toHaveBeenCalledWith(someAvatar));
	});

	it('when save button is clicked with predefined avatar passed as default, onAvatarPicked should be called', async () => {
		const onAvatarPicked = jest.fn();

		render(
			<AvatarPickerDialog
				avatars={[someAvatar]}
				defaultSelectedAvatar={someAvatar}
				onAvatarPicked={onAvatarPicked}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		const form = await screen.findByRole('form');
		fireEvent.submit(form);

		await waitFor(() => expect(onAvatarPicked).toHaveBeenCalledWith(someAvatar));
	});

	it('should render avatar list when avatars are passed', async () => {
		render(
			<AvatarPickerDialog
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);
		expect(await screen.findByRole('radio', { name: /avatar/i })).toBeInTheDocument();
	});

	it('should not render avatar list when no avatars are passed', () => {
		render(
			<AvatarPickerDialog
				avatars={[]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);
		expect(screen.queryByRole('radio', { name: /avatar/i })).not.toBeInTheDocument();
	});

	it('should not render avatar list when imageSource is passed', () => {
		render(
			<AvatarPickerDialog
				imageSource={smallImage}
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);
		expect(screen.queryByRole('radio', { name: /avatar/i })).not.toBeInTheDocument();
	});

	it('should not trigger callbacks when save button is clicked without selected image or selected avatar', async () => {
		const onAvatarPicked = jest.fn();
		const onImagePicked = jest.fn();
		const onImagePickedDataURI = jest.fn();

		render(
			<AvatarPickerDialog
				avatars={[someAvatar]}
				onAvatarPicked={onAvatarPicked}
				onImagePicked={onImagePicked}
				onImagePickedDataURI={onImagePickedDataURI}
				onCancel={jest.fn()}
			/>,
		);

		const form = await screen.findByRole('form');
		fireEvent.submit(form);

		expect(onAvatarPicked).not.toHaveBeenCalled();
		expect(onImagePicked).not.toHaveBeenCalled();
		expect(onImagePickedDataURI).not.toHaveBeenCalled();
	});

	it('should keep the footer inside the dialog content when the submit error is shown', async () => {
		render(
			<AvatarPickerDialog
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		fireEvent.submit(await screen.findByRole('form'));

		const content = screen.getByTestId('avatar-picker-dialog-content');
		expect(content).toContainElement(await screen.findByRole('alert'));
		expect(content).toContainElement(screen.getByTestId('avatar-picker-dialog-footer'));
	});

	it('should alert when save button is clicked without selected image or selected avatar', async () => {
		render(
			<AvatarPickerDialog
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		const form = await screen.findByRole('form');
		fireEvent.submit(form);

		const alert = await screen.findByRole('alert');
		expect(alert).toBeInTheDocument();
		expect(alert.innerText).toContain('Upload a photo or select from some default options');
	});

	it('should alert even on predefined avatars mode', async () => {
		render(
			<AvatarPickerDialog
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);
		const showMoreButton = await screen.findByLabelText('Show more');
		await userEvent.click(showMoreButton);

		const form = await screen.findByRole('form');
		fireEvent.submit(form);

		const alert = await screen.findByRole('alert');
		expect(alert).toBeInTheDocument();
		expect(alert.innerText).toContain('Upload a photo or select from some default options');
	});

	it('should allow save with selected image passed as default', async () => {
		const onAvatarPicked = jest.fn();
		const onImagePicked = jest.fn();
		const onImagePickedDataURI = jest.fn();

		render(
			<AvatarPickerDialog
				imageSource={smallImage}
				avatars={[someAvatar]}
				onAvatarPicked={onAvatarPicked}
				onImagePicked={onImagePicked}
				onImagePickedDataURI={onImagePickedDataURI}
				onCancel={jest.fn()}
			/>,
		);
		const mediaImage = await screen.findByTestId('media-image');
		fireEvent.load(mediaImage);

		const form = await screen.findByRole('form');
		fireEvent.submit(form);

		expect(onAvatarPicked).not.toHaveBeenCalled();

		const alert = screen.queryByRole('alert');
		expect(alert).not.toBeInTheDocument();
	});

	it('should ensure selected avatars beyond visible limit are shown when selected', () => {
		const avatars: Array<Avatar> = [];
		for (let i = 0; i < DEFAULT_VISIBLE_PREDEFINED_AVATARS + 1; i++) {
			avatars.push({ dataURI: `http://an.avatar.com/${i}` });
		}
		// select one past the end of the visible limit
		const selectedAvatar = avatars[DEFAULT_VISIBLE_PREDEFINED_AVATARS];
		const avatarDialog = new AvatarPickerDialog({
			avatars,
			onAvatarPicked: jest.fn(),
			onImagePicked: jest.fn(),
			onCancel: jest.fn(),
			defaultSelectedAvatar: selectedAvatar,
		});
		const predefinedAvatars = avatarDialog.getPredefinedAvatars();

		expect(predefinedAvatars).toHaveLength(DEFAULT_VISIBLE_PREDEFINED_AVATARS);
		expect(predefinedAvatars[DEFAULT_VISIBLE_PREDEFINED_AVATARS - 1]).toBe(selectedAvatar);
	});

	it('should render default title', async () => {
		render(
			<AvatarPickerDialog
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		const title = await screen.findByTestId('modal-header');
		expect(title.textContent).toContain('Upload an avatar');
	});

	it('should be able to customise title', async () => {
		render(
			<AvatarPickerDialog
				title={'test-title'}
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		const title = await screen.findByTestId('modal-header');
		expect(title.textContent).toContain('test-title');
	});

	it('should render default primary button text', async () => {
		render(
			<AvatarPickerDialog
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		await waitFor(() => {
			const elem = document.querySelector('button[type="submit"]');
			expect(elem).toBeInTheDocument();
			expect(elem?.textContent).toBe('Save');
		});
	});

	it('should be able to customise primary button text', async () => {
		render(
			<AvatarPickerDialog
				primaryButtonText={'test-primary-text'}
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		await waitFor(() => {
			const elem = document.querySelector('button[type="submit"]');
			expect(elem).toBeInTheDocument();
			expect(elem?.textContent).toBe('test-primary-text');
		});
	});

	it('should render default select avatar label', async () => {
		render(
			<AvatarPickerDialog
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		const radioGroup = await screen.findByRole('radiogroup');
		expect(radioGroup.getAttribute('aria-label')).toBe('Select a default avatar');
	});

	it('should be able to customise select avatar label', async () => {
		render(
			<AvatarPickerDialog
				selectAvatarLabel={'test-select-avatar'}
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);
		const radioGroup = await screen.findByRole('radiogroup');
		expect(radioGroup.getAttribute('aria-label')).toBe('test-select-avatar');
	});

	it('should render default show more avatars button label', async () => {
		render(
			<AvatarPickerDialog
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		const showMoreButton = await screen.findByRole('button', { name: /Show more/i });
		expect(showMoreButton).toBeInTheDocument();
	});

	it('should be able to customise show more avatars button label', async () => {
		render(
			<AvatarPickerDialog
				showMoreAvatarsButtonLabel={'test-show-more'}
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		const showMoreButton = await screen.findByRole('button', { name: /test-show-more/i });
		expect(showMoreButton).toBeInTheDocument();
	});

	it('should clear selected image when cross clicked', async () => {
		render(
			<AvatarPickerDialog
				imageSource={smallImage}
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		const mediaImage = await screen.findByTestId('media-image');
		expect(mediaImage.getAttribute('src')).toBe(smallImage);

		const removeButton = document.querySelector('#remove-image-button');
		expect(removeButton).toBeInTheDocument();
		removeButton && (await userEvent.click(removeButton));

		const imageUloader = await screen.findByTestId('image-navigator-input-file');
		expect(imageUloader).toBeInTheDocument();

		expect(screen.queryByTestId('media-image')).not.toBeInTheDocument();
	});

	it('should render loading state when "isLoading" is true', async () => {
		render(
			<AvatarPickerDialog
				imageSource={smallImage}
				isLoading={true}
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		const footer = await screen.findByTestId('avatar-picker-dialog-footer');
		expect(footer).toBeInTheDocument();

		// Spinner from Loading Button
		expect(await screen.findByRole('img')).toBeInTheDocument();

		// Spinner from ImageNavigator
		expect(await screen.findByTestId('spinner')).toBeInTheDocument();

		expect(document.querySelector('#predefined-avatar-view-wrapper')).not.toBeInTheDocument();
	});

	it('should pass props down to PredefinedAvatarView', async () => {
		render(
			<AvatarPickerDialog
				avatars={[someAvatar]}
				predefinedAvatarsText="some text"
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		const showMoreButton = await screen.findByRole('button', { name: /Show more/i });
		await userEvent.click(showMoreButton);

		const img = document.querySelector(`img[src="${someAvatar.dataURI}"]`);

		expect(img).toBeInTheDocument();
		expect(img?.getAttribute('src')).toEqual(someAvatar.dataURI);

		const text = document.querySelector('h2');
		expect(text).toBeInTheDocument();
		expect(text?.textContent).toEqual('some text');
	});

	it('should announce instructions to screen readers on cropping mode', async () => {
		render(
			<AvatarPickerDialog
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		await waitFor(() => {
			const elem = document.querySelector('div[aria-live="polite"]');
			expect(elem).toBeInTheDocument();
			expect(elem?.textContent).toEqual('Upload a photo or select from some default options');
		});
	});

	it('should announce instructions to screen readers on predefined avatar mode', async () => {
		render(
			<AvatarPickerDialog
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		const showMoreButton = await screen.findByRole('button', { name: /Show more/i });
		await userEvent.click(showMoreButton);

		await waitFor(() => {
			const elem = document.querySelector('div[aria-live="polite"]');
			expect(elem).toBeInTheDocument();
			expect(elem?.textContent).toEqual('Select from all default options');
		});
	});

	it('should not announce screen reader instructions when there is no predefined list of avatars', () => {
		render(
			<AvatarPickerDialog
				avatars={[]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		expect(document.querySelector('#predefined-avatar-view-wrapper')).not.toBeInTheDocument();
		expect(document.querySelector('div[aria-live="polite"]')).not.toBeInTheDocument();
	});

	it('should remove alert when a default avatar is selected', async () => {
		render(
			<AvatarPickerDialog
				avatars={[someAvatar]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		const form = await screen.findByRole('form');
		fireEvent.submit(form);
		const alert = await screen.findByRole('alert');
		expect(alert).toBeInTheDocument();
		expect(alert.innerText).toContain('Upload a photo or select from some default options');

		const radio = await screen.findByRole('radio', { name: /avatar/i });
		await userEvent.click(radio);
		fireEvent.submit(form);

		const alertGone = screen.queryByRole('alert');
		expect(alertGone).not.toBeInTheDocument();
	});

	describe('Alt text required', () => {
		const testAltText: string = 'test alt text';

		it('when alt text has been specified and save button is clicked, onImagePicked should be called', async () => {
			const onImagePicked = jest.fn();

			render(
				<AvatarPickerDialog
					imageSource={smallImage}
					avatars={[someAvatar]}
					onAvatarPicked={jest.fn()}
					onImagePicked={onImagePicked}
					onImagePickedDataURI={jest.fn()}
					onCancel={jest.fn()}
					requireAltText={true}
				/>,
			);

			const mediaImage = await screen.findByTestId('media-image');
			fireEvent.load(mediaImage);

			// When the Field is required, the component adds a span wrapping a '*'. This breaks the matching literal, therefore we need to use a Regex.
			const textField = await screen.findByLabelText(/Alt text.*/);
			await userEvent.clear(textField);
			await userEvent.type(textField, testAltText);

			const form = await screen.findByRole('form');
			fireEvent.submit(form);

			await waitFor(() => {
				expect(onImagePicked).toHaveBeenCalledWith(expect.anything(), fixedCrop, testAltText);
			});
		});

		it('when save button is clicked, onImagePicked should be called with predefined alt text', async () => {
			const onImagePicked = jest.fn();

			render(
				<AvatarPickerDialog
					imageSource={smallImage}
					imageSourceAltText={testAltText}
					avatars={[someAvatar]}
					onAvatarPicked={jest.fn()}
					onImagePicked={onImagePicked}
					onImagePickedDataURI={jest.fn()}
					onCancel={jest.fn()}
					requireAltText={true}
				/>,
			);
			const mediaImage = await screen.findByTestId('media-image');
			fireEvent.load(mediaImage);

			const form = await screen.findByRole('form');
			fireEvent.submit(form);

			await waitFor(() => {
				expect(onImagePicked).toHaveBeenCalledWith(expect.anything(), fixedCrop, testAltText);
			});
		});

		it('when alt text has been specified and save button is clicked, onImagePickedDataURI should be called', async () => {
			const onImagePickedDataURI = jest.fn();

			render(
				<AvatarPickerDialog
					imageSource={smallImage}
					avatars={[someAvatar]}
					onAvatarPicked={jest.fn()}
					onImagePicked={jest.fn()}
					onImagePickedDataURI={onImagePickedDataURI}
					onCancel={jest.fn()}
					requireAltText={true}
				/>,
			);

			const mediaImage = await screen.findByTestId('media-image');
			fireEvent.load(mediaImage);

			// When the Field is required, the component adds a span wrapping a '*'. This breaks the matching literal, therefore we need to use a Regex.
			const textField = await screen.findByLabelText(/Alt text.*/);
			await userEvent.clear(textField);
			await userEvent.type(textField, testAltText);

			const form = await screen.findByRole('form');
			fireEvent.submit(form);

			await waitFor(() => {
				expect(onImagePickedDataURI).toHaveBeenCalledWith(croppedImgDataURI, testAltText);
			});
		});

		it('when save button is clicked, onImagePickedDataURI should be called with predefined alt text', async () => {
			const onImagePickedDataURI = jest.fn();

			render(
				<AvatarPickerDialog
					imageSource={smallImage}
					imageSourceAltText={testAltText}
					avatars={[someAvatar]}
					onAvatarPicked={jest.fn()}
					onImagePicked={jest.fn()}
					onImagePickedDataURI={onImagePickedDataURI}
					onCancel={jest.fn()}
					requireAltText={true}
				/>,
			);

			const mediaImage = await screen.findByTestId('media-image');
			fireEvent.load(mediaImage);

			const form = await screen.findByRole('form');
			fireEvent.submit(form);

			await waitFor(() => {
				expect(onImagePickedDataURI).toHaveBeenCalledWith(croppedImgDataURI, testAltText);
			});
		});

		it('when save button is clicked, onAvatarPicked should be called with predefined alt text', async () => {
			const onAvatarPicked = jest.fn();

			render(
				<AvatarPickerDialog
					avatars={[someAvatar]}
					onAvatarPicked={onAvatarPicked}
					onImagePicked={jest.fn()}
					onImagePickedDataURI={jest.fn()}
					onCancel={jest.fn()}
					requireAltText={true}
				/>,
			);

			const radio = await screen.findByRole('radio', { name: /avatar/i });
			await userEvent.click(radio);

			const form = await screen.findByRole('form');
			fireEvent.submit(form);

			await waitFor(() => {
				expect(onAvatarPicked).toHaveBeenCalledWith(someAvatar, someAvatar.name);
			});
		});

		// TODO: flaky React 16 and React 18
		it.skip('when custom alt text has been specified and save button is clicked, onAvatarPicked should be called with custom alt text', async () => {
			const onAvatarPicked = jest.fn();

			render(
				<AvatarPickerDialog
					avatars={[someAvatar]}
					onAvatarPicked={onAvatarPicked}
					onImagePicked={jest.fn()}
					onImagePickedDataURI={jest.fn()}
					onCancel={jest.fn()}
					requireAltText={true}
				/>,
			);

			const radio = await screen.findByRole('radio', { name: /avatar/i });
			await userEvent.click(radio);

			const textField = await screen.findByLabelText('altTextField');
			await userEvent.clear(textField);
			await userEvent.type(textField, testAltText);

			const form = await screen.findByRole('form');
			fireEvent.submit(form);

			await waitFor(() => {
				expect(onAvatarPicked).toHaveBeenCalledWith(someAvatar, testAltText);
			});
		});

		it('when save button is clicked with predefined avatar passed as default, onAvatarPicked should be called with predefined alt text', async () => {
			const onAvatarPicked = jest.fn();

			render(
				<AvatarPickerDialog
					avatars={[someAvatar]}
					defaultSelectedAvatar={someAvatar}
					onAvatarPicked={onAvatarPicked}
					onImagePicked={jest.fn()}
					onImagePickedDataURI={jest.fn()}
					onCancel={jest.fn()}
					requireAltText={true}
				/>,
			);

			const form = await screen.findByRole('form');
			fireEvent.submit(form);

			await waitFor(() => {
				expect(onAvatarPicked).toHaveBeenCalledWith(someAvatar, someAvatar.name);
			});
		});

		it('should allow save with selected image passed as default', async () => {
			const onAvatarPicked = jest.fn();
			const onImagePicked = jest.fn();
			const onImagePickedDataURI = jest.fn();

			render(
				<AvatarPickerDialog
					imageSource={smallImage}
					avatars={[someAvatar]}
					onAvatarPicked={onAvatarPicked}
					onImagePicked={onImagePicked}
					onImagePickedDataURI={onImagePickedDataURI}
					onCancel={jest.fn()}
					requireAltText={true}
				/>,
			);
			const mediaImage = await screen.findByTestId('media-image');
			fireEvent.load(mediaImage);

			const form = await screen.findByRole('form');
			fireEvent.submit(form);

			expect(onAvatarPicked).not.toHaveBeenCalled();

			const alert = screen.queryByRole('alert');
			expect(alert).not.toBeInTheDocument();
		});
	});

	describe('maxImageSize', () => {
		const originalFileReader = global.FileReader;
		const niceImage = new File(['dsjklDFljk'], 'nice-photo.png', { type: 'image/png' });
		const tooLargeText = (maxMb: number) => `Image is too large, must be no larger than ${maxMb}Mb`;

		class MockFileReader {
			onload: any;
			result = 'data:image/png;base64,AAAA';
			private loadListeners: Array<(event: any) => void> = [];

			addEventListener(type: string, callback: (event: any) => void) {
				if (type === 'load') {
					this.loadListeners.push(callback);
				}
			}

			removeEventListener(type: string, callback: (event: any) => void) {
				if (type === 'load') {
					this.loadListeners = this.loadListeners.filter((listener) => listener !== callback);
				}
			}
			readAsDataURL() {
				const event = { target: this };
				this.onload?.(event);
				this.loadListeners.forEach((listener) => listener(event));
			}
		}

		const mockDropEvent = (file: any): any => ({
			stopPropagation: jest.fn(),
			preventDefault: jest.fn(),
			dataTransfer: {
				files: [file],
			},
		});

		let fileSizeMbSpy: jest.SpyInstance;

		beforeEach(() => {
			fileSizeMbSpy = jest.spyOn(utilModule, 'fileSizeMb');
			global.FileReader = MockFileReader as any;
		});

		afterEach(() => {
			fileSizeMbSpy.mockRestore();
			global.FileReader = originalFileReader;
		});

		const renderAndDrop = async (sizeMb: number, maxImageSize?: number) => {
			fileSizeMbSpy.mockImplementationOnce(() => sizeMb);

			render(
				<AvatarPickerDialog
					avatars={[]}
					onAvatarPicked={jest.fn()}
					onImagePicked={jest.fn()}
					onImagePickedDataURI={jest.fn()}
					onCancel={jest.fn()}
					maxImageSize={maxImageSize}
				/>,
			);

			const dragZone = await screen.findByTestId('dragzone');
			fireEvent.drop(dragZone, mockDropEvent(niceImage));
		};

		describe('when the max image size gate is on', () => {
			beforeEach(() => {
				passGate('platform_media_avatar_picker_max_image_size');
			});

			it('shows an error when the image is larger than maxImageSize', async () => {
				await renderAndDrop(4.01, 4);

				expect(await screen.findByText(tooLargeText(4))).toBeInTheDocument();
			});

			it('accepts the image when it is within maxImageSize', async () => {
				await renderAndDrop(3.99, 4);

				await waitFor(() => expect(screen.queryByTestId('dragzone')).not.toBeInTheDocument());
				expect(screen.queryByText(/Image is too large/)).not.toBeInTheDocument();
			});

			it('falls back to the default 10Mb limit when maxImageSize is not passed', async () => {
				await renderAndDrop(10.01);

				expect(await screen.findByText(tooLargeText(10))).toBeInTheDocument();
			});
		});

		describe('when the max image size gate is off', () => {
			beforeEach(() => {
				failGate('platform_media_avatar_picker_max_image_size');
			});

			it('accepts an image above maxImageSize because the default limit applies', async () => {
				await renderAndDrop(5, 4);

				await waitFor(() => expect(screen.queryByTestId('dragzone')).not.toBeInTheDocument());
				expect(screen.queryByText(/Image is too large/)).not.toBeInTheDocument();
			});

			it('shows the default 10Mb error when the image is larger than 10Mb', async () => {
				await renderAndDrop(10.01, 4);

				expect(await screen.findByText(tooLargeText(10))).toBeInTheDocument();
			});
		});
	});
});

describe('Avatar Picker Dialog without default avatars', () => {
	it('shows the upload-only error when no default avatars are provided', async () => {
		render(
			<AvatarPickerDialog
				avatars={[]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		const form = await screen.findByRole('form');
		fireEvent.submit(form);

		const alert = await screen.findByRole('alert');
		expect(alert).toBeInTheDocument();
		expect(alert.textContent).toContain('Upload a photo to continue');
		expect(alert.textContent).not.toContain('Upload a photo or select from some default options');
	});

	it('shows the upload-only error when the avatars prop is omitted', async () => {
		render(
			<AvatarPickerDialog
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		const form = await screen.findByRole('form');
		fireEvent.submit(form);

		const alert = await screen.findByRole('alert');
		expect(alert).toBeInTheDocument();
		expect(alert.textContent).toContain('Upload a photo to continue');
		expect(alert.textContent).not.toContain('Upload a photo or select from some default options');
	});
});

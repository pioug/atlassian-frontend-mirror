const mockedFile = new File(['dsjklDFljk'], 'nice-photo.png', {
	type: 'image/png',
});

jest.mock('@atlaskit/media-ui', () => ({
	...jest.requireActual('@atlaskit/media-ui'),
	dataURItoFile: jest.fn(() => mockedFile),
}));

import React from 'react';
import { smallImage } from '@atlaskit/media-test-helpers';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type Avatar } from '../../avatar-list';
import { AvatarPickerDialog, fixedCrop } from '../../avatar-picker-dialog';
import { DEFAULT_VISIBLE_PREDEFINED_AVATARS } from '../../avatar-picker-dialog/layout-const';
import * as exportCroppedImageModule from '../../image-navigator/exportCroppedImage';

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
});

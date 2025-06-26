import React from 'react';
import { render, screen } from '@testing-library/react';
import AvatarPickerDialogErrorBoundary from './avatar-picker-dialog-error-boundary';
import * as avatarPickerDialogModule from './';

const AvatarPickerDialogSpy = jest
	.spyOn(avatarPickerDialogModule, 'default')
	.mockImplementation(() => {
		throw new Error('unexpected error');
	});

describe('AvatarPickerDialogErrorBoundary', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<AvatarPickerDialogErrorBoundary
				avatars={[{ dataURI: 'http://an.avatar.com/453' }]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);

		await expect(container).toBeAccessible();
	});

	it('should catch unexpected errors and display the default spinner', () => {
		render(
			<AvatarPickerDialogErrorBoundary
				avatars={[{ dataURI: 'http://an.avatar.com/453' }]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
			/>,
		);
		expect(AvatarPickerDialogSpy).toHaveBeenCalled();
		expect(document.querySelector('svg')).toBeInTheDocument();
	});

	it('should catch unexpected errors and display the provided placeholder', async () => {
		const Placeholder = () => <div data-testid="loading-placeholder">Loading Placeholder</div>;

		render(
			<AvatarPickerDialogErrorBoundary
				avatars={[{ dataURI: 'http://an.avatar.com/453' }]}
				onAvatarPicked={jest.fn()}
				onImagePicked={jest.fn()}
				onImagePickedDataURI={jest.fn()}
				onCancel={jest.fn()}
				placeholder={<Placeholder />}
			/>,
		);
		expect(AvatarPickerDialogSpy).toHaveBeenCalled();
		expect(await screen.findByTestId('loading-placeholder')).toBeInTheDocument();
	});
});

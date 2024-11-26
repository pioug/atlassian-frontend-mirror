/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/* eslint-disable no-console */
import React, { type ReactNode } from 'react';
import { jsx, css } from '@compiled/react';
import Button from '@atlaskit/button/standard-button';
import { ModalTransition } from '@atlaskit/modal-dialog';
import { type Avatar, AvatarPickerDialog } from '../src';
import { generateAvatars } from '../example-helpers';
import {
	type AvatarPickerDialogPropsAlt,
	type AvatarPickerDialogPropsNoAlt,
} from '../src/avatar-picker-dialog/types';

const avatars: Array<Avatar> = generateAvatars(30);

export interface State {
	isOpen: boolean;
	imagePreviewSourceViaFileAPI: string;
	imagePreviewSourceViaDataURIAPI: string;
	isLoading: boolean;
	altText: string;
}

type AsyncAvatarPickerDialogPropsNoAlt = AvatarPickerDialogPropsNoAlt & {
	placeholder?: ReactNode;
};

type AsyncAvatarPickerDialogPropsAlt = AvatarPickerDialogPropsAlt & {
	placeholder?: ReactNode;
};

type StatefulAvatarPickerDialogPropsToOmit =
	| 'avatars'
	| 'onAvatarPicked'
	| 'onImagePicked'
	| 'onImagePickedDataURI'
	| 'onCancel'
	| 'isLoading'
	| 'predefinedAvatarsText';

const layoutStyles = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'space-around',
	height: '80vh',
});

export default class StatefulAvatarPickerDialog extends React.Component<
	| Partial<AsyncAvatarPickerDialogPropsNoAlt>
	| Omit<AsyncAvatarPickerDialogPropsAlt, StatefulAvatarPickerDialogPropsToOmit>,
	State
> {
	timeoutId: number = 0;
	fileURL?: string;

	state = {
		isOpen: false,
		imagePreviewSourceViaFileAPI: '',
		imagePreviewSourceViaDataURIAPI: '',
		isLoading: false,
		altText: '',
	};

	componentWillUnmount() {
		clearTimeout(this.timeoutId);
		if (this.fileURL) {
			URL.revokeObjectURL(this.fileURL);
		}
	}

	openPicker = () => {
		this.setState({ isOpen: true });
	};

	closePicker = () => {
		this.setState({ isOpen: false });
	};

	setIsLoading = () => this.setState({ isLoading: true });

	saveDataURI = (dataURI: any) => {
		// Fake "uploading" call by adding a delay
		this.timeoutId = window.setTimeout(() => {
			this.setState({
				imagePreviewSourceViaDataURIAPI: dataURI,
				isOpen: false,
				isLoading: false,
			});
		}, 2000);
	};

	saveFileAndCrop = (file: File) => {
		// Fake "uploading" call by adding a delay
		this.timeoutId = window.setTimeout(() => {
			this.fileURL = URL.createObjectURL(file);
			this.setState({
				imagePreviewSourceViaFileAPI: this.fileURL,
				isOpen: false,
				isLoading: false,
			});
		}, 2000);
	};

	setAltText = (altText: string) => {
		this.setState({ altText });
	};

	renderPicker() {
		const { isOpen, isLoading } = this.state;
		const { requireAltText } = this.props;

		const avatarPickerDialog = requireAltText ? (
			<AvatarPickerDialog
				avatars={avatars}
				onAvatarPicked={(selectedAvatar, altText) => {
					console.log('onAvatarPicked:', selectedAvatar);
					this.saveDataURI(selectedAvatar.dataURI);
					this.setAltText(altText);
				}}
				onImagePicked={(selectedImage, crop, altText) => {
					console.log('onImagePicked:', selectedImage, crop);
					this.setIsLoading();
					this.saveFileAndCrop(selectedImage);
					this.setAltText(altText);
				}}
				onImagePickedDataURI={(exportedImg, altText) => {
					console.log('onImagePickedDataURI: ', { dataURI: exportedImg });
					this.setIsLoading();
					this.saveDataURI(exportedImg);
					this.setAltText(altText);
				}}
				onCancel={this.closePicker}
				isLoading={isLoading}
				predefinedAvatarsText="Default icons"
				{...this.props}
				requireAltText={true}
			/>
		) : (
			<AvatarPickerDialog
				avatars={avatars}
				onAvatarPicked={(selectedAvatar) => {
					console.log('onAvatarPicked:', selectedAvatar);
					this.saveDataURI(selectedAvatar.dataURI);
				}}
				onImagePicked={(selectedImage, crop) => {
					console.log('onImagePicked:', selectedImage, crop);
					this.setIsLoading();
					this.saveFileAndCrop(selectedImage);
				}}
				onImagePickedDataURI={(exportedImg) => {
					console.log('onImagePickedDataURI: ', { dataURI: exportedImg });
					this.setIsLoading();
					this.saveDataURI(exportedImg);
				}}
				onCancel={this.closePicker}
				isLoading={isLoading}
				predefinedAvatarsText="Default icons"
				{...this.props}
			/>
		);

		return <ModalTransition>{isOpen && avatarPickerDialog}</ModalTransition>;
	}

	render() {
		const { imagePreviewSourceViaDataURIAPI, imagePreviewSourceViaFileAPI, altText } = this.state;

		const { requireAltText } = this.props;

		return (
			<div css={layoutStyles}>
				<Button appearance="primary" onClick={this.openPicker}>
					Open sesame!
				</Button>
				{this.renderPicker()}
				{imagePreviewSourceViaDataURIAPI !== '' ? (
					<React.Fragment>
						<p>onImagePickedDataURI(dataUri: string)</p>
						<img src={imagePreviewSourceViaDataURIAPI} alt={altText || undefined} />
						{requireAltText && <p>Alt text: {altText}</p>}
					</React.Fragment>
				) : null}
				{imagePreviewSourceViaFileAPI !== '' ? (
					<React.Fragment>
						<p>onImagePicked(selectedImage: File, crop: CropProperties)</p>
						<img src={imagePreviewSourceViaFileAPI} alt={altText || undefined} />
						{requireAltText && <p>Alt text: {altText}</p>}
					</React.Fragment>
				) : null}
			</div>
		);
	}
}

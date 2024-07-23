/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type FormEvent, Fragment } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { PureComponent } from 'react';
import ModalDialog, { ModalFooter, ModalBody, useModal } from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button/standard-button';
import {
	FormattedMessage,
	IntlProvider,
	injectIntl,
	type WrappedComponentProps,
} from 'react-intl-next';
import { Field, HelperMessage } from '@atlaskit/form';
import { fileToDataURI, dataURItoFile, messages } from '@atlaskit/media-ui';
import { Box, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { type Avatar } from '../avatar-list';
import ImageNavigator, { type CropProperties } from '../image-navigator';
import { PredefinedAvatarList } from '../predefined-avatar-list';
import { formStyles, avatarPickerViewWrapperStyles, modalHeaderStyles } from './styles';
import { PredefinedAvatarView } from '../predefined-avatar-view';
import { type LoadParameters } from '../image-navigator/index';
import ButtonGroup from '@atlaskit/button/button-group';

import { DEFAULT_VISIBLE_PREDEFINED_AVATARS } from './layout-const';
import { AVATAR_DIALOG_WIDTH, AVATAR_DIALOG_HEIGHT, CONTAINER_INNER_SIZE } from './layout-const';
import { type AvatarPickerDialogProps, type AvatarPickerDialogState, Mode } from './types';
import { SRLiveTitle } from './SRLiveTitle';
import LoadingButton from '@atlaskit/button/loading-button';
import { SubmitErrorDialog } from './SubmitErrorDialog';

export const MAX_SIZE_MB = 10;

export const ERROR = {
	URL: messages.image_url_invalid_error,
	FORMAT: messages.image_format_invalid_error,
	SIZE: messages.image_size_too_large_error,
};

export const ACCEPT = ['image/gif', 'image/jpeg', 'image/png'];

export const fixedCrop = {
	x: 0,
	y: 0,
	size: CONTAINER_INNER_SIZE,
} as CropProperties;

export type AvatarPickerDialogWithIntlProps = AvatarPickerDialogProps &
	Partial<WrappedComponentProps>;

const HeaderContent = ({ title }: { title?: string }) => {
	const modal = useModal();
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<h1 css={modalHeaderStyles} data-test-id="modal-header" id={modal.titleId}>
			{title || <FormattedMessage {...messages.upload_an_avatar} />}
		</h1>
	);
};

const altTextFieldStyles = xcss({
	paddingTop: 'space.100',
	textAlign: 'left',
});

const croppingWrapperStyles = xcss({
	display: 'inline-block',
	userSelect: 'none',
});

const predefinedAvatarWrapperStyles = xcss({
	display: 'inline-block',
	userSelect: 'none',
});

export class AvatarPickerDialog extends PureComponent<
	AvatarPickerDialogWithIntlProps,
	AvatarPickerDialogState
> {
	static defaultProps = {
		avatars: [],
	};

	state: AvatarPickerDialogState = {
		mode: Mode.Cropping,
		selectedAvatar: this.props.defaultSelectedAvatar,
		selectedImageSource: this.props.errorMessage ? undefined : this.props.imageSource,
		selectedImage: undefined,
		errorMessage: this.props.errorMessage,
		isSubmitted: false,
		altText: this.initialiseAltText(),
		prevAltText: '',
	};

	setSelectedImageState = async (selectedImage: File) => {
		// this is the main method to update the image state,
		// it is bubbled from the ImageCropper component through ImageNavigator when the image is loaded
		try {
			this.setState({ selectedImage });
			const dataURI = await fileToDataURI(selectedImage);
			this.setState({ selectedImageSource: dataURI });
		} catch (e) {}
	};

	setSelectedAvatarState = (avatar: Avatar) => {
		const { requireAltText } = this.props;

		if (requireAltText) {
			this.setState({
				selectedAvatar: avatar,
				altText: avatar.name ?? '',
				isSubmitted: false,
			});
		} else {
			this.setState({
				selectedAvatar: avatar,
				isSubmitted: false,
			});
		}
	};

	onImageNavigatorLoad = (loadParams: LoadParameters) => {
		this.exportCroppedImage = loadParams.export;
	};

	/**
	 * Initialised with no-op function.  Is assigned cropped image exporting
	 * function when internal ImageCropper mounts via this.onImageNavigatorLoad
	 */
	exportCroppedImage = (outputSize?: number) => '';

	onSave = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const {
			onImagePicked,
			onImagePickedDataURI,
			onAvatarPicked,
			outputSize,
			imageSource,
			requireAltText,
		} = this.props;
		const { selectedImage, selectedAvatar, altText } = this.state;

		if (!(imageSource || selectedImage || selectedAvatar)) {
			this.setState({ isSubmitted: true });
			return;
		}

		if (selectedImage) {
			const exportedCroppedImageURI = this.exportCroppedImage(outputSize);
			if (requireAltText) {
				onImagePicked?.(dataURItoFile(exportedCroppedImageURI), fixedCrop, altText);
				onImagePickedDataURI?.(exportedCroppedImageURI, altText);
			} else {
				onImagePicked?.(dataURItoFile(exportedCroppedImageURI), fixedCrop);
				onImagePickedDataURI?.(exportedCroppedImageURI);
			}
		} else if (selectedAvatar) {
			requireAltText ? onAvatarPicked(selectedAvatar, altText) : onAvatarPicked(selectedAvatar);
		} else {
			this.setState({ isSubmitted: true });
		}
	};

	onShowMore = () => {
		this.setState({
			mode: Mode.PredefinedAvatars,
			isSubmitted: false,
		});
	};

	onGoBack = () => {
		this.clearErrorState();
	};

	onRemoveImage = () => {
		const { requireAltText } = this.props;
		const { prevAltText } = this.state;

		this.setState({
			selectedImageSource: undefined,
			selectedImage: undefined,
			mode: Mode.Cropping,
			altText: requireAltText ? prevAltText : '',
		});

		this.clearPrevAltText();
	};

	clearErrorState = () => {
		this.setState({
			mode: Mode.Cropping,
			errorMessage: undefined,
			isSubmitted: false,
		});
	};

	setErrorState = (errorMessage: string) => {
		this.setState({
			mode: Mode.Cropping,
			errorMessage,
		});
	};

	onImageUploaded = () => {
		const { requireAltText } = this.props;
		const { altText } = this.state;

		if (requireAltText) {
			this.updatePrevAltText(altText);
		}
		this.clearAltText();
		this.clearErrorState();
	};

	onImageError = (errorMessage: string) => {
		this.setErrorState(errorMessage);
	};

	render() {
		const content = (
			<ModalDialog
				height={`${AVATAR_DIALOG_HEIGHT}px`}
				width={`${AVATAR_DIALOG_WIDTH}px`}
				shouldScrollInViewport
				onClose={this.props.onCancel}
			>
				{this.props.avatars.length > 0 && <SRLiveTitle mode={this.state.mode} />}

				<HeaderContent title={this.props.title} />

				{this.state.isSubmitted && <SubmitErrorDialog />}

				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
				<form onSubmit={this.onSave} css={formStyles}>
					<ModalBody>
						{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
						<div css={avatarPickerViewWrapperStyles}>{this.renderBody()}</div>
					</ModalBody>
					{this.footerContent()}
				</form>
			</ModalDialog>
		);

		return this.props.intl ? content : <IntlProvider locale="en">{content}</IntlProvider>;
	}

	footerContent = () => {
		const { primaryButtonText, onCancel, isLoading } = this.props;
		return (
			<ModalFooter>
				<ButtonGroup>
					<Button appearance="default" onClick={onCancel}>
						<FormattedMessage {...messages.cancel} />
					</Button>
					<LoadingButton appearance="primary" isLoading={isLoading} type="submit">
						{primaryButtonText || <FormattedMessage {...messages.save} />}
					</LoadingButton>
				</ButtonGroup>
			</ModalFooter>
		);
	};

	getPredefinedAvatars(): Avatar[] {
		const { avatars } = this.props;
		const { selectedAvatar } = this.state;
		const avatarsSubset = avatars.slice(0, DEFAULT_VISIBLE_PREDEFINED_AVATARS);
		if (selectedAvatar && avatars.indexOf(selectedAvatar) >= DEFAULT_VISIBLE_PREDEFINED_AVATARS) {
			avatarsSubset[avatarsSubset.length - 1] = selectedAvatar;
		}
		return avatarsSubset;
	}

	renderPredefinedAvatarList() {
		const { isLoading, selectAvatarLabel, showMoreAvatarsButtonLabel } = this.props;
		const { selectedAvatar, selectedImage, selectedImageSource } = this.state;
		const avatars = this.getPredefinedAvatars();

		if (isLoading || selectedImage || selectedImageSource || avatars.length === 0) {
			return null;
		}

		return (
			<PredefinedAvatarList
				selectedAvatar={selectedAvatar}
				avatars={avatars}
				onAvatarSelected={this.setSelectedAvatarState}
				onShowMore={this.onShowMore}
				selectAvatarLabel={selectAvatarLabel}
				showMoreAvatarsButtonLabel={showMoreAvatarsButtonLabel}
			/>
		);
	}

	initialiseAltText() {
		const { requireAltText, errorMessage, imageSource, defaultSelectedAvatar } = this.props;

		if (requireAltText) {
			if (!errorMessage && imageSource) {
				// there is a default image
				return this.props.imageSourceAltText ?? '';
			} else {
				// if there is a default avatar, return its name (if defined)
				return defaultSelectedAvatar?.name ?? '';
			}
		} else {
			return '';
		}
	}

	updateAltText(altText: string) {
		this.setState({ altText });
	}

	clearAltText() {
		this.updateAltText('');
	}

	updatePrevAltText(prevAltText: string) {
		this.setState({ prevAltText });
	}

	clearPrevAltText() {
		this.updatePrevAltText('');
	}

	renderAltTextField() {
		const { altText } = this.state;

		return (
			<Box xcss={altTextFieldStyles}>
				<Field
					aria-required={true}
					name="altText"
					isRequired
					label={<FormattedMessage {...messages.alt_text} />}
				>
					{({ fieldProps }) => (
						<Fragment>
							<Textfield
								{...fieldProps}
								id="altText"
								onChange={(event: FormEvent<HTMLInputElement>) =>
									this.updateAltText(event.currentTarget.value)
								}
								value={altText || ''}
							/>
							<HelperMessage>
								<FormattedMessage {...messages.alt_text_description} />
							</HelperMessage>
						</Fragment>
					)}
				</Field>
			</Box>
		);
	}

	renderBody() {
		const { avatars, isLoading, predefinedAvatarsText, requireAltText } = this.props;
		const { mode, selectedImageSource, selectedAvatar, errorMessage } = this.state;

		switch (mode) {
			case Mode.Cropping:
				return (
					<Box>
						<Box xcss={croppingWrapperStyles}>
							<ImageNavigator
								imageSource={selectedImageSource}
								errorMessage={errorMessage}
								onImageLoaded={this.setSelectedImageState}
								onLoad={this.onImageNavigatorLoad}
								onRemoveImage={this.onRemoveImage}
								onImageUploaded={this.onImageUploaded}
								onImageError={this.onImageError}
								isLoading={isLoading}
							/>
							{this.renderPredefinedAvatarList()}
						</Box>
						{requireAltText && this.renderAltTextField()}
					</Box>
				);
			case Mode.PredefinedAvatars:
				return (
					<Box xcss={predefinedAvatarWrapperStyles}>
						<PredefinedAvatarView
							avatars={avatars}
							onAvatarSelected={this.setSelectedAvatarState}
							onGoBack={this.onGoBack}
							selectedAvatar={selectedAvatar}
							predefinedAvatarsText={predefinedAvatarsText}
						/>
						{requireAltText && this.renderAltTextField()}
					</Box>
				);
		}
	}
}

export default injectIntl(
	AvatarPickerDialog as React.ComponentType<
		AvatarPickerDialogWithIntlProps & WrappedComponentProps
	>,
	{
		enforceContext: false,
	},
) as React.FC<AvatarPickerDialogProps>;

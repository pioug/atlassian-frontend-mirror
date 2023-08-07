/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { PureComponent } from 'react';
import ModalDialog, { ModalFooter, ModalBody } from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button/standard-button';
import {
  FormattedMessage,
  IntlProvider,
  injectIntl,
  WrappedComponentProps,
} from 'react-intl-next';
import { fileToDataURI, dataURItoFile, messages } from '@atlaskit/media-ui';
import { Avatar } from '../avatar-list';
import ImageNavigator, { CropProperties } from '../image-navigator';
import { PredefinedAvatarList } from '../predefined-avatar-list';
import {
  formStyles,
  avatarPickerViewWrapperStyles,
  modalHeaderStyles,
  croppingWrapperStyles,
} from './styles';
import { PredefinedAvatarView } from '../predefined-avatar-view';
import { LoadParameters } from '../image-navigator/index';
import ButtonGroup from '@atlaskit/button/button-group';

import { DEFAULT_VISIBLE_PREDEFINED_AVATARS } from './layout-const';
import {
  AVATAR_DIALOG_WIDTH,
  AVATAR_DIALOG_HEIGHT,
  CONTAINER_INNER_SIZE,
} from './layout-const';
import {
  AvatarPickerDialogProps,
  AvatarPickerDialogState,
  Mode,
} from './types';
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
    selectedImageSource: this.props.errorMessage
      ? undefined
      : this.props.imageSource,
    selectedImage: undefined,
    errorMessage: this.props.errorMessage,
    isSubmitted: false,
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
    this.setState({
      selectedAvatar: avatar,
      isSubmitted: false,
    });
  };

  onImageNavigatorLoad = (loadParams: LoadParameters) => {
    this.exportCroppedImage = loadParams.export;
  };

  /**
   * Initialised with no-op function.  Is assigned cropped image exporting
   * function when internal ImageCropper mounts via this.onImageNavigatorLoad
   */
  exportCroppedImage = (outputSize?: number) => '';

  onSaveClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const {
      onImagePicked,
      onImagePickedDataURI,
      onAvatarPicked,
      outputSize,
      imageSource,
    } = this.props;
    const { selectedImage, selectedAvatar } = this.state;

    if (!(imageSource || selectedImage || selectedAvatar)) {
      event.preventDefault();
      this.setState({ isSubmitted: true });
      return;
    }

    if (selectedImage) {
      const exportedCroppedImageURI = this.exportCroppedImage(outputSize);
      if (onImagePicked) {
        onImagePicked(dataURItoFile(exportedCroppedImageURI), fixedCrop);
      }
      if (onImagePickedDataURI) {
        onImagePickedDataURI(exportedCroppedImageURI);
      }
    } else if (selectedAvatar) {
      onAvatarPicked(selectedAvatar);
    }
  };

  onShowMore = () => {
    this.setState({ mode: Mode.PredefinedAvatars, isSubmitted: false });
  };

  onGoBack = () => {
    this.clearErrorState();
  };

  onRemoveImage = () => {
    this.setState({
      selectedImageSource: undefined,
      selectedImage: undefined,
      mode: Mode.Cropping,
    });
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
        {this.props.avatars.length > 0 && (
          <SRLiveTitle mode={this.state.mode} />
        )}

        {this.headerContent()}

        {this.state.isSubmitted && <SubmitErrorDialog />}

        <form css={formStyles}>
          <ModalBody>
            <div css={avatarPickerViewWrapperStyles}>{this.renderBody()}</div>
          </ModalBody>
          {this.footerContent()}
        </form>
      </ModalDialog>
    );

    return this.props.intl ? (
      content
    ) : (
      <IntlProvider locale="en">{content}</IntlProvider>
    );
  }

  headerContent = () => {
    const { title } = this.props;
    return (
      <div css={modalHeaderStyles} data-test-id="modal-header">
        {title || <FormattedMessage {...messages.upload_an_avatar} />}
      </div>
    );
  };

  footerContent = () => {
    const { primaryButtonText, onCancel, isLoading } = this.props;
    const { onSaveClick } = this;
    return (
      <ModalFooter>
        <ButtonGroup>
          <Button appearance="default" onClick={onCancel}>
            <FormattedMessage {...messages.cancel} />
          </Button>
          <LoadingButton
            appearance="primary"
            onClick={onSaveClick}
            isLoading={isLoading}
            type="submit"
          >
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
    if (
      selectedAvatar &&
      avatars.indexOf(selectedAvatar) >= DEFAULT_VISIBLE_PREDEFINED_AVATARS
    ) {
      avatarsSubset[avatarsSubset.length - 1] = selectedAvatar;
    }
    return avatarsSubset;
  }

  renderPredefinedAvatarList() {
    const { isLoading } = this.props;
    const { selectedAvatar, selectedImage, selectedImageSource } = this.state;
    const avatars = this.getPredefinedAvatars();

    if (
      isLoading ||
      selectedImage ||
      selectedImageSource ||
      avatars.length === 0
    ) {
      return null;
    }

    return (
      <PredefinedAvatarList
        selectedAvatar={selectedAvatar}
        avatars={avatars}
        onAvatarSelected={this.setSelectedAvatarState}
        onShowMore={this.onShowMore}
      />
    );
  }

  renderBody() {
    const { avatars, isLoading, predefinedAvatarsText } = this.props;
    const { mode, selectedImageSource, selectedAvatar, errorMessage } =
      this.state;

    switch (mode) {
      case Mode.Cropping:
        return (
          <div css={croppingWrapperStyles}>
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
          </div>
        );
      case Mode.PredefinedAvatars:
        return (
          <PredefinedAvatarView
            avatars={avatars}
            onAvatarSelected={this.setSelectedAvatarState}
            onGoBack={this.onGoBack}
            selectedAvatar={selectedAvatar}
            predefinedAvatarsText={predefinedAvatarsText}
          />
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

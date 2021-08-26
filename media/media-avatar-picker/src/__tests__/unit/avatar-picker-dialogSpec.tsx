import * as mocks from './avatar-picker-dialogSpec.mock';
import React from 'react';
import { ModalFooter } from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button/custom-theme-button';
import { smallImage, mountWithIntlContext } from '@atlaskit/media-test-helpers';
import { Avatar } from '../../avatar-list';
import { ImageNavigator } from '../../image-navigator';
import { PredefinedAvatarList } from '../../predefined-avatar-list';
import { AvatarPickerDialog, fixedCrop } from '../../avatar-picker-dialog';
import {
  DEFAULT_VISIBLE_PREDEFINED_AVATARS,
  CONTAINER_SIZE,
} from '../../avatar-picker-dialog/layout-const';
import { PredefinedAvatarView } from '../../predefined-avatar-view';
import {
  Mode,
  AvatarPickerDialogProps,
  AvatarPickerDialogState,
} from '../../avatar-picker-dialog/types';

describe('Avatar Picker Dialog', () => {
  const renderWithProps = (props: Partial<AvatarPickerDialogProps>) => {
    const component = mountWithIntlContext(
      <AvatarPickerDialog
        avatars={[{ dataURI: 'http://an.avatar.com/453' }]}
        onAvatarPicked={jest.fn()}
        onImagePicked={jest.fn()}
        onImagePickedDataURI={jest.fn()}
        onCancel={jest.fn()}
        {...props}
      />,
    );

    // when you pass an image it normally renders the image (which triggers load event and selectedImage back-propagation)...
    // since we are rendering in js-dom, we have to force the load mechanism

    if (props.imageSource) {
      updateComponentWithNewImage(component);
    }
    return component;
  };

  const updateComponentWithNewImage = (component: any) => {
    // get the handler which the ImageNavigator triggers when the image loads, fire it
    const { onImageLoaded } = component.find(ImageNavigator).props();
    onImageLoaded(mocks.mockFileFromDataURI, {
      x: 0,
      y: 0,
      size: CONTAINER_SIZE,
    });
    component.update();
  };

  const renderSaveButton = (props: Partial<AvatarPickerDialogProps> = {}) => {
    return renderWithProps(props).find(ModalFooter).find(Button).first();
  };

  it('when save button is clicked onImagePicked should be called', () => {
    const onImagePicked = jest.fn();

    const component: any = renderWithProps({
      onImagePicked,
      imageSource: smallImage,
    });

    // Stub internal function to facilitate shallow testing of `onImagePickedDataURI`
    const croppedImgDataURI = 'data:image/meme;based64:w0w';
    component.instance()['exportCroppedImage'] = () => croppedImgDataURI;

    component.find(ModalFooter).find(Button).first().simulate('click');

    expect(onImagePicked.mock.calls[0][1]).toEqual(fixedCrop);
  });

  it('when save button is clicked onImagePickedDataURI should be called', () => {
    const onImagePickedDataURI = jest.fn();

    const component: any = renderWithProps({
      onImagePickedDataURI,
      imageSource: smallImage,
    });

    // Stub internal function to facilitate shallow testing of `onImagePickedDataURI`
    const croppedImgDataURI = 'data:image/meme;based64:w0w';
    component.instance()['exportCroppedImage'] = () => croppedImgDataURI;

    component.find(ModalFooter).find(Button).first().simulate('click');

    expect(onImagePickedDataURI).toBeCalledWith(croppedImgDataURI);
  });

  it('when save button is clicked onSaveAvatar should be called', () => {
    const selectedAvatar: Avatar = { dataURI: 'http://an.avatar.com/453' };
    const avatars = [selectedAvatar];
    const onAvatarPicked = jest.fn();

    const component = renderWithProps({ avatars, onAvatarPicked });
    const { onAvatarSelected } = component.find(PredefinedAvatarList).props();
    onAvatarSelected(selectedAvatar);

    component.find(ModalFooter).find(Button).first().simulate('click');

    expect(onAvatarPicked).toBeCalledWith(selectedAvatar);
  });

  it('should render avatar list when avatars are passed', () => {
    const component = renderWithProps({});
    expect(component.find(PredefinedAvatarList)).toHaveLength(1);
  });

  it('should not render avatar list when no avatars are passed', () => {
    const component = renderWithProps({
      avatars: [],
    });
    expect(component.find(PredefinedAvatarList)).toHaveLength(0);
  });

  it('should not render avatar list when imageSource is passed', () => {
    const component = renderWithProps({
      imageSource: smallImage,
    });
    expect(component.find(PredefinedAvatarList)).toHaveLength(0);
  });

  it('should not render avatar list when there is an image selected', () => {
    const component = renderWithProps({});
    expect(component.find(PredefinedAvatarList)).toHaveLength(1);
    updateComponentWithNewImage(component);
    expect(component.find(PredefinedAvatarList)).toHaveLength(0);
  });

  it('should not allow save without selected image or selected avatar', () => {
    const saveButton = renderSaveButton();
    expect(saveButton.props().isDisabled).toBeTruthy();
  });

  it('should allow save with selected image passed as default', () => {
    const saveButton = renderSaveButton({
      imageSource: smallImage,
    });
    expect(saveButton.props().isDisabled).toBeFalsy();
  });

  it('should allow save with predefined avatar passed as default', () => {
    const selectedAvatar: Avatar = { dataURI: 'http://an.avatar.com/453' };
    const avatars = [selectedAvatar];
    const saveButton = renderSaveButton({
      avatars,
      defaultSelectedAvatar: selectedAvatar,
    });
    expect(saveButton.props().isDisabled).toBeFalsy();
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
    expect(predefinedAvatars[DEFAULT_VISIBLE_PREDEFINED_AVATARS - 1]).toBe(
      selectedAvatar,
    );
  });

  it('should render default title', () => {
    const selectedAvatar: Avatar = { dataURI: 'http://an.avatar.com/123' };
    const avatars = [selectedAvatar];
    const component = renderWithProps({ avatars });
    const title = component
      .find('[data-test-id="modal-header"]')
      .first()
      .html();
    expect(title).toContain('Upload an avatar');
  });

  it('should by able to customise title', () => {
    const selectedAvatar: Avatar = { dataURI: 'http://an.avatar.com/123' };
    const avatars = [selectedAvatar];
    const component = renderWithProps({
      avatars,
      title: 'test-title',
    });
    const title = component
      .find('[data-test-id="modal-header"]')
      .first()
      .html();
    expect(title).toContain('test-title');
  });

  it('should render default primary button text', () => {
    const selectedAvatar: Avatar = { dataURI: 'http://an.avatar.com/123' };
    const avatars = [selectedAvatar];
    const component = renderSaveButton({ avatars });

    expect((component.props() as any).children.props.defaultMessage).toBe(
      'Save',
    );
  });

  it('should by able to customise primary button text', () => {
    const selectedAvatar: Avatar = { dataURI: 'http://an.avatar.com/123' };
    const avatars = [selectedAvatar];
    const component = renderSaveButton({
      avatars,
      primaryButtonText: 'test-primary-text',
    });

    expect((component.props() as React.Props<{}>).children).toBe(
      'test-primary-text',
    );
  });

  it('should clear selected image when cross clicked', () => {
    const component = renderWithProps({
      imageSource: smallImage,
    });
    const imageNavigator = component.find(ImageNavigator);
    const { onRemoveImage } = imageNavigator.props() as {
      onRemoveImage: any;
    };

    expect(
      (component.state() as AvatarPickerDialogState).selectedImage,
    ).toBeInstanceOf(File);
    expect(
      (component.state() as AvatarPickerDialogState).selectedImageSource,
    ).toBe(smallImage);

    onRemoveImage();

    expect(
      (component.state() as AvatarPickerDialogState).selectedImage,
    ).toBeUndefined();
    expect(
      (component.state() as AvatarPickerDialogState).selectedImageSource,
    ).toBeUndefined();
  });

  it('should render loading state when "isLoading" is true', () => {
    const component = renderWithProps({
      imageSource: smallImage,
      isLoading: true,
    });
    const button = renderSaveButton({ isLoading: true });

    expect(button.prop('isDisabled')).toBeTruthy();
    expect(component.find(ImageNavigator).prop('isLoading')).toBeTruthy();
    expect(component.find(PredefinedAvatarList)).toHaveLength(0);
  });

  it('should pass props down to PredefinedAvatarView', () => {
    const component = renderWithProps({
      avatars: [{ dataURI: '1' }],
      predefinedAvatarsText: 'some text',
    });
    component.setState({ mode: Mode.PredefinedAvatars });
    expect(component.find(PredefinedAvatarView).prop('avatars')).toEqual([
      { dataURI: '1' },
    ]);
    expect(
      component.find(PredefinedAvatarView).prop('predefinedAvatarsText'),
    ).toEqual('some text');
  });
});

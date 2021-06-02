/* eslint-disable no-console */

import React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button/custom-theme-button';
import { ModalTransition } from '@atlaskit/modal-dialog';
import {
  Avatar,
  AvatarPickerDialog,
  AsyncAvatarPickerDialogProps,
} from '../src';
import { generateAvatars } from '../example-helpers';

const avatars: Array<Avatar> = generateAvatars(30);

const Layout: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 80vh;
`;

export interface State {
  isOpen: boolean;
  imagePreviewSourceViaFileAPI: string;
  imagePreviewSourceViaDataURIAPI: string;
  isLoading: boolean;
}

export default class StatefulAvatarPickerDialog extends React.Component<
  Partial<AsyncAvatarPickerDialogProps>,
  State
> {
  timeoutId: number = 0;
  fileURL?: string;

  state = {
    isOpen: false,
    imagePreviewSourceViaFileAPI: '',
    imagePreviewSourceViaDataURIAPI: '',
    isLoading: false,
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

  renderPicker() {
    const { isOpen, isLoading } = this.state;
    return (
      <ModalTransition>
        {isOpen && (
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
        )}
      </ModalTransition>
    );
  }

  render() {
    const {
      imagePreviewSourceViaDataURIAPI,
      imagePreviewSourceViaFileAPI,
    } = this.state;

    return (
      <Layout>
        <Button appearance="primary" onClick={this.openPicker}>
          Open sesame!
        </Button>
        {this.renderPicker()}
        {imagePreviewSourceViaDataURIAPI !== '' ? (
          <>
            <p>onImagePickedDataURI(dataUri: string)</p>
            <img src={imagePreviewSourceViaDataURIAPI} />
          </>
        ) : null}
        {imagePreviewSourceViaFileAPI !== '' ? (
          <>
            <p>onImagePicked(selectedImage: File, crop: CropProperties)</p>
            <img src={imagePreviewSourceViaFileAPI} />
          </>
        ) : null}
      </Layout>
    );
  }
}

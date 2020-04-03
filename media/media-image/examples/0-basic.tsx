import React from 'react';
import { Component } from 'react';
import FieldText from '@atlaskit/field-text';
import {
  genericFileId,
  gifFileId,
  largeImageFileId,
  imageFileId,
  docFileId,
  errorFileId,
  createStorybookMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import Spinner from '@atlaskit/spinner';
import Select from '@atlaskit/select';
import { MediaImage } from '../src';
import { OptionsWrapper, MediaImageWrapper } from '../example-helpers/styled';

export interface ExampleProps {}

export type MediaImageId = {
  label: string;
  value: any;
};
export interface ExampleState {
  imageId: MediaImageId;
  width: number;
  height: number;
}

const mediaClientConfig = createStorybookMediaClientConfig();
const imageIds: MediaImageId[] = [
  { label: 'Generic', value: genericFileId },
  { label: 'Gif', value: gifFileId },
  { label: 'Large', value: largeImageFileId },
  { label: 'Image', value: imageFileId },
  { label: 'Doc', value: docFileId },
  { label: 'Error', value: errorFileId },
];
class Example extends Component<ExampleProps, ExampleState> {
  state: ExampleState = {
    imageId: imageIds[0],
    width: 100,
    height: 100,
  };

  onWidthChange = (e: any) => {
    this.setState({
      width: parseInt(e.currentTarget.value),
    });
  };

  onHeightChange = (e: any) => {
    this.setState({
      height: parseInt(e.currentTarget.value),
    });
  };

  render() {
    const { imageId, width, height } = this.state;

    return (
      <div>
        <OptionsWrapper>
          <Select
            options={imageIds}
            defaultValue={imageId}
            onChange={(imageId: any) => {
              this.setState({ imageId });
            }}
          />
          <FieldText
            label="width"
            placeholder="width"
            value={`${width}`}
            onChange={this.onWidthChange}
          />
          <FieldText
            label="height"
            placeholder="height"
            value={`${height}`}
            onChange={this.onHeightChange}
          />
        </OptionsWrapper>
        <MediaImageWrapper>
          <MediaImage
            identifier={imageId.value}
            mediaClientConfig={mediaClientConfig}
            apiConfig={{ width, height }}
          >
            {({ loading, error, data }) => {
              if (loading) {
                return <Spinner />;
              }

              if (error) {
                console.error(error);
                return <div>Error :(</div>;
              }

              if (!data) {
                return null;
              }

              return <img src={data.src} />;
            }}
          </MediaImage>
        </MediaImageWrapper>
      </div>
    );
  }
}

export default () => <Example />;

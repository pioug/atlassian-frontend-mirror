import React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import {
  readImageMetaData,
  getFileInfo,
  ImageMetaData,
  getScaleFactor,
} from '../src';
import {
  InputWrapper,
  PreviewList,
  PreviewInfo,
  PreviewItem,
  PreviewImageContainer,
  Code,
  CloseButton,
} from '../example-helpers/styled';
import Lozenge from '@atlaskit/lozenge';

interface ExamplePreview {
  filename: string;
  src: string;
  scaleFactor: number;
  metadata: ImageMetaData | null;
  duration: number;
}

export interface ExampleState {
  previews: ExamplePreview[];
}

class Example extends React.Component<{}, ExampleState> {
  state: ExampleState = {
    previews: [],
  };

  onChange = async (e: any) => {
    const { files } = e.target;
    const { previews } = this.state;
    for (let file of files) {
      const startTime = Date.now();
      const fileInfo = await getFileInfo(file);
      const metadata = await readImageMetaData(fileInfo);
      const scaleFactor = getScaleFactor(file, metadata ? metadata.tags : null);
      const duration = Date.now() - startTime;
      previews.push({
        filename: file.name,
        scaleFactor,
        src: fileInfo.src,
        metadata,
        duration,
      });
    }
    this.setState({ previews: [...previews] });
  };

  render() {
    return (
      <Page>
        <Grid>
          <GridColumn>
            <h1>Image MetaData Preview</h1>
            <p>
              <Lozenge>@atlaskit/media-ui</Lozenge> exports:{' '}
              <Code>
                async readImageMetaData(fileInfo:FileInfo):ImageMetaData
              </Code>
            </p>
            <p>async Example:</p>
            <Code>{`const { type, width, height, tags: { Orientation, XResolution, PixelXDimension, PixelYDimension } } = await readImageMetaData(fileInfo);`}</Code>
            <p>
              Select a local image to see it's metadata (if available).
              <br />
              Currently only supports Exif / XMP tags in <b>JPEG</b> and{' '}
              <b>PNG</b> formats.
            </p>
          </GridColumn>
        </Grid>
        <Grid>
          <GridColumn>
            <InputWrapper>
              <input type="file" onChange={this.onChange} />
            </InputWrapper>
          </GridColumn>
        </Grid>
        <Grid>
          <GridColumn>
            <PreviewList>{this.renderPreviews()}</PreviewList>
          </GridColumn>
        </Grid>
      </Page>
    );
  }

  onRemovePreview = (index: number) => () => {
    const previews = this.state.previews;
    previews.splice(index, 1);
    this.setState({ previews: [...previews] });
  };

  renderPreviews() {
    return this.state.previews.map((preview, i) => {
      return (
        <PreviewItem key={`preview-${i}`}>
          <div>
            <p>
              filename:{' '}
              <Lozenge appearance="inprogress">{preview.filename}</Lozenge>
            </p>
            <p>
              scaleFactor:{' '}
              <Lozenge appearance="success" isBold>
                {preview.scaleFactor}
              </Lozenge>
            </p>
            <p>
              duration: <Lozenge>{preview.duration}ms</Lozenge>
            </p>
          </div>
          <PreviewImageContainer>
            <img src={preview.src} />
            <PreviewInfo>
              {JSON.stringify(preview.metadata, null, 4)}
            </PreviewInfo>
          </PreviewImageContainer>
          <CloseButton onClick={this.onRemovePreview(i)}>X</CloseButton>
        </PreviewItem>
      );
    });
  }
}

export default () => <Example />;

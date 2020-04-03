import React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { ImagePlacer, ImageActions } from '../src/image-placer';
import {
  Slider,
  Label,
  ExportedImage,
  ExportedImageWrapper,
} from '../example-helpers/styled';

export interface ExampleState {
  containerWidth: number;
  containerHeight: number;
  margin: number;
  zoom: number;
  maxZoom: number;
  useConstraints: boolean;
  isCircular: boolean;
  useCircularClipWithActions: boolean;
  src?: string | File;
  exportedDataURI?: string;
}

const CONTAINER_WIDTH_LABEL = 'Container_Width';
const CONTAINER_HEIGHT_LABEL = 'Container_Height';
const MARGIN_LABEL = 'Margin';

class Example extends React.Component<{}, ExampleState> {
  zoomSliderElement?: HTMLInputElement;

  // part of ImageActions exported with onImageActions prop of ImagePlacer
  toDataURL?: () => string;

  state: ExampleState = {
    containerWidth: 200,
    containerHeight: 200,
    margin: 30,
    zoom: 0,
    maxZoom: 4,
    useConstraints: true,
    isCircular: false,
    useCircularClipWithActions: false,
  };

  onZoomSliderChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const value = e.currentTarget.valueAsNumber;
    const zoom = value / 100;
    this.setState({ zoom });
  };

  onUseConstraintsChanged = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const useConstraints = e.currentTarget.checked;
    this.setState({ zoom: 0, useConstraints });
  };

  onCircularChanged = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const isCircular = e.currentTarget.checked;
    this.setState({ isCircular });
  };

  onRenderCircularMaskChanged = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const useCircularClipWithActions = e.currentTarget.checked;
    this.setState({ useCircularClipWithActions });
  };

  onZoomSliderElement = (el: HTMLInputElement) => {
    this.zoomSliderElement = el;
  };

  onImageChange = () => {
    this.setState({ zoom: 0 });
  };

  onZoomChange = (zoom: number) => {
    this.setState({ zoom });
  };

  onFileInputChange = async (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const file = e.currentTarget.files[0];
      this.setState({ src: file });
    }
  };

  onImageActions = (actions: ImageActions) => {
    this.toDataURL = actions.toDataURL;
  };

  onGetImageClick = () => {
    const { toDataURL } = this;
    if (toDataURL) {
      this.setState({
        exportedDataURI: toDataURL(),
      });
    }
  };

  render() {
    const {
      containerWidth,
      containerHeight,
      margin,
      zoom,
      maxZoom,
      useConstraints,
      isCircular,
      useCircularClipWithActions,
      src,
      exportedDataURI,
    } = this.state;

    return (
      <Page>
        <Grid>
          <GridColumn>
            <h1>Image Placer</h1>
            <p>
              This component allows placement of an image via panning and
              zooming.
            </p>
            <p>It supports touch, svg, and Exif orientation.</p>
            <p>
              Normally you would set a fixed container size and margin, but feel
              free to change them here in this demo.
            </p>
            <p>
              With constraints, the image will never be smaller than the inner
              visible area (default:true), but this can turned off via
              useConstraints prop.
            </p>
            <p>
              To access the image at current view, provide a callback to
              onImageActions to receive an object with actions.
            </p>
            {this.createSlider(CONTAINER_WIDTH_LABEL, containerWidth)}
            {this.createSlider(CONTAINER_HEIGHT_LABEL, containerHeight)}
            {this.createSlider(MARGIN_LABEL, margin, 0, 100, 5)}
            <Label>
              <span>Circular:</span>
              <input
                type="checkbox"
                defaultChecked={isCircular}
                onChange={this.onCircularChanged}
              />
            </Label>
            <Label>
              <span>Render Circular Mask:</span>
              <input
                type="checkbox"
                defaultChecked={useCircularClipWithActions}
                onChange={this.onRenderCircularMaskChanged}
              />
            </Label>
            <Label>
              <span>Use Constraints:</span>
              <input
                type="checkbox"
                defaultChecked={useConstraints}
                onChange={this.onUseConstraintsChanged}
              />
            </Label>
          </GridColumn>
        </Grid>
        <Grid>
          <GridColumn>
            <ImagePlacer
              containerWidth={containerWidth}
              containerHeight={containerHeight}
              src={src}
              margin={margin}
              zoom={zoom}
              maxZoom={maxZoom}
              useConstraints={useConstraints}
              isCircular={isCircular}
              useCircularClipWithActions={useCircularClipWithActions}
              onImageChange={this.onImageChange}
              onZoomChange={this.onZoomChange}
              onImageActions={this.onImageActions}
            />
          </GridColumn>
        </Grid>
        <Grid>
          <GridColumn>
            <Slider
              type="range"
              min="0"
              max="100"
              value={`${zoom * 100}`}
              step="1"
              onChange={this.onZoomSliderChange}
              innerRef={this.onZoomSliderElement}
              style={{ width: containerWidth + margin * 2 }}
            />
          </GridColumn>
        </Grid>
        <Grid>
          <GridColumn>
            <input type="file" onChange={this.onFileInputChange} />
            {src !== undefined ? (
              <p>
                <button onClick={this.onGetImageClick}>Export DataURI</button>
              </p>
            ) : null}
          </GridColumn>
        </Grid>
        <Grid>
          <GridColumn>
            {exportedDataURI ? (
              <ExportedImageWrapper>
                <ExportedImage src={exportedDataURI} style={{ margin }} />
              </ExportedImageWrapper>
            ) : null}
          </GridColumn>
        </Grid>
      </Page>
    );
  }

  private createSlider(
    title: string,
    defaultValue: number,
    min: number = 0,
    max: number = 500,
    step: number = 50,
  ): JSX.Element {
    const dataListOptions: JSX.Element[] = [];
    for (let i = min; i < max; i += step) {
      dataListOptions.push(<option key={i + title}>{i}</option>);
    }
    const displayTitle = title.replace(/_/g, ' ');
    const stepListId = `stepList_${displayTitle}`;
    return (
      <Label>
        <span>{displayTitle}:</span>
        <Slider
          type="range"
          min={min}
          max={max}
          defaultValue={`${defaultValue}`}
          step={step}
          list={stepListId}
          onChange={this.onSliderChange(title)}
        />
        {defaultValue}
        <datalist id={stepListId}>{dataListOptions}</datalist>
      </Label>
    );
  }

  private onSliderChange(id: string) {
    return (e: React.SyntheticEvent<HTMLInputElement>) => {
      const value = e.currentTarget.valueAsNumber;
      switch (id) {
        case CONTAINER_WIDTH_LABEL:
          this.setState({ containerWidth: value });
          break;
        case CONTAINER_HEIGHT_LABEL:
          this.setState({ containerHeight: value });
          break;
        case MARGIN_LABEL:
          this.setState({ zoom: 0, margin: value });
          break;
      }
    };
  }
}

export default () => <Example />;

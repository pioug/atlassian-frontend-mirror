// eslint-disable-line no-console

import React from 'react';
import { Component } from 'react';
import { RadioGroup } from '@atlaskit/radio';
import {
  videoFileDetails,
  imageFileDetails,
  audioFileDetails,
  docFileDetails,
  unknownFileDetails,
  smallImage,
  smallTransparentImage,
  tallImage,
  wideImage,
  wideTransparentImage,
} from '@atlaskit/media-test-helpers';
import { ImageResizeMode } from '@atlaskit/media-client';
import Toggle from '@atlaskit/toggle';
import Range from '@atlaskit/range';
import * as exenv from 'exenv';
import { CardView } from '../src/root/cardView';
import { CardAppearance, CardStatus, CardDimensions, CardAction } from '../src';
import {
  openAction,
  closeAction,
  deleteAction,
  actions,
} from '../example-helpers';
import {
  EditableCardOptions,
  EditableCardContent,
  SliderWrapper,
  OptionsWrapper,
  CardDimensionsWrapper,
  FlexWrapper,
  CardPreviewWrapper,
} from '../example-helpers/styled';
import { defaultImageCardDimensions } from '../src/utils/cardDimensions';
import { MainWrapper } from '../example-helpers';

const appearanceOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 'small', label: 'Small' },
  { value: 'image', label: 'Image' },
  { value: 'square', label: 'Square' },
  { value: 'horizontal', label: 'Horizontal' },
];
const metadataOptions = [
  { value: 'fileImage', label: 'File image' },
  { value: 'fileVideo', label: 'File video' },
  { value: 'fileAudio', label: 'File audio' },
  { value: 'fileDoc', label: 'File doc' },
  { value: 'fileUnknown', label: 'File unknown' },
  { value: 'genericLink', label: 'Link generic' },
  { value: 'transparentLink', label: 'Link transparent' },
  { value: 'noImageLink', label: 'Link no image' },
  { value: 'noTitleLink', label: 'Link no title' },
  { value: 'longLink', label: 'Link long' },
  { value: 'imageLink', label: 'Link image' },
  { value: 'emptyLink', label: 'Link empty' },
  { value: 'erroredLink', label: 'Link errored' },
];

const dataURIOptions = [
  { value: smallImage, label: 'Small' },
  { value: smallTransparentImage, label: 'Small transparent' },
  { value: tallImage, label: 'Tall' },
  { value: wideImage, label: 'Wide' },
  { value: wideTransparentImage, label: 'Wide transparent' },
  { value: undefined, label: 'No Image' },
];
const statusOptions = [
  { value: 'complete', label: 'complete' },
  { value: 'uploading', label: 'uploading' },
  { value: 'loading', label: 'loading' },
  { value: 'processing', label: 'processing' },
  { value: 'error', label: 'error' },
];
const resizeModeOptions = [
  { value: 'crop', label: 'crop' },
  { value: 'fit', label: 'fit' },
  { value: 'full-fit', label: 'full-fit' },
];

export const generateStoriesForEditableCards = () => {
  const localStorageKeyName = 'editableCardState';
  const metadataOptionsMap: any = {
    fileImage: imageFileDetails,
    fileVideo: videoFileDetails,
    fileAudio: audioFileDetails,
    fileDoc: docFileDetails,
    fileUnknown: unknownFileDetails,
  };
  const getStateFromLocalStorage = (): EditableCardState | null => {
    if (!exenv.canUseDOM) {
      return null;
    }

    const previousState = localStorage.getItem(localStorageKeyName);

    try {
      return JSON.parse(previousState || '');
    } catch (e) {
      return null;
    }
  };

  const getOptionsWithDefaultValue = (
    options: Array<{ value?: string }>,
    value: string,
  ) => {
    const optionsWithDefault = options.map((option) => ({
      ...option,
      defaultSelected: option.value === value,
    }));

    return optionsWithDefault;
  };

  interface EditableCardProps {}

  interface EditableCardState {
    appearance: CardAppearance;
    status: CardStatus;
    dimensions: CardDimensions;
    parentDimensions: CardDimensions;
    metadata: string;
    dataURI: string;
    progress: number;
    menuActions: Array<CardAction>;
    selectable: boolean;
    selected: boolean;
    resizeMode: ImageResizeMode;
    isMouseEnterHandlerActive: boolean;
    isClickHandlerActive: boolean;
    isParentInlineBlock: boolean;
    doesParentHasWidth: boolean;
    isWidthPercentage: boolean;
    isHeightPercentage: boolean;
    useDimensions: boolean;
  }

  class EditableCard extends Component<EditableCardProps, EditableCardState> {
    debounced: any;

    constructor(props: EditableCardProps) {
      super(props);
      const defaultState: EditableCardState = {
        appearance: 'auto',
        status: 'complete',
        metadata: 'fileImage',
        dataURI: tallImage,
        dimensions: {
          width: defaultImageCardDimensions.width,
          height: defaultImageCardDimensions.height,
        },
        parentDimensions: {
          width: '100%',
          height: '100%',
        },
        progress: 0,
        menuActions: actions,
        selectable: false,
        selected: false,
        resizeMode: 'crop',
        isMouseEnterHandlerActive: true,
        isClickHandlerActive: true,
        isParentInlineBlock: false,
        doesParentHasWidth: true,
        isWidthPercentage: true,
        isHeightPercentage: true,
        useDimensions: true,
      };
      const previousState = getStateFromLocalStorage();
      const state = previousState || defaultState;
      // We need to override "menuActions" since it can't be serialized because it contains react no
      this.state = { ...state, menuActions: actions };
    }

    componentDidUpdate() {
      localStorage.setItem(localStorageKeyName, JSON.stringify(this.state));
    }

    render() {
      const {
        appearance,
        status,
        dataURI,
        dimensions,
        parentDimensions,
        metadata: metadataKey,
        menuActions,
        progress,
        selectable,
        selected,
        resizeMode,
        isClickHandlerActive,
        isMouseEnterHandlerActive,
        isParentInlineBlock,
        doesParentHasWidth,
        isWidthPercentage,
        isHeightPercentage,
        useDimensions,
      } = this.state;
      const width = parseInt(`${dimensions.width}`, 0);
      const height = parseInt(`${dimensions.height}`, 0);
      const metadata = metadataOptionsMap[metadataKey];
      const { width: parentWidth, height: parentHeight } = parentDimensions;
      const parentStyle: any = { height: parentHeight };
      const newDimensions: CardDimensions = { width, height };

      if (isParentInlineBlock) {
        parentStyle['display'] = 'inline-block';
      }

      if (doesParentHasWidth) {
        parentStyle['width'] = parentWidth;
      }

      if (isWidthPercentage) {
        newDimensions.width = `${width}%`;
      }

      if (isHeightPercentage) {
        newDimensions.height = `${height}%`;
      }

      return (
        <MainWrapper>
          <FlexWrapper>
            <CardPreviewWrapper>
              <CardDimensionsWrapper>
                <div>
                  Card dimensions: {width}x{height}
                </div>
                <div>
                  Parent dimensions: {parentWidth}x{parentHeight}
                </div>
              </CardDimensionsWrapper>
              <EditableCardContent style={parentStyle}>
                <CardView
                  appearance={appearance}
                  status={status}
                  mediaItemType="file"
                  metadata={metadata}
                  dataURI={dataURI}
                  dimensions={useDimensions ? newDimensions : undefined}
                  actions={menuActions}
                  progress={progress}
                  selectable={selectable}
                  selected={selected}
                  resizeMode={resizeMode}
                  onClick={this.onClick}
                  onMouseEnter={this.onMouseEnter}
                />
              </EditableCardContent>
            </CardPreviewWrapper>
            <EditableCardOptions>
              <SliderWrapper>
                <div>
                  Card dimensions <hr />
                  <div>
                    Width ({width}) | Percentage
                    <Toggle
                      defaultChecked={isWidthPercentage}
                      onChange={this.onWidthPercentageChange}
                    />
                    <Range
                      value={Number(width)}
                      min={0}
                      max={500}
                      onChange={this.onWidthChange}
                    />
                  </div>
                  <div>
                    Height ({height}) | Percentage
                    <Toggle
                      defaultChecked={isHeightPercentage}
                      onChange={this.onHeightPercentageChange}
                    />
                    <Range
                      value={Number(height)}
                      min={0}
                      max={500}
                      onChange={this.onHeightChange}
                    />
                  </div>
                </div>
                <div>
                  Parent properties <hr />
                  <div>
                    Has width
                    <Toggle
                      defaultChecked={doesParentHasWidth}
                      onChange={this.onDoesParentHasWidthChange}
                    />
                  </div>
                  {doesParentHasWidth ? (
                    <div>
                      Width ({parentWidth})
                      <Range
                        value={Number(parentWidth)}
                        min={50}
                        max={1000}
                        onChange={this.onParentWidthChange}
                      />
                    </div>
                  ) : null}
                  <div>
                    Height ({parentHeight})
                    <Range
                      value={Number(parentHeight)}
                      min={50}
                      max={1000}
                      onChange={this.onParentHeightChange}
                    />
                  </div>
                  <div>
                    Is inline-block
                    <Toggle
                      defaultChecked={isParentInlineBlock}
                      onChange={this.onIsParentInlineBlockChange}
                    />
                  </div>
                </div>
                <div>
                  Progress ({progress})
                  <Range
                    value={Number(progress)}
                    min={0}
                    max={1}
                    onChange={this.onProgressChange}
                  />
                </div>
                <div>
                  Actions <hr />
                  <div>
                    <input
                      type="checkbox"
                      onChange={this.onActionsChange(openAction)}
                      checked={this.isActionChecked(openAction)}
                    />{' '}
                    Open
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      onChange={this.onActionsChange(closeAction)}
                      checked={this.isActionChecked(closeAction)}
                    />{' '}
                    Close
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      onChange={this.onActionsChange(deleteAction)}
                      checked={this.isActionChecked(deleteAction)}
                    />{' '}
                    Delete
                  </div>
                </div>
                <div>
                  Selectable
                  <Toggle
                    defaultChecked={selectable}
                    onChange={this.onSelectableChange}
                  />
                  <hr />
                  Selected
                  <Toggle
                    defaultChecked={selected}
                    onChange={this.onSelectedChange}
                  />
                </div>
                <div>
                  On click
                  <Toggle
                    defaultChecked={isClickHandlerActive}
                    onChange={this.onClickChange}
                  />
                  <hr />
                  On mouse enter
                  <Toggle
                    defaultChecked={isMouseEnterHandlerActive}
                    onChange={this.onMouseEnterChange}
                  />
                  <hr />
                  use dimensions
                  <Toggle
                    defaultChecked={useDimensions}
                    onChange={this.onUseDimensionsChange}
                  />
                </div>
              </SliderWrapper>
              <OptionsWrapper>
                <div>
                  Appearance
                  <RadioGroup
                    options={getOptionsWithDefaultValue(
                      appearanceOptions,
                      appearance,
                    )}
                    onChange={this.onAppearanceChange}
                  />
                </div>
                <div>
                  Metadata
                  <RadioGroup
                    options={getOptionsWithDefaultValue(
                      metadataOptions,
                      metadataKey,
                    )}
                    onChange={this.onMetadataChange}
                  />
                </div>
                <div>
                  URI
                  <RadioGroup
                    options={getOptionsWithDefaultValue(
                      dataURIOptions,
                      dataURI,
                    )}
                    onChange={this.onDataURIChange}
                  />
                </div>
                <div>
                  Status
                  <RadioGroup
                    options={getOptionsWithDefaultValue(statusOptions, status)}
                    onChange={this.onStatusChange}
                  />
                </div>
                <div>
                  Reize mode
                  <RadioGroup
                    options={getOptionsWithDefaultValue(
                      resizeModeOptions,
                      resizeMode,
                    )}
                    onChange={this.onResizeModeChange}
                  />
                </div>
              </OptionsWrapper>
            </EditableCardOptions>
          </FlexWrapper>
        </MainWrapper>
      );
    }

    onWidthPercentageChange = () => {
      this.setState({ isWidthPercentage: !this.state.isWidthPercentage });
    };

    onHeightPercentageChange = () => {
      this.setState({ isHeightPercentage: !this.state.isHeightPercentage });
    };

    onMouseEnterChange = () => {
      this.setState({
        isMouseEnterHandlerActive: !this.state.isMouseEnterHandlerActive,
      });
    };

    onClickChange = () => {
      this.setState({ isClickHandlerActive: !this.state.isClickHandlerActive });
    };

    onClick = () => {
      if (this.state.isClickHandlerActive) {
        console.log('onClick');
      }
    };

    onMouseEnter = () => {
      if (this.state.isMouseEnterHandlerActive) {
        console.log('onMouseEnter');
      }
    };

    onSelectedChange = () => {
      this.setState({ selected: !this.state.selected });
    };

    onSelectableChange = () => {
      this.setState({ selectable: !this.state.selectable });
    };

    isActionChecked = (action: any) =>
      this.state.menuActions.indexOf(action) !== -1;

    onActionsChange = (action: any) => (e: any) => {
      const { checked } = e.target;
      const { menuActions } = this.state;

      if (checked) {
        menuActions.push(action);
      } else {
        menuActions.splice(menuActions.indexOf(action), 1);
      }

      this.setState({ menuActions });
    };

    onAppearanceChange = (e: any) => {
      const appearance = e.target.value;
      this.setState({ appearance });
    };

    onMetadataChange = (e: any) => {
      const metadata = e.target.value;

      this.setState({ metadata });
    };

    onDataURIChange = (e: any) => {
      const dataURI = e.target.value;

      this.setState({ dataURI });
    };

    onStatusChange = (e: any) => {
      const status = e.target.value;

      this.setState({ status });
    };

    onResizeModeChange = (e: any) => {
      const resizeMode = e.target.value;

      this.setState({ resizeMode });
    };

    onWidthChange = (e: any) => {
      const dimensions = this.state.dimensions;

      dimensions.width = e;
      this.setState({ dimensions });
    };

    onHeightChange = (e: any) => {
      const dimensions = this.state.dimensions;

      dimensions.height = e;
      this.setState({ dimensions });
    };

    onParentWidthChange = (width: any) => {
      const parentDimensions = this.state.parentDimensions;

      parentDimensions.width = width;
      this.setState({ parentDimensions });
    };

    onParentHeightChange = (height: any) => {
      const parentDimensions = this.state.parentDimensions;

      parentDimensions.height = height;
      this.setState({ parentDimensions });
    };

    onIsParentInlineBlockChange = () => {
      this.setState({ isParentInlineBlock: !this.state.isParentInlineBlock });
    };

    onDoesParentHasWidthChange = () => {
      this.setState({ doesParentHasWidth: !this.state.doesParentHasWidth });
    };

    onProgressChange = (progress: any) => {
      this.setState({ progress });
    };

    onUseDimensionsChange = () => {
      this.setState({ useDimensions: !this.state.useDimensions });
    };
  }

  return <EditableCard />;
};

export default () => generateStoriesForEditableCards();

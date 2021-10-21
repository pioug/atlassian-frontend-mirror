import React from 'react';
import { Component } from 'react';
import {
  createStorybookMediaClientConfig,
  genericFileId,
} from '@atlaskit/media-test-helpers';
import Toggle from '@atlaskit/toggle';
import Range from '@atlaskit/range';
import { Identifier } from '@atlaskit/media-client';
import { Card, CardDimensions } from '../src';
import { CardDimensionsWrapper } from '../example-helpers/styled';
import {
  EditableCardOptions,
  EditableCardContent,
} from '../example-helpers/styled';
import { MainWrapper } from '../example-helpers';

const mediaClientConfig = createStorybookMediaClientConfig();

const maxHeight = 1000;
const maxWidth = 1000;

export interface EditableCardState {
  identifier: Identifier;
  dimensions: CardDimensions;
  parentDimensions: CardDimensions;
  isWidthPercentage: boolean;
  isHeightPercentage: boolean;
  isLazy: boolean;
  useDimensions: boolean;
}

class EditableCard extends Component<{}, EditableCardState> {
  state: EditableCardState = {
    identifier: genericFileId,
    dimensions: { width: 100, height: 50 },
    parentDimensions: { height: 300, width: 500 },
    isWidthPercentage: true,
    isHeightPercentage: true,
    isLazy: false,
    useDimensions: true,
  };

  onWidthChange = (e: any) => {
    const { height } = this.state.dimensions;
    this.setState({ dimensions: { width: parseInt(e, 0), height } });
  };

  onHeightChange = (e: any) => {
    const { width } = this.state.dimensions;
    this.setState({ dimensions: { height: parseInt(e, 0), width } });
  };

  onWidthPercentageChange = () => {
    this.setState({ isWidthPercentage: !this.state.isWidthPercentage });
  };

  onHeightPercentageChange = () => {
    this.setState({ isHeightPercentage: !this.state.isHeightPercentage });
  };

  onParentWidthChange = (e: any) => {
    const { height } = this.state.parentDimensions;
    this.setState({ parentDimensions: { width: parseInt(e, 0), height } });
  };

  onParentHeightChange = (e: any) => {
    const { width } = this.state.parentDimensions;
    this.setState({ parentDimensions: { height: parseInt(e, 0), width } });
  };

  onIsLazyChange = () => {
    this.setState({ isLazy: !this.state.isLazy });
  };

  onUseDimensionsChange = () => {
    this.setState({ useDimensions: !this.state.useDimensions });
  };

  printUnit = (dimension: `w` | `h`) => {
    const isPercentage =
      dimension === 'w'
        ? this.state.isWidthPercentage
        : this.state.isHeightPercentage;
    return isPercentage ? '%' : 'px';
  };

  getCardDimensions = () => {
    const {
      dimensions: { width, height },
    } = this.state;
    return {
      width: `${width}${this.printUnit('w')}`,
      height: `${height}${this.printUnit('h')}`,
    };
  };

  render() {
    const {
      identifier,
      dimensions: { width, height },
      isWidthPercentage,
      isHeightPercentage,
      parentDimensions: { width: parentWidth, height: parentHeight },
      isLazy,
      useDimensions,
    } = this.state;
    const parentStyle = { width: parentWidth, height: parentHeight };
    const formattedWidth = this.getCardDimensions().width;
    const formattedHeight = this.getCardDimensions().height;
    return (
      <MainWrapper>
        <div>
          <EditableCardOptions>
            Card dimensions <hr />
            <CardDimensionsWrapper>
              <div>
                Card Width ({formattedWidth}) | Use percentage:
                <Toggle
                  defaultChecked={isWidthPercentage}
                  onChange={this.onWidthPercentageChange}
                />
                <Range
                  value={Number(width)}
                  min={10}
                  max={isWidthPercentage ? 100 : maxWidth}
                  onChange={this.onWidthChange}
                />
              </div>
              <div>
                Card Height ({formattedHeight}) | Use percentage:
                <Toggle
                  defaultChecked={isHeightPercentage}
                  onChange={this.onHeightPercentageChange}
                />
                <Range
                  value={Number(height)}
                  min={10}
                  max={isHeightPercentage ? 100 : maxHeight}
                  onChange={this.onHeightChange}
                />
              </div>
              <div>
                Parent Width ({parentWidth}px)
                <Range
                  value={Number(parentWidth)}
                  min={0}
                  max={maxWidth}
                  onChange={this.onParentWidthChange}
                />
              </div>
              <div>
                Parent Height ({parentHeight}px)
                <Range
                  value={Number(parentHeight)}
                  min={50}
                  max={maxHeight}
                  onChange={this.onParentHeightChange}
                />
              </div>
            </CardDimensionsWrapper>
            isLazy
            <Toggle defaultChecked={isLazy} onChange={this.onIsLazyChange} />
            use dimensions
            <Toggle
              defaultChecked={useDimensions}
              onChange={this.onUseDimensionsChange}
            />
          </EditableCardOptions>
          <EditableCardContent style={parentStyle}>
            <Card
              mediaClientConfig={mediaClientConfig}
              identifier={identifier}
              dimensions={useDimensions ? this.getCardDimensions() : undefined}
              isLazy={isLazy}
              alt="this is an alt text"
            />
          </EditableCardContent>
        </div>
      </MainWrapper>
    );
  }
}

export default () => <EditableCard />;

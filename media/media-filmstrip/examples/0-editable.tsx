// eslint-disable-line no-console

import React from 'react';
import { HTMLAttributes, ComponentClass, LabelHTMLAttributes } from 'react';
import styled from 'styled-components';
import { RadioGroup } from '@atlaskit/radio';
import Range from '@atlaskit/range';
import Button from '@atlaskit/button/standard-button';
import { Card } from '@atlaskit/media-card';
import {
  createStorybookMediaClientConfig,
  genericFileId,
  audioFileId,
  videoFileId,
  imageFileId,
  docFileId,
  passwordProtectedPdfFileId,
  codeFileId,
  emailFileId,
  archiveFileId,
} from '@atlaskit/media-test-helpers';
import { FilmstripView } from '../src/filmstripView';

const StoryWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  padding: 1em;
`;

const Separator: ComponentClass<HTMLAttributes<{}>> = styled.hr`
  margin: 1em 0;
  border: 1px solid #ccc;
`;

const ControlLabel: ComponentClass<
  HTMLAttributes<{}> & LabelHTMLAttributes<{}>
> = styled.label`
  display: block;
  margin-top: 1em;
  font-weight: bold;
`;

const Flex: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface BoxProps {
  grow?: number;
}

const Box: ComponentClass<HTMLAttributes<{}> & BoxProps> = styled.div`
  padding: 4px;
  ${({ grow }: { grow?: number }) => (grow && `flex-grow: ${grow};`) || ''};
`;

const mediaClientConfig = createStorybookMediaClientConfig();

const exampleActions = [{ label: 'View', handler: () => console.log('View') }];

const cards = [
  <Card
    key="card1"
    mediaClientConfig={mediaClientConfig}
    identifier={genericFileId}
    actions={exampleActions}
  />,
  <Card
    key="card2"
    mediaClientConfig={mediaClientConfig}
    identifier={audioFileId}
    actions={exampleActions}
  />,
  <Card
    key="card3"
    mediaClientConfig={mediaClientConfig}
    identifier={videoFileId}
    actions={exampleActions}
  />,
  <Card
    key="card4"
    mediaClientConfig={mediaClientConfig}
    identifier={imageFileId}
    actions={exampleActions}
  />,
  <Card
    key="card5"
    mediaClientConfig={mediaClientConfig}
    identifier={docFileId}
    actions={exampleActions}
  />,
  <Card
    key="card6"
    mediaClientConfig={mediaClientConfig}
    identifier={passwordProtectedPdfFileId}
    actions={exampleActions}
  />,
  <Card
    key="card7"
    mediaClientConfig={mediaClientConfig}
    identifier={codeFileId}
    actions={exampleActions}
  />,
  <Card
    key="card8"
    mediaClientConfig={mediaClientConfig}
    identifier={emailFileId}
    actions={exampleActions}
  />,
  <Card
    key="card9"
    mediaClientConfig={mediaClientConfig}
    identifier={archiveFileId}
    actions={exampleActions}
  />,
  <Card
    key="card10"
    mediaClientConfig={mediaClientConfig}
    identifier={passwordProtectedPdfFileId}
    actions={exampleActions}
  />,
];

export interface ViewStoryProps {}

export interface ViewStoryState {
  animate: boolean;
  offset: number;
  offsets: { left: number; right: number }[];
  minOffset: number;
  maxOffset: number;
  containerWidth: string | number;
  children: JSX.Element[];
}

export class ViewStory extends React.Component<ViewStoryProps, ViewStoryState> {
  state: ViewStoryState = {
    animate: false,
    offset: 0,
    offsets: [],
    minOffset: 0,
    maxOffset: 0,
    containerWidth: 'auto',
    children: cards.map((card, index) =>
      React.cloneElement(card, { key: index }),
    ),
  };

  handleSizeChange = ({
    offset,
    offsets,
    minOffset,
    maxOffset,
  }: Pick<
    ViewStoryState,
    'offset' | 'offsets' | 'minOffset' | 'maxOffset'
  >) => {
    this.setState({ offset, offsets, minOffset, maxOffset });
  };

  handleScrollChange = ({
    offset,
    animate,
  }: Pick<ViewStoryState, 'offset' | 'animate'>) => {
    this.setState({ offset, animate });
  };

  handleGoToStart = () => {
    this.setState(({ minOffset }) => ({ offset: minOffset, animate: true }));
  };

  handleGoToEnd = () => {
    this.setState(({ maxOffset }) => ({ offset: maxOffset, animate: true }));
  };

  handleGoTo = (offset: number) => {
    this.setState({ offset, animate: false });
  };

  handleChangeWidthType = (event: any) => {
    const type = event.target.value;
    if (type === 'auto') {
      this.setState({ containerWidth: 'auto' });
    } else {
      this.setState({ containerWidth: 600 });
    }
  };

  handleChangeContainerWidth = (containerWidth: number) => {
    this.setState({ containerWidth });
  };

  handleChangeCardCount = (cardCount: number) => {
    const children: JSX.Element[] = [];
    for (let i = 0; i < cardCount; ++i) {
      const idx = i % cards.length;
      children.push(
        React.cloneElement(cards[idx], {
          key: i,
        }),
      );
    }
    this.setState({ children });
  };

  renderFilmstrip() {
    const { animate, offset, containerWidth, children } = this.state;
    return (
      <div style={{ width: containerWidth }}>
        <FilmstripView
          animate={animate}
          offset={offset}
          onSize={this.handleSizeChange}
          onScroll={this.handleScrollChange}
        >
          {children}
        </FilmstripView>
      </div>
    );
  }

  renderControls() {
    const {
      containerWidth,
      offset,
      minOffset,
      maxOffset,
      children,
    } = this.state;
    return (
      <div>
        <ControlLabel>Offset: </ControlLabel>
        <Flex>
          <Box>
            <Button
              onClick={this.handleGoToStart}
              isSelected={offset === minOffset}
            >
              Start
            </Button>
          </Box>
          <Box grow={1}>
            <Range
              step={1}
              min={minOffset}
              max={maxOffset}
              value={offset}
              onChange={this.handleGoTo}
            />
          </Box>
          <Box>
            <Button
              onClick={this.handleGoToEnd}
              isSelected={offset === maxOffset}
            >
              End
            </Button>
          </Box>
        </Flex>

        <ControlLabel>Width: </ControlLabel>
        <RadioGroup
          options={[
            {
              value: 'auto',
              label: 'Auto',
            },
            {
              value: 'number',
              label: 'Number',
            },
          ]}
          onChange={this.handleChangeWidthType}
        />
        {containerWidth !== 'auto' && (
          <Range
            value={containerWidth as number}
            min={0}
            max={1000}
            step={1}
            onChange={this.handleChangeContainerWidth}
          />
        )}
        <ControlLabel htmlFor="cardCount">
          Card count: {children.length}
        </ControlLabel>
        <Range
          id="cardCount"
          value={children.length}
          min={0}
          max={50}
          step={1}
          onChange={this.handleChangeCardCount}
        />
      </div>
    );
  }

  render() {
    return (
      <StoryWrapper>
        <h1>Make your own 🍽</h1>
        <Separator />
        {this.renderFilmstrip()}
        <Separator />
        {this.renderControls()}
      </StoryWrapper>
    );
  }
}

export default () => <ViewStory />;

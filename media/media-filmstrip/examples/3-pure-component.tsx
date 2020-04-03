import React from 'react';
import { HTMLAttributes, ComponentClass } from 'react';
import styled from 'styled-components';
import { FilmstripView } from '../src/filmstripView';
import { FilmstripState } from '../src';

export interface StoryProps {}

export interface StoryState {
  animate: boolean;
  offset: number;
}

const Box: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: 250px;
  height: 100px;
  background-color: lightgreen;
`;

export class Story extends React.PureComponent<StoryProps, StoryState> {
  state: StoryState = {
    animate: false,
    offset: 0,
  };

  handleSizeChange = ({ offset }: Pick<FilmstripState, 'offset'>) =>
    this.setState({ offset });
  handleScrollChange = ({ offset, animate }: FilmstripState) =>
    this.setState({ offset, animate });

  render() {
    const { animate, offset } = this.state;
    return (
      <div>
        <h1>In a PureComponent</h1>
        <p>
          This story renders a filmstrip inside a React.PureComponent to assert
          that the state updates correctly. There once was a bug in filmstrip
          that resulted in the smart-card not displaying the arrows. See{' '}
          <a href="https://product-fabric.atlassian.net/browse/MSW-181">
            MSW-181
          </a>
          .
        </p>
        <FilmstripView
          animate={animate}
          offset={offset}
          onSize={this.handleSizeChange}
          onScroll={this.handleScrollChange}
        >
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
        </FilmstripView>
      </div>
    );
  }
}

export default () => <Story />;

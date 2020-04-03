import React from 'react';
import styled from 'styled-components';
import WidthDetector from '../src';
import debounce from 'lodash.debounce';

const ResultBox = styled.div`
  align-items: center;
  background-color: rebeccapurple;
  color: white;
  display: flex;
  height: 100%;
  min-height: 100px;
  justify-content: center;
  white-space: nowrap;
  transition: background-color 1s;
  padding: 10px;
`;

const ResultNumber = styled.div`
  background-color: rgb(0, 0, 0, 0.6);
  color: white;
  padding: 10px;
  border-radius: 3px;
`;

export default class Example extends React.Component {
  state = {
    width: 0,
    bgColor: '#fff',
  };

  onResize = debounce(
    (width: Number) => {
      console.log('[onResize] width:', width);

      this.setState({
        width,
        // create a new background color based on the width of the container
        bgColor: `#${(this.state.width + 255).toString(16)}`,
      });
    },
    100,
    { leading: false },
  );

  render() {
    return (
      <div>
        <div style={{ height: 100 }}>
          <WidthDetector onResize={this.onResize}>
            {() => (
              <ResultBox style={{ backgroundColor: this.state.bgColor }}>
                <ResultNumber>{this.state.width}</ResultNumber>
              </ResultBox>
            )}
          </WidthDetector>
          The area above will change color as the width of the container
          changes.
        </div>
      </div>
    );
  }
}

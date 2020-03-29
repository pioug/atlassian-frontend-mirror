/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import Button from '../src';

const PER_RUN = 100; // how many button groups to render
const TEST_RUNS = 5; // how many render passes to run during the test
const BUTTON_COUNT = 5; // the number of buttons per group

type State = {
  count: number;
};

class PerfTest extends React.Component<{}, State> {
  state = {
    count: 0,
  };
  startTest = () => {
    console.log('Starting performance test...');
    let runs = 0;
    let startTime: number;
    const run = () => {
      if (!runs) {
        startTime = Date.now();
      }
      if (runs === TEST_RUNS) {
        const time = Date.now() - startTime;
        let totalButtons = 0;
        for (let i = 1; i <= TEST_RUNS; i++) {
          totalButtons += BUTTON_COUNT * PER_RUN * i;
        }
        console.log('Finished performance test');
        console.log(
          `Rendered ${totalButtons} buttons in ${time}ms (${TEST_RUNS} runs)`,
        );
        return;
      }
      runs++;
      this.setState({ count: runs * PER_RUN }, run);
    };
    this.setState({ count: 0 }, run);
  };
  renderButtons() {
    const { count } = this.state;
    const buttons: JSX.Element[] = [];
    for (let i = 1; i <= count; i++) {
      const buttonNumber = (i - 1) * BUTTON_COUNT;
      buttons.push(
        <div key={`buttons-${i}`} css={{ padding: '10px' }}>
          <Button appearance="default">Button {buttonNumber + 1}</Button>
          <Button appearance="danger">Button {buttonNumber + 2}</Button>
          <Button appearance="primary">Button {buttonNumber + 3}</Button>
          <Button appearance="warning">Button {buttonNumber + 4}</Button>
          <Button
            component={React.forwardRef<
              HTMLDivElement,
              React.AllHTMLAttributes<HTMLElement>
            >((props, ref) => (
              <div {...props} ref={ref}>
                {props.children}
              </div>
            ))}
          >
            Button {buttonNumber + 5}
          </Button>
        </div>,
      );
    }
    return buttons;
  }
  render() {
    return (
      <div>
        <div css={{ padding: '10px' }}>
          <Button appearance="primary" onClick={this.startTest}>
            Start Test
          </Button>
        </div>
        <div>{this.renderButtons()}</div>
      </div>
    );
  }
}

export default () => <PerfTest />;
